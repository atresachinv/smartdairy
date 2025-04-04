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
    return res
      .status(400)
      .json({ status: 400, message: "Records are required!" });
  }
  const dairy_id = req.user.dairy_id;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
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
  try {
    const { code, fromDate, toDate } = req.query;

    const { dairy_id, center_id } = req.user;
    if (!dairy_id) {
      return res
        .status(400)
        .json({ status: 4001, message: "Unauthorized User!" });
    }

    const dairy_table = `dailymilkentry_${dairy_id}`;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection:", err);
        return res.status(500).json({ message: "Database connection error" });
      }

      const selectRecordQuery = `
        SELECT id, rno, ReceiptDate, Litres, fat, snf, rate, Amt, ME
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ? 
        AND rno = ?
        `;

      connection.query(
        selectRecordQuery,
        [center_id, fromDate, toDate, code],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query:", err);
            return res
              .status(500)
              .json({ message: "Query execution error", error: err.message });
          }

          if (result.length === 0) {
            return res.status(200).json({
              message: "No records found!",
              customerMilkData: result || [],
            });
          }

          return res.status(200).json({ customerMilkData: result || [] });
        }
      );
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------------------------------------------------------------->
// Retrive TRANSFERED MILK COLLECTION TO CUSTOMER ------------------------------------>
// ----------------------------------------------------------------------------------->

exports.getTrasferedMilk = async (req, res) => {
  const { code, fromDate, toDate } = req.query;

  const { dairy_id, center_id } = req.user;
  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }
  const dairy_table = `dailymilkentry_${dairy_id}`;

  try {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection:", err);
        return res.status(500).json({ message: "Database connection error" });
      }

      const selectRecordQuery = `
        SELECT id, rno, ReceiptDate, Litres, fat, snf, rate, Amt, ME
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ? 
        AND rno = ?
        `;

      connection.query(
        selectRecordQuery,
        [center_id, fromDate, toDate, code],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query:", err);
            return res
              .status(500)
              .json({ message: "Query execution error", error: err.message });
          }

          if (result.length === 0) {
            return res.status(200).json({
              message: "No records found!",
              customerMilkData: result || [],
            });
          }

          return res.status(200).json({ customerMilkData: result || [] });
        }
      );
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ----------------------------------------------------------------------------------->
// TRANSFER MILK COLLECTION CUSTOMER TO CUSTOMER ------------------------------------->
// ----------------------------------------------------------------------------------->

