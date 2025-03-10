const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});
const util = require("util");

//..................................................
// Create New Customer (Admin Route)................
//..................................................
// get max customer No -------------------------------------------------->
exports.getMaxCustNo = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const centerid = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const query =
        "SELECT MAX(srno) AS maxCustNo FROM customer WHERE orgid = ? AND centerid = ? AND ctype = 1";

      connection.query(query, [dairy_id, centerid], (error, results) => {
        // Release connection after query execution
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res.status(500).json({ message: "Error executing query" });
        }

        // Fetching maxCustNo from results
        const maxCustNo = results[0]?.maxCustNo || 0; // Use maxCustNo instead of maxCid
        const cust_no = maxCustNo + 1;

        // Return the new customer number
        return res.status(200).json({ cust_no });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

exports.createCustomer = async (req, res) => {
  const {
    cust_name,
    isActive,
    isMember,
    date,
    prefix,
    cust_no,
    marathi_name,
    member_date,
    mobile,
    aadhaar_no,
    caste,
    gender,
    city,
    tehsil,
    district,
    pincode,
    milktype,
    rctype,
    farmerid,
    bankName,
    bank_ac,
    bankIFSC,
    deposit,
    commission,
    rebet,
    transportation,
    h_deposit,
    h_deduction,
    h_allrebet,
    h_sanghrebet,
    h_dairyrebet,
    h_transportation,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const centerid = req.user.center_id;
  const user_role = req.user.user_role;
  const designation = "Customer";
  const isAdmin = "0";
  const formattedCode = String(cust_no).padStart(3, "0");
  const fax = `${prefix}${formattedCode}`;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!req.body) {
    return res
      .status(400)
      .json({ status: 400, message: "All field data required!" });
  }
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
          .json({ status: 500, message: "Error starting transaction" });
      }

      try {
        // Step 1: Get the max cid
        const maxCidQuery = `SELECT MAX(cid) AS maxCid FROM customer`;
        connection.query(maxCidQuery, (err, maxCidResult) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("Error querying maxCid: ", err);
              return res
                .status(500)
                .json({ status: 500, message: "Database query error" });
            });
          }

          const cid = (maxCidResult[0]?.maxCid || 0) + 1; // Calculate new cid

          // Step 2: Insert into customer table
          const createCustomerQuery = `
            INSERT INTO customer (
              cid, cname, Phone, fax, City, tal, dist, cust_accno, createdby, 
              createdon, mobile, isSabhasad, rno, orgid, engName, rcName, 
              centerid, srno, cust_pincode, cust_addhar, cust_farmerid, cust_bankname, 
              cust_ifsc, caste, gender, milktype, sabhasad_date, isActive, deposit, 
              commission, rebet, transportation, h_deposit, h_deduction, h_allrebet, 
              h_sanghrebet, h_dairyrebet, h_transportation , ctype , isdeleted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

          connection.query(
            createCustomerQuery,
            [
              cid,
              cust_name,
              mobile,
              fax,
              city,
              tehsil,
              district,
              bank_ac,
              user_role,
              date,
              mobile,
              isMember,
              fax,
              dairy_id,
              marathi_name,
              rctype || null,
              centerid,
              cust_no,
              pincode,
              aadhaar_no || null,
              farmerid || null,
              bankName || null,
              bankIFSC || null,
              caste || null,
              gender,
              milktype,
              member_date,
              isActive,
              deposit,
              commission,
              rebet,
              transportation,
              h_deposit,
              h_deduction,
              h_allrebet,
              h_sanghrebet,
              h_dairyrebet,
              h_transportation,
              1,
              0,
            ],
            (err, result) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error("Error inserting into customer table: ", err);
                  return res
                    .status(500)
                    .json({ status: 500, message: "Database query error" });
                });
              }

              // Step 3: Insert into users table
              const createUserQuery = `
              INSERT INTO users (
                username, password, isAdmin, createdon, createdby, designation, 
                pincode, mobile, SocietyCode, pcode, center_id
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

              connection.query(
                createUserQuery,
                [
                  fax,
                  mobile,
                  isAdmin,
                  date,
                  user_role,
                  designation,
                  pincode,
                  mobile,
                  dairy_id,
                  cid,
                  centerid,
                ],
                (err, result) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error("Error inserting into users table: ", err);
                      return res
                        .status(500)
                        .json({ status: 500, message: "Database query error" });
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
                      message: "Customer created successfully!",
                    });
                  });
                }
              );
            }
          );
        });
        // Remove the cached customer list
        const cacheKey = `customerList_${dairy_id}_${centerid}`;
        cache.del(cacheKey);
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

