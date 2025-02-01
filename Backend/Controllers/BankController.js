const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// --------------------------------------------------------------------------->
// Add New Bank -------------------------------------------------------------->
// --------------------------------------------------------------------------->
exports.addNewBank = async (req, res) => {
  const { user_code } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const addBankQuery = `INSERT INTO bankmaster (name, branch, ifsc, companyid ,center_id) VALUES (?, ?, ?, ?, ?)`;

      connection.query(
        addBankQuery,
        [user_code, dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // Check if result is empty (no customer found)
          if (result.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
          }

          // Proceed if customer details are found
          const custdetails = result[0];
          res.status(200).json({ custdetails });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
