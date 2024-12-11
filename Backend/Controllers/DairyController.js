const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});

// ................................................
// Create New Dairy User...........................
// ................................................

//.................................................
//Dairy info ......................................
//.................................................

// exports.dairyInfo = async (req, res) => {
//   // Get a connection from the pool
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
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       // Base query for dairy information
//       let getDairyInfo;
//       let queryParams = [dairy_id];
//
//       // Determine whether to query main dairy or dairy center
//       if (center_id === 0) {
//         // Query for main dairy
//         getDairyInfo = `
//           SELECT SocietyCode, SocietyName, PhoneNo, city, PinCode, AuditClass, RegNo, RegDate,
//                  email, prefix, startDate, enddate, tel, dist, gstno, marathiName
//           FROM societymaster
//           WHERE SocietyCode = ?
//         `;
//       } else {
//         getDairyInfo = `
//           SELECT center_name, marathi_name, reg_no, reg_date, mobile, email, city,
//                  tehsil, district, pincode, auditclass, orgid ,prefix
//           FROM centermaster
//           WHERE orgid = ? AND center_id = ?
//         `;
//         queryParams.push(center_id);
//       }
//
//       // Execute the query
//       connection.query(getDairyInfo, queryParams, (err, result) => {
//         connection.release(); // Release the connection back to the pool
//
//         if (err) {
//           console.error("Error executing query: ", err);
//           return res.status(500).json({ message: "Database query error" });
//         }
//
//         if (result.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "Dairy or center not found!" });
//         }
//
//         // Send the result as a response
//         res.status(200).json({
//           dairyInfo: result[0],
//         });
//       });
//     } catch (error) {
//       connection.release(); // Ensure the connection is released in case of an error
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//v2
exports.dairyInfo = async (req, res) => {
  // Extract user details from the request
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  // Construct the cache key
  const cacheKey = `dairyInfo_${dairy_id}_${center_id}`;

  // Check if the data exists in the cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      dairyInfo: cachedData,
    });
  }

  // Proceed to database query if cache miss
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
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
        // Query for dairy center
        getDairyInfo = `
          SELECT center_name, marathi_name, reg_no, reg_date, mobile, email, city, 
                 tehsil, district, pincode, auditclass, orgid, prefix
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

        // Cache the result for future requests
        cache.set(cacheKey, result[0]);

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
        // Invalidate the cache for this dairy_id
        const cacheKey = `dairyInfo_${dairy_id}_${center_id}`;
        cache.del(cacheKey);

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

// exports.updateCenterInfo = async (req, res) => {
//   const {
//     marathi_name,
//     center_name,
//     reg_no,
//     reg_date,
//     center_id,
//     auditclass,
//     mobile,
//     email,
//     city,
//     tehsil,
//     district,
//     pincode,
//   } = req.body;
//
//   const dairy_id = req.user.dairy_id;
//
//   if (!dairy_id) {
//     return res.status(404).json({ message: "Unauthorized user!" });
//   }
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("MySQL connection error: ", err);
//       return res.status(500).json({ message: "Database connection error!" });
//     }
//
//     try {
//       const updateCenterDetails = `
//         UPDATE centermaster
//         SET center_name = ?, marathi_name = ?, reg_no = ?, reg_date = ?, mobile = ?, email = ?, city = ?, tehsil = ?, district = ?, pincode = ?, auditclass = ?
//         WHERE center_id = ? AND orgid = ?
//       `;
//
//       connection.query(
//         updateCenterDetails,
//         [
//           center_name,
//           marathi_name,
//           reg_no,
//           reg_date,
//           mobile,
//           email,
//           city,
//           tehsil,
//           district,
//           pincode,
//           auditclass,
//           center_id,
//           dairy_id, // Using orgid from the user's dairy_id for authorization
//         ],
//         (err, result) => {
//           connection.release(); // Ensure connection is released after the query
//           if (err) {
//             console.error("Update center details query execution error!", err);
//             return res.status(500).json({ message: "Database query error!" });
//           }
//
//           if (result.affectedRows === 0) {
//             return res
//               .status(404)
//               .json({ message: "No center data found for updating!" });
//           }
//
//           // Successfully updated the center info
//           res
//             .status(200)
//             .json({ message: "Center details updated successfully!" });
//         }
//       );
//     } catch (error) {
//       connection.release(); // Make sure to release the connection in case of an error
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//v2
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
          dairy_id,
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

          // Invalidate the cache for this dairy_id
          const cacheKey1 = `centers_${dairy_id}`;
          const cacheKey = `dairyInfo_${dairy_id}_${center_id}`;
          cache.del(cacheKey1, cacheKey);

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

