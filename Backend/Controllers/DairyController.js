const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const pool = require("../Configs/Database");
const evpool = require("../Configs/EverleapDB");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});
const axios = require("axios");

const getConnectionPromise = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
};

const queryPromise = (connection, sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
//Dairy info --------------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

//v3 center_id added in data
exports.dairyInfo = async (req, res) => {
  // Extract user details from the request
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  // Construct the cache key
  const cacheKey = `dairyInfo_${dairy_id}_${center_id}`;

  // Check if the data exists in the cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({ status: 200, dairyInfo: cachedData });
  }

  // Proceed to database query if cache miss
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      // Base query for dairy information
      let getDairyInfo;
      let queryParams = [dairy_id];

      // Determine whether to query main dairy or dairy center
      if (center_id === 0) {
        // Query for main dairy
        getDairyInfo = `
          SELECT SocietyCode, center_id, SocietyName, PhoneNo, city, PinCode, AuditClass, RegNo, RegDate, 
                 email, prefix, startDate, enddate, tel, dist, gstno, marathiName
          FROM societymaster
          WHERE SocietyCode = ?
        `;
      } else {
        // Query for dairy center
        getDairyInfo = `
          SELECT id, center_id, center_name, marathi_name, reg_no, reg_date, mobile, email, city, 
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
          return res
            .status(500)
            .json({ status: 500, message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(404).json({
            status: 404,
            dairyInfo: [],
            message: "Dairy or center not found!",
          });
        }

        // Cache the result for future requests
        cache.set(cacheKey, result[0]);

        // Send the result as a response
        res.status(200).json({ status: 200, dairyInfo: result[0] });
      });
    } catch (error) {
      connection.release(); // Ensure the connection is released in case of an error
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// update dairy details ---------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

//v2 function
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

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id || center_id === undefined) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  const cacheKey = `dairyInfo_${dairy_id}_${center_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res
          .status(500)
          .json({ status: 500, message: "Transaction error" });
      }

      const updateSocietyQuery = `
        UPDATE societymaster 
        SET SocietyName = ?, PhoneNo = ?, city = ?, PinCode = ?, 
            AuditClass = ?, RegNo = ?, RegDate = ?, email = ?, tel = ?, dist = ?, gstno = ?, marathiName = ?
        WHERE SocietyCode = ?`;

      const updateCenterQuery = `
        UPDATE centermaster 
        SET center_name = ?, marathi_name = ?, reg_no = ?, reg_date = ?, mobile = ?, email = ?, city = ?, 
            tehsil = ?, district = ?, pincode = ?, auditclass = ?
        WHERE orgid = ? AND center_id = ?`;

      if (center_id === 0) {
        connection.query(
          updateSocietyQuery,
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
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({
                  status: 500,
                  message: "Error updating society details",
                });
              });
            }

            connection.query(
              updateCenterQuery,
              [
                SocietyName,
                marathiName,
                RegNo,
                RegDate,
                PhoneNo,
                email,
                city,
                tel,
                dist,
                PinCode,
                AuditClass,
                dairy_id,
                center_id,
              ],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({
                      status: 500,
                      message: "Error updating center details",
                    });
                  });
                }
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({
                        status: 500,
                        message: "Transaction commit error",
                      });
                    });
                  }

                  // Remove cache entry after successful update
                  delete cache[cacheKey];

                  connection.release();
                  res.status(200).json({
                    status: 200,
                    message:
                      "Dairy and Center information updated successfully!",
                  });
                });
              }
            );
          }
        );
      } else {
        connection.query(
          updateCenterQuery,
          [
            SocietyName,
            marathiName,
            RegNo,
            RegDate,
            PhoneNo,
            email,
            city,
            tel,
            dist,
            PinCode,
            AuditClass,
            dairy_id,
            center_id,
          ],
          (err, result) => {
            connection.release();
            if (err) {
              return res.status(500).json({
                status: 500,
                message: "Error updating center details",
              });
            }

            // Remove cache entry after successful update
            delete cache[cacheKey];

            res.status(200).json({
              status: 200,
              message: "Center information updated successfully!",
            });
          }
        );
      }
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
// Create New center details ----------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.maxCenterId = async (req, res) => {
  const dairy_id = req.user.dairy_id;

  if (!dairy_id) {
    return res
      .status(401)
      .json({ status: 401, message: "Dairy ID not found!" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    // Query to get the maximum center_id
    const getMaxCenterId = `SELECT MAX(center_id) AS maxCenterid FROM centermaster WHERE orgid = ?`;

    connection.query(getMaxCenterId, [dairy_id], (err, result) => {
      connection.release(); // Release the connection after the query
      if (err) {
        console.error("Error fetching max center_id: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Database query error" });
      }

      // Increment the max center_id by 1, or set to 1 if no records exist
      const centerId = result[0].maxCenterid ? result[0].maxCenterid + 1 : 1;

      // Send the new center_id as the response
      return res.status(200).json({ status: 200, centerId });
    });
  });
};

