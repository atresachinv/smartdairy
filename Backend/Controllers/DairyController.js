const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });

// ................................................
// Create New Dairy User...........................
// ................................................

//.................................................
//Dairy info ......................................
//.................................................

exports.dairyInfo = async (req, res) => {
  // Get a connection from the pool
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

      // Base query for dairy information
      let getDairyInfo;
      let queryParams = [dairy_id];

      // Determine whether to query main dairy or dairy center
      if (center_id === 0) {
        // Query for main dairy
        getDairyInfo = `
          SELECT SocietyCode, SocietyName, PhoneNo, city, PinCode, AuditClass, RegNo, RegDate, 
                 email, prefix, startDate, enddate, tel, dist, gstno, marathiName
          FROM societymaster
          WHERE SocietyCode = ?
        `;
      } else {
        getDairyInfo = `
          SELECT center_name, marathi_name, reg_no, reg_date, mobile, email, city, 
                 tehsil, district, pincode, auditclass, orgid ,prefix
          FROM centermaster
          WHERE orgid = ? AND center_id = ?
        `;
        queryParams.push(center_id);
      }

      // Execute the query
      connection.query(getDairyInfo, queryParams, (err, result) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "Dairy or center not found!" });
        }

        // Send the result as a response
        res.status(200).json({
          dairyInfo: result[0],
        });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ..................................................
// update dairy details .............................
// ..................................................

exports.updatedetails = async (req, res) => {
  const {
    marathiName,
    SocietyName,
    RegNo,
    RegDate,
    gstno,
    AuditClass,
    PhoneNo,
    email,
    city,
    tel,
    dist,
    PinCode,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    // Get dairy_id from the verified token (already decoded in middleware)
    const dairy_id = req.user.dairy_id;

    if (!dairy_id) {
      connection.release(); // Release connection
      return res.status(400).json({ message: "Dairy ID not found!" });
    }

    // SQL query to update dairy information
    const updateDairyDetails = `
      UPDATE societymaster 
      SET SocietyName = ?, PhoneNo = ?, city = ?, PinCode = ?, 
          AuditClass = ?, RegNo = ?, RegDate = ?, email = ?, tel = ?, dist = ?, gstno = ?, marathiName =?
      WHERE SocietyCode = ?`;

    // Execute the query
    connection.query(
      updateDairyDetails,
      [
        SocietyName,
        PhoneNo,
        city,
        PinCode,
        AuditClass,
        RegNo,
        RegDate,
        email,
        tel,
        dist,
        gstno,
        marathiName,
        dairy_id,
      ],
      (err, result) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error executing update query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        // Check if any row was updated
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Dairy not found!" });
        }

        // Successfully updated
        res
          .status(200)
          .json({ message: "Dairy information updated successfully!" });
      }
    );
  });
};

// ..................................................
// Create New center details ........................
// ..................................................

exports.maxCenterId = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    const dairy_id = req.user.dairy_id;

    if (!dairy_id) {
      connection.release(); // Release connection
      return res.status(400).json({ message: "Dairy ID not found!" });
    }

    // Query to get the maximum center_id
    const getMaxCenterId = `SELECT MAX(center_id) AS maxCenterid FROM centermaster WHERE orgid = ?`;

    connection.query(getMaxCenterId, [dairy_id], (err, result) => {
      connection.release(); // Release the connection after the query
      if (err) {
        console.error("Error fetching max center_id: ", err);
        return res.status(500).json({ message: "Database query error" });
      }

      // Increment the max center_id by 1, or set to 1 if no records exist
      const centerId = result[0].maxCenterid ? result[0].maxCenterid + 1 : 1;

      // Send the new center_id as the response
      return res.status(200).json({ centerId });
    });
  });
};

// ------------------------------FIND MAX CENTERID

