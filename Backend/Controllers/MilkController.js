const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// ..................................................
// Milk Collection .....................
// ..................................................

// Check Username ................
exports.custName = async (req, res) => {
  const { user_code } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const dairy_id = req.user.dairy_id;

      const getCustname = `SELECT cid, cname FROM customer WHERE srno = ? AND orgid = ?`;

      connection.query(getCustname, [user_code, dairy_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing summary query: ", err);
          return res.status(500).json({ message: "query execution error" });
        }
        const custdetails = result[0];
        res.status(200).json({ custdetails });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//get rate from rate chart and calculate amount
exports.getRateAmount = (req, res) => {
  const { liters, fat, snf } = req.body;

  // // Input validation (basic example)
  // if (!dairy_id || !rccode || !rcdate || !fat || !snf || !liters) {
  //   return res.status(400).json({ message: "All fields are required." });
  // }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;

    if (!dairy_id) {
      return res.status(400).json({ message: "Dairy ID not found!" });
    }

    const getRateAmt = `
    SELECT rate 
    FROM ratemaster 
    WHERE companyid = ? 
      AND rccode = "1"
      AND rcdate = ?  
      AND fat = ? 
      AND snf = ?
    LIMIT 1
  `;

    connection.query(
      getRateAmt,
      [dairy_id, rccode, rcdate, fat, snf],
      (err, results) => {
        connection.release(); // Always release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Rate not found for the provided parameters." });
        }

        const rate = results[0].rate;

        // Ensure 'liters' is a number
        const litersNumber = parseFloat(liters);
        if (isNaN(litersNumber)) {
          return res.status(400).json({ message: "Invalid value for liters." });
        }

        const amt = litersNumber * parseFloat(rate);

        res.status(200).json({ rate: parseFloat(rate), amt });
      }
    );
  });
};

// saving milk collection to database
exports.milkCollection = async (req, res) => {
  const {
    companyid,
    DMEId,
    ReceiptDate,
    time,
    animal,
    liter,
    fat,
    snf,
    amt,
    GLCode,
    code,
    degree,
    rate,
    cname,
    rno,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Get dairy_id and user_code from the verified token (already decoded in middleware)

      const dairy_id = req.user.dairy_id;
      const user_code = req.user.user_code;

      if (!dairy_id) {
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const milkcollection = `INSERT INTO ${dairy_table} (companyid, DMEId, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno) 
                              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

      // Execute the query
      connection.query(
        milkcollection,
        [
          companyid,
          DMEId,
          ReceiptDate,
          time,
          animal,
          liter,
          fat,
          snf,
          amt,
          GLCode,
          code,
          degree,
          rate,
          cname,
          rno,
        ],
        (err, results) => {
          // Release the connection back to the pool
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

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

//.................................................
// Rate MAster........
//.................................................

exports.saveRateChart = async (req, res) => {
  const { rccode, rctype, rcdate, time, animal, rate } = req.body;

  // Validate required fields
  if (!rccode || !rctype || !rcdate || !time || !animal) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Validate that 'rate' is a non-empty array
  if (!Array.isArray(rate) || rate.length === 0) {
    return res.status(400).json({ message: "No rate data provided." });
  }

  // Acquire a connection from the pool
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Extract user details from the request (assuming middleware handles authentication)
      const dairy_id = req.user.dairy_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Start transaction
      await connection.beginTransaction();

      // Prepare the SQL query for bulk insert
      const saveRatesQuery = `
        INSERT INTO ratemaster (companyid, rccode, rcdate, rctypecode, cb, fat, snf, rate, time)
        VALUES ?
      `;

      // Prepare the values array for bulk insertion
      const values = rate.map((record, index) => {
        let { FAT, SNF, Rate } = record;

        // Validate each record's fields
        if (
          typeof FAT !== "number" ||
          typeof SNF !== "number" ||
          typeof Rate !== "number"
        ) {
          throw new Error(
            `Invalid record format at index ${index}. Each rate record must have numeric FAT, SNF, and Rate.`
          );
        }

        // Round the FAT, SNF, and Rate to 2 decimal places
        FAT = parseFloat(FAT.toFixed(1));
        SNF = parseFloat(SNF.toFixed(1));
        Rate = parseFloat(Rate.toFixed(2));

        return [dairy_id, rccode, rcdate, rctype, animal, FAT, SNF, Rate, time];
      });

      console.log(values);

      // await connection.query(saveRatesQuery, [values]);

      await connection.query(saveRatesQuery, [values], (err, results) => {
        connection.commit();
        connection.release(); // Always release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (results.length === 0) {
          return res
            .status(404)
            .json({ message: "Rate not found for the provided parameters." });
        }

        res.status(201).json({
          message: "Ratechart saved successfully!",
          insertedRecords: results.affectedRows,
        });
      });
    } catch (error) {
      // Rollback transaction on error
      if (connection) {
        try {
          await connection.rollback();
        } catch (rollbackError) {
          console.error("Error rolling back transaction:", rollbackError);
        }
        connection.release();
      }
      return res.status(400).json({ message: error.message });
    }
  });
};

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