// ------------------------------FIND MAX CENTERID

// exports.createCenter = (req, res) => {
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
//     password,
//     date,
//     prefix,
//   } = req.body;

//   const dairy_id = req.user.dairy_id;
//   const user_role = req.user.user_role;

//   if (!dairy_id) {
//     return res.status(401).json({ status: 401, message: "Unauthorized User!" });
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("MySQL connection error:", err);
//       return res
//         .status(500)
//         .json({ status: 500, message: "Database connection error" });
//     }

//     // Hash password before inserting into `users`
//     bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
//       if (hashErr) {
//         connection.release();
//         console.error("Error hashing password:", hashErr);
//         return res
//           .status(500)
//           .json({ status: 500, message: "Password hashing error" });
//       }

//       // Insert into `centermaster`
//       const createCenterQuery = `
//         INSERT INTO centermaster (
//           center_id, center_name, marathi_name, reg_no, reg_date,
//           mobile, email, city, tehsil, district, pincode,
//           orgid, auditclass, prefix
//         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       const insertRegNo = reg_no && reg_no !== "" ? parseInt(reg_no, 10) : null;
//       const insertRegDate = reg_date && reg_date !== "" ? reg_date : null;

//       connection.query(
//         createCenterQuery,
//         [
//           center_id,
//           center_name,
//           marathi_name,
//           insertRegNo,
//           insertRegDate,
//           mobile,
//           email || null,
//           city || null,
//           tehsil || null,
//           district || null,
//           pincode || null,
//           dairy_id,
//           auditclass || null,
//           prefix,
//         ],
//         (err, centerResult) => {
//           if (err) {
//             connection.release();
//             console.error("Error inserting into centermaster:", err);
//             return res
//               .status(500)
//               .json({ status: 500, message: "Center creation failed" });
//           }

//           // Insert into `users`
//           const createUserQuery = `
//             INSERT INTO users (
//               username, password, isAdmin, createdon,
//               createdby, designation, SocietyCode, center_id
//             ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//           `;

//           const designation = "Admin";
//           const isAdmin = "1";

//           connection.query(
//             createUserQuery,
//             [
//               mobile,
//               hashedPassword,
//               isAdmin,
//               date,
//               user_role,
//               designation,
//               dairy_id,
//               center_id,
//             ],
//             (err, userResult) => {
//               connection.release();

//               if (err) {
//                 console.error("Error inserting into users:", err);
//                 return res
//                   .status(500)
//                   .json({ status: 500, message: "User creation failed" });
//               }

//               return res.status(200).json({
//                 status: 200,
//                 message: "Center and user created successfully!",
//               });
//             }
//           );
//         }
//       );
//     });
//   });
// };

exports.createCenter = (req, res, next) => {
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

  const dairy_id = req.user.dairy_id;
  const user_role = req.user.user_role;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        connection.release();
        return res
          .status(500)
          .json({ status: 500, message: "Password hashing error" });
      }

      const createCenterQuery = `
        INSERT INTO centermaster (
          center_id, center_name, marathi_name, reg_no, reg_date,
          mobile, email, city, tehsil, district, pincode,
          orgid, auditclass, prefix
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const insertRegNo = reg_no && reg_no !== "" ? parseInt(reg_no, 10) : null;
      const insertRegDate = reg_date && reg_date !== "" ? reg_date : null;

      connection.query(
        createCenterQuery,
        [
          center_id,
          center_name,
          marathi_name,
          insertRegNo,
          insertRegDate,
          mobile,
          email || null,
          city || null,
          tehsil || null,
          district || null,
          pincode || null,
          dairy_id,
          auditclass || null,
          prefix,
        ],
        (err, centerResult) => {
          if (err) {
            connection.release();
            return res
              .status(500)
              .json({ status: 500, message: "Center creation failed" });
          }

          const createUserQuery = `
            INSERT INTO users (
              username, password, isAdmin, createdon,
              createdby, designation, SocietyCode, center_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

          connection.query(
            createUserQuery,
            [
              mobile,
              hashedPassword,
              "1", // isAdmin
              date,
              user_role, // createdby
              "Admin", // designation
              dairy_id,
              center_id,
            ],
            (err, userResult) => {
              connection.release();

              if (err) {
                return res
                  .status(500)
                  .json({ status: 500, message: "User creation failed" });
              }

              // Pass control to the next middleware
              req.dairy_id = dairy_id;
              req.center_id = center_id;
              next(); // Do not send response here
            }
          );
        }
      );
    });
  });
};

