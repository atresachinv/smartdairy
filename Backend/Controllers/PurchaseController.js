const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

//------------------------------------------------------------------>
//Purchase Info ---------------------------------------------------->
//------------------------------------------------------------------>

exports.purchaseInfo = async (req, res) => {
  const { formDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Get dairy_id and user_code from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;
      const user_id = req.user.user_id;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Combined query to get purchase bills and the summary in a single request
      const purchaseBillsAndSummaryQuery = `
        SELECT 
          BillNo, BillDate, ItemName, Qty, Rate, Amount,
          (SELECT SUM(Qty) FROM salesmaster WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?) AS totalQty,
          (SELECT SUM(Amount) FROM salesmaster WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?) AS totalAmount
        FROM salesmaster 
        WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?
      `;

      // Execute the combined query
      connection.query(
        purchaseBillsAndSummaryQuery,
        [
          dairy_id,
          formDate,
          toDate,
          user_id, // For the totalQty subquery
          dairy_id,
          formDate,
          toDate,
          user_id, // For the totalAmount subquery
          dairy_id,
          formDate,
          toDate,
          user_id, // For the main query
        ],
        (err, result) => {
          connection.release(); // Release the connection

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({
              message: "No purchase bills found for the given criteria.",
            });
          }

          // The total summary (Qty and Amount) will be the same in every row, so take it from the first row
          const { totalQty, totalAmount } = result[0];

          // Respond with the purchase bills and the summary
          res.status(200).json({
            purchaseBill: result,
            psummary: { totalQty, totalAmount }, // Return the summary from the first row
          });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//.......................................................//
//.................Deduction Routes......................//
//.......................................................//

exports.paymentDetails = async (req, res) => {
  const { fromDate, toDate } = req.body;

  // Validate request body
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        connection.release(); // Release connection in case of early exit
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const paymentInfoQuery = `
        SELECT ToDate, BillNo, arate, tliters, pamt, damt, namt , MAMT, BAMT
        FROM custbilldetails 
        WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND DeductionId = 0
      `;

      connection.query(
        paymentInfoQuery,
        [dairy_id, user_code, fromDate, toDate],
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
          res.status(200).json({ payment: result });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//............................................
//Deduction Customer Route....................
//............................................

exports.deductionInfo = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const deductionInfo = `
        SELECT ToDate, BillNo, dname, Amt, arate, tliters, pamt, damt, namt
        FROM custbilldetails 
        WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND  DeductionId <> 0
      `;

      connection.query(
        deductionInfo,
        [dairy_id, user_code, fromDate, toDate],
        (err, result) => {
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "No records found!" });
          }
          res.status(200).json({ otherDeductions: result });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    } finally {
      connection.release();
    }
  });
};