// exports.createCenter = async (req, res) => {
//   const {
//     center_id,
//     center_name,
//     marathi_name,
//     reg_no,
//     reg_date,
//     mobile,
//     email,
//     city,
//     tehsil,
//     district,
//     pincode,
//     auditclass,
//   } = req.body;
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     // Get dairy_id from the verified token (already decoded in middleware)
//     const dairy_id = req.user.dairy_id;
//     const center_id = req.user.center_id;
//
//     if (!dairy_id) {
//       connection.release(); // Release connection
//       return res.status(400).json({ message: "Dairy ID not found!" });
//     }
//
//     // SQL query to update dairy information
//     const createCenter = `
//       INSERT INTO centermaster (center_id, center_name, marathi_name, reg_no, reg_date, mobile, email, city, tehsil, district, pincode, orgid, auditclass) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`;
//
//
//       const createCenterUser = `INSERT INTO users (username, password, isAdmin, createdon, createdby, designation, SocietyCode, center_id) VALUES ()`;
//
//     // Execute the query
//     connection.query(
//       createCenter,
//       [
//         center_id,
//         center_name,
//         marathi_name,
//         reg_no,
//         reg_date,
//         mobile,
//         email,
//         city,
//         tehsil,
//         district,
//         pincode,
//         dairy_id,
//         auditclass,
//       ],
//       (err, result) => {
//         connection.release();
//
//         if (err) {
//           console.error("Error executing update query: ", err);
//           return res.status(500).json({ message: "Database query error" });
//         }
//
//         // Check if any row was updated
//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: "table not found!" });
//         }
//
//         // Successfully updated
//         res.status(200).json({ message: "center created successfully!" });
//       }
//     );
//   });
// };