// exports.getAllcenters = async (req, res) => {
//   const dairy_id = req.user.dairy_id;
//
//   if (!dairy_id) {
//     return res.status(400).json({ message: "Unauthorized User!" });
//   }
//
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Getting MySQL connection error!", err);
//       return res.status(500).json({ message: "Database connection error!" });
//     }
//
//     try {
//       const allCenterDetailsQuery = `SELECT * FROM centermaster WHERE orgid = ?`;
//
//       connection.query(allCenterDetailsQuery, [dairy_id], (err, result) => {
//         connection.release();
//         if (err) {
//           console.error("All center details fetch query failed!", err);
//           return res.status(500).json({ message: "Query execution failed!" });
//         }
//
//         if (result.length === 0) {
//           return res.status(404).json({ message: "No center data found!" });
//         }
//
//         res.status(200).json({ centersDetails: result });
//       });
//     } catch (error) {
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//v2
exports.getAllcenters = async (req, res) => {
  const dairy_id = req.user.dairy_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Unauthorized User!" });
  }

  // Check if the data is cached
  const cacheKey = `centers_${dairy_id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.status(200).json({ centersDetails: cachedData });
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

        // Store the result in cache
        cache.set(cacheKey, result);
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

// exports.listRatecharts = async (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//     try {
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       const rateChartListQuery = `
//         SELECT DISTINCT rccode, rcdate, rctypename, cb, time, isActive
//         FROM ratemaster
//         WHERE companyid = ? AND center_id = ?
//       `;
//
//       connection.query(
//         rateChartListQuery,
//         [dairy_id, center_id],
//         (err, result) => {
//           connection.release();
//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//
//           // Send the distinct rate chart details in the response
//           res.status(200).json({
//             ratecharts: result,
//           });
//         }
//       );
//     } catch (error) {
//       connection.release(); // Ensure the connection is released on error
//       return res.status(400).json({ message: error.message });
//     }
//   });
// };

//v2
exports.listRatecharts = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  // Generate a unique cache key for this combination of dairy_id and center_id
  const cacheKey = `ratecharts_${dairy_id}_${center_id}`;

  // Check if the data is in the cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({ ratecharts: cachedData });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const rateChartListQuery = `
        SELECT DISTINCT rccode, rcdate, rctypename, cb, time, isActive
        FROM ratemaster
        WHERE companyid = ? AND center_id = ?
      `;

      connection.query(
        rateChartListQuery,
        [dairy_id, center_id],
        (err, result) => {
          connection.release(); // Ensure connection is released
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // Cache the result for future requests
          cache.set(cacheKey, result);

          // Send the distinct rate chart details in the response
          res.status(200).json({ ratecharts: result });
        }
      );
    } catch (error) {
      connection.release(); // Ensure the connection is released on error
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
//.........................................................
// Save Rate Chart ........................................
//.........................................................

// exports.saveRateChart = async (req, res) => {
//   const { rccode, rctype, rcdate, time, animal, ratechart } = req.body;
//
//   // Acquire a connection from the pool
//   pool.getConnection(async (err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }
//
//     try {
//       // Extract user details from the request (assuming middleware handles authentication)
//       const dairy_id = req.user.dairy_id;
//       const center_id = req.user.center_id;
//
//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }
//
//       // Start transaction
//       await connection.beginTransaction();
//
//       const rctypecode = 0;
//       // Prepare the SQL query for bulk insert
//       const saveRatesQuery = `
//         INSERT INTO ratemaster (companyid, rccode, rcdate, rctypecode, rctypename, cb, fat, snf, rate, time, center_id)
//         VALUES ?
//       `;
//
//       // Prepare the values array for bulk insertion
//       const values = ratechart.map((record, index) => {
//         let { fat, snf, rate } = record;
//
//         // Validate each record's fields
//         if (
//           typeof fat !== "number" ||
//           typeof snf !== "number" ||
//           typeof rate !== "number"
//         ) {
//           throw new Error(
//             `Invalid record format at index ${index}. Each rate record must have numeric FAT, SNF, and Rate.`
//           );
//         }
//
//         // Round the FAT, SNF, and Rate to 2 decimal places
//         fat = parseFloat(fat.toFixed(1));
//         snf = parseFloat(snf.toFixed(1));
//         rate = parseFloat(rate.toFixed(2));
//
//         return [
//           dairy_id,
//           rccode,
//           rcdate,
//           rctypecode,
//           rctype,
//           animal,
//           fat,
//           snf,
//           rate,
//           time,
//           center_id,
//         ];
//       });
//
//       // await connection.query(saveRatesQuery, [values]);
//
//       await connection.query(saveRatesQuery, [values], (err, results) => {
//         connection.commit();
//         connection.release(); // Always release the connection back to the pool
//
//         if (err) {
//           console.error("Error executing query: ", err);
//           return res.status(500).json({ message: "Query execution error" });
//         }
//
//         res.status(200).json({
//           message: "Ratechart saved successfully!",
//           insertedRecords: results.affectedRows,
//         });
//       });
//     } catch (error) {
//       // Rollback transaction on error
//       if (connection) {
//         try {
//           await connection.rollback();
//         } catch (rollbackError) {
//           console.error("Error rolling back transaction:", rollbackError);
//         }
//         connection.release();
//       }
//       return res.status(400).json({ message: error.message });
//     }
//   });
// };

