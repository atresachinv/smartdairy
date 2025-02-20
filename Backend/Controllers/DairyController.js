const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});
const axios = require("axios");

// ................................................
// Create New Dairy User...........................
// ................................................

//.................................................
//Dairy info ......................................
//.................................................

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

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

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

//--------------------------------------------------------------------------------------------------------->
// Whats app  message send--------------------------------------------------------------------------------->
//--------------------------------------------------------------------------------------------------------->

exports.sendMessage = async (req, res) => {
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
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error Details:",
      error.response ? error.response.data : error.message
    );
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
};