// exports.deductionInfo = async (req, res) => {
//   const { fromDate, toDate } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const user_code = req.user.user_code;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const deductionInfo = `
//         SELECT ToDate, BillNo, dname, Amt, MAMT, BAMT
//         FROM custbilldetails
//         WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND  DeductionId <> 0
//       `;
//
//       connection.query(
//         deductionInfo,
//         [dairy_id, user_code, fromDate, toDate],
//         (err, result) => {
//           connection.release();
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           if (result.length === 0) {
//             return res.status(404).json({ message: "No records found!" });
//           }
//
//           // // Filter the main deduction (Deductionid "0") and additional deductions (based on dname)
//           // const mainDeduction = result.find((item) => item.DeductionId === 0);
//           // const additionalDeductions = result.filter(
//           //   (item) => item.DeductionId !== 0
//           // );
//
//           // Send the response with separated data
//           res.status(200).json({
//             // mainDeduction: mainDeduction || null,
//             // otherDeductions: additionalDeductions || [],
//             otherDeductions: result,
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//------------------------------------------------------------------>
//Customer deduction Info for Admin ------------------------------------------>
//------------------------------------------------------------------>

exports.allPaymentDetails = async (req, res) => {
  const { fromDate, toDate } = req.body;

  // Validate request body
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "fromDate and toDate are required!" });
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
        connection.release(); // Release connection in case of early exit
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const paymentInfoQuery = `
        SELECT ToDate, BillNo, arate, tliters, pamt, damt, namt , MAMT, BAMT
        FROM custbilldetails 
        WHERE companyid = ? AND center_id = ?
      `;

      connection.query(
        paymentInfoQuery,
        [dairy_id, center_id],
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
          res.status(200).json({ payment: result });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//----------------------------------------------------------------------->
//Payment Deduction Admin Route ----------------------------------------->
//----------------------------------------------------------------------->

// exports.paymentDeductionInfo = async (req, res) => {
//   const { fromDate, toDate } = req.body;
//   console.log(req.body);
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const deductionInfo = `
//         SELECT ToDate, BillNo, dname, Amt, arate, tliters, pamt, damt, namt
//         FROM custbilldetails
//         WHERE companyid = ? AND center_id = ? AND ToDate BETWEEN ? AND ? AND  DeductionId <> 0
//       `;
//
//       connection.query(
//         deductionInfo,
//         [dairy_id, center_id, fromDate, toDate],
//         (err, result) => {
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           console.log(result);
//
//           if (result.length === 0) {
//             return res.status(404).json({ message: "No records found!" });
//           }
//           res.status(200).json({ otherDeductions: result });
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     } finally {
//       connection.release();
//     }
//   });
// };

// exports.paymentDeductionInfo = async (req, res) => {
//   const { fromDate, toDate } = req.body;
//   console.log(`deduction function`);
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const deductionInfo = `
//         SELECT BillNo, AccCode, Code, dname, DeductionId, AMT, pamt, namt , damt, tliters
//         FROM custbilldetails
//         WHERE companyid = ? AND center_id = ? AND ToDate BETWEEN ? AND ?
//       `;
//       // WHERE companyid = ? AND center_id = ? AND ToDate BETWEEN ? AND ? AND  DeductionId <> 0
//       connection.query(
//         deductionInfo,
//         [dairy_id, center_id, fromDate, toDate],
//         (err, result) => {
//           connection.release();
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           if (result.length === 0) {
//             return res.status(404).json({ message: "No records found!" });
//           }
//
//           // Filter the main deduction (Deductionid "0") and additional deductions (based on dname)
//           // const mainDeduction = result.find((item) => item.DeductionId === 0);
//           // const additionalDeductions = result.filter(
//           //   (item) => item.DeductionId !== 0
//           // );
//
//           // Send the response with separated data
//           res.status(200).json({
//             // mainDeduction: mainDeduction || null,
//             // otherDeductions: additionalDeductions || [],
//             AllDeductions: result,
//           });
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

exports.paymentDeductionInfo = async (req, res) => {
  const { fromDate, toDate } = req.body;

  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ message: "From date and To date are required!" });
  }

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  const query = `
    SELECT id , ToDate, BillNo, AccCode, Code, dname, DeductionId, AMT, pamt, namt, damt, tliters
    FROM custbilldetails
    WHERE companyid = ? AND center_id = ? AND ToDate BETWEEN ? AND ?
  `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection:", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(
      query,
      [dairy_id, center_id, fromDate, toDate],
      (queryErr, result) => {
        connection.release();

        if (queryErr) {
          console.error("Error executing query:", queryErr);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.length === 0) {
          return res
            .status(200)
            .json({ AllDeductions: [], message: "No records found!" });
        }

        // const additionalDeductions = result.filter(
        //   (item) => item.DeductionId !== 0
        // );

        res.status(200).json({
          AllDeductions: result,
        });
      }
    );
  });
};

// ------------------------------------------------------------------------------------------->
// Pramod ------------------->
// ------------------------------------------------------------------------------------------->

// Creating new and multiple purchase items controller
exports.createPurchases = async (req, res) => {
  const purchaseData = req.body; // Expecting an array of purchase objects

  const { dairy_id, center_id, user_id } = req.user;
  // Validate input
  if (!Array.isArray(purchaseData) || purchaseData.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a non-empty array of purchase data.",
    });
  }

  for (const purchase of purchaseData) {
    const { purchasedate, itemcode, qty, dealerCode } = purchase;
    if (!purchasedate || !itemcode || !qty || !dealerCode) {
      return res.status(400).json({
        success: false,
        message:
          "Each purchase must include purchasedate, itemcode, qty, and dealerCode.",
      });
    }
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Step 1: Build the bulk INSERT query dynamically, including dairy_id and center_id
      let insertQuery =
        "INSERT INTO PurchaseMaster (purchasedate, itemcode, qty, dealerCode, dairy_id, center_id,createdby";
      const insertValues = [];
      const valuePlaceholders = [];

      for (const purchase of purchaseData) {
        const { purchasedate, itemcode, qty, dealerCode, ...otherFields } =
          purchase;
        const rowValues = [
          purchasedate,
          itemcode,
          qty,
          dealerCode,
          dairy_id,
          center_id,
          user_id,
        ];

        for (const key of Object.keys(otherFields)) {
          if (!insertQuery.includes(key)) {
            insertQuery += `, ${key}`;
          }
          rowValues.push(otherFields[key]);
        }

        insertValues.push(...rowValues);
        valuePlaceholders.push(`(${rowValues.map(() => "?").join(", ")})`);
      }

      insertQuery += `) VALUES ${valuePlaceholders.join(", ")}`;

      // Step 2: Execute the bulk INSERT query
      connection.query(insertQuery, insertValues, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error inserting purchase records: ", err);
          return res
            .status(500)
            .json({ message: "Error creating purchase records" });
        }

        res.status(201).json({
          success: true,
          message: "Purchase records created successfully",
          insertedRows: result.affectedRows,
        });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};
