const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// exports.purchaseInfo = async (req, res) => {
//   const { formDate, toDate } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       // Get dairy_id and user_code from the verified token (already decoded in middleware)
//       const dairy_id = req.user.dairy_id;
//       const user_id = req.user.user_id;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const purchaseBills = `SELECT BillNo, BillDate, ItemName, Qty, Rate, Amount FROM salesmaster WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?`;
//
//       connection.query(
//         purchaseBills,
//         [dairy_id, formDate, toDate, user_id],
//         (err, result) => {
//           if (err) {
//             console.error("Error executing purchase bill query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           if (result.length === 0) {
//             return res.status(404).json({
//               message: "No purchase bills found for the given criteria.",
//             });
//           }
//
//           res.status(200).json({ purchaseBill: result });
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     } finally {
//       connection.release(); // Ensure the connection is always released
//     }
//   });
// };

// exports.purchaseInfo = async (req, res) => {
//   const { formDate, toDate } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       // Get dairy_id and user_code from the verified token (already decoded in middleware)
//       const dairy_id = req.user.dairy_id;
//       const user_id = req.user.user_id;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const purchaseBillsQuery = `
//         SELECT BillNo, BillDate, ItemName, Qty, Rate, Amount
//         FROM salesmaster
//         WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?`;
//
//       const summaryQuery = `
//         SELECT SUM(Qty) AS totalQty, SUM(Amount) AS totalAmount
//         FROM salesmaster
//         WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?`;
//
//       // Execute the purchase bills query
//       connection.query(
//         purchaseBillsQuery,
//         [dairy_id, formDate, toDate, user_id],
//         (err, purchaseResult) => {
//           if (err) {
//             console.error("Error executing purchase bill query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           if (purchaseResult.length === 0) {
//             return res.status(404).json({
//               message: "No purchase bills found for the given criteria.",
//             });
//           }
//
//           // Execute the summary query for sum of Qty and Amount
//           connection.query(
//             summaryQuery,
//             [dairy_id, formDate, toDate, user_id],
//             (err, summaryResult) => {
//               connection.release(); // Release the connection
//
//               if (err) {
//                 console.error("Error executing summary query: ", err);
//                 return res
//                   .status(500)
//                   .json({ message: "Summary query execution error" });
//               }
//
//               // Respond with both the purchase bills and summary
//               res.status(200).json({
//                 purchaseBill: purchaseResult,
//                 psummary: summaryResult[0], // Contains totalQty and totalAmount
//               });
//             }
//           );
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

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
        SELECT ToDate, BillNo, arate, tliters, pamt, damt, namt 
        FROM custbilldetails 
        WHERE companyid = ? AND AccCode = ? AND ToDate BETWEEN ? AND ? AND Deductionid = "0"
      `;

      connection.query(
        deductionInfo,
        [dairy_id, user_code, fromDate, toDate],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (result.length === 0) {
            return res.status(404).json({ message: "No records found!" });
          }

          // Sending all results in case multiple records match the query
          res.status(200).json({
            deductions: result,
          });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
