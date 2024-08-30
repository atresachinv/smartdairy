const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// Create New Customer (Admin Route) *********************************** */
// Update Customer Info (Admin Route) Active *********************************** */
// Delete Customer Info (Admin Route) *********************************** */

// Customer Dashboard Info (Customer Route) *********************************** */

/*................................................*/
// exports.dashboardInfo = async (req, res) => {
//   const { toDate , slotdays } = req.body;
//
//   // if slotdays = 10  slot 1 = 1 - 10 , slot 2 = 11-20 , slot 3 = 21 - 30 if month has 28 or 29 or 31 date if 28 last  date is 28 then solt 3 is 8 days only , if  29 then 9 days if 31 then 11 days in slot 3 ,
//
//   // slot 1 is dates from 1-10
//   // if current date is 9 check  its slot first then get slot start date its our formDate  we need to use below
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//
//     try {
//       // Get dairy_id from the verified token (already decoded in middleware)
//       const dairy_id = req.user.dairy_id;
//       const user_code = req.user.user_code;
//
//       if (!dairy_id) {
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       const custDashboardData = ` SELECT
//             SUM(Litres) AS totalLiters,
//             AVG(fat) AS avgFat,
//             AVG(snf) AS avgSNF,
//             SUM(Amt) AS totalAmount
//           FROM ${dairy_table}
//           WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;`;
//
//       connection.query(
//         custDashboardData,
//         [formDate, toDate, user_code],
//         (err, dashboardDataresult) => {
//           connection.release();
//           if (err) {
//             console.error("Error executing summary query: ", err);
//             return res
//               .status(500)
//               .json({ message: "Summary query execution error" });
//           }
//           const dashboardInfo = dashboardDataresult[0];
//           res
//             .status(200)
//             .json({ records: records, dashboardInfo: dashboardInfo });
//         }
//       );
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

/*................................................*/

exports.dashboardInfo = async (req, res) => {
  const { toDate, fromDate, u_type } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Get dairy_id from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const custDashboardData = ` SELECT 
            SUM(Litres) AS totalLiters,
            AVG(fat) AS avgFat,
            AVG(snf) AS avgSNF,
            SUM(Amt) AS totalAmount
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;`;

      connection.query(
        custDashboardData,
        [fromDate, toDate, user_code],
        (err, dashboardDataresult) => {
          connection.release();
          if (err) {
            console.error("Error executing summary query: ", err);
            return res.status(500).json({ message: "query execution error" });
          }
          const dashboardInfo = dashboardDataresult[0];
          res.status(200).json({ formDate, toDate, dashboardInfo });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

/*................................................*/

/* name , phone ,Addhar, BankDetails , cow Tags ,  */
// *********************************** */

// ......................................
// Profile Info..........................
// ......................................

exports.profileInfo = async (req, res) => {
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

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const profileInfo = `SELECT * FROM `;
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// exports.milkReport = async (req, res) => {
//   const { fromDate, toDate } = req.body;
//
//   // Modify toDate to include the entire day
//   const mFormDate = `${fromDate} 18:30:00.000Z`;
//   const mToDate = `${toDate} 18:30:00.000Z`;
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
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       // Proceed with the milk report query
//       const milkreportQuery = `
//         SELECT
//           ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt
//         FROM ${dairy_table}
//         WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
//         ORDER BY ReceiptDate ASC;
//       `;
//
//       const summaryQuery = `
//         SELECT
//           SUM(Litres) AS totalLiters,
//           AVG(fat) AS avgFat,
//           AVG(snf) AS avgSNF,
//           SUM(Amt) AS totalAmount
//         FROM ${dairy_table}
//         WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
//       `;
//
//       connection.query(
//         milkreportQuery,
//         [mFormDate, mToDate, user_code],
//         (err, records) => {
//           if (err) {
//             connection.release();
//             console.error("Error executing records query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           connection.query(
//             summaryQuery,
//             [mFormDate, mToDate, user_code],
//             (err, summaryResults) => {
//               connection.release();
//
//               if (err) {
//                 console.error("Error executing summary query: ", err);
//                 return res
//                   .status(500)
//                   .json({ message: "Summary query execution error" });
//               }
//
//               const summaryData = summaryResults[0];
//
//               res.status(200).json({ records: records, summary: summaryData });
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

exports.milkReport = async (req, res) => {
  const { fromDate, toDate } = req.body;

  // Modify toDate to include the entire day
  const mFormDate = `${fromDate} 18:30:00.000Z`;
  const mToDate = `${toDate} 18:30:00.000Z`;

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

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Proceed with the milk report query
      const milkreportQuery = `
        SELECT 
          ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt
        FROM ${dairy_table} 
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
        ORDER BY ReceiptDate ASC;
      `;

      const summaryQuery = `
        SELECT 
          SUM(Litres) AS totalLiters,
          AVG(fat) AS avgFat,
          AVG(snf) AS avgSNF,
          AVG(Rate) AS avgRate,
          SUM(Amt) AS totalAmount
        FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
      `;

      connection.query(
        milkreportQuery,
        [mFormDate, mToDate, user_code],
        (err, records) => {
          if (err) {
            connection.release();
            console.error("Error executing records query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          connection.query(
            summaryQuery,
            [mFormDate, mToDate, user_code],
            (err, summaryResults) => {
              connection.release();

              if (err) {
                console.error("Error executing summary query: ", err);
                return res
                  .status(500)
                  .json({ message: "Summary query execution error" });
              }

              const summaryData = summaryResults[0];

              res.status(200).json({ records: records, summary: summaryData });
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

// ......................................
// App Customer Milk Report..........................
// ......................................
exports.custMilkReport = async (req, res) => {
  const { SocietyCode, AccCode } = req.body;

  const currentDate = new Date();
  const toDate = currentDate.toISOString().split("T")[0];

  const day = toDate.slice(8, 10);
  const date = toDate.slice(0, 8);
  let startDay = 0;
  if (day <= 10) {
    startDay = 1;
  } else if (day <= 20) {
    startDay = 11;
  } else {
    startDay = 21;
  }
  const fromDate = date + startDay;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = SocietyCode;
      const user_code = AccCode;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Proceed with the milk report query
      const milkreportQuery = `
        SELECT 
          ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt
        FROM ${dairy_table} 
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
        ORDER BY ReceiptDate ASC;
      `;

      const summaryQuery = `
        SELECT 
          SUM(Litres) AS totalLiters,
          AVG(fat) AS avgFat,
          AVG(snf) AS avgSNF,
          AVG(Rate) AS avgRate,
          SUM(Amt) AS totalAmount
        FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
      `;

      connection.query(
        milkreportQuery,
        [fromDate, toDate, user_code],
        (err, records) => {
          if (err) {
            connection.release();
            console.error("Error executing records query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          connection.query(
            summaryQuery,
            [fromDate, toDate, user_code],
            (err, summaryResults) => {
              connection.release();

              if (err) {
                console.error("Error executing summary query: ", err);
                return res
                  .status(500)
                  .json({ message: "Summary query execution error" });
              }

              const summaryData = summaryResults[0];

              res.status(200).json({ records: records, summary: summaryData });
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