//..................................................
// Update Customer Info (Admin Route) Active........
//..................................................

//....................admin.........................

exports.updateCustomer = async (req, res) => {
  const {
    cid,
    cust_name,
    isActive,
    isMember,
    marathi_name,
    member_date,
    mobile,
    aadhaar_no,
    caste,
    gender,
    city,
    tehsil,
    district,
    pincode,
    milktype,
    rctype,
    farmerid,
    bankName,
    bank_ac,
    bankIFSC,
    deposit,
    commission,
    rebet,
    transportation,
    h_deposit,
    h_deduction,
    h_allrebet,
    h_sanghrebet,
    h_dairyrebet,
    h_transportation,
  } = req.body;

  const { dairy_id, center_id } = req.user;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const updateCustomerQuery = `
        UPDATE customer
        SET
           cname = ?, isActive = ?, isSabhasad = ?, engName = ?, sabhasad_date = ?, Phone = ?, cust_addhar = ?, caste = ?, gender = ?, City = ?, tal = ?, dist = ?, cust_pincode = ?, milktype = ?, rcName = ?, cust_farmerid = ?, cust_bankname = ?, cust_accno = ?, cust_ifsc = ?, deposit = ?, commission = ?, rebet = ?, transportation = ?, h_deposit = ?, h_deduction = ?, h_allrebet = ?, h_sanghrebet = ?, h_dairyrebet = ?, h_transportation = ?
        WHERE cid = ?
      `;

      connection.query(
        updateCustomerQuery,
        [
          cust_name,
          isActive,
          isMember,
          marathi_name,
          member_date,
          mobile,
          aadhaar_no,
          caste,
          gender,
          city,
          tehsil,
          district,
          pincode,
          milktype,
          rctype,
          farmerid,
          bankName,
          bank_ac,
          bankIFSC,
          deposit,
          commission,
          rebet,
          transportation,
          h_deposit,
          h_deduction,
          h_allrebet,
          h_sanghrebet,
          h_dairyrebet,
          h_transportation,
          cid,
        ],
        (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
            console.error("Error executing query: ", error);
            return res
              .status(500)
              .json({ status: 500, message: "Error updating customer" });
          }

          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ status: 404, message: "Customer not found" });
          }

          return res
            .status(200)
            .json({ status: 200, message: "Customer updated successfully" });
        }
      );
      // Remove the cached customer list
      const cacheKey = `customerList_${dairy_id}_${center_id}`;
      cache.del(cacheKey);
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//..............................................................
//Fetch Customers List .........................................
//..............................................................

exports.customerList = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  const cacheKey = `customerList_${dairy_id}_${center_id}`;
  // Check if data exists in cache
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.status(200).json({
      status: 200,
      customerList: cachedData,
      message: "Customers found!",
    });
  }

  // SQL Query for retrieving customers
  const getCustList =
    center_id === 0
      ? `SELECT cid, cname, Phone, fax, City, tal, dist, cust_accno, createdby, createdon, mobile,
              isSabhasad, rno, orgid, engName, rateChartNo, centerid, srno, cust_pincode,
              cust_addhar, cust_farmerid, cust_bankname, cust_ifsc, caste, gender, milktype, isActive, rcName
       FROM customer
       WHERE orgid = ? AND (ctype IS NULL OR ctype = 1) AND (isdeleted IS NULL OR isdeleted = 0)
       ORDER BY centerid ASC, srno ASC`
      : `SELECT cid, cname, Phone, fax, City, tal, dist, cust_accno, createdby, createdon, mobile,
              isSabhasad, rno, orgid, engName, rateChartNo, centerid, srno, cust_pincode,
              cust_addhar, cust_farmerid, cust_bankname, cust_ifsc, caste, gender, milktype, isActive, rcName
       FROM customer
       WHERE orgid = ? AND centerid = ? AND (ctype IS NULL OR ctype = 1) AND (isdeleted IS NULL OR isdeleted = 0)`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const params = center_id === 0 ? [dairy_id] : [dairy_id, center_id];

      connection.query(getCustList, params, (err, result) => {
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Error fetching customer list" });
        }

        // Store in cache before sending response
        cache.set(cacheKey, result);

        return res.status(200).json({
          status: 200,
          customerList: result,
          message: "Customer list retrieved successfully",
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    } finally {
      connection.release(); // Ensure connection is always released
    }
  });
};

//..................................................
// Get list of unique RateCharts....................
//..................................................