// -------------------------------------------------------------------------------------->
// Get All purchase items controller ---------------------------------------------------->
// -------------------------------------------------------------------------------------->
exports.getAllPurchases = async (req, res) => {
  const { date1, date2, fcode, role, ...dynamicFields } = req.query;
  const { dairy_id, center_id, user_id } = req.user; // Get dairy_id and center_id from the logged-in user

  let query = `
    SELECT * 
    FROM PurchaseMaster 
    WHERE 1=1`;

  let countQuery = `
    SELECT COUNT(*) AS totalRecords 
    FROM PurchaseMaster 
    WHERE 1=1`;

  const queryParams = [];

  // Append filters for date range
  if (date1 && date2) {
    query += ` AND purchasedate BETWEEN ? AND ?`;
    countQuery += ` AND purchasedate BETWEEN ? AND ?`;
    queryParams.push(date1, date2);
  } else {
    // Default date range (last 10 days)
    // query += ` AND DATE(purchasedate) = CURDATE()`;
    // countQuery += ` AND DATE(purchasedate) = CURDATE()`;
  }

  // Append filter for fcode (Supplier code)
  if (fcode) {
    query += ` AND dealerCode = ?`;
    countQuery += ` AND dealerCode = ?`;
    queryParams.push(fcode);
  }

  // Append filter for dairy_id and center_id (Ensure these fields are in the WHERE clause)
  if (dairy_id) {
    query += ` AND dairy_id = ?  `;
    countQuery += ` AND dairy_id = ? `;
    queryParams.push(dairy_id);
  }
  if (center_id > 0) {
    query += `AND center_id=? `;
    countQuery += `AND center_id=? `;
    queryParams.push(center_id);
  }

  //if user can login as admin then he can see all the data
  if (role && role === "salesman") {
    query += `AND createdby=? `;
    countQuery += `AND createdby=? `;
    queryParams.push(user_id);
  }
  // Append dynamic fields (filters that come from query parameters)
  for (const [field, value] of Object.entries(dynamicFields)) {
    if (value) {
      query += ` AND ${field} = ?`;
      countQuery += ` AND ${field} = ?`;
      queryParams.push(value);
    }
  }

  // Add sorting by purchaseid in descending order
  query += ` ORDER BY purchaseid DESC`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    // First query to get the total record count
    connection.query(countQuery, queryParams, (err, countResult) => {
      if (err) {
        connection.release();
        console.error("Error executing count query: ", err);
        return res
          .status(500)
          .json({ message: "Error fetching total record count", error: err });
      }

      const totalRecords = countResult[0]?.totalRecords || 0;

      // Second query to get the purchase data based on dynamic filters
      connection.query(query, queryParams, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ message: "Error fetching purchase data", error: err });
        }

        res.status(200).json({
          success: true,
          totalRecords,
          purchaseData: result,
        });
      });
    });
  });
};