//v2
exports.saveRateChart = async (req, res) => {
  const { rccode, rctype, rcdate, time, animal, ratechart } = req.body;

  // Acquire a connection from the pool
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

      // Start transaction
      await connection.beginTransaction();

      const rctypecode = 0;
      const saveRatesQuery = `
        INSERT INTO ratemaster (companyid, rccode, rcdate, rctypecode, rctypename, cb, fat, snf, rate, time, center_id)
        VALUES ?
      `;

      const values = ratechart.map((record, index) => {
        let { fat, snf, rate } = record;

        if (
          typeof fat !== "number" ||
          typeof snf !== "number" ||
          typeof rate !== "number"
        ) {
          throw new Error(
            `Invalid record format at index ${index}. Each rate record must have numeric FAT, SNF, and Rate.`
          );
        }

        fat = parseFloat(fat.toFixed(1));
        snf = parseFloat(snf.toFixed(1));
        rate = parseFloat(rate.toFixed(2));

        return [
          dairy_id,
          rccode,
          rcdate,
          rctypecode,
          rctype,
          animal,
          fat,
          snf,
          rate,
          time,
          center_id,
        ];
      });

      connection.query(saveRatesQuery, [values], async (err, results) => {
        if (err) {
          await connection.rollback();
          connection.release();
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        // Commit the transaction
        await connection.commit();
        connection.release();

        // Clear the cache for rate charts of this dairy_id and center_id
        const cacheKey = `ratecharts_${dairy_id}_${center_id}`;
        cache.del(cacheKey);

        res.status(200).json({
          message: "Ratechart saved successfully!",
          insertedRecords: results.affectedRows,
        });
      });
    } catch (error) {
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
//       const applyRatechartQuery = `
//         UPDATE ratemaster
//         SET isActive = ?
//         WHERE companyid = ? AND center_id = ?
//       `;
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

exports.applyRateChart = async (req, res) => {
  const {} = req.body;
  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id || !center_id) {
        connection.release();
        return res
          .status(400)
          .json({ message: "Dairy ID or Center ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

      // 1. Fetch the active rate chart for the dairy and center
      const fetchRateChartQuery = `
        SELECT ReceiptDate, litres, fat, snf, rate 
        FROM ${dairy_table}
        WHERE center_id = ? AND  ReceiptDate >= ? 
      `;

      connection.query(
        fetchRateChartQuery,
        [center_id, currentDate],
        (err, Result) => {
          if (err) {
            connection.release();
            console.error("Error fetching rate chart: ", err);
            return res
              .status(500)
              .json({ message: "Error fetching rate chart" });
          }

          if (Result.length === 0) {
            connection.release();
            return res
              .status(404)
              .json({ message: "No active rate chart found!" });
          }

          const { milkentries } = Result;

          // 2. Update the `dairy_milk` table with the new rates and recalculate amounts
          const updateMilkDataQuery = `
          UPDATE ${dairy_table}
          SET rate = ?, amount = litres * ?
          WHERE center_id = ? AND ReceiptDate <= ?
        `;

          const values = milkentries.map((record, index) => {
            let { fat, snf, rate } = record;

            if (
              typeof fat !== "number" ||
              typeof snf !== "number" ||
              typeof rate !== "number"
            ) {
              throw new Error(
                `Invalid record format at index ${index}. Each rate record must have numeric FAT, SNF, and Rate.`
              );
            }

            fat = parseFloat(fat.toFixed(1));
            snf = parseFloat(snf.toFixed(1));
            rate = parseFloat(rate.toFixed(2));

            return [
              dairy_id,
              rccode,
              rcdate,
              rctypecode,
              rctype,
              animal,
              fat,
              snf,
              rate,
              time,
              center_id,
            ];
          });

          connection.query(
            updateMilkDataQuery,
            [rate, rate, dairy_id, center_id, currentDate],
            (err, updateResult) => {
              connection.release(); // Ensure the connection is released

              if (err) {
                console.error("Error updating dairy milk data: ", err);
                return res
                  .status(500)
                  .json({ message: "Error updating dairy milk data" });
              }

              res.status(200).json({
                message:
                  "Ratechart applied and dairy milk data updated successfully!",
                updatedRows: updateResult.affectedRows,
              });
            }
          );
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error: ", error);
      return res
        .status(500)
        .json({ message: "Server error", error: error.message });
    }
  });
};

// .............................................................................
// Updating selected Ratechart .................................................
// .............................................................................

//working...
// exports.updateSelectedRateChart = async (req, res) => {
//   const { amt, rccode, rcdate, rctype } = req.body;
//
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
//       // Parse amt
//       const parsedAmt = parseFloat(amt);
//       if (isNaN(parsedAmt)) {
//         connection.release();
//         return res.status(400).json({ message: "Invalid amount value!" });
//       }
//
//       const updateAmount = parsedAmt; // Use parsedAmt directly
//
//       // Retrieve ratechart records first
//       const getRatechartQuery = `
//         SELECT fat, snf, rate
//         FROM ratemaster
//         WHERE companyid = ? AND center_id = ? AND rcdate = ? AND rccode = ? AND rctypename = ?
//       `;
//
//       connection.query(
//         getRatechartQuery,
//         [dairy_id, center_id, rcdate, rccode, rctype],
//         async (err, ratechart) => {
//           if (err) {
//             connection.release();
//             console.error("Error fetching ratechart: ", err);
//             return res
//               .status(500)
//               .json({ message: "Error fetching ratechart" });
//           }
//
//           // Adjust rates dynamically based on amt
//           const updatedRates = ratechart.map((record) => ({
//             ...record,
//             rate: parseFloat((record.rate + updateAmount).toFixed(2)), // Add or subtract amt
//           }));
//
//           // Update each record in the database
//           const updateRateQuery = `
//             UPDATE ratemaster
//             SET rate = ?
//             WHERE companyid = ? AND center_id = ? AND rcdate = ? AND rccode = ? AND rctypename = ? AND fat = ? AND snf = ?
//           `;
//
//           let affectedRowsCount = 0; // Initialize the counter for affected rows
//
//           for (const record of updatedRates) {
//             await new Promise((resolve, reject) => {
//               connection.query(
//                 updateRateQuery,
//                 [
//                   record.rate, // Updated rate
//                   dairy_id,
//                   center_id,
//                   rcdate,
//                   rccode,
//                   rctype,
//                   record.fat,
//                   record.snf,
//                 ],
//                 (err, result) => {
//                   if (err) {
//                     console.error("Error updating rate: ", err);
//                     reject(err);
//                   }
//
//                   // Add the affected rows to the counter
//                   affectedRowsCount += result.affectedRows;
//                   // Log affected rows count
//                   console.log(
//                     `Updated ${affectedRowsCount} row(s) for rate: ${record.rate}`
//                   );
//
//                   resolve();
//                 }
//               );
//             });
//           }
//
//           connection.release(); // Release connection after all updates
//
//           // Log the total number of affected rows
//           console.log(`Total affected rows: ${affectedRowsCount}`);
//
//           res.status(200).json({
//             message: "Ratechart updated successfully!",
//             updatedRates,
//             affectedRowsCount, // Return affected rows count in the response
//           });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//v2 function
exports.updateSelectedRateChart = async (req, res) => {
  const { amt, rccode, rcdate, rctype, rate } = req.body;

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

      // Parse amt
      const parsedAmt = parseFloat(amt);
      if (isNaN(parsedAmt)) {
        connection.release();
        return res.status(400).json({ message: "Invalid amount value!" });
      }

      const updateAmount = parsedAmt; // Use parsedAmt directly

      // Adjust rates dynamically based on amt
      const updatedRates = rate.map((record) => ({
        ...record,
        rate: parseFloat((record.rate + updateAmount).toFixed(2)), // Add or subtract amt
      }));

      // Start a transaction
      await connection.beginTransaction();

      const updateRateQuery = `
        UPDATE ratemaster
        SET rate = ?
        WHERE companyid = ? AND center_id = ? AND rcdate = ? AND rccode = ? AND rctypename = ? AND fat = ? AND snf = ?
      `;

      for (const record of updatedRates) {
        await new Promise((resolve, reject) => {
          connection.query(
            updateRateQuery,
            [
              record.rate, // Updated rate
              dairy_id,
              center_id,
              rcdate,
              rccode,
              rctype,
              record.fat,
              record.snf,
            ],
            (err, result) => {
              if (err) {
                // If any error occurs, rollback the transaction and reject
                console.error("Error updating rate: ", err);
                return connection.rollback(() => {
                  reject(err);
                });
              }
              resolve();
            }
          );
        });
      }

      // If all updates are successful, commit the transaction
      await new Promise((resolve, reject) => {
        connection.commit((err) => {
          if (err) {
            // If commit fails, rollback the transaction and reject
            console.error("Error committing transaction: ", err);
            return connection.rollback(() => {
              reject(err);
            });
          }
          resolve();
        });
      });

      connection.release(); // Release connection after transaction

      res.status(200).json({
        message: "Ratechart updated successfully!",
        affectedRowsCount,
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// .............................................................................
// Finding Distinct Ratechart used by dairy ....................................
// .............................................................................
//Incomplete
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
      const distinctRateChartsQuery = `SELECT DISTINCT ratecharttype FROM customer WHERE orgid = ? AND centerid = ?`;

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

//v2 function
exports.getSelectedRateChart = async (req, res) => {
  const { cb, rccode, rcdate, time } = req.query;

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

      const getRatechartQuery = `SELECT fat, snf, rate FROM ratemaster WHERE companyid = ? AND center_id = ? AND rccode = ? AND time = ? AND rcdate = ? AND cb = ? ORDER BY fat ASC, snf ASC`;

      connection.query(
        getRatechartQuery,
        [dairy_id, center_id, rccode, time, rcdate, cb],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          res.status(200).json({
            selectedRChart: result,
            message: result.length ? "Ratechart Found!" : "No ratechart found!",
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
// Retriving applied Ratechart for milk Collection .................
// .................................................................
//Incomplete

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

// .................................................................
// Retriving perfect Ratechart for milk Collection .................
// .................................................................

exports.collectionRatecharts = async (req, res) => {
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

      const findRatechart = `
      SELECT fat, snf, rate, rccode FROM ratemaster 
            WHERE orgid = ? AND center_id = ?
      `;

      connection.query(
        findRatechart,
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

// .................................................................
// Removing all cache data..........................................
// .................................................................

exports.clearCache = (req, res) => {
  try {
    cache.flushAll(); // Clears the entire cache
    return res.status(200).json({ message: "All cache cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cache: ", error);
    return res.status(500).json({ message: "Error clearing cache" });
  }
};