exports.uniqueRchartList = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const geturcList = `
       SELECT DISTINCT rcName FROM customer WHERE orgid = ? AND centerid = ?
      `;

      connection.query(geturcList, [dairy_id, center_id], (err, result) => {
        connection.release(); // Release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err); // Correct error reference
          return res
            .status(500)
            .json({ message: "Error fetching customer list" });
        }

        return res.status(200).json({
          uniqueRCList: result,
          message: "Unique ratechart name list retrieved successfully",
        });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//..................customer........................

//..................................................
// Delete Customer Info (Admin Route)...............
//..................................................

exports.deleteCustomer = async (req, res) => {
  const { cid } = req.body;
  const { dairy_id, center_id } = req.user;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const isdeleted = "1";
      const udeletequery = `
        UPDATE customer
        SET
          isdeleted = ?,      
        WHERE cid = ?
      `;

      connection.query(udeletequery, [isdeleted, cid], (error, results) => {
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res.status(500).json({ message: "Error deleting customer" });
        }

        if (results.affectedRows === 0) {
          return res.status(404).json({ message: "Customer not found" });
        }

        return res
          .status(200)
          .json({ message: "Customer deleted successfully" });
      });
      // Remove the cached customer list
      const cacheKey = `customerList_${dairy_id}_${center_id}`;
      cache.del(cacheKey);
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

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

// ---------------------------------------------------------------------->
// Upload customers from Excel ------------------------------------------>
// ---------------------------------------------------------------------->

// new customer excel upload function ------------------------------------>

exports.uploadExcelCustomer = async (req, res) => {
  const { excelData, prefix } = req.body;
  const dairy_id = req.user.dairy_id;
  const centerid = req.user.center_id;
  const user_role = req.user.user_role;
  const designation = "Customer";
  const isAdmin = "0";

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!excelData || excelData.length === 0) {
    return res
      .status(400)
      .json({ status: 400, message: "Excel data required!" });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    const query = util.promisify(connection.query).bind(connection);

    try {
      await query("START TRANSACTION");

      for (const customer of excelData) {
        const {
          Code,
          Customer_Name,
          Marathi_Name,
          Mobile,
          Addhar_No,
          Farmer_Id,
          City,
          Tehsil,
          District,
          Pincode,
          Bank_Name,
          Bank_AccNo,
          Bank_IFSC,
          Caste,
          Gender,
          Animal_Type,
          Ratechart_Type,
        } = customer;

        const formattedCode = String(Code).padStart(3, "0");
        const fax = `${prefix}${formattedCode}`;
        const isMember = 0;
        const member_date = new Date();
        const isActive = 1;
        const createdOn = new Date();
        const animal = Animal_Type === "Buffalo" ? "1" : "0";

        // Check if customer exists
        const existingCustomer = await query(
          `SELECT cid FROM customer WHERE orgid = ? AND centerid = ? AND srno = ? AND ctype = 1`,
          [dairy_id, centerid, Code]
        );

        if (existingCustomer.length > 0) {
          // Customer exists, update records
          const customerId = existingCustomer[0].cid;

          await query(
            `UPDATE customer 
            SET cname=?, engName=?, Phone=?, City=?, tal=?, dist=?, cust_accno=?, mobile=?, cust_pincode=?,
                cust_addhar=?, cust_farmerid=?, cust_bankname=?, cust_ifsc=?, caste=?, gender=?, milktype=?, rcName=? 
            WHERE cid=?`,
            [
              Customer_Name,
              Marathi_Name,
              Mobile,
              City,
              Tehsil,
              District,
              Bank_AccNo || null,
              Mobile,
              Pincode,
              Addhar_No || null,
              Farmer_Id || null,
              Bank_Name || null,
              Bank_IFSC || null,
              Caste || null,
              Gender || 0,
              animal || 0,
              Ratechart_Type || null,
              customerId,
            ]
          );

          await query(
            `UPDATE users 
            SET username=?, password=?, isAdmin=?, createdon=?, createdby=?, designation=?, pincode=?, mobile=?, SocietyCode=?, pcode=?, center_id=? 
            WHERE pcode=?`,
            [
              fax,
              Mobile,
              isAdmin,
              createdOn,
              user_role,
              designation,
              Pincode,
              Mobile,
              dairy_id,
              customerId,
              centerid,
              customerId,
            ]
          );
        } else {
          // Customer does not exist, create a new one
          const customerid =
            (await query("SELECT MAX(cid) AS maxCid FROM customer"))[0]
              ?.maxCid + 1 || 1;
          const cType = 1;

          await query(
            `INSERT INTO customer (
              cid, ctype, cname, Phone, fax, City, tal, dist, cust_accno, createdby, createdon, mobile,
              isSabhasad, rno, orgid, engName, centerid, srno, cust_pincode, cust_addhar, cust_farmerid,
              cust_bankname, cust_ifsc, caste, gender, milktype, sabhasad_date, isActive, rcName
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              customerid,
              cType,
              Customer_Name,
              Mobile,
              fax,
              City,
              Tehsil,
              District,
              Bank_AccNo,
              user_role,
              createdOn,
              Mobile,
              isMember,
              fax,
              dairy_id,
              Marathi_Name,
              centerid,
              Code,
              Pincode,
              Addhar_No || null,
              Farmer_Id || null,
              Bank_Name || null,
              Bank_IFSC || null,
              Caste || null,
              Gender || 0,
              animal || 0,
              member_date || createdOn,
              isActive,
              Ratechart_Type || null,
            ]
          );

          await query(
            `INSERT INTO users (
              username, password, isAdmin, createdon, createdby, designation,
              pincode, mobile, SocietyCode, pcode, center_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              fax,
              Mobile,
              isAdmin,
              createdOn,
              user_role,
              designation,
              Pincode,
              Mobile,
              dairy_id,
              customerid,
              centerid,
            ]
          );
        }
      }

      await query("COMMIT");
      connection.release();

      // Remove cached customer list
      const cacheKey = `customerList_${dairy_id}_${centerid}`;
      cache.del(cacheKey);

      return res.status(200).json({
        status: 200,
        message: "Customers processed successfully!",
      });
    } catch (error) {
      await query("ROLLBACK");
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

// ---------------------------------------------------------------------->
// Profile Info --------------------------------------------------------->
// ---------------------------------------------------------------------->

//v2 function
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

      // Check if the profileInfo is already in the cache
      const cachedProfile = cache.get(`profile_${user_id}`);
      if (cachedProfile) {
        return res.status(200).json({ profileInfo: cachedProfile });
      }

      const profileInfoQuery = `SELECT cname, City, cust_pincode, mobile, cust_addhar, cust_farmerid, cust_bankname, cust_accno, cust_ifsc, srno FROM customer WHERE fax =?`;

      connection.query(profileInfoQuery, [user_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing summary query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }
        const profileInfo = result[0];
        // Store the profileInfo in the cache with a unique key
        cache.set(`profile_${user_id}`, profileInfo);
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

exports.milkcollReport = async (req, res) => {
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

      const milkcollDataQuery = `
          SELECT 
             ReceiptDate, ME, CB, Litres, fat, snf, Rate, Amt
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ?
        ORDER BY ReceiptDate ASC;
      `;

      connection.query(
        milkcollDataQuery,
        [fromDate, toDate, user_code],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ records: result });
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

// ..................................................
// Download Customer List Upload Excel Format .......
// ..................................................

exports.downloadExcelFormat = async (req, res) => {
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

// -------------------------------------------------------------------------------------------->
// Dev Pramod ------------------------------------>
// -------------------------------------------------------------------------------------------->

//get max dealer no
exports.getMaxDealNo = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const centerid = req.user.center_id;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const query =
        "SELECT MAX(srno) AS maxCustNo FROM customer WHERE orgid = ? AND centerid = ? AND ctype=?";

      connection.query(query, [dairy_id, centerid, 2], (error, results) => {
        // Release connection after query execution
        connection.release();

        if (error) {
          console.error("Error executing query: ", error);
          return res.status(500).json({ message: "Error executing query" });
        }

        // Fetching maxCustNo from results
        const maxCustNo = results[0]?.maxCustNo || 0; // Use maxCustNo instead of maxCid
        const cust_no = maxCustNo + 1;

        // Return the new customer number
        return res.status(200).json({ cust_no });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//create a new dealer controller -------------------------------------------------------------->
exports.createDealer = async (req, res) => {
  const {
    cust_name,
    cust_no,
    marathi_name,
    mobile,
    district,
    city,
    pincode,
    bankName,
    bank_ac,
    bankIFSC,
  } = req.body;

  const { dairy_id, center_id: centerid, user_role } = req.user;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Transaction start error:", err);
        return res.status(500).json({ message: "Error starting transaction" });
      }

      // Step 1: Get the next cid
      const maxCidQuery = "SELECT MAX(cid) AS maxCid FROM customer";
      connection.query(maxCidQuery, (err, maxCidResult) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error fetching maxCid:", err);
            return res.status(500).json({ message: "Database query error" });
          });
        }

        const cid = (maxCidResult[0]?.maxCid || 0) + 1;

        // Step 2: Insert into customer table
        const createDealerQuery = `
          INSERT INTO customer (
            cid, cname, Phone, City, dist, cust_accno, createdby, 
            createdon, mobile, orgid, engName, centerid, srno, 
            cust_pincode, cust_bankname, cust_ifsc, isActive, ctype , isdeleted
          ) VALUES (?, ?, ? ,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?)
        `;
        const dealerData = [
          cid,
          cust_name,
          mobile,
          city,
          district,
          bank_ac,
          user_role,
          new Date(),
          mobile,
          dairy_id,
          marathi_name,
          centerid,
          cust_no,
          pincode,
          bankName,
          bankIFSC,
          1,
          2,
          0,
        ];

        connection.query(createDealerQuery, dealerData, (err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("Error inserting dealer:", err);
              return res
                .status(500)
                .json({ message: "Error creating dealer record" });
            });
          }

          // Step 3: Fetch the newly created dealer
          const fetchCreatedDealerQuery =
            "SELECT * FROM customer WHERE cid = ?";
          connection.query(
            fetchCreatedDealerQuery,
            [cid],
            (err, dealerResult) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  console.error("Error fetching created dealer:", err);
                  return res
                    .status(500)
                    .json({ message: "Error fetching dealer record" });
                });
              }

              // Step 4: Commit transaction
              connection.commit((commitErr) => {
                if (commitErr) {
                  return connection.rollback(() => {
                    connection.release();
                    console.error("Error committing transaction:", commitErr);
                    return res
                      .status(500)
                      .json({ message: "Error committing transaction" });
                  });
                }

                // Success
                connection.release();
                res.status(200).json({
                  message: "Dealer created successfully!",
                  dealer: dealerResult[0],
                });
              });
            }
          );
        });
      });
    });
  });
};

