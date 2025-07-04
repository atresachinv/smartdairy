const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});

//.................................................................
// Create Emp (Admin Route)........................................
//.................................................................

exports.createEmployee = async (req, res) => {
  const {
    date,
    marathi_name,
    emp_name,
    mobile,
    designation,
    salary,
    city,
    tehsil,
    district,
    pincode,
    bankName,
    bank_ac,
    bankIFSC,
    password,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const user_role = req.user.user_role;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res
          .status(500)
          .json({ status: 500, message: "Error starting transaction!" });
      }

      try {
        // Step 1: Find the maximum emp_id and increment it
        const findMaxEmpIdQuery = `SELECT MAX(emp_id) AS maxEmpId FROM employeemaster WHERE dairy_id = ? AND center_id = ?`;

        connection.query(
          findMaxEmpIdQuery,
          [dairy_id, center_id],
          (err, results) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                console.error("Error finding max emp_id: ", err);
                return res
                  .status(500)
                  .json({ status: 500, message: "Database query error" });
              });
            }

            const maxEmpId = results[0].maxEmpId || 0;
            const newEmpId = maxEmpId + 1;

            // Step 2: Insert into employeemaster table
            const createEmployeeQuery = `
            INSERT INTO employeemaster (
              dairy_id, center_id, emp_name, marathi_name, emp_mobile, emp_bankname, emp_accno, emp_ifsc, 
              emp_city, emp_tal, emp_dist, createdon, createdby, designation, salary, pincode, emp_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

            connection.query(
              createEmployeeQuery,
              [
                dairy_id,
                center_id,
                emp_name,
                marathi_name,
                mobile,
                bankName || null,
                bank_ac || null,
                bankIFSC || null,
                city,
                tehsil,
                district,
                date,
                user_role,
                designation,
                salary,
                pincode,
                newEmpId,
              ],
              (err, result) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error(
                      "Error inserting into employeemaster table: ",
                      err
                    );
                    return res
                      .status(500)
                      .json({ status: 500, message: "Database query error" });
                  });
                }

                // Step 3: Insert into users table
                const createUserQuery = `
                INSERT INTO users (
                  username, password, isAdmin, createdon, createdby, designation, 
                  mobile, SocietyCode, center_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
              `;

                connection.query(
                  createUserQuery,
                  [
                    mobile,
                    password,
                    1, // Assuming the user is always an admin by default
                    date,
                    user_role,
                    designation,
                    mobile,
                    dairy_id,
                    center_id,
                  ],
                  (err, result) => {
                    if (err) {
                      return connection.rollback(() => {
                        connection.release();
                        console.error(
                          "Error inserting into users table: ",
                          err
                        );
                        return res.status(500).json({
                          status: 500,
                          message: "Database query error",
                        });
                      });
                    }

                    // Commit transaction after both inserts succeed
                    connection.commit((err) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          console.error("Error committing transaction: ", err);
                          return res.status(500).json({
                            status: 500,
                            message: "Error committing transaction",
                          });
                        });
                      }

                      connection.release();
                      res.status(200).json({
                        status: 200,
                        message: "Employee created successfully!",
                      });
                    });
                  }
                );
              }
            );

            // Remove the cached employee list
            const cacheKey = `employeeList_${dairy_id}_${center_id}`;
            cache.del(cacheKey);
          }
        );
      } catch (error) {
        connection.rollback(() => {
          connection.release();
          console.error("Error processing request: ", error);
          return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
        });
      }
    });
  });
};

//.................................................................
// Find Employee By Code To update ................................
//.................................................................

//v2
exports.findEmpByCode = async (req, res) => {
  const { code } = req.body;
  const { dairy_id, center_id } = req.user;

  if (!code) {
    return res
      .status(400)
      .json({ status: 400, message: "Employee code required!" });
  }

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const deleteEmpQuery = `
      SELECT * FROM employeemaster
      WHERE dairy_id = ? AND center_id = ? AND emp_id = ?
    `;

    connection.query(
      deleteEmpQuery,
      [dairy_id, center_id, code],
      (error, result) => {
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ message: "Error retrieving employee data" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(204)
            .json({ status: 204, message: "Employee Not found!" });
        }
        return res.status(200).json({ status: 200, employee: result[0] });
      }
    );
  });
};

//.................................................................
// Update Emp Info (Admin Route) ..................................
//.................................................................

//v2
exports.updateEmployee = async (req, res) => {
  const {
    code,
    date,
    marathi_name,
    emp_name,
    designation,
    salary,
    city,
    tehsil,
    district,
    pincode,
    bankName,
    bank_ac,
    bankIFSC,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const user_role = req.user.user_role;

  if (
    !code ||
    !date ||
    !marathi_name ||
    !emp_name ||
    !designation ||
    !salary ||
    !city ||
    !tehsil ||
    !district ||
    !pincode
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All field data required!" });
  }

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      // Corrected table name to employeemaster
      const updateEmpQuery = `
        UPDATE employeemaster
        SET
           dairy_id = ?, center_id = ?, emp_name = ?, marathi_name = ?, emp_bankname = ?, emp_accno = ?, emp_ifsc = ?, emp_city = ?, emp_tal = ?, emp_dist = ?, updatedon = ?, updatedby = ?, designation = ?, salary = ?, pincode = ?
        WHERE emp_id = ?
      `;

      connection.query(
        updateEmpQuery,
        [
          dairy_id,
          center_id,
          emp_name,
          marathi_name,
          bankName,
          bank_ac || 0,
          bankIFSC,
          city,
          tehsil,
          district,
          date,
          user_role,
          designation,
          salary,
          pincode,
          code,
        ],
        (error, results) => {
          connection.release();

          if (error) {
            console.error("Error executing query: ", error);
            return res
              .status(500)
              .json({ status: 500, message: "Error updating employee!" });
          }

          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: 404, message: "Employee not found!" });
          }
          // Remove the cached employee list
          const cacheKey = `employeeList_${dairy_id}_${center_id}`;
          cache.del(cacheKey);

          return res
            .status(200)
            .json({ status: 200, message: "Employee updated successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error!" });
    }
  });
};

//.................................................................
// Delete Emp (Admin Route) .......................................
//.................................................................

//v2
exports.deleteEmployee = async (req, res) => {
  const { emp_id } = req.body;
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!emp_id) {
    return res
      .status(400)
      .json({ status: 400, message: "Employee id is required!" });
  }
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const deleteEmpQuery = `
        DELETE FROM employeemaster
        WHERE dairy_id = ? AND center_id = ? AND emp_id = ?
      `;

      connection.query(
        deleteEmpQuery,
        [dairy_id, center_id, emp_id],
        (error, results) => {
          connection.release();

          if (error) {
            console.error("Error executing query: ", error);
            return res
              .status(500)
              .json({ status: 500, message: "Error deleting employee" });
          }

          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: 404, message: "Employee not found" });
          }

          // Remove the cached employee list
          const cacheKey = `employeeList_${dairy_id}_${center_id}`;
          cache.del(cacheKey);

          return res
            .status(200)
            .json({ status: 200, message: "Employee deleted successfully" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// exports.deleteEmployee = async (req, res) => {
//   const { emp_id, mobile } = req.body;
//   const { dairy_id, center_id } = req.user;

//   if (!emp_id || !mobile) {
//     return res
//       .status(400)
//       .json({ status: 400, message: "Employee ID and mobile are required!" });
//   }
//   if (!dairy_id) {
//     return res.status(401).json({ status: 401, message: "Unauthorized User!" });
//   }

//   pool.getConnection((err, connection) => {
//     if (err) {
//       return res
//         .status(500)
//         .json({ status: 500, message: "Database connection error" });
//     }

//     try {
//       const dairy_table = `dailymilkentry_${dairy_id}`;

//       // **Step 1: Check if employee has milk collection records**
//       const checkMilkEntryQuery = `
//         SELECT COUNT(*) AS count FROM ${dairy_table}
//         WHERE center_id = ? AND userid = ?
//       `;

//       connection.query(
//         checkMilkEntryQuery,
//         [center_id, mobile],
//         (error, results) => {
//           if (error) {
//             connection.release();
//             console.error("Error checking milk collection records: ", error);
//             return res.status(500).json({
//               status: 500,
//               message: "Database error while checking records",
//             });
//           }

//           const entryCount = results[0].count;
//           if (entryCount === 0) {
//             // Proceed with deleting the employee
//             const deleteEmpQuery = `
//               DELETE FROM employeemaster
//               WHERE dairy_id = ? AND center_id = ? AND emp_id = ?
//         `;

//             connection.query(
//               deleteEmpQuery,
//               [dairy_id, center_id, emp_id],
//               (deleteError, deleteResults) => {
//                 connection.release();

//                 if (deleteError) {
//                   console.error("Error deleting employee: ", deleteError);
//                   return res.status(500).json({
//                     status: 500,
//                     message: "Error deleting employee",
//                   });
//                 }

//                 if (deleteResults.affectedRows === 0) {
//                   return res
//                     .status(404)
//                     .json({ status: 404, message: "Employee not found" });
//                 }

//                 // **Step 3: Clear cached employee list properly**
//                 const cacheKey = `employeeList_${dairy_id}_${center_id}`;
//                 console.log("Deleting cache for key:", cacheKey);
//                 if (cache.has(cacheKey)) {
//                   cache.del(cacheKey);
//                   console.log("Cache deleted successfully");
//                 } else {
//                   console.log("Cache key not found");
//                 }

//                 return res.status(200).json({
//                   status: 200,
//                   message: "Employee deleted successfully",
//                 });
//               }
//             );
//           } else {
//             return res.status(400).json({
//               status: 400,
//               message:
//                 "Employee has milk collection records. Cannot be deleted!",
//             });
//           }
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res
//         .status(500)
//         .json({ status: 500, message: "Internal server error" });
//     }
//   });
// };

//.................................................................
// Employee List (Admin Route) ....................................
//.................................................................

exports.employeeList = async (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorised User!" });
  }
  // const cacheKey = `employeeList_${dairy_id}_${center_id}`;

  // Check if data exists in cache
  // const cachedData = cache.get(cacheKey);
  // if (cachedData) {
  //   return res.status(200).json({
  //     status: 200,
  //     empList: cachedData,
  //     message: "Employees found!",
  //   });
  // }
  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      let query;
      let queryParams;

      if (center_id === 0) {
        // Query for center_id = 0
        query = `
          SELECT center_id, emp_name, emp_mobile, designation, salary, emp_id
          FROM employeemaster
          WHERE dairy_id = ?
          ORDER BY center_id ASC, emp_id ASC;
        `;
        queryParams = [dairy_id];
      } else {
        // Query for center_id != 0
        query = `
          SELECT center_id, emp_name, emp_mobile, designation, salary, emp_id
          FROM employeemaster
          WHERE dairy_id = ? AND center_id = ?
          ORDER BY emp_id ASC;
        `;
        queryParams = [dairy_id, center_id];
      }

      connection.query(query, queryParams, (error, result) => {
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ status: 500, message: "Error retrieving employee data!" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(204)
            .json({ status: 204, message: "Emplyees not found!" });
        }

        // Store in cache before sending response
        // cache.set(cacheKey, result);

        return res
          .status(200)
          .json({ status: 200, empList: result, message: "Employees found!" });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Unexpected server error!" });
    }
  });
};

//.................................................................
// Employee Details................................................
//.................................................................

exports.employeeDetails = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  // Construct the cache key
  const cacheKey = `employeeList_${dairy_id}_${center_id}`;

  // Check if data is already cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({ empList: cachedData });
  }

  // If cache miss, query the database
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const emplist = `
      SELECT emp_name, emp_mobile, designation, salary, emp_id
      FROM employeemaster
      WHERE dairy_id = ? AND center_id = ?
    `;

      connection.query(emplist, [dairy_id, center_id], (error, result) => {
        connection.release(); // Release connection back to the pool

        if (error) {
          console.error("Error executing query: ", error);
          return res
            .status(500)
            .json({ message: "Error retrieving employee data" });
        }

        // Cache the result for future requests
        cache.set(cacheKey, result);

        // Return the result
        return res.status(200).json({ empList: result });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
