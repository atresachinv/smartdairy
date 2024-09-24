const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// Milk Collection  ********************************************** */
// (exports.milkCollection = async),
//   (req, res) => {
//     const {} = req.body;
//
//   };

// Show Milk Collection *************************************** */

// (exports.showMilkCollection = async),
//   (req, res) => {
//     const {} = req.body;
//   };

// Currection in Milk Collection ****************************** */

// (exports.updateMilkCollection = async),
//   (req, res) => {
//     const {} = req.body;
//   };

// ..................................................
// todays milk report for Admin .....................
// ..................................................

exports.todaysReport = async (req, res) => {
  const { date } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const morningQuery = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM dailymilkentry_102 
      WHERE ReceiptDate = ? AND ME = 0
    `;
    const eveningQuery = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM dailymilkentry_102 
      WHERE ReceiptDate = ? AND ME = 1
    `;
    const totalMilkQuery = `
      SELECT SUM(Litres) AS totalLitres, COUNT(DISTINCT AccCode) AS totalCustomers, SUM(Amt) AS totalAmount
      FROM dailymilkentry_102 
      WHERE ReceiptDate = ?
    `;

    Promise.all([
      new Promise((resolve, reject) =>
        connection.query(morningQuery, [date], (err, results) =>
          err ? reject(err) : resolve(results)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(eveningQuery, [date], (err, results) =>
          err ? reject(err) : resolve(results)
        )
      ),
      new Promise((resolve, reject) =>
        connection.query(totalMilkQuery, [date], (err, results) =>
          err ? reject(err) : resolve(results[0])
        )
      ),
    ])
      .then(([morningData, eveningData, totalResult]) => {
        connection.release();
        const totalMilk = totalResult.totalLitres || 0;
        const totalCustomers = totalResult.totalCustomers || 0;
        const totalAmount = totalResult.totalAmount || 0;

        res.status(200).json({
          morningData,
          eveningData,
          totalMilk,
          totalCustomers,
          totalAmount,

          message: "Data Found !",
        });
      })
      .catch((err) => {
        connection.release();
        console.error("Error executing query: ", err);
        res.status(500).json({ message: "Server error" });
      });
  });
};

// ..........................................
// milk report for customer .................
// ..........................................

exports.milkReport = async (req, res) => {
  const { fromDate, toDate } = req.body;

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

      // Query to check if records exist for the given date range
      const checkDatesQuery = `
        SELECT COUNT(*) AS recordCount
        FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
      `;

      connection.query(
        checkDatesQuery,
        [fromDate, toDate, user_code],
        (err, results) => {
          if (err) {
            connection.release(); // Release the connection back to the pool
            console.error("Error executing date check query: ", err);
            return res
              .status(500)
              .json({ message: "Date check query execution error" });
          }

          const recordCount = results[0].recordCount;
          if (recordCount === 0) {
            connection.release(); // Release the connection back to the pool
            return res
              .status(404)
              .json({ message: "No records found for the given dates!" });
          }

          // Proceed with the milk report query
          const milkreport = `
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
            SUM(Amt) AS totalAmount
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
        `;

          connection.query(
            milkreport,
            [fromDate, toDate, user_code],
            (err, records) => {
              if (err) {
                connection.release(); // Release the connection back to the pool
                console.error("Error executing records query: ", err);
                return res
                  .status(500)
                  .json({ message: "Query execution error" });
              }

              connection.query(
                summaryQuery,
                [fromDate, toDate, user_code],
                (err, summaryResults) => {
                  connection.release(); // Release the connection back to the pool

                  if (err) {
                    console.error("Error executing summary query: ", err);
                    return res
                      .status(500)
                      .json({ message: "Summary query execution error" });
                  }

                  const summaryData = summaryResults[0]; // The aggregated data

                  res
                    .status(200)
                    .json({ records: records, summary: summaryData });
                }
              );
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

// ............................................
// Dashboard Info Admin .......................
// ............................................

exports.dashboardInfo = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      // Get dairy_id from the verified token (already decoded in middleware)
      const dairy_id = req.user.dairy_id;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const getMonthsDairyInfo = `
      SELECT 
                SUM(Litres) AS totalLiters,
                SUM(Amt) AS totalAmount,
                ReceiptDate,
                SUM(Litres) AS dailyLiters,
                SUM(Amt) AS dailyAmount
              FROM ${dairy_table}
              WHERE ReceiptDate BETWEEN ? AND ? 
              GROUP BY ReceiptDate WITH ROLLUP;
      `;

      // Execute the query
      connection.query(
        getMonthsDairyInfo,
        [fromDate, toDate],
        (err, results) => {
          connection.release(); // Release the connection back to the pool

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Database query error" });
          }

          // Separate total and daily data
          let totalLiters = 0;
          let totalAmount = 0;
          const dailyData = [];

          results.forEach((row) => {
            if (row.ReceiptDate === null) {
              totalLiters = row.totalLiters;
              totalAmount = row.totalAmount;
            } else {
              dailyData.push({
                date: row.ReceiptDate,
                liters: row.dailyLiters,
                amount: row.dailyAmount,
              });
            }
          });

          // Send the response
          res.status(200).json({
            totalLiters,
            totalAmount,
            dailyData,
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ............................................
// Dashboard Info Admin .......................
// ............................................

// ............................................
// Dashboard Info Admin .......................
// ............................................
// ............................................
// Dashboard Info Admin .......................
// ............................................
// ............................................
// Dashboard Info Admin .......................
// ............................................
