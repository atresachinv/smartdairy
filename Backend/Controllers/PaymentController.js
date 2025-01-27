const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
const { current } = require("@reduxjs/toolkit");
dotenv.config({ path: "Backend/.env" });

//-----------------------------MILK CORRECTION FUNCTIONS------------------------------//
// ----------------------------------------------------------------------------------->
// Milk Correction update selected milk record only ---------------------------------->
// ----------------------------------------------------------------------------------->

exports.updateSelectedRecord = async (req, res) => {
  const { data } = req.body;

  console.log("hiii");
  if (!data) {
    return res.status(400).json({ message: "record are required!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const { id, liters, fat, snf, rate, amt } = data;
      // const currentDate =
      const dairy_table = `dailymilkentry_${dairy_id}`;
      const currentDate = new Date();
      const updateRecordQuery = `
        UPDATE 
         ${dairy_table}
         SET  Litres = ?, fat = ?, snf = ?, rate = ?, Amt = ?, UpdatedBy = ?, updatedOn = ?
        WHERE id = ?
      `;

      connection.query(
        updateRecordQuery,
        [liters, fat, snf, rate, amt, user_role, currentDate, id],
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
          res
            .status(200)
            .json({ message: "Selected Record updated successfully!" });
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

exports.milkTransferToEvening = async (req, res) => {
  const { records } = req.body;
  // Validate request body
  if (!records || records.length === 0) {
    return res.status(400).json({ message: "Records are required!" });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      const currentDate = new Date(); // Assuming you're using the current date for `updatedOn`

      // Create a query to update multiple records at once
      const placeholders = records.map(() => "?").join(", "); // Creates a list of '?' placeholders based on records length
      const updateRecordQuery = `
        UPDATE ${dairy_table}
        SET ME = 1, UpdatedBy = ?, updatedOn = ?
        WHERE id IN (${placeholders})
      `;

      // Execute the query with all necessary parameters
      const queryParams = [user_role, currentDate, ...records];
      connection.query(updateRecordQuery, queryParams, (err, result) => {
        connection.release(); // Always release the connection

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "No records found to update!" });
        }
        console.log("updatedRecords:", result.affectedRows);

        // Return success response
        res.status(200).json({
          message: "Selected records transferred to evening successfully!",
          updatedRecords: result.affectedRows,
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------->
// Milk Correction transfer Milk evening to morning ---------------------------------->
// ----------------------------------------------------------------------------------->

exports.milkTransferToMorning = async (req, res) => {
  const { records } = req.body;

  // Validate request body
  if (!records || records.length === 0) {
    return res.status(400).json({ message: "Records are required!" });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      const currentDate = new Date();

      // Create a query to update multiple records at once
      const placeholders = records.map(() => "?").join(", ");

      const updateRecordQuery = `
        UPDATE ${dairy_table}
        SET ME = 0, UpdatedBy = ?, updatedOn = ?
        WHERE id IN (${placeholders})
      `;

      // Execute the query with all necessary parameters
      const queryParams = [user_role, currentDate, ...records];
      connection.query(updateRecordQuery, queryParams, (err, result) => {
        connection.release(); // Always release the connection

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "No records found to update!" });
        }

        // Return success response
        res.status(200).json({
          message: "Selected records transferred to morning successfully!",
          updatedRecords: result.affectedRows,
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------->
// Milk Correction delete selected milk record only ---------------------------------->
// ----------------------------------------------------------------------------------->

exports.deleteSelectedMilkRecord = async (req, res) => {
  const { records } = req.body;

  // Validate request body
  if (!records || records.length === 0) {
    return res.status(400).json({ message: "Records are required!" });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Create a query to update multiple records at once
      const placeholders = records.map(() => "?").join(", ");

      const updateRecordQuery = `
        DELETE FROM ${dairy_table}
        WHERE id IN (${placeholders})
      `;

      connection.query(updateRecordQuery, [...records], (err, result) => {
        connection.release(); // Always release the connection

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(200)
            .json({ message: "No records found to delete!" });
        }

        // Return success response
        res.status(200).json({
          message: "Selected records deleted successfully!",
          updatedRecords: result.affectedRows,
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//-----------------------------MILK TRANSFER FUNCTIONS--------------------------------//

// ----------------------------------------------------------------------------------->
// TRANSFER MILK COLLECTION CUSTOMER TO CUSTOMER ------------------------------------->
// ----------------------------------------------------------------------------------->

exports.milkTrasferToCustomer = async (req, res) => {
  const { record } = req.body;

  // Validate request body
  if (!record) {
    return res.status(400).json({ message: "record are required!" });
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
        [date, code, time, user_role, currentDate],
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
          res
            .status(200)
            .json({ message: "Selected Record updated successfully!" });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
// ----------------------------------------------------------------------------------->
// MILK TRANSFER TO DATES ------------------------------------------------------------>
// ----------------------------------------------------------------------------------->

exports.milkTrasferToDates = async (req, res) => {
  const { record } = req.body;

  // Validate request body
  if (!record) {
    return res.status(400).json({ message: "record are required!" });
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
        [date, code, time, user_role, currentDate],
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
          res
            .status(200)
            .json({ message: "Selected Record updated successfully!" });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------->
// TRANSFER MILK COLLECTION TO SHIFT ------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.milkTrasferToShift = async (req, res) => {
  const { record } = req.body;

  // Validate request body
  if (!record) {
    return res.status(400).json({ message: "record are required!" });
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
        [date, code, time, user_role, currentDate],
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
          res
            .status(200)
            .json({ message: "Selected Record updated successfully!" });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
// ----------------------------------------------------------------------------------->
// COPY MILK COLLECTION -------------------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.copyMilkCollection = async (req, res) => {
  const { record } = req.body;

  // Validate request body
  if (!record) {
    return res.status(400).json({ message: "record are required!" });
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
        [date, code, time, user_role, currentDate],
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
          res
            .status(200)
            .json({ message: "Selected Record updated successfully!" });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
// ----------------------------------------------------------------------------------->
// DELETE MILK COLLECTION ------------------------------------------------------------>
// ----------------------------------------------------------------------------------->

exports.deleteMilkCollection = async (req, res) => {
  const { record } = req.body;

  // Validate request body
  if (!record) {
    return res.status(400).json({ message: "record are required!" });
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
        [date, code, time, user_role, currentDate],
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
          res
            .status(200)
            .json({ message: "Selected Record updated successfully!" });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};


