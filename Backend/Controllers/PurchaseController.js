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

      const purchaseBillsQuery = `
        SELECT BillNo, BillDate, ItemName, Qty, Rate, Amount 
        FROM salesmaster 
        WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?`;

      const summaryQuery = `
        SELECT SUM(Qty) AS totalQty, SUM(Amount) AS totalAmount 
        FROM salesmaster 
        WHERE companyid = ? AND BillDate BETWEEN ? AND ? AND userid = ?`;

      // Execute the purchase bills query
      connection.query(
        purchaseBillsQuery,
        [dairy_id, formDate, toDate, user_id],
        (err, purchaseResult) => {
          if (err) {
            console.error("Error executing purchase bill query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          if (purchaseResult.length === 0) {
            return res.status(404).json({
              message: "No purchase bills found for the given criteria.",
            });
          }

          // Execute the summary query for sum of Qty and Amount
          connection.query(
            summaryQuery,
            [dairy_id, formDate, toDate, user_id],
            (err, summaryResult) => {
              connection.release(); // Release the connection

              if (err) {
                console.error("Error executing summary query: ", err);
                return res
                  .status(500)
                  .json({ message: "Summary query execution error" });
              }

              // Respond with both the purchase bills and summary
              res.status(200).json({
                purchaseBill: purchaseResult,
                psummary: summaryResult[0], // Contains totalQty and totalAmount
              });
            }
          );
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