exports.setupBasicInformation = async (req, res) => {
  const SocietyCode = req.dairy_id;
  const CenterId = req.center_id;

  const connection = await getConnectionPromise();

  try {
    await queryPromise(
      connection,
      `INSERT INTO ratecharttype (companyid, center_id, rctypeid, rctypename) VALUES (?, ?, ?, ?)`,
      [SocietyCode, CenterId, 1, "Cow"]
    );

    await queryPromise(
      connection,
      `INSERT INTO bankmaster (code, name, branch, ifsc, companyid, center_id) VALUES (?, ?, ?, ?, ?, ?)`,
      [1, "Demo Bank", "Demo", "DEMO000123", SocietyCode, CenterId]
    );

    connection.release();

    res.status(200).json({
      status: 200,
      message: "Center and basic information created successfully!",
    });
  } catch (err) {
    connection.release();
    console.error("setupBasicInformation error:", err);
    res.status(500).json({
      status: 500,
      message: "Center created, but basic information creation failed!",
    });
  }
};

//-------------------------------------------------------------------------------------------------------->
// update center details --------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

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
    return res.status(401).json({ status: 401, message: "Unauthorized user!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
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
            return res
              .status(500)
              .json({ status: 500, message: "Database query error!" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              status: 404,
              message: "No center data found for updating!",
            });
          }

          res.status(200).json({
            status: 200,
            message: "Center details updated successfully!",
          });
        }
      );
    } catch (error) {
      connection.release(); // Make sure to release the connection in case of an error
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// update center details --------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

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
    return res.status(401).json({ status: 401, message: "Unauthorized user!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("MySQL connection error: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
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
            return res
              .status(500)
              .json({ status: 500, message: "Database query error!" });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              status: 404,
              message: "No center data found for updating!",
            });
          }

          res.status(200).json({
            status: 200,
            message: "Center details updated successfully!",
          });
        }
      );
    } catch (error) {
      connection.release(); // Make sure to release the connection in case of an error
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// display perticular center details --------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->
exports.getCenterDetails = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Getting MySQL connection error", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
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
          .json({ status: 500, message: "Database query execution error!" });
      }

      // Check if there are any results
      if (result.length === 0) {
        return res
          .status(404)
          .json({ status: 404, message: "No center details found!" });
      }

      // Return center details as JSON
      res.status(200).json({ status: 200, centerinfo: result });
    });
  });
};

//-------------------------------------------------------------------------------------------------------->.
// display All centers (LIST) details  ------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->.

