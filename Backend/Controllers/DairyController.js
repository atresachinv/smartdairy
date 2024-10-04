const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// ..................................................
// Create New Dairy User..........................
// ..................................................



// ..................................................
// master Dates ..........................
// ..................................................

// exports.masterDates = async (req, res) => {
//   const { yearStart, yearEnd } = req.body;
// 
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
// 
//     try {
//       const getMasters = `SELECT DISTINCT fromDate, toDate FROM custbilldetails WHERE fromDate BETWEEN ? AND ? ORDER BY fromDate DESC`;
// 
//       connection.query(getMasters, [yearStart, yearEnd], (err, result) => {
//         connection.release();
// 
//         if (err) {
//           console.error("master query execution error: ", err);
//           return res
//             .status(500)
//             .json({ message: "master query execution error" });
//         }
// 
//         const getMasters = result;
// 
//         res.status(200).json({ getMasters: getMasters });
//       });
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

exports.masterDates = async (req, res) => {
  const { yearStart, yearEnd } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Use DATE() function to ensure only date parts are retrieved
      const getMasters = `
        SELECT DISTINCT 
          DATE(fromDate) AS fromDate, 
          DATE(toDate) AS toDate 
        FROM custbilldetails 
        WHERE fromDate BETWEEN ? AND ? 
        ORDER BY fromDate ASC`; // Ascending to get earliest dates first

      connection.query(getMasters, [yearStart, yearEnd], (err, result) => {
        connection.release();

        if (err) {
          console.error("master query execution error: ", err);
          return res
            .status(500)
            .json({ message: "master query execution error" });
        }

        // Map result to desired format
        const formattedResult = result.map((record) => ({
          fromDate: record.fromDate, // This should already be in YYYY-MM-DD format
          toDate: record.toDate, // This should already be in YYYY-MM-DD format
        }));

        res.status(200).json({ getMasters: formattedResult });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
 




//.................................................
// Dairy Dashboard Info........
//.................................................

exports.dairyDashboardInfo = async (req, res) => {
  const { toDate, fromDate } = req.body;

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

      const custDashboardData = `     
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
          res.status(200).json({ fromDate, toDate, dashboardInfo });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};