exports.milkTrasferToCustomer = async (req, res) => {
  const { ucode, ucname, uacccode, fromDate, toDate, records } = req.body;
  const { dairy_id, center_id, user_role } = req.user;
  console.log("hello from cust transfer");
  if (!dairy_id || !user_role) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  // Validate request body
  if (
    !ucode ||
    !ucname ||
    !uacccode ||
    !fromDate ||
    !toDate ||
    !records ||
    !Array.isArray(records) ||
    records.length === 0
  ) {
    return res.status(400).json({
      status: 400,
      message: "Milk collection data is required to milk transfer!",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const dairy_table = `dailymilkentry_${dairy_id}`;
      const currentDate = new Date();

      // Step 1: Update records
      const updateRecordQuery = `
        UPDATE ${dairy_table} 
        SET AccCode = ?, cname = ?, rno = ?, UpdatedBy = ?, updatedOn = ? 
        WHERE id = ?
      `;

      const updatePromises = records.map((record) => {
        return new Promise((resolve, reject) => {
          const { id } = record;
          if (!id) {
            return reject("Invalid record format");
          }

          connection.query(
            updateRecordQuery,
            [uacccode, ucname, ucode, user_role, currentDate, id],
            (err, result) => {
              if (err) {
                console.error("Error executing query: ", err);
                return reject("Query execution error");
              }
              resolve(result);
            }
          );
        });
      });

      Promise.all(updatePromises)
        .then(() => {
          // Step 2: Remove duplicate entries (keeping the latest one)
          const deleteDuplicateQuery = `
              DELETE FROM ${dairy_table}
              WHERE id NOT IN (
                  SELECT * FROM (
                      SELECT MIN(id) 
                      FROM ${dairy_table} 
                      WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
                      GROUP BY ReceiptDate, rno, ME, CB
                  ) AS temp_table
              ) 
              AND ReceiptDate BETWEEN ? AND ?;
          `;

          connection.query(
            deleteDuplicateQuery,
            [center_id, fromDate, toDate, fromDate, toDate],
            (err, deleteResult) => {
              connection.release();
              if (err) {
                console.error("Error deleting duplicates: ", err);
                return res
                  .status(500)
                  .json({ message: "Error removing duplicate records" });
              }

              return res.status(200).json({
                status: 200,
                message:
                  "Milk Collection Transferred to customer successfully!",
              });
            }
          );
        })
        .catch((error) => {
          connection.release();
          res.status(500).json({
            status: 500,
            message: "Error updating records",
            error,
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

// ----------------------------------------------------------------------------------->
// MILK TRANSFER TO DATES ------------------------------------------------------------>
// ----------------------------------------------------------------------------------->

exports.milkTrasferToDates = async (req, res) => {
  const { date, updatedate, fromCode, toCode } = req.body;
  const { dairy_id, center_id, user_role } = req.user;

  // Validate request body
  if (!date || !updatedate || !fromCode || !toCode) {
    return res.status(400).json({
      status: 400,
      message: "All field data required!",
    });
  }

  if (!dairy_id || !user_role) {
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
      const dairy_table = `dailymilkentry_${dairy_id}`;
      const currentDate = new Date();

      // Step 1: Fetch records that need to be updated
      const fetchRecordQuery = `
        SELECT id, ReceiptDate, rno, ME, CB 
        FROM ${dairy_table} 
        WHERE ReceiptDate = ? AND rno BETWEEN ? AND ?
      `;

      connection.query(
        fetchRecordQuery,
        [date, fromCode, toCode],
        (err, records) => {
          if (err) {
            console.error("Error fetching records: ", err);
            connection.release();
            return res
              .status(500)
              .json({ status: 500, message: "Error fetching records" });
          }

          if (records.length === 0) {
            connection.release();
            return res
              .status(404)
              .json({ status: 404, message: "No records found!" });
          }

          // Step 2: Update records with new ReceiptDate
          const updateRecordQuery = `
          UPDATE ${dairy_table} 
          SET ReceiptDate = ?, UpdatedBy = ?, updatedOn = ? 
          WHERE id = ?
        `;

          const updatePromises = records.map((record) => {
            return new Promise((resolve, reject) => {
              connection.query(
                updateRecordQuery,
                [updatedate, user_role, currentDate, record.id],
                (err, result) => {
                  if (err) {
                    console.error("Error executing update query: ", err);
                    return reject("Query execution error");
                  }
                  resolve(result);
                }
              );
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              // Step 3: Remove duplicate entries, keeping the latest one
              const deleteDuplicateQuery = `
              DELETE FROM ${dairy_table}
              WHERE id NOT IN (
                SELECT id FROM (
                  SELECT MIN(id) AS id 
                  FROM ${dairy_table} 
                  WHERE center_id = ? AND  ReceiptDate = ?
                  GROUP BY ReceiptDate, rno, ME, CB
                ) AS temp_table
              ) AND ReceiptDate = ?
            `;

              connection.query(
                deleteDuplicateQuery,
                [center_id, updatedate, updatedate],
                (err, deleteResult) => {
                  connection.release();
                  if (err) {
                    console.error("Error deleting duplicates: ", err);
                    return res.status(500).json({
                      status: 500,
                      message: "Error removing duplicate records",
                    });
                  }

                  res.status(200).json({
                    status: 200,
                    message:
                      "Milk collection records transferred successfully!",
                  });
                }
              );
            })
            .catch((error) => {
              connection.release();
              res.status(500).json({
                status: 500,
                message: "Error updating records",
                error,
              });
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

// ----------------------------------------------------------------------------------->
// TRANSFER MILK COLLECTION TO SHIFT ------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.milkTrasferToShift = async (req, res) => {
  const { currentdate, updatedate, fromCode, toCode, time, updatetime } =
    req.body;
  const { dairy_id, center_id, user_role } = req.user;
  // Validate request body
  if (!currentdate || !updatedate || !fromCode || !toCode) {
    return res.status(400).json({
      status: 400,
      message: "All field data required!",
    });
  }

  if (!dairy_id || !user_role) {
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
      const dairy_table = `dailymilkentry_${dairy_id}`;
      const nowdate = new Date();

      // Step 1: Fetch records that need to be updated
      const fetchRecordQuery = `
        SELECT id, ReceiptDate, ME, CB, rno 
        FROM ${dairy_table} 
        WHERE ReceiptDate = ? AND ME = ? AND rno BETWEEN ? AND ?
      `;

      connection.query(
        fetchRecordQuery,
        [currentdate, time, fromCode, toCode],
        (err, records) => {
          if (err) {
            console.error("Error fetching records: ", err);
            connection.release();
            return res
              .status(500)
              .json({ status: 500, message: "Error fetching records" });
          }

          if (records.length === 0) {
            connection.release();
            return res
              .status(404)
              .json({ status: 404, message: "No records found!" });
          }

          // Step 2: Update records with new date and ME
          const updateRecordQuery = `
          UPDATE ${dairy_table} 
          SET ReceiptDate = ?, ME = ?, UpdatedBy = ?, updatedOn = ? 
          WHERE id = ?
        `;

          const updatePromises = records.map((record) => {
            return new Promise((resolve, reject) => {
              connection.query(
                updateRecordQuery,
                [updatedate, updatetime, user_role, nowdate, record.id],
                (err, result) => {
                  if (err) {
                    console.error("Error executing update query: ", err);
                    return reject("Query execution error");
                  }
                  resolve(result);
                }
              );
            });
          });

          Promise.all(updatePromises)
            .then(() => {
              // Step 3: Remove duplicate entries, keeping only the latest one
              const deleteDuplicateQuery = `
              DELETE FROM ${dairy_table}
              WHERE id NOT IN (
                SELECT id FROM (
                  SELECT MIN(id) AS id 
                  FROM ${dairy_table} 
                  WHERE center_id = ? AND ReceiptDate = ? 
                  GROUP BY ReceiptDate, rno, ME, CB
                ) AS temp_table
              ) AND ReceiptDate = ?
            `;

              connection.query(
                deleteDuplicateQuery,
                [center_id, updatedate, updatedate],
                (err, deleteResult) => {
                  connection.release();
                  if (err) {
                    console.error("Error deleting duplicates: ", err);
                    return res.status(500).json({
                      status: 500,
                      message: "Error removing duplicate records",
                    });
                  }

                  res.status(200).json({
                    status: 200,
                    message: "Milk records transferred to shift successfully!",
                    updatedRecords: records.length,
                    deletedDuplicates: deleteResult.affectedRows,
                  });
                }
              );
            })
            .catch((error) => {
              connection.release();
              res.status(500).json({
                status: 500,
                message: "Error transferring records!",
                error,
              });
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

// ----------------------------------------------------------------------------------->
// COPY MILK COLLECTION -------------------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.copyMilkCollection = async (req, res) => {
  const { currentdate, updatedate, fromCode, toCode, time, updatetime } =
    req.body;
  const { dairy_id, center_id, user_id } = req.user;

  // Validate request body
  if (
    !currentdate ||
    !updatedate ||
    !fromCode ||
    !toCode ||
    !time ||
    !updatetime
  ) {
    return res.status(400).json({ message: "All field data required!" });
  }

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Step 1: Select records based on currentdate, time (ME), and customers (rno)
      const selectRecordQuery = `
        SELECT Litres, fat, snf, rate, Amt, AccCode, cname, rno, ME, CB
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? 
          AND rno BETWEEN ? AND ? 
          AND ME ${time === 2 ? "IN (0, 1)" : "= ?"}
      `;

      const selectParams =
        time === 2
          ? [center_id, currentdate, fromCode, toCode]
          : [center_id, currentdate, fromCode, toCode, time];

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

        // Step 2: Insert new records with updated ReceiptDate
        const insertRecordQuery = `
            INSERT INTO ${dairy_table} 
            (userid, ReceiptDate, ME, CB, Litres, Amt, AccCode, fat, snf, rate, cname, rno, center_id) 
            VALUES ?
        `;

        const insertData = results.map((record) => [
          user_id,
          updatedate,
          time === 2 ? record.ME : updatetime,
          record.CB,
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

        connection.query(insertRecordQuery, [insertData], (err, result) => {
          if (err) {
            console.error("Error inserting records: ", err);
            connection.release();
            return res.status(500).json({ message: "Error inserting records" });
          }

          if (result.affectedRows === 0) {
            connection.release();
            return res
              .status(200)
              .json({ message: "No Records Found to Copy!" });
          }

          // Step 3: Remove old duplicates for the same `updatedate`, `rno`, `ME`, `CB`
          const deleteDuplicateQuery = `
              DELETE FROM ${dairy_table}
              WHERE id NOT IN (
                  SELECT * FROM (
                      SELECT MIN(id) 
                      FROM ${dairy_table} 
                      WHERE center_id = ? AND ReceiptDate = ?
                      GROUP BY ReceiptDate, rno, ME, CB
                  ) AS temp_table
              ) 
              AND ReceiptDate = ?;
          `;

          connection.query(
            deleteDuplicateQuery,
            [center_id, updatedate, updatedate],
            (err, deleteResult) => {
              connection.release();
              if (err) {
                console.error("Error deleting duplicates: ", err);
                return res
                  .status(500)
                  .json({ message: "Error removing duplicate records" });
              }

              return res.status(200).json({
                status: 200,
                message: "Records copied and duplicates removed successfully!",
              });
            }
          );
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
  const { values } = req.body;
  const dairy_id = req.user?.dairy_id;

  // Validate request body
  if (!values || Object.keys(values).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "All fields data required!",
    });
  }

  if (!dairy_id) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized User!",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_table = `dailymilkentry_${dairy_id}`;
      const { fromDate, toDate, fromCode, toCode, time } = values;

      let deleteQuery;
      let queryParams;

      if (time === 2) {
        deleteQuery = `
          DELETE FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? 
          AND rno BETWEEN ? AND ? 
          AND ME IN (0, 1)
        `;
        queryParams = [fromDate, toDate, fromCode, toCode];
      } else if (time !== undefined) {
        deleteQuery = `
          DELETE FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? 
          AND rno BETWEEN ? AND ? 
          AND ME = ?
        `;
        queryParams = [fromDate, toDate, fromCode, toCode, time];
      } else {
        return res.status(400).json({ message: "Invalid time value!" });
      }

      connection.query(deleteQuery, queryParams, (err, result) => {
        connection.release(); // Release connection after query execution

        if (err) {
          console.error("Error executing delete query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            status: 201,
            message: "No records found to delete!",
          });
        }

        res.status(200).json({
          status: 200,
          message: "Records deleted successfully!",
        });
      });
    } catch (error) {
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

// <<<<<<<<<<< ----------------- Generate Payment -------------------->>>>>>>>>>>>>> //

// ----------------------------------------------------------------------------------->
// get payment avg fat snf ---------------------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.checkZeroAmt = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate } = req.query;

  if (!dairy_id) {
    return res
      .status(401)
      .json({ status: 401, message: "Dairy ID not found in the request!" });
  }

  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ status: 400, message: "fromDate and toDate are required!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const milkCollectionQuery = `
      SELECT rno FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ? AND center_id = ? AND Amt = 0
        ORDER BY rno ASC;
      `;

    connection.query(
      milkCollectionQuery,
      [fromDate, toDate, center_id],
      (err, results) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err.message);
          return res
            .status(500)
            .json({ status: 500, message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(204).json({
            status: 204,
            paymentZero: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ status: 200, paymentZero: results });
      }
    );
  });
};

// ----------------------------------------------------------------------------------->
// get payment Amount ---------------------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.getMilkPayAmt = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate } = req.query;

  if (!dairy_id) {
    return res
      .status(400)
      .json({ message: "Dairy ID not found in the request!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    const milkPaymentDataquery = `
      SELECT 
            rno, 
            cname,
            SUM(Litres) AS totalLitres,
            SUM(Litres * rate) AS totalamt,
            MIN(ReceiptDate) AS min_receipt_date,
            SUM(Litres * fat) / SUM(Litres) AS avgFat, 
            SUM(Litres * snf) / SUM(Litres) AS avgSnf
        FROM 
            ${dairy_table}
        WHERE 
            ReceiptDate BETWEEN ? AND ? 
            AND center_id = ?
        GROUP BY 
            rno, cname
        ORDER BY 
            CAST(rno AS UNSIGNED) ASC;
      `;

    connection.query(
      milkPaymentDataquery,
      [fromDate, toDate, center_id],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            paymentData: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ status: 200, paymentData: results });
      }
    );
  });
};

// ----------------------------------------------------------------------------------->
/* Save bill on generate button click ------------------------------------------------>
  Save FIx Deduction And Deduction 0 Entries */ //------------------------------------>
//------------------------------------------------------------------------------------>

exports.saveFixDeductions = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { formData, PaymentFD } = req.body;

  const { billDate, vcDate, fromDate, toDate, custFrom, custTo } = formData;

  if (!dairy_id || !center_id) {
    return res.status(400).json({ message: "Dairy ID or center ID missing!" });
  }

  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("MySQL connection error: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Step 1: Get max BillNo
      const [billRows] = await connection.promise().query(
        `SELECT MAX(CAST(BillNo AS UNSIGNED)) AS maxBillNo 
         FROM custbilldetails 
         WHERE companyid = ? AND center_id = ?`,
        [dairy_id, center_id]
      );

      let billCounter = billRows[0].maxBillNo
        ? parseInt(billRows[0].maxBillNo)
        : 0;

      // Step 2: Group PaymentFD by rno
      const groupedByRno = PaymentFD.reduce((acc, item) => {
        if (!acc[item.rno]) acc[item.rno] = [];
        acc[item.rno].push(item);
        return acc;
      }, {});

      // Step 3: Insert records for each rno
      for (const rno of Object.keys(groupedByRno)) {
        billCounter++;
        const billNo = billCounter.toString().padStart(4, "0");

        // Sort by DeductionId ASC (DeductionId === 0 comes first)
        const records = groupedByRno[rno].sort(
          (a, b) => a.DeductionId - b.DeductionId
        );

        for (const row of records) {
          const {
            GLCode,
            DeductionId,
            dname,
            amt,
            totalamt,
            totalLitres,
            avgFat,
            avgSnf,
            avgRate,
            totalDeduction,
            netPayment,
          } = row;

          const insertQuery = `
            INSERT INTO custbilldetails
            (companyid, center_id, BillNo, BillDate, VoucherNo, VoucherDate,
             GLCode, Code, FromDate, ToDate, dname, DeductionId, Amt, MAMT, BAMT,
             tliters, afat, asnf, arate, pamt, damt, namt)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

          const values = [
            dairy_id,
            center_id,
            billNo,
            billDate,
            billNo, // Assuming VoucherNo = BillNo
            vcDate,
            GLCode || null,
            rno,
            fromDate,
            toDate,
            dname || null,
            DeductionId,
            parseFloat(amt).toFixed(2),
            0.0, // MAMT
            0.0, // BAMT
            parseFloat(totalLitres).toFixed(2),
            parseFloat(avgFat).toFixed(2),
            parseFloat(avgSnf).toFixed(2),
            parseFloat(avgRate).toFixed(2),
            parseFloat(totalamt).toFixed(2),
            parseFloat(totalDeduction).toFixed(2),
            parseFloat(netPayment).toFixed(2),
          ];

          await connection.promise().query(insertQuery, values);
        }
      }

      res.status(200).json({ message: "Deductions saved successfully." });
    } catch (error) {
      console.error("Save error:", error);
      res.status(500).json({ message: "Something went wrong while saving!" });
    } finally {
      connection.release();
    }
  });
};

// ----------------------------------------------------------------------------------->
// Save Fix Deduction And other Deductions Entries and update last ------------------->
// ----------------------------------------------------------------------------------->

exports.saveNewUpdateLastBill = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate } = req.query;

  if (!dairy_id) {
    return res
      .status(400)
      .json({ message: "Dairy ID not found in the request!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    const milkPaymentDataquery = `
      SELECT 
            rno, 
            cname,
            SUM(Litres) AS totalLitres,
            SUM(Litres * rate) AS totalamt,
            MIN(ReceiptDate) AS min_receipt_date,
            SUM(Litres * fat) / SUM(Litres) AS avgFat, 
            SUM(Litres * snf) / SUM(Litres) AS avgSnf
        FROM 
            ${dairy_table}
        WHERE 
            ReceiptDate BETWEEN ? AND ? 
            AND center_id = ?
        GROUP BY 
            rno, cname
        ORDER BY 
            CAST(rno AS UNSIGNED) ASC;
      `;

    connection.query(
      milkPaymentDataquery,
      [fromDate, toDate, center_id],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            paymentData: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ status: 200, paymentData: results });
      }
    );
  });
};

// ----------------------------------------------------------------------------------->
// Lock Unlock Milk Payment ---------------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.lockMilkPayment = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate } = req.query;

  if (!dairy_id) {
    return res
      .status(400)
      .json({ message: "Dairy ID not found in the request!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    const milkPaymentDataquery = `
      SELECT 
            rno, 
            cname,
            SUM(Litres) AS totalLitres,
            SUM(Litres * rate) AS totalamt,
            MIN(ReceiptDate) AS min_receipt_date,
            SUM(Litres * fat) / SUM(Litres) AS avgFat, 
            SUM(Litres * snf) / SUM(Litres) AS avgSnf
        FROM 
            ${dairy_table}
        WHERE 
            ReceiptDate BETWEEN ? AND ? 
            AND center_id = ?
        GROUP BY 
            rno, cname
        ORDER BY 
            CAST(rno AS UNSIGNED) ASC;
      `;

    connection.query(
      milkPaymentDataquery,
      [fromDate, toDate, center_id],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            paymentData: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ status: 200, paymentData: results });
      }
    );
  });
};

// ----------------------------------------------------------------------------------->
// View Selected Payment ------------------------------------------------------------->
// ----------------------------------------------------------------------------------->

exports.fetchSelectedPayAmt = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate } = req.query;

  if (!dairy_id) {
    return res
      .status(400)
      .json({ message: "Dairy ID not found in the request!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    const milkPaymentDataquery = `
      SELECT 
            rno, 
            cname,
            SUM(Litres) AS totalLitres,
            SUM(Litres * rate) AS totalamt,
            MIN(ReceiptDate) AS min_receipt_date,
            SUM(Litres * fat) / SUM(Litres) AS avgFat, 
            SUM(Litres * snf) / SUM(Litres) AS avgSnf
        FROM 
            ${dairy_table}
        WHERE 
            ReceiptDate BETWEEN ? AND ? 
            AND center_id = ?
        GROUP BY 
            rno, cname
        ORDER BY 
            CAST(rno AS UNSIGNED) ASC;
      `;

    connection.query(
      milkPaymentDataquery,
      [fromDate, toDate, center_id],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            paymentData: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ status: 200, paymentData: results });
      }
    );
  });
};
