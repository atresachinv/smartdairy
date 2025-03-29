const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// --------------------------------------------------------------------------->
// fetch max Bank no --------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.maxBankNO = async (req, res) => {
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
        SELECT MAX(CAST(code AS UNSIGNED)) AS maxBankcode 
        FROM bankmaster 
        WHERE companyid = ?
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

        const maxBankNo = results[0]?.maxBankcode || 0;
        const maxBankCode = maxBankNo + 1;

        return res.status(200).json({ status: 200, maxBankCode });
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
// Add New Bank -------------------------------------------------------------->
// --------------------------------------------------------------------------->
exports.addNewBank = async (req, res) => {
  const { date, code, bankname, branch, ifsc } = req.body.values;

  const { dairy_id, center_id, user_id } = req.user;

  if (!date || !code || !bankname || !branch || !ifsc) {
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
      const glcode = 0;
      const addBankQuery = `
        INSERT INTO bankmaster 
        (code, name, branch, ifsc, companyid, center_id, glcode, createdon, createdby) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        addBankQuery,
        [
          code,
          bankname,
          branch,
          ifsc,
          dairy_id,
          center_id,
          glcode,
          date,
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
            .json({ status: 200, message: "New bank added successfully!" });
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
// update Bank --------------------------------------------------------------->
// --------------------------------------------------------------------------->
exports.updateBankDetails = async (req, res) => {
  const { id, date, code, bankname, branch, ifsc } = req.body.values;
  const { dairy_id, center_id, user_id } = req.user;

  if (!id || !date || !code || !bankname || !branch || !ifsc) {
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
      const updateBankQuery = `
        UPDATE bankmaster SET
        code = ?, name = ?, branch = ?, ifsc = ?, companyid = ?, center_id = ?, glcode = ?, updatedon = ?, updatedby = ? 
        WHERE id = ?
      `;

      connection.query(
        updateBankQuery,
        [
          code,
          bankname,
          branch,
          ifsc,
          dairy_id,
          center_id,
          glcode,
          date,
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
            message: "Bank details updated successfully!",
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
// Fetch all Banks------------------------------------------------------------>
// --------------------------------------------------------------------------->

exports.fetchAllBanks = async (req, res) => {
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
      const fetchAllBanksQuery =
        center_id === 0
          ? `
            SELECT id, code, name, branch, ifsc, glcode 
            FROM bankmaster
            WHERE companyid = ?
          `
          : `
            SELECT id, code, name, branch, ifsc, glcode 
            FROM bankmaster
            WHERE companyid = ? AND center_id = ?
          `;

      const params = center_id === 0 ? [dairy_id] : [dairy_id, center_id];

      connection.query(fetchAllBanksQuery, params, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        if (result.length === 0) {
          return res.status(204).json({ status: 204, bankList: [] });
        }

        res.status(200).json({ status: 200, bankList: result });
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
// Delete Bank --------------------------------------------------------------->
// --------------------------------------------------------------------------->

exports.deleteBank = async (req, res) => {
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
      const checkIsUsedBank = `
        SELECT COUNT(code) AS code_count
        FROM customer
        WHERE orgid = ? AND center_id = ?;
      `;

      connection.query(
        checkIsUsedBank,
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
            const deleteBankQuery = `
            DELETE FROM bankmaster
            WHERE id = ?
          `;

            connection.query(deleteBankQuery, [id], (err, result) => {
              connection.release();
              if (err) {
                console.error("Error executing query: ", err);
                return res
                  .status(500)
                  .json({ status: 500, message: "Query execution error" });
              }

              res.status(200).json({
                status: 200,
                message: "Bank deleted successfully",
              });
            });
          } else {
            connection.release();
            return res.status(200).json({
              status: 200,
              message: "Bank records found, You can't delete this bank!",
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