exports.createCenter = async (req, res) => {
  const {
    center_id,
    center_name,
    marathi_name,
    reg_no,
    reg_date,
    mobile,
    email,
    city,
    tehsil,
    district,
    pincode,
    auditclass,
    password,
    date,
    prefix,
  } = req.body;

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    const dairy_id = req.user.dairy_id;
    const user_role = req.user.user_role;

    if (!dairy_id) {
      connection.release(); // Release connection
      return res.status(400).json({ message: "Dairy ID not found!" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to create the center
    const createCenterQuery = `
      INSERT INTO centermaster (center_id, center_name, marathi_name, reg_no, reg_date, mobile, email, city, tehsil, district, pincode, orgid, auditclass, prefix)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )
    `;

    const designation = "Admin";
    const isAdmin = "1";

    // SQL query to create the user associated with the center
    const createUserQuery = `
      INSERT INTO users (username, password, isAdmin, createdon, createdby, designation, SocietyCode, center_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // First, create the center
    connection.query(
      createCenterQuery,
      [
        center_id,
        center_name,
        marathi_name,
        reg_no,
        reg_date,
        mobile,
        email,
        city,
        tehsil,
        district,
        pincode,
        dairy_id,
        auditclass,
        prefix,
      ],
      (err, centerResult) => {
        if (err) {
          connection.release();
          console.error("Error executing createCenter query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        // Now create the user associated with the center
        connection.query(
          createUserQuery,
          [
            mobile,
            password,
            isAdmin,
            date,
            user_role,
            designation,
            dairy_id,
            center_id,
          ],
          (err, userResult) => {
            connection.release();
            if (err) {
              console.error("Error executing createUser query: ", err);
              return res.status(500).json({ message: "Error creating user" });
            }

            // Successfully created center
            res.status(200).json({ message: "Center created successfully!" });
          }
        );
      }
    );
  });
};

// ..................................................
// update center details ............................
// ..................................................

exports.updateCenterInfo = async (req, res) => {
  const {
    marathi_name,
    center_name,
    reg_no,
    reg_date,
    center_id,
    auditclass,
    mobile,
    email,
    city,
    tehsil,
    district,
    pincode,
  } = req.body;

  const dairy_id = req.user.dairy_id;

  if (!dairy_id) {
    return res.status(404).json({ message: "Unauthorized user!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error: ", err);
      return res.status(500).json({ message: "Database connection error!" });
    }

    try {
      const updateCenterDetails = `
        UPDATE centermaster 
        SET center_name = ?, marathi_name = ?, reg_no = ?, reg_date = ?, mobile = ?, email = ?, city = ?, tehsil = ?, district = ?, pincode = ?, auditclass = ? 
        WHERE center_id = ? AND orgid = ?
      `;

      connection.query(
        updateCenterDetails,
        [
          center_name,
          marathi_name,
          reg_no,
          reg_date,
          mobile,
          email,
          city,
          tehsil,
          district,
          pincode,
          auditclass,
          center_id,
          dairy_id, // Using orgid from the user's dairy_id for authorization
        ],
        (err, result) => {
          connection.release(); // Ensure connection is released after the query
          if (err) {
            console.error("Update center details query execution error!", err);
            return res.status(500).json({ message: "Database query error!" });
          }

          if (result.affectedRows === 0) {
            return res
              .status(404)
              .json({ message: "No center data found for updating!" });
          }

          // Successfully updated the center info
          res
            .status(200)
            .json({ message: "Center details updated successfully!" });
        }
      );
    } catch (error) {
      connection.release(); // Make sure to release the connection in case of an error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .............................................................
// display perticular center details ...........................
// .............................................................
exports.getCenterDetails = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Getting MySQL connection error", err);
      return res.status(500).json({ message: "Database connection error!" });
    }

    const center_id = req.user.center_id;

    // Query to fetch center details based on dairy_id
    const centerDetailsQuery = `SELECT * FROM centermaster WHERE center_id = ?`;

    connection.query(centerDetailsQuery, [center_id], (err, result) => {
      connection.release(); // Always release connection after query execution
      if (err) {
        console.error("Error executing query to fetch center details", err);
        return res
          .status(500)
          .json({ message: "Database query execution error!" });
      }

      // Check if there are any results
      if (result.length === 0) {
        return res.status(404).json({ message: "No center details found!" });
      }

      // Return center details as JSON
      res.status(200).json({ centerinfo: result });
    });
  });
};

// ..............................................................
// display All centers (LIST) details ...........................
// ..............................................................

exports.getAllcenters = async (req, res) => {
  const dairy_id = req.user.dairy_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Getting MySQL connection error!", err);
      return res.status(500).json({ message: "Database connection error!" });
    }

    try {
      const allCenterDetailsQuery = `SELECT * FROM centermaster WHERE orgid = ?`;

      connection.query(allCenterDetailsQuery, [dairy_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("All center details fetch query failed!", err);
          return res.status(500).json({ message: "Query execution failed!" });
        }

        if (result.length === 0) {
          return res.status(404).json({ message: "No center data found!" });
        }

        res.status(200).json({ centersDetails: result });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ..................................................
// master Dates ..........................
// ..................................................

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
          fromDate: record.fromDate,
          toDate: record.toDate,
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

// ******************************** RATE CHART OPERATIONS **********************************//

//.................................................
//find rate chart of perticular dairy / center  ...
//.................................................

exports.maxRateChartNo = async (req, res) => {
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

      const maxRateChartNoQuery = `SELECT MAX(rccode) as maxRcCode FROM ratemaster WHERE companyid = ? AND center_id = ?`;

      connection.query(
        maxRateChartNoQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          const maxRcCode = result[0]?.maxRcCode
            ? Math.max(result[0].maxRcCode + 1, 1)
            : 1;

          res.status(200).json({
            maxRcCode: maxRcCode,
          });
        }
      );
    } catch (error) {
      connection.release();
      return res.status(400).json({ message: error.message });
    }
  });
};

// ....................................................
// To Show List Of Ratechart used by dairy ............
// ....................................................

exports.listRatecharts = async (req, res) => {
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

      const rateChartListQuery = `
        SELECT DISTINCT rccode, rcdate, rctypename, cb, time, isActive
        FROM ratemaster
        WHERE companyid = ? AND center_id = ? 
      `;

      connection.query(
        rateChartListQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // Send the distinct rate chart details in the response
          res.status(200).json({
            ratecharts: result,
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      return res.status(400).json({ message: error.message });
    }
  });
};

//.........................................................
// Save Rate Chart ........................................
//.........................................................

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
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Start transaction
      await connection.beginTransaction();

      const rctypecode = 0;
      // Prepare the SQL query for bulk insert
      const saveRatesQuery = `
        INSERT INTO ratemaster (companyid, rccode, rcdate, rctypecode, rctypename, cb, fat, snf, rate, time, center_id)
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

        return [
          dairy_id,
          rccode,
          rcdate,
          rctypecode,
          rctype,
          animal,
          FAT,
          SNF,
          Rate,
          time,
          center_id,
        ];
      });

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

//.................................................
//Apply rate chart ................................
//.................................................

// incomplete

// exports.applyRateChart = async (req, res) => {
//   pool.getConnection(async (err, connection) => {
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
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const dairy_table = `dailymilkentry_${dairy_id}`;
//
//       const applyRatechartQuery = `
//         UPDATE ratemaster
//         SET isActive = ?
//         WHERE companyid = ? AND center_id = ?
//       `;
//
//       const updateRateAmtOfMilkColl = ` UPDATE  ${dairy_table} `;
//
//       // i want to update each record found in above query
//
//       await connection.query(
//         applyRatechartQuery,
//         [1, dairy_id, center_id], // Pass 1 as an integer for isActive
//         (err, results) => {
//           connection.release(); // Always release the connection back to the pool
//
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           res.status(201).json({
//             message: "Ratechart applied successfully!",
//           });
//         }
//       );
//     } catch (error) {
//       connection.release(); // Ensure the connection is released on error
//       return res.status(400).json({ message: error.message });
//     }
//   });
// };

//  only updates isActive 0 to 1

exports.applyRateChart = async (req, res) => {
  pool.getConnection(async (err, connection) => {
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

      const applyRatechartQuery = `
        UPDATE ratemaster
        SET isActive = ?
        WHERE companyid = ? AND center_id = ? 
      `;

      await connection.query(
        applyRatechartQuery,
        [1, dairy_id, center_id], // Pass 1 as an integer for isActive
        (err, results) => {
          connection.release(); // Always release the connection back to the pool

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          res.status(201).json({
            message: "Ratechart applied successfully!",
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      return res.status(400).json({ message: error.message });
    }
  });
};

// .............................................................................
// Finding Distict Ratechart used by dairy to Show to Apply Customer............
// .............................................................................


exports.findUsedRc = async (req, res) => {
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

      // Query to get distinct ratecharttype values
      const distinctRateChartsQuery = `SELECT DISTINCT ratecharttype FROM customer WHERE orgid = ? AND center_id = ? AND isActive = "1"`;

      connection.query(
        distinctRateChartsQuery,
        [dairy_id, center_id],
        (err, results) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // Map the results to an array of ratecharttype values
          const distinctRateCharts = results.map((row) => row.ratecharttype);

          res.status(200).json({
            distinctRateCharts, // Return the array of distinct ratecharttype values
          });
        }
      );
    } catch (error) {
      connection.release();
      return res.status(400).json({ message: error.message });
    }
  });
};

// .................................................................
// Retriving perticular Ratechart to perform operations ............
// (Download , Apply , Update , Delete )............................
// .................................................................

exports.getSelectedRateChart = async (req, res) => {
  const { cb, rccode, rcdate, time } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      if (err) {
        console.error("Error getting MySQL connection: ", err);
        return res.status(500).json({ message: "Database connection error" });
      }
    }
    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const getRatechartQuery = `SELECT fat, snf, rate FROM ratemaster WHERE companyid = ? AND center_id = ? AND rccode = ? AND time = ? AND rcdate = ? AND cb = ?`;

      connection.query(
        getRatechartQuery,
        [dairy_id, center_id, rccode, time, rcdate, cb],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          console.log(result);

          res.status(201).json({
            selectedRChart: result,
            message: "Ratechart Found!",
          });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      return res.status(400).json({ message: error.message });
    }
  });
};

// .................................................................
// Retriving applied Ratechart for milk Collection .................
// .................................................................


exports.rateChartMilkColl = async (req, res) => {

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
        return res.status(400).json({ message: "Unauthorized User!" });
      }

      const findRatechartQuery = `
      SELECT rm.fat, rm.snf, rm.rate, rm.rccode 
        FROM ratemaster AS rm 
        WHERE rm.companyid = ? 
          AND rm.center_id = ? 
          AND rm.rccode IN (
            SELECT DISTINCT rateChartNo 
            FROM customer 
            WHERE orgid = ? AND center_id = ?
          );
      `;

      connection.query(
        findRatechartQuery,
        [dairy_id, center_id, dairy_id, center_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          res.status(200).json({
            usedRateChart: result,
            message: "Rate chart data retrieved successfully",
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

