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
// Retrive MILk TO TRANSFER MILK COLLECTION CUSTOMER TO CUSTOMER --------------------->
// ----------------------------------------------------------------------------------->

exports.getMilkTrasferToCustomer = async (req, res) => {
   const { code, fromdate, todate } = req.query;
   console.log(req.query);

   if (!code || !fromdate || !todate) {
     return res.status(400).json({ message: "Required data is missing!" });
   }

   const dairy_id = req.user?.dairy_id;
   const center_id = req.user?.center_id;

   if (!dairy_id) {
     return res.status(400).json({ message: "Dairy ID not found!" });
   }

   const dairy_table = `dailymilkentry_${dairy_id}`;
   const selectRecordQuery = `
    SELECT id, Litres, fat, snf, rate, Amt, ME
    FROM ${dairy_table}
    WHERE companyid = ? AND center_id = ? 
      AND ReceiptDate BETWEEN ? AND ? 
      AND rno = ?
  `;

   pool.getConnection((err, connection) => {
     if (err) {
       console.error("Error getting MySQL connection: ", err);
       return res.status(500).json({ message: "Database connection error" });
     }

     connection.query(
       selectRecordQuery,
       [dairy_id, center_id, fromdate, todate, code],
       (err, result) => {
         connection.release(); // Always release the connection

         if (err) {
           console.error("Error executing query: ", err);
           return res.status(500).json({ message: "Query execution error" });
         }

         if (result.length === 0) {
           return res.status(404).json({ message: "No records found!" });
         }

         console.log(result);
         return res.status(200).json({ customerMilkData: result });
       }
     );
   });
};

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

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // const currentDate =
      const dairy_table = `dailymilkentry_${dairy_id}`;

      const updateRecordQuery = `
        UPDATE  AccCode , cname , rno UpdatedBy, updatedOn
        FROM ${dairy_table}
        WHERE id = ? AND rno = ?
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
        UPDATE  ReceiptDate = ? , ME =? , UpdatedBy , updatedOn
        FROM ${dairy_table}
        WHERE companyid = ? AND center_id = ? AND ReceiptDate = ? AND ME = ? AND rno IN ()

      `;

      connection.query(
        updateRecordQuery,
        [
          updatedate,
          updatetime,
          user_role,
          currentDate,
          dairy_id,
          center_id,
          date,
          time,
          fromCode,
          toCode,
        ],
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
  const { values } = req.body;

  // Validate request body
  if (!values || !values.currentdate || !values.updatedate || !values.time) {
    return res.status(400).json({ message: "Required data is missing!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      const { currentdate, updatetime, fromCode, toCode, updatedate, time } =
        values;

      // Step 1: Select records based on currentdate, time (ME), and customers (rno)
      const selectRecordQuery = `
        SELECT Litres, fat, snf, rate, Amt, AccCode, cname, rno, ME
        FROM ${dairy_table}
        WHERE companyid = ? AND center_id = ? AND ReceiptDate = ? 
          AND rno BETWEEN ? AND ? AND ME ${time === 2 ? "IN (0, 1)" : "= ?"}  
      `;

      const selectParams =
        time === 2
          ? [dairy_id, center_id, currentdate, fromCode, toCode]
          : [dairy_id, center_id, currentdate, fromCode, toCode, time];

      connection.query(selectRecordQuery, selectParams, (err, results) => {
        if (err) {
          console.error("Error selecting records: ", err);
          connection.release();
          return res.status(500).json({ message: "Error selecting records" });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: "No records found!" });
        }

        // Step 2: Insert new records into the same table with updated fields
        const insertRecordQuery = `
            INSERT INTO ${dairy_table} 
            (companyid, userid, ReceiptDate, ME, Litres, Amt, AccCode, fat, snf, rate, cname, rno, center_id) 
            VALUES ?
        `;

        const insertData = results.map((record) => [
          dairy_id,
          req.user.user_id,
          updatedate,
          time === 2 ? record.ME : updatetime,
          record.Litres,
          record.Amt,
          record.AccCode,
          record.fat,
          record.snf,
          record.rate,
          record.cname,
          record.rno,
          center_id,
        ]);

        // Execute the query with flattened data
        connection.query(insertRecordQuery, [insertData], (err, result) => {
          connection.release();
          if (err) {
            console.error("Error inserting records: ", err);
            return res.status(500).json({ message: "Error inserting records" });
          }
          if (result.affectedRows === 0) {
            return res.status(200).json({
              message: "No Records Found to Copy!",
            });
          }
          return res.status(200).json({
            message: "Records copied and updated successfully!",
            affectedRows: result.affectedRows,
          });
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      connection.release();
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------->
// DELETE MILK COLLECTION ------------------------------------------------------------>
// ----------------------------------------------------------------------------------->

exports.deleteMilkCollection = async (req, res) => {
  const { fromDate, toDate, fromCode, toCode, time } = req.body;

  // Validate request body
  if (!fromDate || !toDate || !fromCode || !toCode || !time) {
    return res.status(400).json({ message: "All input fields are required!" });
  }
  const dairy_id = req.user.dairy_id;
  console.log("dairy_id", dairy_id);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    console.log("hiii2");
    try {
      const dairy_id = req.user?.dairy_id;
      console.log("hiii3");
      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      const deleteQuery = `
        DELETE  FROM ${dairy_table}
        WHERE 
          ReceiptDate BETWEEN ? AND ? 
          AND rno BETWEEN ? AND ? 
          AND ME ${time === 2 ? "IN (0, 1)" : "= ?"}
      `;
      console.log("hiii4");
      const queryParams =
        time === 2
          ? [fromDate, toDate, fromCode, toCode]
          : [fromDate, toDate, fromCode, toCode, time];

      connection.query(deleteQuery, queryParams, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(200)
            .json({ message: "No records found to delete!" });
        }
        console.log("deletedRows:", result.affectedRows);

        res.status(200).json({
          message: "Records deleted successfully!",
          deletedRows: result.affectedRows,
        });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------->
// Transfer MILK COLLECTION to Shift ------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.transferMilkCollectionToShift = async (req, res) => {
  const { values } = req.body;

  // Validate request body
  if (!values) {
    return res.status(400).json({ message: "Required data is missing!" });
  }

  try {
    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    if (!dairy_id) {
      return res.status(400).json({ message: "Dairy ID not found!" });
    }
    const dairy_table = `dailymilkentry_${dairy_id}`;
    const { currentdate, updatetime, fromCode, toCode, updatedate, time } =
      values;

    // Step 1: Select records based on currentdate, time (ME), and customers (rno)
    const selectRecordQuery = `
      SELECT id, rno, ME
      FROM ${dairy_table}
      WHERE center_id = ? AND ReceiptDate = ? AND rno BETWEEN ? AND ? AND ME = ?  
    `;

    const selectParams = [center_id, currentdate, fromCode, toCode, time];
    // Start MySQL connection
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection: ", err);
        return res.status(500).json({ message: "Database connection error" });
      }

      // Select records based on the provided parameters
      connection.query(selectRecordQuery, selectParams, (err, results) => {
        if (err) {
          console.error("Error selecting records: ", err);
          connection.release();
          return res.status(500).json({ message: "Error selecting records" });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: "No records found!" });
        }

        // Step 2: Update records in the same table with updated fields
        const insertRecordQuery = `
          UPDATE ${dairy_table} 
          SET ReceiptDate = ?, ME = ?
          WHERE id = ?
        `;

        // Prepare the data for updating records
        const updateData = results.map((record) => [
          updatedate, // Updated receipt date
          updatetime, // Updated ME time
          record.id, // Record ID to update
        ]);

        // Execute the update query for each record
        connection.beginTransaction((err) => {
          if (err) {
            console.error("Transaction start error: ", err);
            connection.release();
            return res.status(500).json({ message: "Transaction error" });
          }

          connection.query(
            insertRecordQuery,
            [updatedate, updatetime, results[0].id],
            (err, result) => {
              if (err) {
                console.error("Error updating records: ", err);
                connection.rollback(() => {
                  connection.release();
                  return res
                    .status(500)
                    .json({ message: "Error updating records" });
                });
              }

              // Commit the transaction
              connection.commit((err) => {
                if (err) {
                  console.error("Error committing transaction: ", err);
                  connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ message: "Transaction commit error" });
                  });
                }
                // Successfully updated records
                connection.release();
                return res.status(200).json({
                  message: "Records updated successfully!",
                  affectedRows: result.affectedRows,
                });
              });
            }
          );
        });
      });
    });
  } catch (error) {
    console.error("Error processing request: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------------------------------------------------------------->
// TRANSFER MILK COLLECTION TO DATE -------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.transferMilkCollToDate = async (req, res) => {
  const { values } = req.body;

  // Validate request body
  if (!values || !values.currentdate || !values.updatedate || !values.time) {
    return res.status(400).json({ message: "Required data is missing!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      const { currentdate, updatetime, fromCode, toCode, updatedate, time } =
        values;

      // Step 1: Select records based on currentdate, time (ME), and customers (rno)
      const selectRecordQuery = `
        SELECT id , Litres, fat, snf, rate, Amt, AccCode, cname, rno, ME
        FROM ${dairy_table}
        WHERE companyid = ? AND center_id = ? AND ReceiptDate = ? 
          AND rno BETWEEN ? AND ? AND ME ${time === 2 ? "IN (0, 1)" : "= ?"}  
      `;

      const selectParams =
        time === 2
          ? [dairy_id, center_id, currentdate, fromCode, toCode]
          : [dairy_id, center_id, currentdate, fromCode, toCode, time];

      connection.query(selectRecordQuery, selectParams, (err, results) => {
        if (err) {
          console.error("Error selecting records: ", err);
          connection.release();
          return res.status(500).json({ message: "Error selecting records" });
        }

        if (results.length === 0) {
          connection.release();
          return res.status(404).json({ message: "No records found!" });
        }

        // Step 2: Insert new records into the same table with updated fields
        const insertRecordQuery = `
            INSERT INTO ${dairy_table} 
            (companyid, userid, ReceiptDate, ME, Litres, Amt, AccCode, fat, snf, rate, cname, rno, center_id) 
            VALUES ?
        `;

        const insertData = results.map((record) => [
          dairy_id,
          req.user.user_id,
          updatedate,
          time === 2 ? record.ME : updatetime,
          record.Litres,
          record.Amt,
          record.AccCode,
          record.fat,
          record.snf,
          record.rate,
          record.cname,
          record.rno,
          center_id,
        ]);

        // Execute the query with flattened data
        connection.query(insertRecordQuery, [insertData], (err, result) => {
          connection.release();
          if (err) {
            console.error("Error inserting records: ", err);
            return res.status(500).json({ message: "Error inserting records" });
          }
          if (result.affectedRows === 0) {
            return res.status(200).json({
              message: "No Records Found to Copy!",
            });
          }
          return res.status(200).json({
            message: "Records copied and updated successfully!",
            affectedRows: result.affectedRows,
          });
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      connection.release();
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};