//v2
exports.getAllcenters = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Getting MySQL connection error!", err);
      return res.status(500).json({ message: "Database connection error!" });
    }

    try {
      const allCenterDetailsQuery = `
        SELECT * FROM centermaster 
          WHERE orgid = ?
          ORDER BY center_id ASC
        `;

      connection.query(allCenterDetailsQuery, [dairy_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("All center details fetch query failed!", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution failed!" });
        }

        if (result.length === 0) {
          return res.status(404).json({
            status: 404,
            centersDetails: [],
            message: "No center data found!",
          });
        }

        res.status(200).json({ status: 200, centersDetails: result });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// master Dates   ---------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.masterDates = async (req, res) => {
  const { yearStart, yearEnd } = req.body;
  const { dairy_id } = req.user;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      // Use DATE() function to ensure only date parts are retrieved
      const getMasters = `
        SELECT DISTINCT 
          DATE(fromDate) AS fromDate, 
          DATE(toDate) AS toDate 
        FROM custbilldetails 
        WHERE companyid = ? AND fromDate BETWEEN ? AND ? 
        ORDER BY fromDate DESC`;

      connection.query(
        getMasters,
        [dairy_id, yearStart, yearEnd],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("master query execution error: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "master query execution error" });
          }

          // Map result to desired format
          const formattedResult = result.map((record) => ({
            fromDate: record.fromDate,
            toDate: record.toDate,
          }));

          res.status(200).json({ status: 200, getMasters: formattedResult });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// Everleap data ------------------------------------------------>
exports.mastersDates = async (req, res) => {
  const { yearStart, yearEnd } = req.body;
  const { dairy_id } = req.user;

  evpool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      // Use DATE() function to ensure only date parts are retrieved
      const getMasters = `
        SELECT DISTINCT 
          DATE(fromDate) AS fromDate, 
          DATE(toDate) AS toDate 
        FROM custbilldetails 
        WHERE companyid = ? AND fromDate BETWEEN ? AND ? 
        ORDER BY fromDate DESC`;

      connection.query(
        getMasters,
        [dairy_id, yearStart, yearEnd],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("master query execution error: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "master query execution error" });
          }

          // Map result to desired format
          const formattedResult = result.map((record) => ({
            fromDate: record.fromDate,
            toDate: record.toDate,
          }));

          res.status(200).json({ status: 200, getMasters: formattedResult });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// Dairy Dashboard Info ---------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.dairyDashboardInfo = async (req, res) => {
  const { toDate, fromDate } = req.body;

  const dairy_id = req.user.dairy_id;
  const user_code = req.user.user_code;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorised User!" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      // Get dairy_id from the verified token (already decoded in middleware)

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
            return res
              .status(500)
              .json({ status: 500, message: "query execution error" });
          }
          const dashboardInfo = dashboardDataresult[0];
          res
            .status(200)
            .json({ status: 200, fromDate, toDate, dashboardInfo });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// Removing all cache data ------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.clearCache = (req, res) => {
  try {
    cache.flushAll(); // Clears the entire cache
    return res
      .status(200)
      .json({ status: 200, message: "All cache cleared successfully!" });
  } catch (error) {
    console.error("Error clearing cache: ", error);
    return res
      .status(500)
      .json({ status: 500, message: "Error clearing cache" });
  }
};

//--------------------------------------------------------------------------------------------------------->
// Whats app  message send--------------------------------------------------------------------------------->
//--------------------------------------------------------------------------------------------------------->

exports.sendMessage = (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Database connection error",
      });
    }

    try {
      // Get rows from sms_history_master
      connection.query(
        `SELECT * FROM sms_history_master WHERE center_id=? AND dairy_id=?`,
        [center_id, dairy_id],
        (err, result) => {
          if (err) {
            console.error("Error getting rows from sms_history_master: ", err);
            connection.release();
            return res.status(500).json({
              success: false,
              status: 500,
              message: "query execution error sms_history_master",
            });
          }

          // Get the total balance from smsRechargeMaster
          connection.query(
            `SELECT SUM(balance) as total_balance FROM smsRechargeMaster WHERE center_id=? AND dairy_id=?`,
            [center_id, dairy_id],
            async (err, result1) => {
              connection.release();

              if (err) {
                console.error(
                  "Error getting balance from smsRechargeMaster: ",
                  err
                );
                return res.status(500).json({
                  success: false,
                  status: 500,
                  message: "query execution error smsRechargeMaster",
                });
              }

              const rowCount = result.length;
              const totalBalance =
                result1[0] && result1[0].total_balance !== null
                  ? result1[0].total_balance
                  : 10;

              // Compare row count with total balance to decide further action
              if (rowCount < totalBalance) {
                try {
                  const response = await axios.post(
                    "https://partnersv1.pinbot.ai/v3/560504630471076/messages",
                    req.body,
                    {
                      headers: {
                        apikey: "0a4a47a3-d03c-11ef-bb5a-02c8a5e042bd",
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  return res.json({ success: true, res: response.data }); // Return the response from the API call
                } catch (error) {
                  console.error("Error sending message:", error.message);
                  return res.status(500).json({
                    success: false,
                    error: error.message,
                  });
                }
              } else {
                // Log additional details for better debugging
                // console.log(
                //   `Low Balance: Row Count = ${rowCount}, Total Balance = ${totalBalance}`
                // );
                return res.status(200).json({
                  success: false,
                  message: "Your balance is low",
                });
              }
            }
          );
        }
      );
    } catch (error) {
      console.error("Error in try block:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

//--------------------------------------------------------------------------------------------------------->
// Send OTP on Whatsapp ----------------------------------------------------------------------------------->
//--------------------------------------------------------------------------------------------------------->

exports.sendOTPMessage = (req, res) => {
  try {
    const response = axios.post(
      "https://partnersv1.pinbot.ai/v3/560504630471076/messages",
      req.body,
      {
        headers: {
          apikey: "0a4a47a3-d03c-11ef-bb5a-02c8a5e042bd",
          "Content-Type": "application/json",
        },
      }
    );
    return res.json({ success: true, res: response.data }); // Return the response from the API call
  } catch (error) {
    console.error("Error sending message:", error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//--------------------------------------------------------------------------------------------------------->
// Save OTP in Users Table ----------------------------------------------------------------------------------->
//--------------------------------------------------------------------------------------------------------->

exports.saveOTP = (req, res) => {
  const { otp, username, mobile } = req.body;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const updateQuery = `     
          UPDATE users SET otp = ?
          WHERE username = ? AND mobile = ?
      `;

      connection.query(updateQuery, [otp, username, mobile], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing summary query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "query execution error" });
        }

        res
          .status(200)
          .json({ status: 200, message: "Otp saved successfully!" });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//--------------------------------------------------------------------------------------------------------->
// save Whats app  message --------------------------------------------------------------------------------->
//--------------------------------------------------------------------------------------------------------->

exports.saveMessage = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const { smsStatus, mono, custCode, rNo, smsText } = req.body;

  try {
    const query = `
      INSERT INTO sms_history_master 
      (center_id, dairy_id, smsStatus, mono, custCode, rNo, smsText) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      center_id,
      dairy_id,
      smsStatus,
      mono,
      custCode,
      rNo,
      JSON.stringify(smsText), // Store as JSON string
    ];

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Database connection error: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Database connection error" });
      }

      connection.query(query, values, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error saving SMS record:", err);
          return res
            .status(500)
            .json({ success: false, message: "Error saving SMS record" });
        }
        res.json({ success: true, message: "Message saved successfully" });
      });
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

//--------------------------------------------------------------------------------------------------------->
// <<<------------------------- Dashboard Information  ------------------------------------------------>>>
//--------------------------------------------------------------------------------------------------------->

//-------------------------------------------------------------------------------------------------------->
// Center wise milk Collection --------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.getCenterWiseMilkData = (req, res) => {
  const { fromDate, toDate } = req.body;
  const { dairy_id } = req.user;
  if (!dairy_id) {
    connection.release();
    return res.status(401).json({ status: 401, message: "Unathorised User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }
    const dairy_table = `dailymilkentry_${dairy_id}`;
    const getLiterAmt = `
      SELECT center_id, 
        SUM(litres) AS total_litres, 
        SUM(amt) AS total_amount
      FROM ${dairy_table}
      WHERE ReceiptDate BETWEEN ? AND ?
      GROUP BY center_id;
    `;

    connection.query(getLiterAmt, [fromDate, toDate], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Query execution error" });
      }
      if (result.length === 0) {
        return res.status(200).json({
          status: 200,
          centerData: [],
          message: "Rate not found for the provided parameters.",
        });
      }

      res.status(200).json({ status: 200, centerData: result });
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
// Center wise customer count ---------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

// exports.getCenterCustomerCount = (req, res) => {
//   const dairy_id = req.user.dairy_id;
//   if (!dairy_id) {
//     connection.release();
//     return res.status(401).json({ status: 401, message: "Unauthorised User!" });
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res
//         .status(500)
//         .json({ status: 500, message: "Database connection error" });
//     }
//     // we have to fetch count of customer centerwise but count
//     // shift wise count from
//     const getCustCount = `
//       SELECT centerid, COUNT(*) AS total_customers
//       FROM customer WHERE orgid = ?
//       GROUP BY centerid;
//   `;

//     connection.query(getCustCount, [dairy_id], (err, result) => {
//       connection.release(); // Always release the connection back to the pool

//       if (err) {
//         console.error("Error executing query: ", err);
//         return res
//           .status(500)
//           .json({ status: 500, message: "Query execution error" });
//       }
//       if (result.length === 0) {
//         return res.status(404).json({
//           custCounts: [],
//           status: 404,
//           message: "No Customers Available for this Dairy.",
//         });
//       }
//       res.status(200).json({ status: 200, custCounts: result });
//     });
//   });
// };

exports.getCenterCustomerCount = (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate } = req.query;
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorised User!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const getCustCount = `
      SELECT center_id, COUNT(DISTINCT rno) AS total_customers
      FROM ${dairy_table}
      WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
      GROUP BY center_id;
    `;

    connection.query(
      getCustCount,
      [center_id, fromDate, toDate],
      (err, result) => {
        connection.release(); // Always release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        if (result.length === 0) {
          return res.status(204).json({
            custCounts: [],
            status: 204,
            message: "No Customers Available for this Dairy.",
          });
        }

        res.status(200).json({ status: 200, custCounts: result });
      }
    );
  });
};

//-------------------------------------------------------------------------------------------------------->
// center wise setting ----------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.getCenterSetting = (req, res) => {
  const { dairy_id, center_id } = req.user;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    const query =
      center_id === 0
        ? `
          SELECT * 
          FROM setting_Master 
          WHERE dairy_id = ?  
        `
        : `
          SELECT *
          FROM setting_Master 
          WHERE dairy_id = ? AND center_id = ?
        `;
    const params = center_id === 0 ? [dairy_id] : [dairy_id, center_id];

    connection.query(query, params, (err, results) => {
      connection.release(); // Release the connection back to the pool

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching settings" });
      }

      if (results.length === 0) {
        return res
          .status(200)
          .json({ success: true, data: [], message: "Settings not found" });
      }

      return res.status(200).json({ success: true, data: results });
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
// center wise setting ----------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.getOneCenterSetting = (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Database connection error",
      });
    }

    const query = `
      SELECT * 
      FROM setting_Master 
      WHERE dairy_id = ? and center_id = ?
    `;

    connection.query(query, [dairy_id, center_id], (err, results) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({
          status: 500,
          success: false,
          message: "Error fetching settings",
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          status: 404,
          success: true,
          data: [],
          message: "Settings not found",
        });
      }
      res.status(200).json({ status: 200, success: true, data: results });
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
// center wise setting create or update ------------------------------------------------------------------>
//-------------------------------------------------------------------------------------------------------->

exports.updateCenterSetting = (req, res) => {
  const dairy_id = req.user.dairy_id;
  const { id, center_id, ...updateData } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Database connection error",
      });
    }

    if (id) {
      // Directly update without checking existence
      let setClause = [];
      let values = [];

      Object.keys(updateData).forEach((key) => {
        if (key !== "id" && key !== "center_id") {
          setClause.push(`${key} = ?`);
          values.push(updateData[key]);
        }
      });

      if (setClause.length === 0) {
        connection.release();
        return res.status(400).json({
          status: 400,
          success: false,
          message: "No valid fields provided for update",
        });
      }

      const updateQuery = `
        UPDATE setting_Master 
        SET ${setClause.join(", ")}, updatedBy=?, updatedDate=?
        WHERE dairy_id = ? AND center_id = ? AND id = ?
      `;

      values.push(req.user.user_id, new Date(), dairy_id, center_id, id);

      connection.query(updateQuery, values, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing update query: ", err);
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Error updating settings",
          });
        }

        return res.status(200).json({
          status: 200,
          success: true,
          message:
            results.affectedRows > 0
              ? "Settings updated successfully"
              : "No changes made",
          updatedData: updateData,
        });
      });
    } else {
      // Insert new record if `id` is not provided
      const insertData = {
        dairy_id,
        center_id,
        ...updateData,
        updatedBy: req.user.user_id,
        updatedDate: new Date(),
      };
      const insertQuery = `
        INSERT INTO setting_Master (${Object.keys(insertData).join(", ")})
        VALUES (${Object.keys(insertData)
          .map(() => "?")
          .join(", ")})
      `;

      const insertValues = Object.values(insertData);

      connection.query(insertQuery, insertValues, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing insert query: ", err);
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Error inserting settings",
          });
        }

        return res.status(200).json({
          status: 200,
          success: true,
          message: "Settings inserted successfully",
          insertedData: results,
        });
      });
    }
  });
};

