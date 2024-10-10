const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

//..................................................
// Create New Customer (Admin Route)................
//..................................................

exports.createCustomer = async (req, res) => {
  const {
    cust_id, // cid in the database
    cust_name, // cname in the database
    cust_phone, // mobile in the database
    cust_city, // City in the database
    cust_pincode,
    cust_addhar,
    cust_farmerid,
    cust_bank,
    cust_accno,
    cust_ifsc,
    dairy_id,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const createCustomerQuery = `INSERT INTO customer (
        cid,
        cname,
        mobile,
        City,
        cust_pincode,
        cust_addhar,
        cust_farmerid,
        cust_bankname,
        cust_accno,
        cust_ifsc,
        dairy_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        createCustomerQuery,
        [
          cust_id,
          cust_name,
          cust_phone,
          cust_city,
          cust_pincode,
          cust_addhar,
          cust_farmerid,
          cust_bank,
          cust_accno,
          cust_ifsc,
          dairy_id,
        ],
        (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).json({ message: "Error creating customer" });
          }

          return res
            .status(201)
            .json({ message: "Customer created successfully" });
        }
      );
    } catch (error) {
      connection.release(); // Ensure connection is released even in case of error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//..................................................
// Update Customer Info (Admin Route) Active........
//..................................................

//....................admin.........................
exports.updateCustomer = async (req, res) => {
  const {
    cust_id, // cid in the database
    cust_name, // cname in the database
    cust_phone, // mobile in the database
    cust_city, // City in the database
    cust_pincode,
    cust_addhar,
    cust_farmerid,
    cust_bank, // cust_bankname in the database
    cust_accno,
    cust_ifsc,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const updateCustomerQuery = `
        UPDATE customer
        SET
          cname = ?,
          mobile = ?,
          City = ?,
          cust_pincode = ?,
          cust_addhar = ?,
          cust_farmerid = ?,
          cust_bankname = ?,
          cust_accno = ?,
          cust_ifsc = ?,
         
        WHERE cid = ?
      `;

      connection.query(
        updateCustomerQuery,
        [
          cust_name,
          cust_phone,
          cust_city,
          cust_pincode,
          cust_addhar,
          cust_farmerid,
          cust_bank,
          cust_accno,
          cust_ifsc,

          cust_id,
        ],
        (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).json({ message: "Error updating customer" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found" });
          }

          return res
            .status(200)
            .json({ message: "Customer updated successfully" });
        }
      );
    } catch (error) {
      connection.release(); // Ensure connection is released even in case of error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
//..................customer........................

//..................................................
// Delete Customer Info (Admin Route)...............
//..................................................

//.................................................
// Customer Dashboard Info (Customer Route)........
//.................................................

exports.custDashboardInfo = async (req, res) => {
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
              ReceiptDate,
              SUM(Litres) AS dailyLiters,
              SUM(Amt) AS dailyAmount
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
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
          const dashboardInfo = dashboardDataresult;
          res.status(200).json({ fromDate, toDate, dashboardInfo });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

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
      const user_id = req.user.user_id;

      if (!user_id) {
        return res.status(400).json({ message: "User ID not found!" });
      }

      const profileInfo = `SELECT cname, City, cust_pincode, cust_addhar, cust_farmerid, cust_bankname, cust_accno, cust_ifsc, srno FROM customer WHERE fax =?`;

      connection.query(profileInfo, [user_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing summary query: ", err);
          return res.status(500).json({ message: "query execution error" });
        }
        const profileInfo = result[0];
        res.status(200).json({ profileInfo });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ..................................................
// App Customer Milk Report..........................
// ..................................................

// exports.milkReport = async (req, res) => {
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
//           AVG(Rate) AS avgRate,
//           SUM(Amt) AS totalAmount
//         FROM ${dairy_table}
//         WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?;
//       `;
//
//       connection.query(
//         milkreportQuery,
//         [fromDate, toDate, user_code],
//         (err, records) => {
//           if (err) {
//             connection.release();
//             console.error("Error executing records query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           connection.query(
//             summaryQuery,
//             [fromDate, toDate, user_code],
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

//new

exports.milkReport = async (req, res) => {
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
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const combinedQuery = `
        SELECT 
          ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt,
          summary.totalLiters, 
          summary.avgFat, 
          summary.avgSNF, 
          summary.avgRate, 
          summary.totalAmount
        FROM ${dairy_table}
        JOIN (
          SELECT 
            SUM(Litres) AS totalLiters,
            AVG(fat) AS avgFat,
            AVG(snf) AS avgSNF,
            AVG(Rate) AS avgRate,
            SUM(Amt) AS totalAmount
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
        ) AS summary
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
        ORDER BY ReceiptDate ASC;
      `;

      connection.query(
        combinedQuery,
        [fromDate, toDate, user_code, fromDate, toDate, user_code],
        (err, results) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          const summaryData = {
            totalLiters: results[0].totalLiters,
            avgFat: results[0].avgFat,
            avgSNF: results[0].avgSNF,
            avgRate: results[0].avgRate,
            totalAmount: results[0].totalAmount,
          };

          res.status(200).json({ records: results, summary: summaryData });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ..................................................
// App Custmize Milk Report..........................
// ..................................................

exports.customMilkReport = async (req, res) => {
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

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const milkreportQuery = `
        SELECT 
          ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt,
          (SELECT 
            SUM(Litres) 
            FROM ${dairy_table} 
            WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?) AS totalLiters,
          (SELECT 
            AVG(fat) 
            FROM ${dairy_table} 
            WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?) AS avgFat,
          (SELECT 
            AVG(snf) 
            FROM ${dairy_table} 
            WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?) AS avgSNF,
          (SELECT 
            AVG(Rate) 
            FROM ${dairy_table} 
            WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?) AS avgRate,
          (SELECT 
            SUM(Amt) 
            FROM ${dairy_table} 
            WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?) AS totalAmount
        FROM ${dairy_table} 
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
        ORDER BY ReceiptDate ASC;
      `;

      const params = [
        fromDate,
        toDate,
        user_code, // Params for totalLiters
        fromDate,
        toDate,
        user_code, // Params for avgFat
        fromDate,
        toDate,
        user_code, // Params for avgSNF
        fromDate,
        toDate,
        user_code, // Params for avgRate
        fromDate,
        toDate,
        user_code, // Params for totalAmount
        fromDate,
        toDate,
        user_code, // Params for main query
      ];

      connection.query(milkreportQuery, params, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing milk report query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        const summaryData = {
          totalLiters: results[0]?.totalLiters || 0,
          avgFat: results[0]?.avgFat || 0,
          avgSNF: results[0]?.avgSNF || 0,
          avgRate: results[0]?.avgRate || 0,
          totalAmount: results[0]?.totalAmount || 0,
        };

        res.status(200).json({ records: results, summary: summaryData });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ..................................................
// App Customer Milk Report..........................
// ..................................................

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
