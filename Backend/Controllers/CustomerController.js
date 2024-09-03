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

exports.dashboardInfo = async (req, res) => {
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
      const user_code = req.user.user_code;

      if (!user_code) {
        return res.status(400).json({ message: "User ID not found!" });
      }

      const profileInfo = `SELECT cname, City, cust_pincode, cust_addhar, cust_farmerid, cust_bankname, cust_accno, cust_ifsc, dairy_id FROM customer WHERE cid =?`;

      connection.query(profileInfo, [user_code], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing summary query: ", err);
          return res.status(500).json({ message: "query execution error" });
        }
        const getprofileInfo = result[0];
        res.status(200).json({ getprofileInfo });
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