//-------------------------------------------------------------------------------------------------------->
// center wise setting create or update (shubham) -------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.updateCenterSetup = (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;
  const { centerid, id, ...formData } = req.body;
  const currentDate = new Date().toISOString().slice(0, 10);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        success: false,
        message: "Database connection error",
      });
    }

    // Dynamic UPDATE
    if (id !== undefined) {
      const fields = [];
      const values = [];

      // Loop through provided keys and build SET clause
      Object.keys(formData).forEach((key) => {
        fields.push(`${key} = ?`);
        let value = formData[key];

        // Handle special parsing
        if (key === "minPayment" || key === "milkRate") {
          value = parseFloat(value) || 0.0;
        } else if (
          typeof value === "string" &&
          (value.toLowerCase() === "null" || value === "")
        ) {
          value = null;
        }

        values.push(value);
      });

      // Add updater info
      fields.push("updatedBy = ?", "updatedDate = ?");
      values.push(user_id, currentDate);

      const updateQuery = `UPDATE setting_Master SET ${fields.join(
        ", "
      )} WHERE id = ?`;
      values.push(id);

      connection.query(updateQuery, values, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing dynamic update query: ", err);
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Error updating settings",
          });
        }

        return res.status(200).json({
          status: 200,
          success: true,
          message:
            results.affectedRows > 0
              ? "Settings updated successfully"
              : "No changes made",
        });
      });
    } else {
      // INSERT remains the same (full insert)
      const {
        milkType,
        previnfo,
        fill_manually,
        whsms,
        print,
        billDays,
        minPayment,
        milkRate,
        pType,
        vSalesms,
        millcoll,
        printmilKcoll,
        salesms,
        printSales,
        vMillcoll,
        cmillcoll,
        noRatesms,
        kgliters,
        collUnit,
      } = formData;

      const parsedMinPayment = parseFloat(minPayment) || 0.0;
      const parsedMilkRate = parseFloat(milkRate) || 0.0;

      const insertQuery = `
        INSERT INTO setting_Master 
        (center_id, dairy_id, milkType, previnfo, fill_manually, whsms, print, millcoll,
          printmilKcoll, vMillcoll, pType, salesms, printSales, vSalesms, KgLitres, cmillcoll, 
          noRatesms, billDays, minPayment, milkRate, collUnit, updatedBy, updatedDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const insertValues = [
        centerid || center_id,
        dairy_id,
        milkType || 0,
        previnfo || null,
        fill_manually || null,
        whsms || 0,
        print || 0,
        millcoll || 0,
        printmilKcoll || 0,
        vMillcoll || 0,
        pType || 0,
        salesms || 0,
        printSales || 0,
        vSalesms || 0,
        kgliters || null,
        cmillcoll || 0,
        noRatesms || 0,
        billDays || 0,
        parsedMinPayment,
        parsedMilkRate,
        collUnit || 0,
        user_id,
        currentDate,
      ];

      connection.query(insertQuery, insertValues, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing insert query: ", err);
          return res.status(500).json({
            status: 500,
            success: false,
            message: "Error inserting settings",
          });
        }

        return res.status(200).json({
          status: 200,
          success: true,
          message: "Settings inserted successfully",
          insertedData: results,
        });
      });
    }
  });
};

// <<<<<<<<<----------------------------- Sangha ---------------------------->>>>>>>>>>>>

//-------------------------------------------------------------------------------------------------------->
// Add new milk sangha ----------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.createMilkSangha = (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;
  const { code, sanghaname, marathiname } = req.body;
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  if ((!code, !sanghaname, !marathiname)) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }

  const date = new Date().toISOString().slice(0, 10);

  const insertQuery = `
        INSERT INTO sangh_master 
        (dairy_id, center_id, code, sangha_name , marathi_name, createdon, createdby)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        message: "Database connection error",
      });
    }

    connection.query(
      insertQuery,
      [dairy_id, center_id, code, sanghaname, marathiname, date, user_id],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing insert query: ", err);
          return res.status(500).json({
            status: 500,
            message: "Error Adding new Sangha!",
          });
        }

        return res.status(200).json({
          status: 200,
          message: "Sangha Added successfully!",
        });
      }
    );
  });
};
//-------------------------------------------------------------------------------------------------------->
// update milk sangha ------------------------------------------------------------------------------------>
//-------------------------------------------------------------------------------------------------------->

