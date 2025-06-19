const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// --------------------------------------------------------------------------->
// fetch max Tanker no --------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.maxTankerNO = async (req, res) => {
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
        SELECT MAX(CAST(tno AS UNSIGNED)) AS maxTankerNo 
        FROM tankermaster 
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

        const maxTankerNo = results[0]?.maxTankerNo || 0;
        const maxTankerCode = maxTankerNo + 1;

        return res.status(200).json({ status: 200, maxTankerCode });
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
// Add New Tanker -------------------------------------------------------------->
// --------------------------------------------------------------------------->
exports.addNewTanker = async (req, res) => {
  const { tno, ownername, tankerno, contactno, rateltr } = req.body.values;
  const { dairy_id, center_id, user_id } = req.user;

  if (!tno) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }

  if (!dairy_id || !user_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  const today = new Date().toISOString().split("T")[0];
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const addTankerQuery = `
        INSERT INTO tankermaster 
        (dairy_id, center_id, tno, ownername, tankerno, contactno,  rateltr, createdon, createdby) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        addTankerQuery,
        [
          dairy_id,
          center_id,
          tno,
          ownername || null,
          tankerno || null,
          contactno || null,
          rateltr || null,
          today,
          user_id,
        ],
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
            .json({ status: 200, message: "New tanker added successfully!" });
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
// update Tanker --------------------------------------------------------------->
// --------------------------------------------------------------------------->
exports.updateTankerDetails = async (req, res) => {
  const { id, ownername, tankerno, contactno, rateltr } = req.body.values;
  const { dairy_id, user_id } = req.user;

  if (!id ) {
    return res
      .status(400)
      .json({ status: 400, message: "Id is required to update data!" });
  }

  if (!dairy_id || !user_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  const today = new Date().toISOString().split("T")[0];
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const updateTankerQuery = `
        UPDATE tankermaster SET
        ownername = ?, tankerno = ?, contactno = ?, rateltr = ?, updatedon = ?, updatedby = ? 
        WHERE id = ?
      `;

      connection.query(
        updateTankerQuery,
        [
          ownername,
          tankerno || null,
          contactno || null,
          rateltr || null,
          today,
          user_id,
          id,
        ],
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
            message: "Tanker details updated successfully!",
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
// Fetch all Tankers------------------------------------------------------------>
// --------------------------------------------------------------------------->

exports.fetchAllTankers = async (req, res) => {
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
      const fetchAllTankersQuery =
        center_id === 0
          ? `
            SELECT id, tno, ownername, tankerno, contactno, rateltr 
            FROM tankermaster
            WHERE dairy_id = ?
          `
          : `
            SELECT id, tno, ownername, tankerno, contactno, rateltr 
            FROM tankermaster
            WHERE dairy_id = ? AND center_id = ?
          `;

      const params = center_id === 0 ? [dairy_id] : [dairy_id, center_id];

      connection.query(fetchAllTankersQuery, params, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        if (result.length === 0) {
          return res.status(200).json({ status: 204, tankerList: [] });
        }

        res.status(200).json({ status: 200, tankerList: result });
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
// Delete Tanker --------------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.deleteTanker = async (req, res) => {
  const { id } = req.body;
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
      const checkIsUsedTanker = `
        SELECT COUNT(code) AS code_count
        FROM customer
        WHERE orgid = ? AND center_id = ?;
      `;

      connection.query(
        checkIsUsedTanker,
        [dairy_id, center_id],
        (err, result) => {
          if (err) {
            connection.release();
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error" });
          }

          if (result[0].code_count === 0) {
            const deleteTankerQuery = `
            DELETE FROM tankermaster
            WHERE id = ?
          `;

            connection.query(deleteTankerQuery, [id], (err, result) => {
              connection.release();
              if (err) {
                console.error("Error executing query: ", err);
                return res
                  .status(500)
                  .json({ status: 500, message: "Query execution error" });
              }

              res.status(200).json({
                status: 200,
                message: "Tanker deleted successfully",
              });
            });
          } else {
            connection.release();
            return res.status(200).json({
              status: 200,
              message: "Tanker records found, You can't delete this tanker!",
            });
          }
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
