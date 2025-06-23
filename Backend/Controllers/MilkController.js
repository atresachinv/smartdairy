const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const util = require("util");

//------------------------------------------------------------------------------------------------------------------->
//Cusomer Details
//------------------------------------------------------------------------------------------------------------------->
exports.custDetails = async (req, res) => {
  const { user_code } = req.body;
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  if (!user_code) {
    return res
      .status(400)
      .json({ status: 400, message: "User code Required!" });
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
      const getCustname = `SELECT cid, cname, rateChartNo, ratecharttype, rcdate FROM customer WHERE srno = ? AND orgid = ?, center_id = ?`;

      connection.query(
        getCustname,
        [user_code, dairy_id, center_id],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          // Check if result is empty (no customer found)
          if (result.length === 0) {
            return res
              .status(404)
              .json({ status: 404, message: "Customer details not found!" });
          }

          // Proceed if customer details are found
          const custdetails = result[0];
          res.status(200).json({
            status: 200,
            custdetails,
            message: "Customers details found!",
          });
        }
      );
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error!" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Save Milk Collection Settings
//------------------------------------------------------------------------------------------------------------------->

exports.saveMilkCollSetting = async (req, res) => {
  const {
    milkType,
    prevFat,
    prevSnf,
    prevDeg,
    manLiters,
    manFat,
    manSnf,
    manDeg,
    sms,
    print,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (
    !milkType ||
    !prevFat ||
    !prevSnf ||
    !prevDeg ||
    !manLiters ||
    !manFat ||
    !manSnf ||
    !manDeg ||
    !sms ||
    !print
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
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

    const saveMilkCollSettingQuery = `
      INSERT INTO collectionsettings 
        (dairy_id, center_id, milkType, prevFat, prevSnf, prevDeg, manLiters, manFat, manSnf, manDeg, sms, print) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      saveMilkCollSettingQuery,
      [
        dairy_id,
        center_id,
        milkType,
        prevFat,
        prevSnf,
        prevDeg,
        manLiters,
        manFat,
        manSnf,
        manDeg,
        sms,
        print,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error!" });
        }
        if (results.affectedRows === 0) {
          return res.status(400).json({
            status: 400,
            message: "Milk collection settings failed to save!",
          });
        }

        res.status(200).json({
          status: 200,
          message: "Milk Collection Settings Saved Successfully!",
        });
      }
    );
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Update Milk Collection Settings
//------------------------------------------------------------------------------------------------------------------->

exports.updateMilkCollSetting = async (req, res) => {
  const {
    milkType,
    prevFat,
    prevSnf,
    prevDeg,
    manLiters,
    manFat,
    manSnf,
    manDeg,
    sms,
    print,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (
    !milkType ||
    !prevFat ||
    !prevSnf ||
    !prevDeg ||
    !manLiters ||
    !manFat ||
    !manSnf ||
    !manDeg ||
    !sms ||
    !print
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All field data required!" });
  }

  if (!dairy_id) {
    return res.status(400).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const updateMilkCollSettingQuery = `
      UPDATE collectionsettings 
      SET milkType = ?, prevFat = ?, prevSnf = ?, prevDeg = ?, manLiters = ?, manFat = ?, manSnf = ?, manDeg = ?, sms = ?, print = ?
      WHERE dairy_id = ? AND center_id = ?
    `;

    connection.query(
      updateMilkCollSettingQuery,
      [
        milkType,
        prevFat,
        prevSnf,
        prevDeg,
        manLiters,
        manFat,
        manSnf,
        manDeg,
        sms,
        print,
        dairy_id,
        center_id,
      ],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error!" });
        }

        if (results.affectedRows === 0) {
          return res.status(400).json({
            status: 400,
            message: "failed to update milk collection settings!",
          });
        }

        res.status(200).json({
          status: 200,
          message: "Milk Collection Settings Updated Successfully!",
        });
      }
    );
  });
};

//------------------------------------------------------------------------------------------------------------------->
// get Regular customer previous 10 days
//------------------------------------------------------------------------------------------------------------------->

exports.fetchRegCustomers = async (req, res) => {
  const { collDate, ME } = req.query;
  const { dairy_id, center_id } = req.user;

  if (!collDate) {
    return res
      .status(400)
      .json({ status: 400, message: "All field data required!" });
  }

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  const collDateObj = new Date(collDate);
  const fromDateObj = new Date(collDateObj);
  fromDateObj.setDate(collDateObj.getDate() - 10);

  const toDate = collDateObj.toISOString().split("T")[0];
  const fromDate = fromDateObj.toISOString().split("T")[0];

  const dairy_table = `dailymilkentry_${dairy_id}`;

  const query = `
    SELECT DISTINCT d.rno, d.cname, c.Phone 
    FROM ${dairy_table} d
    JOIN customer c ON d.rno = c.srno
    WHERE d.ReceiptDate BETWEEN ? AND ?
      AND d.center_id = ?
      AND c.orgid = ?
      AND c.centerid = ?
      AND c.ctype = 1
      AND d.rno NOT IN (
          SELECT rno 
          FROM ${dairy_table}
          WHERE ReceiptDate = ? AND ME = ? AND center_id = ?
      )
  `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    connection.query(
      query,
      [fromDate, toDate, center_id, dairy_id, center_id, toDate, ME, center_id],
      (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error!" });
        }
        res.status(200).json({
          status: 200,
          regularCustomers: results,
          message: "Fetched Regular Customers Successfully!",
        });
      }
    );
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Save Milk Collection (slot wise entry)
//------------------------------------------------------------------------------------------------------------------->

exports.milkCollection = async (req, res) => {
  const { milkColl } = req.body;

  const dairy_id = req.user.dairy_id;
  const user_role = req.user.user_role;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Unauthorized User!" });
  }

  if (!Array.isArray(milkColl) || milkColl.length === 0) {
    return res
      .status(400)
      .json({ status: 400, message: "Milk collection data required!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;

  // SQL query for bulk inserting entries
  const milkCollectionQuery = `
    INSERT INTO ${dairy_table} 
    (companyid, userid, ReceiptDate, ME, CB, Litres, snf, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id) 
    VALUES ?
  `;

  // Prepare the values array for bulk insertion
  const values = milkColl.map((entry) => {
    const {
      date,
      code,
      time,
      animal,
      liters,
      fat,
      snf,
      amt,
      degree,
      rate,
      cname,
      acccode,
    } = entry;

    // Validate fields are present and have correct types; handle rounding if needed
    if (
      !date ||
      !time ||
      !animal ||
      liters == null ||
      fat == null ||
      snf == null ||
      amt == null ||
      degree == null ||
      rate == null ||
      !cname ||
      !code ||
      !acccode
    ) {
      throw new Error("Each milk entry must have all required fields.");
    }

    return [
      dairy_id,
      user_role,
      date,
      time,
      animal,
      parseFloat(liters).toFixed(2),
      parseFloat(fat).toFixed(1),
      parseFloat(snf).toFixed(1),
      parseFloat(amt).toFixed(2),
      "28",
      acccode,
      parseFloat(degree).toFixed(1),
      parseFloat(rate).toFixed(2),
      cname,
      code,
      center_id,
    ];
  });

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
          .json({ status: 500, message: "Transaction error!" });
      }

      // Execute bulk insert query with values
      connection.query(milkCollectionQuery, [values], (err, results) => {
        if (err) {
          return connection.rollback(() => {
            connection.release();
            console.error("Error executing query: ", err);
            res.status(500).json({
              status: 500,
              message: "Error saving milk collection entries!",
            });
          });
        }

        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res
                .status(500)
                .json({ status: 500, message: "Transaction commit error!" });
            });
          }

          connection.release();
          res.status(200).json({
            status: 200,
            message: "All milk entries saved successfully!",
            insertedRecords: results.affectedRows,
          });
        });
      });
    });
  });
};

//------------------------------------------------------------------------------------------------------------------->
// currently working Save Milk Collection (single entry)
//------------------------------------------------------------------------------------------------------------------->

exports.milkCollectionOneEntry = async (req, res) => {
  const {
    date,
    code,
    shift,
    animal,
    liters,
    fat,
    snf,
    amt,
    rcName,
    degree,
    rate,
    cname,
    acccode,
    allow,
  } = req.body;

  const { dairy_id, center_id, user_id, user_role } = req.user;

  if (
    !date ||
    !code ||
    !liters ||
    !fat ||
    !snf ||
    !amt ||
    !rcName ||
    !rate ||
    !cname ||
    !acccode
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are required!" });
  }

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
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
      const dairy_table = `dailymilkentry_${dairy_id}`;

      // If `allow` is false, check if entry already exists
      if (!allow) {
        const checkMilkCollectionQuery = `
          SELECT COUNT(rno) AS count 
          FROM ${dairy_table} 
          WHERE center_id = ? AND ReceiptDate = ? AND ME = ? AND CB = ? AND rno = ? AND isDeleted = 0
        `;

        const existingEntry = await query(checkMilkCollectionQuery, [
          center_id,
          date,
          shift,
          animal,
          code,
        ]);

        if (existingEntry[0].count > 0) {
          connection.release();
          return res.status(400).json({
            status: 400,
            message: "Duplicate entry! Milk collection already exists.",
          });
        }
      }

      const userid = user_role !== "milkcollector" ? user_role : user_id;

      // Insert milk collection entry
      const insertMilkCollectionQuery = `
        INSERT INTO ${dairy_table} 
        (userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, rctype, GLCode, AccCode, Digree, rate, cname, rno, center_id) 
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await query(insertMilkCollectionQuery, [
        userid,
        date,
        shift,
        animal,
        liters,
        fat,
        snf,
        amt,
        rcName,
        "28", // Default GLCode
        acccode,
        degree,
        rate,
        cname,
        code,
        center_id,
      ]);
      connection.release();
      res.status(200).json({
        status: 200,
        message: "Milk entry saved successfully!",
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error!" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Save Previous Milk Collection
//------------------------------------------------------------------------------------------------------------------->

//get rate from rate chart and calculate amount

exports.getRateAmount = (req, res) => {
  const { rccode, rcdate, fat, snf, time, animal, liters } = req.body;

  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if ((!rccode, !rcdate || !fat || !snf || !time || !animal || !liters)) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields data required!" });
  }
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const getRateAmt = `
    SELECT rate FROM mysql_4234_inventory11.ratemaster WHERE companyid = ? AND center_id = ? AND rcdate <= ? AND fat = ? AND snf = ? AND ME = ? AND CB = ? ORDER BY rcdate DESC LIMIT 1
  `;
    // in query
    // rcdate is lessthan or equal to ratechartdate

    connection.query(
      getRateAmt,
      [dairy_id, center_id, rccode, rcdate, fat, snf, time, animal],
      (err, results) => {
        connection.release(); // Always release the connection back to the pool

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error" });
        }

        if (results.length === 0) {
          return res.status(404).json({
            status: 400,
            message: "Rate not found for the provided parameters.",
          });
        }

        const rate = results[0].rate;

        // Ensure 'liters' is a number
        const litersNumber = parseFloat(liters);
        if (isNaN(litersNumber)) {
          return res
            .status(400)
            .json({ status: 400, message: "Invalid value for liters." });
        }

        const amt = litersNumber * parseFloat(rate);

        res.status(200).json({ status: 200, rate: parseFloat(rate), amt });
      }
    );
  });
};

//------------------------------------------------------------------------------------------------------------------->

exports.PreviousMilkCollection = async (req, res) => {
  const {
    code,
    date,
    time,
    animal,
    liters,
    fat,
    snf,
    amt,
    degree,
    rate,
    cname,
    acccode,
  } = req.body;

  const dairy_id = req.user.dairy_id;
  const user_role = req.user.user_role;
  const center_id = req.user.center_id;

  if (
    !code ||
    !date ||
    !time ||
    !animal ||
    !liters ||
    !fat ||
    !snf ||
    !amt ||
    !degree ||
    !rate ||
    !cname ||
    !acccode
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "All fileds required!" });
  }
  if (!dairy_id) {
    return res.status(400).json({ status: 401, message: "Unauthorized User!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id)
        // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          date,
          time,
          animal,
          liters,
          fat,
          snf,
          amt,
          "28", // GLCode
          acccode,
          degree,
          rate,
          cname,
          code,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }
          res
            .status(200)
            .json({ status: 200, message: "Milk entry saved successfully!" });
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

//------------------------------------------------------------------------------------------------------------------->
// Upload Previous Milk Collection Excel
//------------------------------------------------------------------------------------------------------------------->

exports.UploadPreviousMilkCollection = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
//  Previous Milk Collection List
//------------------------------------------------------------------------------------------------------------------->

exports.PreviousMilkCollectionList = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Get the current hour to determine AM or PM
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Prepare the SQL query
      const milkcollection = `
        INSERT INTO ${dairy_table} 
        (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [
          dairy_id,
          user_role,
          currentDate,
          time,
          animal,
          liters,
          "28", // GLCode
          acccode,
          cname,
          code,
          "1",
          sample,
          center_id,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({ message: "Milk entry saved successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// //------------------------------------------------------------------------------------------------------------------->
// // Save Previous Milk Collection
// //------------------------------------------------------------------------------------------------------------------->

// //get rate from rate chart and calculate amount....................................................................

// exports.getRateAmount = (req, res) => {
//   const { rccode, rcdate, fat, snf, time, animal, liters } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }

//     const dairy_id = req.user.dairy_id;
//     const center_id = req.user.center_id;

//     if (!dairy_id) {
//       connection.release();
//       return res.status(400).json({ message: "Dairy ID not found!" });
//     }

//     const getRateAmt = `
//     SELECT rate
//     FROM mysql_4234_inventory11.ratemaster
//     WHERE companyid = ? AND center_id = ? AND rcdate <= ? AND fat = ? AND snf = ? AND ME = ? AND CB = ?
//     ORDER BY rcdate DESC LIMIT 1
//   `;
//     // in query
//     // rcdate is lessthan or equal to ratechartdate

//     connection.query(
//       getRateAmt,
//       [dairy_id, center_id, rccode, rcdate, fat, snf, time, animal],
//       (err, results) => {
//         connection.release(); // Always release the connection back to the pool

//         if (err) {
//           console.error("Error executing query: ", err);
//           return res.status(500).json({ message: "Query execution error" });
//         }

//         if (results.length === 0) {
//           return res
//             .status(404)
//             .json({ message: "Rate not found for the provided parameters." });
//         }

//         const rate = results[0].rate;

//         // Ensure 'liters' is a number
//         const litersNumber = parseFloat(liters);
//         if (isNaN(litersNumber)) {
//           return res.status(400).json({ message: "Invalid value for liters." });
//         }

//         const amt = litersNumber * parseFloat(rate);

//         res.status(200).json({ rate: parseFloat(rate), amt });
//       }
//     );
//   });
// };

// //.................................................................................................................

// exports.PreviousMilkCollection = async (req, res) => {
//   const {
//     code,
//     date,
//     time,
//     animal,
//     liters,
//     fat,
//     snf,
//     amt,
//     degree,
//     rate,
//     cname,
//     acccode,
//   } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }

//     try {
//       const dairy_id = req.user.dairy_id;
//       const user_role = req.user.user_role;
//       const center_id = req.user.center_id;

//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }

//       const dairy_table = `dailymilkentry_${dairy_id}`;

//       //       // Get the current date in YYYY-MM-DD format
//       //       const currentDate = new Date().toISOString().split("T")[0];
//       //
//       //       // Get the current hour to determine AM or PM
//       //       const currentHour = new Date().getHours();
//       //       const time = currentHour < 12 ? 0 : 1;

//       // Prepare the SQL query
//       const milkcollection = `
//         INSERT INTO ${dairy_table}
//         (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, Amt, GLCode, AccCode, Digree, rate, cname, rno, center_id)
//         // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       // Execute the query
//       connection.query(
//         milkcollection,
//         [
//           dairy_id,
//           user_role,
//           date,
//           time,
//           animal,
//           liters,
//           fat,
//           snf,
//           amt,
//           "28", // GLCode
//           acccode,
//           degree,
//           rate,
//           cname,
//           code,
//           center_id,
//         ],
//         (err, result) => {
//           connection.release();

//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//           res.status(200).json({ message: "Milk entry saved successfully!" });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

// //------------------------------------------------------------------------------------------------------------------->
// // Upload Previous Milk Collection Excel
// //------------------------------------------------------------------------------------------------------------------->

// exports.UploadPreviousMilkCollection = async (req, res) => {
//   const { code, animal, liters, cname, sample, acccode } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }

//     try {
//       const dairy_id = req.user.dairy_id;
//       const user_role = req.user.user_role;
//       const center_id = req.user.center_id;

//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }

//       const dairy_table = `dailymilkentry_${dairy_id}`;

//       // Get the current date in YYYY-MM-DD format
//       const currentDate = new Date().toISOString().split("T")[0];

//       // Get the current hour to determine AM or PM
//       const currentHour = new Date().getHours();
//       const time = currentHour < 12 ? 0 : 1;

//       // Prepare the SQL query
//       const milkcollection = `
//         INSERT INTO ${dairy_table}
//         (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       // Execute the query
//       connection.query(
//         milkcollection,
//         [
//           dairy_id,
//           user_role,
//           currentDate,
//           time,
//           animal,
//           liters,
//           "28", // GLCode
//           acccode,
//           cname,
//           code,
//           "1",
//           sample,
//           center_id,
//         ],
//         (err, result) => {
//           connection.release();

//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//           res.status(200).json({ message: "Milk entry saved successfully!" });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

// //------------------------------------------------------------------------------------------------------------------->
// //  Previous Milk Collection List
// //------------------------------------------------------------------------------------------------------------------->

// exports.PreviousMilkCollectionList = async (req, res) => {
//   const { code, animal, liters, cname, sample, acccode } = req.body;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting MySQL connection: ", err);
//       return res.status(500).json({ message: "Database connection error" });
//     }

//     try {
//       const dairy_id = req.user.dairy_id;
//       const user_role = req.user.user_role;
//       const center_id = req.user.center_id;

//       if (!dairy_id) {
//         connection.release();
//         return res.status(400).json({ message: "Dairy ID not found!" });
//       }

//       const dairy_table = `dailymilkentry_${dairy_id}`;

//       // Get the current date in YYYY-MM-DD format
//       const currentDate = new Date().toISOString().split("T")[0];

//       // Get the current hour to determine AM or PM
//       const currentHour = new Date().getHours();
//       const time = currentHour < 12 ? 0 : 1;

//       // Prepare the SQL query
//       const milkcollection = `
//         INSERT INTO ${dairy_table}
//         (companyid, userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;

//       // Execute the query
//       connection.query(
//         milkcollection,
//         [
//           dairy_id,
//           user_role,
//           currentDate,
//           time,
//           animal,
//           liters,
//           "28", // GLCode
//           acccode,
//           cname,
//           code,
//           "1",
//           sample,
//           center_id,
//         ],
//         (err, result) => {
//           connection.release();

//           if (err) {
//             console.error("Error executing query: ", err);
//             return res.status(500).json({ message: "Query execution error" });
//           }
//           res.status(200).json({ message: "Milk entry saved successfully!" });
//         }
//       );
//     } catch (error) {
//       connection.release();
//       console.error("Error processing request: ", error);
//       return res.status(500).json({ message: "Internal server error" });
//     }
//   });
// };

//---------------------------------------------------------------------------------------->
// Save Mobile Milk Collection (single entry) -------------------------------------------->

//v3 function ---------------------
exports.mobileMilkCollection = async (req, res) => {
  const { code, animal, liters, cname, sample, acccode, allow } = req.body;

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      const user = req.user.user_id;

      if (!dairy_id) {
        connection.release();
        return res
          .status(400)
          .json({ status: 400, message: "Dairy ID not found!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      const currentDate = new Date().toISOString().split("T")[0];
      const currentHour = new Date().getHours();
      const time = currentHour < 12 ? 0 : 1;

      // Promisify queries
      const query = util.promisify(connection.query).bind(connection);

      // Check if entry already exists (only if allow is false)
      if (!allow) {
        const checkMilkCollectionQuery = `
          SELECT COUNT(rno) AS count 
          FROM ${dairy_table} 
          WHERE center_id = ? AND ReceiptDate = ? AND ME = ? AND CB = ? AND rno = ?
        `;

        const existingEntry = await query(checkMilkCollectionQuery, [
          center_id,
          currentDate,
          time,
          animal,
          code,
        ]);

        if (existingEntry[0].count > 0) {
          connection.release();
          return res.status(409).json({
            status: 409,
            message: "Duplicate entry! Milk collection already exists.",
          });
        }
      }

      // Insert new milk collection entry
      const milkCollectionQuery = `
        INSERT INTO ${dairy_table} 
        (userid, ReceiptDate, ME, CB, Litres, GLCode, AccCode, cname, rno, Driver, SampleNo, center_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      await query(milkCollectionQuery, [
        user,
        currentDate,
        time,
        animal,
        liters,
        "28", // GLCode
        acccode,
        cname,
        code,
        "1",
        sample,
        center_id,
      ]);

      connection.release();
      res
        .status(200)
        .json({ status: 200, message: "Milk entry saved successfully!" });
    } catch (error) {
      connection.release();
      console.error("Error processing request:", error);
      res.status(500).json({ status: 500, message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// fetch Mobile Milk Collection (for mobile collector)
//------------------------------------------------------------------------------------------------------------------->

//v2 function
exports.fetchMobileMilkColl = async (req, res) => {
  const { date } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user = req.user.user_id;
      const center_id = req.user.center_id;
      // Check if dairy_id, user_role, and center_id are available
      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Missing required fields" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query without the trailing comma and ensure `date` is currentDate
      const milkcollReport = `
        SELECT ReceiptDate, Litres, cname, rno, SampleNo, ME
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? AND userid = ?
      `;

      // Execute the query
      connection.query(
        milkcollReport,
        [center_id, date, user],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // If there are no records for the given day, send an empty result with a success status
          if (result.length === 0) {
            return res.status(200).json({ mobileMilk: [] }); // Return empty array instead of 404
          }
          res.status(200).json({ mobileMilk: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Fetch code & Liter to Show prev
//------------------------------------------------------------------------------------------------------------------->

//v2 function
exports.fetchPrevLiters = async (req, res) => {
  const { date } = req.query;

  // If no date is provided, return an error
  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  // Convert the date to one day earlier
  const adjustToPreviousDate = (inputDate) => {
    const parsedDate = new Date(inputDate);
    parsedDate.setDate(parsedDate.getDate() - 1);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const previousDate = adjustToPreviousDate(date);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user = req.user.user_id;
      const center_id = req.user.center_id;

      // Check if dairy_id, user, and center_id are available
      if (!dairy_id || !user || !center_id) {
        connection.release();
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Determine the current shift (ME: 0 for Morning, 1 for Evening)
      const currentHour = new Date().getHours();
      const ME = currentHour < 12 ? 0 : 1;

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const prevliterReport = `
        SELECT rno, Litres 
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? AND userid = ? AND ME = ?
      `;

      // Execute the query
      connection.query(
        prevliterReport,
        [center_id, previousDate, user, ME],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // If no records are found, return an empty result
          if (result.length === 0) {
            return res.status(200).json({ PrevLiters: [] });
          }

          res.status(200).json({ PrevLiters: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// (Update) fetch Mobile Milk Collection to complete milk collection
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
exports.fetchMobileMilkCollection = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  // Check if dairy_id, user_role, and center_id are available
  if (!dairy_id) {
    connection.release();
    return res.status(400).json({ message: "Missing required fields" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const milkcollReport = `
        SELECT userid, Litres, cname, rno, SampleNo , ME
        FROM ${dairy_table}
        WHERE ReceiptDate = ?  AND center_id = ? AND isDeleted = 0  AND Driver = 1 
        ORDER BY id ASC
      `;

      // Execute the query
      connection.query(
        milkcollReport,
        [currentDate, center_id],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          if (result.length === 0) {
            return res.status(200).json({ mobileMilkcoll: [] }); // Return empty array instead of 404
          }
          res.status(200).json({ mobileMilkcoll: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};
//------------------------------------------------------------------------------------------------------------------->
// Update Mobile Milk Collection
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
exports.updateMobileCollection = async (req, res) => {
  const { code, fat, snf, amt, degree, rate, acccode, sample } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const user_role = req.user.user_role;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // // Get the current hour to determine AM or PM
      // const currentHour = new Date().getHours();
      // const time = currentHour < 12 ? 0 : 1;

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const updatemilkcollection = `
         UPDATE ${dairy_table}
          SET  fat = ?,  snf = ?,  Amt = ?,  GLCode = ?,  AccCode = ?,  Digree = ?,  rate = ?,  updatedOn = ?,  UpdatedBy = ? , Driver = 2 
          WHERE center_id = ? AND  rno = ? AND  SampleNo = ? 
      `;

      // Execute the query
      connection.query(
        updatemilkcollection,
        [
          fat,
          snf,
          amt,
          "28", // GLCode
          acccode,
          degree,
          rate,
          currentDate,
          user_role,
          center_id,
          code,
          sample,
        ],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res
            .status(200)
            .json({ message: "Milk collection updated successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Milk Collection Report (use to Fillter) and to show on dashboard
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
exports.allMilkCollReport = async (req, res) => {
  const { fromDate, toDate } = req.query;
  const { dairy_id, center_id, user_id, user_role } = req.user;
  if (!dairy_id) {
    return res
      .status(400)
      .json({ message: "Dairy ID not found in the request!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      // const userid = user_role !== "milkcollector" ? user_role : user_id;

      let milkCollectionQuery = `
        SELECT id, userid, ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno, AccCode, center_id, rctype
        FROM ${dairy_table}
        WHERE ReceiptDate BETWEEN ? AND ? AND isDeleted = 0
        `;

      const values = [fromDate, toDate];

      if (center_id !== 0) {
        milkCollectionQuery += " AND center_id = ?";
        values.push(center_id);
      }

      if (user_role === "milkcollector") {
        milkCollectionQuery += " AND userid = ?";
        values.push(user_id);
      }

      milkCollectionQuery += " ORDER BY ReceiptDate ASC";

      connection.query(milkCollectionQuery, values, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            milkcollection: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ milkcollection: results });
      });
    } catch (err) {
      connection.release();
      console.error("Unexpected error: ", err.message);
      res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Milk Collection of MilkCollector (for admin)
//------------------------------------------------------------------------------------------------------------------->

//v2 function // updated isDeleted --> 23/4/25
exports.allMilkCollection = async (req, res) => {
  const { fromDate, toDate } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        return res
          .status(400)
          .json({ message: "Dairy ID not found in the request!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;
      let milkCollectionQuery;
      let queryParams;

      if (center_id === 0) {
        // Query for center_id = 0
        milkCollectionQuery = `
          SELECT 
            id , userid, ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno, SampleNo
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND isDeleted = 0 AND Driver IN (0, 1)
        `;
        queryParams = [fromDate, toDate];
      } else {
        // Query for center_id != 0
        milkCollectionQuery = `
          SELECT 
           id, userid, ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno, SampleNo
          FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ? AND isDeleted = 0 AND Driver IN (0, 1)
        `;
        queryParams = [center_id, fromDate, toDate];
      }

      connection.query(milkCollectionQuery, queryParams, (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            milkCollectorcoll: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ milkCollectorcoll: results });
      });
    } catch (err) {
      connection.release();
      console.error("Unexpected error: ", err.message);
      res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Fetch dairy Milk Collection Report
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
exports.todaysMilkCollReport = async (req, res) => {
  const { date } = req.query; // Read from `req.query`

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err.message);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      if (!dairy_id) {
        return res
          .status(400)
          .json({ message: "Dairy ID not found in the request!" });
      }

      const dairy_table = `dailymilkentry_${dairy_id}`;

      const todaysMilkQuery = `
        SELECT 
          ReceiptDate, ME, CB, Litres, fat, snf, rate, Amt, cname, rno
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? AND isDeleted = 0
      `;

      connection.query(todaysMilkQuery, [center_id, date], (err, results) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err.message);
          return res.status(500).json({ message: "Error executing query" });
        }

        if (results.length === 0) {
          return res.status(200).json({
            todaysmilk: [],
            message: "No record found!",
          });
        }

        res.status(200).json({ todaysmilk: results });
      });
    } catch (err) {
      connection.release();
      console.error("Unexpected error: ", err.message);
      res.status(500).json({ message: "Unexpected server error" });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Fetch dairy Milk Collection Report Customer Wise
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
exports.custWiseMilkCReort = async (req, res) => {
  const { fromDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    const queries = {
      morning: `
        SELECT fat, snf, rate, Litres, Amt 
        FROM dailymilkentry_102 
        WHERE ReceiptDate BETWEEN ? AND ? AND ME = 0 AND dairy_id = ? AND center_id = ? AND isDeleted = 0
      `,
      evening: `
        SELECT fat, snf, rate, Litres, Amt 
        FROM dailymilkentry_102  
        WHERE ReceiptDate BETWEEN ? AND ? AND ME = 1 AND dairy_id = ? AND center_id = ? AND isDeleted = 0
      `,
      total: `
        SELECT SUM(Litres) AS totalLitres, COUNT(DISTINCT AccCode) AS totalCustomers, SUM(Amt) AS totalAmount
        FROM dailymilkentry_102  
        WHERE ReceiptDate BETWEEN ? AND ? AND dairy_id = ? AND center_id = ? AND isDeleted = 0
      `,
    };

    const queryParams = [fromDate, toDate, dairy_id, center_id];

    Promise.all([
      connection.query(queries.morning, queryParams),
      connection.query(queries.evening, queryParams),
      connection.query(queries.total, queryParams),
    ])
      .then(([morningResults, eveningResults, totalResults]) => {
        connection.release();
        const totalData = totalResults[0] || {
          totalLitres: 0,
          totalCustomers: 0,
          totalAmount: 0,
        };

        res.status(200).json({
          morningData: morningResults,
          eveningData: eveningResults,
          totalMilk: totalData.totalLitres,
          totalCustomers: totalData.totalCustomers,
          totalAmount: totalData.totalAmount,
          message: "Data Found!",
        });
      })
      .catch((err) => {
        connection.release();
        console.error("Error executing queries: ", err);
        res.status(500).json({ message: "Server error" });
      });
  });
};

//------------------------------------------------------------------------------------------------------------------->
// todays milk report for Admin
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
exports.todaysReport = async (req, res) => {
  const { formDate, toDate } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    const morningQuery = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM dailymilkentry_102 
      WHERE ReceiptDate BETWEEN ? AND ? AND ME = 0 AND dairy_id = ? AND center_id = ? AND isDeleted = 0
    `;
    const eveningQuery = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM dailymilkentry_102 
      WHERE ReceiptDate BETWEEN ? AND ? AND ME = 1 AND dairy_id = ? AND center_id = ? AND isDeleted = 0
    `;
    const totalMilkQuery = `
      SELECT SUM(Litres) AS totalLitres, COUNT(DISTINCT AccCode) AS totalCustomers, SUM(Amt) AS totalAmount
      FROM dailymilkentry_102 
      WHERE ReceiptDate = ? AND isDeleted = 0
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

//------------------------------------------------------------------------------------------------------------------->
// milk report for customer
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
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
        WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ? AND isDeleted = 0;
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
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ? AND isDeleted = 0
          ORDER BY ReceiptDate ASC;
        `;

          const summaryQuery = `
          SELECT 
            SUM(Litres) AS totalLiters,
            AVG(fat) AS avgFat,
            AVG(snf) AS avgSNF,
            SUM(Amt) AS totalAmount
          FROM ${dairy_table}
          WHERE ReceiptDate BETWEEN ? AND ? AND AccCode = ? AND isDeleted = 0;
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

//------------------------------------------------------------------------------------------------------------------->
// Dashboard Info Admin
//------------------------------------------------------------------------------------------------------------------->
// updated isDeleted --> 23/4/25
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
              WHERE ReceiptDate BETWEEN ? AND ? AND isDeleted = 0
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

//------------------------------------------------------------------------------------------------------------------->
// Complete Milk Collection Report
//------------------------------------------------------------------------------------------------------------------->

// updated isDeleted --> 23/4/25
exports.completedMilkReport = async (req, res) => {
  const { date, time } = req.query;

  // If no date is provided, return an error
  if (!date) {
    return res.status(400).json({ message: "Date is required" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;

      // Check if dairy_id, user, and center_id are available
      if (!dairy_id || !center_id) {
        connection.release();
        return res.status(400).json({ message: "Missing required fields" });
      }

      // // Determine the current shift (ME: 0 for Morning, 1 for Evening)
      // const currentHour = new Date().getHours();
      // const ME = currentHour < 12 ? 0 : 1;

      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare the SQL query
      const completedCollReport = `
        SELECT ReceiptDate, ME, rno, Litres, fat, snf, cname, rate, Amt, CB 
        FROM ${dairy_table}
        WHERE center_id = ? AND ReceiptDate = ? AND ME = ? AND isDeleted = 0 AND Driver = 2
      `;

      // Execute the query
      connection.query(
        completedCollReport,
        [center_id, date, time],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }

          // If no records are found, return an empty result
          if (result.length === 0) {
            return res.status(200).json({ PrevLiters: [] });
          }

          res.status(200).json({ compCollection: result });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//------------------------------------------------------------------------------------//
//<<<<<<<<<<<<<<<<<<<<<<<<<-------Retail Milk sales-------->>>>>>>>>>>>>>>>>>>>>>>>>>>//
//------------------------------------------------------------------------------------//

//-------------------------------------------------------------------------------------------------->
// create retail customer  ------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------->

exports.createRetailCustomer = async (req, res) => {
  const { code, cname, mobile, advance } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      const user = req.user.user_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];

      // Prepare the SQL query
      const milkcollection = `
      INSERT INTO retailsales_customers 
      (dairy_id, center_id, code , cust_name , mobile , advance , createdby ,createdon)
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // Execute the query
      connection.query(
        milkcollection,
        [dairy_id, center_id, code, cname, mobile, advance, user, currentDate],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Query execution error" });
          }
          res
            .status(200)
            .json({ message: "Retail milk customer created successfully!" });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------->
// create retail customer  ------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------->

exports.getRetailCustomer = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;

  if (!dairy_id) {
    return res.status(400).json({ message: "Dairy ID not found!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    // SQL query to fetch retail customers
    const query = `
      SELECT id, code, cust_name, mobile, advance 
      FROM retailsales_customers 
      WHERE dairy_id = ? AND center_id = ?
    `;

    connection.query(query, [dairy_id, center_id], (err, result) => {
      connection.release(); // Ensure connection is released

      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({ message: "Query execution error" });
      }

      if (result.length === 0) {
        return res
          .status(404)
          .json({ retailcust: [], message: "No retail customers found!" });
      }
      res.status(200).json({
        retailcust: result,
        message: "Retail customers retrieved successfully!",
      });
    });
  });
};

//-------------------------------------------------------------------------------------------------->
// Retail milk sales ------------------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------->

// v2 version ----------->>>
exports.RetailMilkCollection = async (req, res) => {
  const {
    id,
    code,
    cname,
    liters,
    rate,
    amt,
    paidamt,
    credit_amt,
    rem_adv,
    paymode,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      const user = req.user.user_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Get the current date in YYYY-MM-DD format
      const currentDate = new Date().toISOString().split("T")[0];
      const insertCode = code && code !== "" ? parseInt(code, 10) : 0;
      const insertLiters = parseFloat(liters) || 0;
      const time = new Date().getHours() < 12 ? 0 : 1;

      // **UPDATE Query for rem_adv (Advance) if applicable**
      const updateQuery = `UPDATE retailsales_customers SET advance = ? WHERE id = ?`;

      // **INSERT Query for milk collection**
      const milkcollection = `
        INSERT INTO retail_milk_sales 
        (dairy_id, center_id, code, cust_name, liters, rate, amt, paidamt, credit_amt, rem_advance, paymode, saleby, saledate, saletime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      // **Execute UPDATE Query First if rem_adv > 0**
      if (rem_adv === 0 || rem_adv > 0) {
        connection.query(
          updateQuery,
          [rem_adv, id],
          (updateErr, updateResult) => {
            if (updateErr) {
              connection.release();
              console.error("Error updating advance: ", updateErr);
              return res
                .status(500)
                .json({ message: "Failed to update advance" });
            }

            // **Proceed with INSERT Query after UPDATE completes**
            connection.query(
              milkcollection,
              [
                dairy_id,
                center_id,
                insertCode,
                cname,
                insertLiters,
                rate,
                amt,
                paidamt || 0.0,
                credit_amt || 0.0,
                rem_adv,
                paymode,
                user,
                currentDate,
                time,
              ],
              (insertErr, insertResult) => {
                connection.release();

                if (insertErr) {
                  console.error("Error executing query: ", insertErr);
                  return res
                    .status(500)
                    .json({ message: "Query execution error" });
                }

                res
                  .status(200)
                  .json({ message: "Milk entry saved successfully!" });
              }
            );
          }
        );
      } else {
        // **Directly execute INSERT if no rem_adv update is needed**
        connection.query(
          milkcollection,
          [
            dairy_id,
            center_id,
            insertCode,
            cname,
            insertLiters,
            rate,
            amt,
            paidamt || 0.0,
            credit_amt || 0.0,
            rem_adv,
            paymode,
            user,
            currentDate,
            time,
          ],
          (insertErr, insertResult) => {
            connection.release();

            if (insertErr) {
              console.error("Error executing query: ", insertErr);
              return res.status(500).json({ message: "Query execution error" });
            }

            res.status(200).json({ message: "Milk entry saved successfully!" });
          }
        );
      }
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

//-------------------------------------------------------------------------------------------------->
// Retail milk report for mobile milk collector ---------------------------------------------------->
//-------------------------------------------------------------------------------------------------->

exports.retailMilkReports = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const dairy_id = req.user.dairy_id;
      const center_id = req.user.center_id;
      const user = req.user.user_id;

      if (!dairy_id) {
        connection.release();
        return res.status(400).json({ message: "Dairy ID not found!" });
      }

      // Get the current date in YYYY-MM-DD format
      // const currentDate = new Date().toISOString().split("T")[0];

      // Prepare the SQL query
      const salesreport = `
      SELECT code , liters , rate , amt , saletime ,saledate
      FROM retail_milk_sales
        WHERE dairy_id = ? AND center_id = ? AND saledate = ? , saleby = ?
      `;

      // Execute the query
      connection.query(
        salesreport,
        [dairy_id, center_id, date, user],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error executing query: ", err);
            return res.status(500).json({ message: "Query execution error" });
          }
          res.status(200).json({
            message: "Milk entry saved successfully!",
            retailSales: result,
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

//-------------------------------------------------------------------------------------------------->
// Retail milk report centerwise ------------------------------------------------------------------->
//-------------------------------------------------------------------------------------------------->

//v2
exports.centerReMilkReports = async (req, res) => {
  const { fromdate, todate } = req.query;

  if (!fromdate || !todate) {
    return res
      .status(400)
      .json({ message: "Both fromdate and todate are required!" });
  }

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

      // Construct the SQL query
      let milkcollection;
      let queryParams = [dairy_id, fromdate, todate];

      if (center_id && center_id !== "0") {
        milkcollection = `
          SELECT center_id, code, cust_name, liters, rate, amt, paidamt, credit_amt, paymode, saletime, saleby
          FROM retail_milk_sales
          WHERE dairy_id = ? AND center_id = ? AND saledate BETWEEN ? AND ?
        `;
        queryParams.splice(1, 0, center_id); // Insert center_id in the second position
      } else {
        milkcollection = `
          SELECT center_id, code,cust_name, liters, rate, amt, paidamt, credit_amt, paymode, saletime, saleby
          FROM retail_milk_sales
          WHERE dairy_id = ? AND saledate BETWEEN ? AND ?
        `;
      }

      // Execute the query
      connection.query(milkcollection, queryParams, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }
        res.status(200).json({
          message: "Milk collection data retrieved successfully!",
          retailCenterSales: result,
        });
      });
    } catch (error) {
      connection.release();
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// ----------------------------------------------------------------------------------------------->
// Upload milk collection from excel or csv file ------------------------------------------------->
// ----------------------------------------------------------------------------------------------->

exports.uploadMilkCollection = async (req, res) => {
  const { dairy_id, center_id, user_role } = req.user;
  const { milkData } = req.body;
  if (!dairy_id || !user_role) {
    return res.status(401).json({ status: 401, message: "Unauthorised User!" });
  }

  if (!Array.isArray(milkData) || milkData.length === 0) {
    return res
      .status(400)
      .json({ status: 400, message: "No milk data received" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("DB connection error:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    try {
      const dairy_table = `dailymilkentry_${dairy_id}`;

      // Prepare insert data
      const values = milkData.map((row) => [
        dairy_id,
        user_role,
        row["दिनांक"],
        parseInt(row["सत्र"]),
        parseInt(row["पशु"]),
        parseFloat(row["लिटर"]),
        parseFloat(row["फॅट"]),
        parseFloat(row["एस एन एफ"]),
        "28",
        parseFloat(row["दर"]),
        parseFloat(row["रक्कम"]),
        row["नाव"],
        parseInt(row["कोड"]),
        "Cow",
        center_id,
      ]);

      const insertQuery = `
        INSERT INTO ${dairy_table}
        (companyid, userid, ReceiptDate, ME, CB, Litres, fat, snf, GLCode, rate, Amt, cname, rno,rctype, center_id)
        VALUES ?
      `;
      connection.query(insertQuery, [values], (err, result) => {
        connection.release();

        if (err) {
          console.error("Query execution error:", err);
          return res
            .status(500)
            .json({ status: 500, message: "Error inserting milk data" });
        }
        return res.status(201).json({
          status: 201,
          message: "Milk data uploaded successfully!",
        });
      });
    } catch (error) {
      connection.release();
      console.error("Server error:", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    }
  });
};

//---------------------------------------------------------------------------------------------------------//
//<<<<<<<<<<<<<<<<<<<<<<<<<------- FAT SNF TADJOD KG to LITER Converter -------->>>>>>>>>>>>>>>>>>>>>>>>>>>//
//---------------------------------------------------------------------------------------------------------//

//------------------------------------------------------------------------------------------------------------------->
// Update General 3.5 FAT to all Milk Collection of perticular master  and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateFatGeneral = async (req, res, next) => {
  const { fromDate, toDate, fat } = req.query;
  const { dairy_id, center_id, user_role } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!fromDate || !toDate || !fat) {
    return res.status(400).json({
      status: 400,
      message:
        "fromDate, toDate and fat data is required to update milk collection!",
    });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const dairy_table = `dailymilkentry_${dairy_id}`;
  const batchSize = 300;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const fetchEntries = (offset) => {
      return new Promise((resolve, reject) => {
        const selectQuery = `
          SELECT id, fat FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
          ORDER BY id ASC
          LIMIT ? OFFSET ?
        `;

        connection.query(
          selectQuery,
          [center_id, fromDate, toDate, batchSize, offset],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    };

    const updateBatch = (ids) => {
      return new Promise((resolve, reject) => {
        if (ids.length === 0) return resolve(); // Nothing to update
        const placeholders = ids.map(() => "?").join(",");

        const updateQuery = `
          UPDATE ${dairy_table}
          SET fat = ?, updatedOn = ?, UpdatedBy = ?
          WHERE id IN (${placeholders})
        `;

        connection.query(
          updateQuery,
          [fat, currentDate, user_role, ...ids],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    };

    const processBatches = async () => {
      try {
        let offset = 0;
        while (true) {
          const rows = await fetchEntries(offset);
          if (rows.length === 0) break;

          const ids = rows.map((row) => row.id);
          await updateBatch(ids);

          if (rows.length < batchSize) break; // Done if last batch is smaller than 300
          offset += batchSize;
        }

        connection.release();
        res.status(200).json({
          status: 200,
          message: "Milk collection updated in batches successfully!",
        });

        // Pass data to next middleware
        req.body = {
          rcfromdate: fromDate,
          rctodate: toDate,
          custFrom,
          custTo,
        };
        next();
      } catch (err) {
        connection.release();
        console.error("Batch processing error: ", err);
        res
          .status(500)
          .json({ status: 500, message: "Error during batch update" });
      }
    };

    processBatches();
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Update Difference eg. -0.1 FAT to all Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateFatDifference = async (req, res) => {
  const { fromDate, toDate, fatDiff } = req.query;
  const { dairy_id, center_id, user_role } = req.user;

  const fatDifference = parseFloat(fatDiff);

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!fromDate || !toDate || isNaN(fatDifference)) {
    return res.status(400).json({
      status: 400,
      message: "fromDate, toDate and numeric fatDiff are required!",
    });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const dairy_table = `dailymilkentry_${dairy_id}`;
  const batchSize = 300;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("DB Connection Error: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const fetchEntries = (offset) => {
      return new Promise((resolve, reject) => {
        const selectQuery = `
          SELECT id, fat FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
          ORDER BY id ASC
          LIMIT ? OFFSET ?
        `;
        connection.query(
          selectQuery,
          [center_id, fromDate, toDate, batchSize, offset],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    };

    const updateFatValues = (entries) => {
      return new Promise((resolve, reject) => {
        if (entries.length === 0) return resolve();

        const updates = entries.map(({ id, fat }) => {
          const newFat = Math.max(0, parseFloat(fat) + fatDifference); // avoid negative fat
          return [newFat, currentDate, user_role, id];
        });

        const updateQuery = `
          UPDATE ${dairy_table}
          SET fat = ?, updatedOn = ?, UpdatedBy = ?
          WHERE id = ?
        `;

        // Execute update one by one
        let processed = 0;
        for (const params of updates) {
          connection.query(updateQuery, params, (err) => {
            if (err) return reject(err);
            processed++;
            if (processed === updates.length) resolve(); // done all
          });
        }
      });
    };

    const processBatches = async () => {
      try {
        let offset = 0;
        while (true) {
          const rows = await fetchEntries(offset);
          if (rows.length === 0) break;

          await updateFatValues(rows);

          if (rows.length < batchSize) break;
          offset += batchSize;
        }

        connection.release();
        res.status(200).json({
          status: 200,
          message: "Fat values updated with difference successfully!",
        });

        // Pass data to next middleware
        req.body = {
          rcfromdate: fromDate,
          rctodate: toDate,
          custFrom,
          custTo,
        };
        next();
      } catch (err) {
        connection.release();
        console.error("Batch update error: ", err);
        res
          .status(500)
          .json({ status: 500, message: "Failed to update fat in batches" });
      }
    };

    processBatches();
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Update last master FAT to Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateFatToLastFat = async (req, res) => {};

//------------------------------------------------------------------------------------------------------------------->
// Update General 3.5 SNF to all Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateSnfGeneral = async (req, res, next) => {
  const { fromDate, toDate, snf } = req.query;
  const { dairy_id, center_id, user_role } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!fromDate || !toDate || !snf) {
    return res.status(400).json({
      status: 400,
      message:
        "fromDate, toDate and snf data is required to update milk collection!",
    });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const dairy_table = `dailymilkentry_${dairy_id}`;
  const batchSize = 300;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const fetchEntries = (offset) => {
      return new Promise((resolve, reject) => {
        const selectQuery = `
          SELECT id, snf FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
          ORDER BY id ASC
          LIMIT ? OFFSET ?
        `;

        connection.query(
          selectQuery,
          [center_id, fromDate, toDate, batchSize, offset],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    };

    const updateBatch = (ids) => {
      return new Promise((resolve, reject) => {
        if (ids.length === 0) return resolve(); // Nothing to update
        const placeholders = ids.map(() => "?").join(",");

        const updateQuery = `
          UPDATE ${dairy_table}
          SET snf = ?, updatedOn = ?, UpdatedBy = ?
          WHERE id IN (${placeholders})
        `;

        connection.query(
          updateQuery,
          [snf, currentDate, user_role, ...ids],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    };

    const processBatches = async () => {
      try {
        let offset = 0;
        while (true) {
          const rows = await fetchEntries(offset);
          if (rows.length === 0) break;

          const ids = rows.map((row) => row.id);
          await updateBatch(ids);

          if (rows.length < batchSize) break; // Done if last batch is smaller than 300
          offset += batchSize;
        }

        connection.release();
        res.status(200).json({
          status: 200,
          message: "Milk collection updated in batches successfully!",
        });

        // Pass data to next middleware
        req.body = {
          rcfromdate: fromDate,
          rctodate: toDate,
          custFrom,
          custTo,
        };
        next();
      } catch (err) {
        connection.release();
        console.error("Batch processing error: ", err);
        res
          .status(500)
          .json({ status: 500, message: "Error during batch update" });
      }
    };

    processBatches();
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Update Difference eg. -0.1 FAT to all Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateSnfDifference = async (req, res) => {
  const { fromDate, toDate, fatDiff } = req.query;
  const { dairy_id, center_id, user_role } = req.user;

  const fatDifference = parseFloat(fatDiff);

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!fromDate || !toDate || isNaN(fatDifference)) {
    return res.status(400).json({
      status: 400,
      message: "fromDate, toDate and numeric fatDiff are required!",
    });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const dairy_table = `dailymilkentry_${dairy_id}`;
  const batchSize = 300;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("DB Connection Error: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error" });
    }

    const fetchEntries = (offset) => {
      return new Promise((resolve, reject) => {
        const selectQuery = `
          SELECT id, snf FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
          ORDER BY id ASC
          LIMIT ? OFFSET ?
        `;
        connection.query(
          selectQuery,
          [center_id, fromDate, toDate, batchSize, offset],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    };

    const updateSnfValues = (entries) => {
      return new Promise((resolve, reject) => {
        if (entries.length === 0) return resolve();

        const updates = entries.map(({ id, snf }) => {
          const newSnf = Math.max(0, parseFloat(snf) + snfDifference); // avoid negative snf
          return [newSnf, currentDate, user_role, id];
        });

        const updateQuery = `
          UPDATE ${dairy_table}
          SET snf = ?, updatedOn = ?, UpdatedBy = ?
          WHERE id = ?
        `;

        // Execute update one by one
        let processed = 0;
        for (const params of updates) {
          connection.query(updateQuery, params, (err) => {
            if (err) return reject(err);
            processed++;
            if (processed === updates.length) resolve(); // done all
          });
        }
      });
    };

    const processBatches = async () => {
      try {
        let offset = 0;
        while (true) {
          const rows = await fetchEntries(offset);
          if (rows.length === 0) break;

          await updateSnfValues(rows);

          if (rows.length < batchSize) break;
          offset += batchSize;
        }

        connection.release();
        res.status(200).json({
          status: 200,
          message: "Snf values updated with difference successfully!",
        });

        // Pass data to next middleware
        req.body = {
          rcfromdate: fromDate,
          rctodate: toDate,
          custFrom,
          custTo,
        };
        next();
      } catch (err) {
        connection.release();
        console.error("Batch update error: ", err);
        res
          .status(500)
          .json({ status: 500, message: "Failed to update snf in batches" });
      }
    };

    processBatches();
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Update last master SNF to Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateSnfToLastSnf = async (req, res) => {};

//------------------------------------------------------------------------------------------------------------------->
// Convert KG to Liters or Liters to KG of all Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateKGLiters = async (req, res) => {
  const { dairy_id, center_id, user_role } = req.user;
  const { fromDate, toDate, milkIn, amount } = req.body;

  if (!dairy_id || !user_role) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  if (!fromDate || !toDate || !milkIn || !amount) {
    return res.status(400).json({
      status: 400,
      message: "fromDate, toDate, milkIn and amount are required!",
    });
  }

  const currentDate = new Date().toISOString().split("T")[0];
  const dairy_table = `dailymilkentry_${dairy_id}`;
  const batchSize = 300;

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ message: "Database connection error" });
    }

    const fetchEntries = (offset) => {
      return new Promise((resolve, reject) => {
        const selectQuery = `
          SELECT id, Litres, rate FROM ${dairy_table}
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
          ORDER BY id ASC
          LIMIT ? OFFSET ?
        `;
        connection.query(
          selectQuery,
          [center_id, fromDate, toDate, batchSize, offset],
          (err, results) => {
            if (err) return reject(err);
            resolve(results);
          }
        );
      });
    };

    const updateSnfValues = (entries) => {
      return new Promise((resolve, reject) => {
        if (entries.length === 0) return resolve();

        const updates = entries.map(({ id, Litres, rate }) => {
          let newLtr = 0;

          if (milkIn === "kg") {
            newLtr = Litres * parseFloat(amount); // convert kg ➝ liters
          } else if (milkIn === "ltr") {
            newLtr = Litres / parseFloat(amount); // convert liters ➝ kg
          } else {
            newLtr = Litres; // fallback, no change
          }

          const newAmt = newLtr * rate;

          return [
            newLtr.toFixed(3),
            newAmt.toFixed(2),
            currentDate,
            user_role,
            id,
          ];
        });

        const updateQuery = `
          UPDATE ${dairy_table}
          SET Litres = ?, Amt = ?, updatedOn = ?, UpdatedBy = ?
          WHERE id = ?
        `;

        let processed = 0;
        for (const params of updates) {
          connection.query(updateQuery, params, (err) => {
            if (err) return reject(err);
            processed++;
            if (processed === updates.length) resolve();
          });
        }
      });
    };

    const processBatches = async () => {
      try {
        let offset = 0;
        while (true) {
          const rows = await fetchEntries(offset);
          if (rows.length === 0) break;

          await updateSnfValues(rows);

          if (rows.length < batchSize) break;
          offset += batchSize;
        }

        connection.release();
        res.status(200).json({
          status: 200,
          message: "Milk entries updated for KG/LTR conversion successfully!",
        });
      } catch (err) {
        connection.release();
        res.status(500).json({
          status: 500,
          message: "Failed to update milk data in batches",
        });
      }
    };

    processBatches();
  });
};

//------------------------------------------------------------------------------------------------------------------->
// Convert Liters to KG of all Milk Collection of perticular master and update rate amount
//------------------------------------------------------------------------------------------------------------------->

exports.updateLitersKG = async (req, res) => {};