exports.updateMilkSangha = (req, res) => {
  const { dairy_id, user_id } = req.user;
  const { id, sanghaname, marathiname } = req.body;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  if ((!id, !sanghaname, !marathiname)) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }

  const date = new Date().toISOString().slice(0, 10);

  const insertQuery = `
        UPDATE sangh_master 
        SET  sangha_name = ? , marathi_name = ? , updatedon = ? , updatedby = ?
        WHERE id = ?
      `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        message: "Database connection error",
      });
    }

    connection.query(
      insertQuery,
      [sanghaname, marathiname, date, user_id, id],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing updating query: ", err);
          return res.status(500).json({
            status: 500,
            message: "Error Updating Sangha Details!",
          });
        }

        return res.status(200).json({
          status: 200,
          message: "Sangha Updated successfully!",
        });
      }
    );
  });
};
//-------------------------------------------------------------------------------------------------------->
// milk sangha list -------------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.listMilkSangha = (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  let fetchQuery;
  let queryParams;

  if (center_id !== 0) {
    fetchQuery = `
      SELECT id, code, sangha_name, marathi_name
      FROM sangh_master
      WHERE dairy_id = ? AND center_id = ?
    `;
    queryParams = [dairy_id, center_id];
  } else {
    fetchQuery = `
    SELECT id, code, sangha_name, marathi_name
    FROM sangh_master
    WHERE dairy_id = ?
  `;
    queryParams = [dairy_id];
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        message: "Database connection error",
      });
    }

    connection.query(fetchQuery, queryParams, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing fetch sangha list query: ", err);
        return res.status(500).json({
          status: 500,
          message: "Error fetching Sangha list!",
        });
      }

      return res.status(200).json({
        status: 200,
        sanghaList: result,
      });
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
// delete milk sangha ------------------------------------------------------------------------------------>
//-------------------------------------------------------------------------------------------------------->

