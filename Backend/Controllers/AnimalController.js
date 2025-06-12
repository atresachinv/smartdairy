const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

//------------------------------------------------------------------------------------------>
// ADD NEW ANIMAL DETAILS ------------------------------------------------------------------>
exports.addNewAnimal = async (req, res) => {
  const { cust_code, code, aname, tagno, atype, isMilking, liters } =
    req.body.values;

  const { dairy_id, center_id, user_id } = req.user;
  if (!cust_code || !code || !aname || !tagno || !atype || !liters) {
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
      const addAnimalQuery = `
          INSERT INTO animalMaster 
          (dairy_id , center_id, cust_code, code, aname, tagno, atype, isMilking, liters, createdon, createdby) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

      connection.query(
        addAnimalQuery,
        [
          dairy_id,
          center_id,
          cust_code,
          code,
          aname,
          tagno,
          atype,
          isMilking,
          liters,
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
            .json({ status: 200, message: "New Animal added successfully!" });
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

//------------------------------------------------------------------------------------------>
// UPDATE EXISTING ANIMAL INFO ------------------------------------------------------------->
exports.updateAnimalDetails = async (req, res) => {
  const { id, aname, tagno, atype, isMilking, liters } = req.body.values;
  const { dairy_id, user_id } = req.user;

  if (!id || !aname || !tagno || !atype || !liters) {
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
      const updateAnimalQuery = `
          UPDATE animalMaster SET
          aname = ?, tagno = ?, atype = ?, isMilking = ?, liters = ?
          WHERE id = ?
        `;

      connection.query(
        updateAnimalQuery,
        [aname, tagno, atype, isMilking, liters, id],
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
            message: "Animal details updated successfully!",
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

//------------------------------------------------------------------------------------------>
// FETCH MAX ANIMAL CODE FOR PERTICULAR CUSTOMER ------------------------------------------->0
exports.maxAnimalNO = async (req, res) => {
  const cust_code = req.query.cust_code;
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
        SELECT MAX(CAST(code AS UNSIGNED)) AS maxAnicode 
        FROM animalMaster 
        WHERE dairy_id = ? AND cust_code = ?
      `;
      let params = [dairy_id, cust_code];

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
        const maxAnimalNo = results[0]?.maxAnicode || 0;
        const maxAnimalCode = maxAnimalNo + 1;

        return res.status(200).json({ status: 200, maxAnimalCode });
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

//------------------------------------------------------------------------------------------>
// LIST ALL ANIMAL DETAILS OF CUSTOMER ----------------------------------------------------->
exports.fetchAllAnimals = async (req, res) => {
  const { cust_code } = req.query;
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
      const fetchAllanimalQuery =
        center_id === 0
          ? `
              SELECT id, cust_code, code, aname, tagno, atype, isMilking, liters, createdon
              FROM animalMaster
              WHERE dairy_id = ? AND cust_code = ?
            `
          : `
              SELECT id, cust_code, code, aname, tagno, atype, isMilking, liters, createdon
              FROM animalMaster
              WHERE dairy_id = ? AND center_id = ? AND cust_code = ?
            `;

      const params =
        center_id === 0
          ? [dairy_id, cust_code]
          : [dairy_id, center_id, cust_code];

      connection.query(fetchAllanimalQuery, params, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }
        if (result.length === 0) {
          return res.status(204).json({ status: 204, animalList: [] });
        }

        res.status(200).json({ status: 200, animalList: result });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------------>
// DELETE SELECTED ANIMAL DETAILS ---------------------------------------------------------->
exports.deleteAnimal = async (req, res) => {
  const { id } = req.query;
  const { dairy_id } = req.user;
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
      const deleteAnimalQuery = `
              DELETE FROM animalMaster
              WHERE id = ?
            `;

      connection.query(deleteAnimalQuery, [id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        res.status(200).json({
          status: 200,
          rows: result.affectedRows,
          message: "Animal Record deleted successfully",
        });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};
