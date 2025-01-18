const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
const { current } = require("@reduxjs/toolkit");
dotenv.config({ path: "Backend/.env" });

// ----------------------------------------------------------------------------------->
// Milk Correction update selected milk record only ----------------------------------> 
// ----------------------------------------------------------------------------------->

exports.updateSelectedRecord = async (req, res) => {
  const { record } = req.body;

  // Validate request body
  if (!record) {
    return res
      .status(400)
      .json({ message: "record are required!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // const currentDate = 
      const dairy_table = `dailymilkentry_${dairy_id}`;

      const updateRecordQuery = `
        UPDATE  Litres , fat , snf, rate, Amt , UpdatedBy, updatedOn
        FROM ${dairy_table}
        WHERE ReceiptDate = ? AND rno = ? AND ME = ?

      `;

      connection.query(
        updateRecordQuery,
        [date, code , time , user_role, currentDate],
        (err, result) => {
          connection.release(); // Always release the connection
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "No records found!" });
          }

          // Return the results
          res.status(200).json({message : "Selected Record updated successfully!"});
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------->
// Milk Correction transfer Milk morning to evening ----------------------------------> 
// ----------------------------------------------------------------------------------->



// ----------------------------------------------------------------------------------->
// Milk Correction transfer Milk evening to morning ----------------------------------> 
// ----------------------------------------------------------------------------------->

// ----------------------------------------------------------------------------------->
// Milk Correction delete selected milk record only ----------------------------------> 
// ----------------------------------------------------------------------------------->


// ----------------------------------------------------------------------------------->
// Milk Correction transfer Milk customer to customer --------------------------------> 
// ----------------------------------------------------------------------------------->