// -------------------------------------------------------------------------------------->
// Update purchase item controller ------------------------------------------------------>
// -------------------------------------------------------------------------------------->
exports.updatePurchase = async (req, res) => {
  const { purchases } = req.body;
  const { dairy_id, center_id } = req.user; // Get dairy_id and center_id from the logged-in user

  // Validate input
  if (!purchases || !dairy_id) {
    return res.status(400).json({
      success: false,
      message: " required with valid data.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      // Start transaction
      connection.beginTransaction((err) => {
        if (err) throw err;

        const updatePromises = purchases.map((purchase) => {
          const { purchaseid, rate, salerate, qty, amount, date } = purchase;

          // Ensure required fields exist
          if (!purchaseid) {
            throw new Error("Purchase are required.");
          }

          // Prepare fields for update
          const updateFields = { rate, salerate, qty, amount, date };
          Object.keys(updateFields).forEach((key) => {
            if (updateFields[key] === undefined || updateFields[key] === null) {
              delete updateFields[key];
            }
          });

          if (Object.keys(updateFields).length === 0) {
            throw new Error(
              "At least one valid field (rate, salerate, qty, amount, date) is required."
            );
          }

          // Construct update query dynamically
          const updateKeys = Object.keys(updateFields).map(
            (key) => `${key} = ?`
          );
          const updateQuery = `
            UPDATE PurchaseMaster 
            SET ${updateKeys.join(", ")}
            WHERE purchaseid = ? AND dairy_id = ? AND center_id = ?`;

          const values = [
            ...Object.values(updateFields),
            purchaseid,
            dairy_id,
            center_id,
          ];

          return new Promise((resolve, reject) => {
            connection.query(updateQuery, values, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });
        });

        // Execute all updates
        Promise.all(updatePromises)
          .then((results) => {
            connection.commit((err) => {
              if (err) {
                return connection.rollback(() => {
                  throw err;
                });
              }

              res.status(200).json({
                success: true,
                message: "Purchase records updated successfully",
              });
            });
          })
          .catch((error) => {
            connection.rollback(() => {
              console.error("Error updating purchase records: ", error);
              res.status(500).json({
                success: false,
                message: "Error updating purchase records",
                error: error.message,
              });
            });
          });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

// delete purchase item controller
exports.deletePurchase = async (req, res) => {
  const { purchaseid } = req.params;
  const { dairy_id, center_id } = req.user;

  // console.log(purchaseid, " ", dairy_id, " ", center_id);
  // Validate input
  if (!purchaseid || !dairy_id) {
    return res.status(400).json({
      success: false,
      message:
        "Purchase ID, Dairy ID, and Center ID are required to delete a record.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      const deleteQuery =
        "DELETE FROM PurchaseMaster WHERE billno = ? AND dairy_id = ? AND center_id = ?";

      connection.query(
        deleteQuery,
        [purchaseid, dairy_id, center_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error deleting purchase record: ", err);
            return res.status(500).json({
              success: false,
              message: "Error deleting purchase record",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "No purchase record found with the given criteria.",
            });
          }

          res.status(200).json({
            success: true,
            message: "Purchase record deleted successfully",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

// -------------------------------------------------------------------------------------->
// Get All products sale rate ----------------------------------------------------------->
// -------------------------------------------------------------------------------------->

exports.getAllProductSaleRate = async (req, res) => {
  const { groupCode } = req.query;
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const user_role = req.user.user_role;

  // Check if dairy_id exists
  if (!dairy_id) {
    return res.status(400).json({ message: "Unauthorized user!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let getSaleRateQuery;
      let queryParams;

      if (user_role === "mobilecollector") {
        // Query for mobilecollector
        getSaleRateQuery = `
          SELECT pm.purchaseid, pm.itemcode, pm.itemname, pm.qty, pm.salerate, pm.purchasedate
          FROM PurchaseMaster AS pm
          INNER JOIN (
            SELECT itemcode, MAX(purchasedate) AS max_purchasedate
            FROM PurchaseMaster
            WHERE dairy_id = ? AND center_id = ? AND cn=0
            GROUP BY itemcode
          ) AS latest_sales
          ON pm.itemcode = latest_sales.itemcode AND pm.purchasedate = latest_sales.max_purchasedate
          WHERE pm.dairy_id = ? AND pm.center_id = ? AND cn=0
          ORDER BY pm.itemcode;
        `;

        queryParams = [dairy_id, center_id, dairy_id, center_id];
      } else {
        // Query for other roles
        getSaleRateQuery = `
          SELECT pm.purchaseid, pm.itemcode, pm.itemname, pm.qty, pm.salerate, pm.purchasedate
          FROM PurchaseMaster AS pm
          INNER JOIN (
            SELECT itemcode, MAX(purchasedate) AS max_purchasedate
            FROM PurchaseMaster
            WHERE dairy_id = ? AND center_id = ? AND itemgroupcode = ? AND cn=0
            GROUP BY itemcode
          ) AS latest_sales
          ON pm.itemcode = latest_sales.itemcode AND pm.purchasedate = latest_sales.max_purchasedate
          WHERE pm.dairy_id = ? AND pm.center_id = ? AND pm.itemgroupcode = ? AND pm.cn=0
          ORDER BY pm.itemcode;
        `;

        queryParams = [
          dairy_id,
          center_id,
          groupCode,
          dairy_id,
          center_id,
          groupCode,
        ];
      }

      // Execute the query
      connection.query(getSaleRateQuery, queryParams, (err, result) => {
        connection.release(); // Release the connection after query execution

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "No records found!" });
        }

        // Return the results
        res.status(200).json({ saleRates: result });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