//-------------------------------------------------------------------------------------------->
// create a new dealer controller ------------------------------------------------------------>
//-------------------------------------------------------------------------------------------->

exports.dealerList = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      // Check for unauthorized access
      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Unauthorized User!" });
      }

      const getCustList = `
        SELECT * FROM customer
        WHERE orgid = ? AND centerid = ? AND ctype=2 AND (isdeleted IS NULL OR isdeleted != 1);
      `;

      connection.query(getCustList, [dairy_id, center_id], (err, result) => {
        connection.release(); // Always release the connection after query execution

        if (err) {
          console.error("Error executing query: ", err); // Correct error reference
          return res
            .status(500)
            .json({ message: "Error fetching customer list" });
        }

        return res.status(200).json({
          customerList: result, // Return the entire result array
          message: "Customer list retrieved successfully", // Updated message
        });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// update delaer controller fun
exports.updateDealer = async (req, res) => {
  const { id, cname, Phone, City, cust_ifsc, dist, cust_accno } = req.body;

  const { dairy_id, center_id } = req.user;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const updateDealerQuery = `
        UPDATE customer
        SET 
          cname = ?, 
          Phone = ?, 
          City = ?, 
          cust_ifsc = ?, 
          dist = ?, 
          cust_accno = ?
        WHERE  orgid = ? AND centerid = ? AND id = ?
      `;

      connection.query(
        updateDealerQuery,
        [
          cname,
          Phone,
          City,
          cust_ifsc,
          dist,
          cust_accno,
          dairy_id,
          center_id,
          id,
        ],
        (error, results) => {
          connection.release(); // Release the connection back to the pool

          if (error) {
            console.error("Error executing query: ", error);
            return res
              .status(500)
              .json({ message: "Error updating dealer", success: false });
          }

          if (results.affectedRows === 0) {
            return res
              .status(404)
              .json({ message: "Dealer not found", success: false });
          }

          return res
            .status(200)
            .json({ message: "Dealer updated successfully", success: true });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ message: "Internal server error", success: false });
    }
  });
};

// ----------------------------------------------------------------------------------->

exports.deleteCustomer = async (req, res) => {
  const { cid } = req.body;

  const { dairy_id, center_id } = req.user;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    try {
      const isdeleted = 1;
      const udeletequery = `
        UPDATE customer
        SET
          isdeleted = ?
        WHERE orgid = ? AND centerid = ? AND cid = ?
      `;

      connection.query(
        udeletequery,
        [isdeleted, dairy_id, center_id, cid],
        (error, results) => {
          connection.release();

          if (error) {
            console.error("Error executing query: ", error);
            return res.status(500).json({ message: "Error deleting customer" });
          }

          if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Customer not found" });
          }
          // Remove the cached customer list
          const cacheKey = `customerList_${dairy_id}_${center_id}`;
          cache.del(cacheKey);
          return res
            .status(200)
            .json({ message: "Customer deleted successfully" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
