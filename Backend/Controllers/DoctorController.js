const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// --------------------------------------------------------------------------->
// fetch max Doctor no --------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.maxDrNo = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      let query = `
        SELECT MAX(CAST(drcode AS UNSIGNED)) AS maxDrcode 
        FROM doctormaster 
        WHERE dairy_id = ?
      `;
      let params = [dairy_id];

      if (center_id !== 0) {
        query += ` AND center_id = ?`;
        params.push(center_id);
      }

      connection.query(query, params, (error, results) => {
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ status: 500, message: "Error executing query" });
        }

        const maxDrNo = results[0]?.maxDrcode || 0;
        const maxDrCode = maxDrNo + 1;

        return res.status(200).json({ status: 200, maxDrCode });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      connection.release();
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// --------------------------------------------------------------------------->
// Add New Doctor -------------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.addNewDoctor = async (req, res) => {
  const { date, code, drname, short_name } = req.body.values;

  const { dairy_id, center_id, user_id } = req.user;

  if (!date || !code || !drname || !short_name) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }

  if (!dairy_id || !user_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const addDrQuery = `
        INSERT INTO doctormaster 
        (dairy_id, center_id, drcode, drname, short_name, createdon, createdby) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        addDrQuery,
        [dairy_id, center_id, code, drname, short_name, date, user_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error" });
          }

          res
            .status(200)
            .json({ status: 200, message: "New Doctor added successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// --------------------------------------------------------------------------->
// update Doctor --------------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.updateDoctorDetails = async (req, res) => {
  const { id, date, drname, short_name } = req.body.values;
  const { dairy_id, user_id } = req.user;

  if (!id || !date || !drname || !short_name) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }

  if (!dairy_id || !user_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const updateDrQuery = `
        UPDATE doctormaster
        SET drname = ?, short_name = ? 
        WHERE id = ?
      `;

      connection.query(
        updateDrQuery,
        [drname, short_name, id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error" });
          }

          res.status(200).json({
            status: 200,
            message: "Doctor details updated successfully!",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// --------------------------------------------------------------------------->
// Fetch all Doctors------------------------------------------------------------>
// --------------------------------------------------------------------------->

exports.fetchAllDoctors = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      let fetchAllDrQuery = `
            SELECT id, drcode, drname, short_name
            FROM doctormaster
            WHERE dairy_id = ?
          `;

      let params = [dairy_id];

      if (center_id !== 0) {
        query += ` AND center_id = ?`;
        params.push(center_id);
      }

      connection.query(fetchAllDrQuery, params, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        if (result.length === 0) {
          return res.status(204).json({ status: 204, drList: [] });
        }

        res.status(200).json({ status: 200, drList: result });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// --------------------------------------------------------------------------->
// Delete Doctor --------------------------------------------------------------->
// --------------------------------------------------------------------------->

// exports.deleteDoctor = async (req, res) => {
//   const { id } = req.body;
//   const { dairy_id, center_id } = req.user;

//   if (!dairy_id) {
//     return res.status(401).json({ status: 401, message: "Unauthorized User!" });
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res
//         .status(500)
//         .json({ status: 500, message: "Database connection error" });
//     }

//     try {
//       const checkIsUsedBank = `
//         SELECT COUNT(code) AS code_count
//         FROM customer
//         WHERE orgid = ? AND center_id = ?;
//       `;

//       connection.query(
//         checkIsUsedBank,
//         [dairy_id, center_id],
//         (err, result) => {
//           if (err) {
//             connection.release();
//             console.error("Error executing query: ", err);
//             return res
//               .status(500)
//               .json({ status: 500, message: "Query execution error" });
//           }

//           if (result[0].code_count === 0) {
//             const deleteBankQuery = `
//             DELETE FROM bankmaster
//             WHERE id = ?
//           `;

//             connection.query(deleteBankQuery, [id], (err, result) => {
//               connection.release();
//               if (err) {
//                 console.error("Error executing query: ", err);
//                 return res
//                   .status(500)
//                   .json({ status: 500, message: "Query execution error" });
//               }

//               res.status(200).json({
//                 status: 200,
//                 message: "Bank deleted successfully",
//               });
//             });
//           } else {
//             connection.release();
//             return res.status(200).json({
//               status: 200,
//               message: "Bank records found, You can't delete this bank!",
//             });
//           }
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res
//         .status(500)
//         .json({ status: 500, message: "Internal server error" });
//     }
//   });
// };