exports.deleteMilkSangha = (req, res) => {
  const { dairy_id } = req.user;
  const { id } = req.query;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "Id required to delete!" });
  }

  const deleteQuery = `
        delete FROM sangh_master 
        WHERE id = ?
      `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        message: "Database connection error",
      });
    }

    connection.query(deleteQuery, [id], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing delete sangha query: ", err);
        return res.status(500).json({
          status: 500,
          message: "Error in deleting Sangha!",
        });
      }

      return res.status(200).json({
        status: 200,
        message: "Sangha Deleted successfully!",
      });
    });
  });
};

//-------------------------------------------------------------------------------------------------------->
// Create Dairy Starting Information ---------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.createDairyInitInfo = (req, res) => {
  const {
    CashOnHandGlcode,
    CashOnHandAmt,
    ClosingDate,
    PLGLCode,
    PreviousPLGLCode,
    TreadingPLGlCode,
    ShareCapitalAmt,
    MilkPurchaseGL,
    MilkSaleGL,
    MilkPurchasePaybleGL,
    MilkSaleRecivableGl,
    AllowSameUserPassing,
    RebateGlCode,
    BankCurrentAccount,
    RoundAmtGL,
    saleincomeGL,
    ArambhiShillakMalGL,
    AkherShillakMal,
    anamatGlcode,
    MilkCommisionAndAnudan,
    ribetIncome,
    ribetExpense,
    milkRateDiff,
    CashOnHandAmt_3,
    chillinggl,
    advGL,
    kirkolmilksale_yene,
    ghutnashgl,
    transportgl,
  } = req.body.formData;

  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const insertQuery = `
        INSERT INTO InitialParameters (
          dairy_id, center_id, CashOnHandGlcode, CashOnHandAmt, ClosingDate, PLGLCode, PreviousPLGLCode,
          TreadingPLGlCode, ShareCapitalAmt, MilkPurchaseGL, MilkSaleGL, MilkPurchasePaybleGL, MilkSaleRecivableGl,
          AllowSameUserPassing, RebateGlCode, BankCurrentAccount, RoundAmtGL, saleincomeGL, ArambhiShillakMalGL,
          AkherShillakMal, anamatGlcode, MilkCommisionAndAnudan, ribetIncome, ribetExpense, milkRateDiff, CashOnHandAmt_3,
          chillinggl, advGL, kirkolmilksale_yene, ghutnashgl, transportgl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

    connection.query(
      insertQuery,
      [
        dairy_id,
        center_id,
        CashOnHandGlcode,
        CashOnHandAmt,
        ClosingDate,
        PLGLCode,
        PreviousPLGLCode,
        TreadingPLGlCode,
        ShareCapitalAmt,
        MilkPurchaseGL,
        MilkSaleGL,
        MilkPurchasePaybleGL,
        MilkSaleRecivableGl,
        AllowSameUserPassing,
        RebateGlCode,
        BankCurrentAccount,
        RoundAmtGL,
        saleincomeGL,
        ArambhiShillakMalGL,
        AkherShillakMal,
        anamatGlcode,
        MilkCommisionAndAnudan,
        ribetIncome,
        ribetExpense,
        milkRateDiff,
        CashOnHandAmt_3,
        chillinggl,
        advGL,
        kirkolmilksale_yene,
        ghutnashgl,
        transportgl,
      ],

      (err, result) => {
        connection.release();
        if (err) {
          console.error("Error inserting record: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Error in inserting data!" });
        }
        return res
          .status(201)
          .json({ status: 201, message: "Record inserted successfully!" });
      }
    );
  });
};

//-------------------------------------------------------------------------------------------------------->
// Update Dairy Starting Information --------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.updateDairyInitInfo = (req, res) => {
  const {
    id,
    CashOnHandGlcode,
    CashOnHandAmt,
    ClosingDate,
    PLGLCode,
    PreviousPLGLCode,
    TreadingPLGlCode,
    ShareCapitalAmt,
    MilkPurchaseGL,
    MilkSaleGL,
    MilkPurchasePaybleGL,
    MilkSaleRecivableGl,
    RebateGlCode,
    BankCurrentAccount,
    RoundAmtGL,
    saleincomeGL,
    ArambhiShillakMalGL,
    AkherShillakMal,
    anamatGlcode,
    MilkCommisionAndAnudan,
    ribetIncome,
    ribetExpense,
    milkRateDiff,
    CashOnHandAmt_3,
    chillinggl,
    advGL,
    kirkolmilksale_yene,
    ghutnashgl,
    transportgl,
  } = req.body.formData;

  const { dairy_id, user_id } = req.user;
  // console.log("hello");
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!id) {
    return res
      .status(400)
      .json({ status: 400, message: "Id required to update data!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const updateQuery = `
        UPDATE InitialParameters
        SET CashOnHandGlcode = ?, CashOnHandAmt = ?, ClosingDate = ?, PLGLCode = ?, PreviousPLGLCode = ?,
          TreadingPLGlCode = ?, ShareCapitalAmt = ?, MilkPurchaseGL = ?, MilkSaleGL = ?, MilkPurchasePaybleGL = ?, MilkSaleRecivableGl = ?,
          RebateGlCode = ?, BankCurrentAccount = ?, RoundAmtGL = ?, saleincomeGL = ?, ArambhiShillakMalGL = ?,
          AkherShillakMal = ?, anamatGlcode = ?, MilkCommisionAndAnudan = ?, ribetIncome = ?, ribetExpense = ?, milkRateDiff = ?,
          CashOnHandAmt_3 = ?, chillinggl = ?, advGL = ?, kirkolmilksale_yene = ?, ghutnashgl = ?, transportgl=?
        WHERE id = ?
      `;

    connection.query(
      updateQuery,
      [
        CashOnHandGlcode,
        CashOnHandAmt,
        ClosingDate,
        PLGLCode,
        PreviousPLGLCode,
        TreadingPLGlCode,
        ShareCapitalAmt,
        MilkPurchaseGL,
        MilkSaleGL,
        MilkPurchasePaybleGL,
        MilkSaleRecivableGl,
        RebateGlCode,
        BankCurrentAccount,
        RoundAmtGL,
        saleincomeGL,
        ArambhiShillakMalGL,
        AkherShillakMal,
        anamatGlcode,
        MilkCommisionAndAnudan,
        ribetIncome,
        ribetExpense,
        milkRateDiff,
        CashOnHandAmt_3,
        chillinggl,
        advGL,
        kirkolmilksale_yene,
        ghutnashgl,
        transportgl,
        id,
      ],
      (err, result) => {
        connection.release();
        if (err) {
          console.error("Error updating record: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Error in updating data!" });
        }
        // console.log("result");
        return res
          .status(200)
          .json({ status: 200, message: "Record updated successfully!" });
      }
    );
  });
};

//-------------------------------------------------------------------------------------------------------->
// Fetch Dairy Starting Information ---------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------------->

exports.fetchDairyInitInfo = (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const fetchQuery =
      "SELECT * FROM InitialParameters WHERE dairy_id = ? AND center_id = ?";

    connection.query(fetchQuery, [dairy_id, center_id], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error fetching record: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Error in fetching data!" });
      }
      const initialInfo = results[0] || {};
      return res.status(200).json({ status: 200, initialInfo });
    });
  });
};
