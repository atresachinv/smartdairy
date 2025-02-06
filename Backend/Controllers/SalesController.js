const pool = require("../Configs/Database");

//-------------------------------------------------------------------------->
// Create Sale with Dynamic Columns (Multiple Rows) ------------------------>
//-------------------------------------------------------------------------->

exports.createSales = (req, res) => {
  const salesData = req.body;
  const { dairy_id, center_id, user_id } = req.user;

  if (!Array.isArray(salesData) || salesData.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a non-empty array of sales data.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Step 1: Get the max BillNo for the company and center
    connection.query(
      "SELECT MAX(BillNo) AS maxBillNo FROM salesmaster WHERE companyid = ? AND center_id = ?",
      [dairy_id, center_id],
      (err, countResult) => {
        if (err) {
          connection.release();
          console.error("Error fetching max BillNo:", err);
          return res
            .status(500)
            .json({ success: false, message: "Error fetching max BillNo" });
        }

        let newBillNo = countResult[0].maxBillNo
          ? countResult[0].maxBillNo + 1
          : 1; // Increment once

        // Step 2: Build the bulk INSERT query dynamically
        let insertQuery =
          "INSERT INTO salesmaster (BillNo, BillDate, companyid, center_id, createdby";
        const insertValues = [];
        const valuePlaceholders = [];

        for (const sale of salesData) {
          const { BillDate, ...otherFields } = sale;
          if (!BillDate) {
            connection.release();
            return res.status(400).json({
              success: false,
              message: "Each sale must have a BillDate.",
            });
          }

          const rowValues = [newBillNo, BillDate, dairy_id, center_id, user_id];
          for (const key of Object.keys(otherFields)) {
            if (!insertQuery.includes(key)) {
              insertQuery += `, ${key}`;
            }
            rowValues.push(otherFields[key]);
          }

          insertValues.push(...rowValues);
          valuePlaceholders.push(`(${rowValues.map(() => "?").join(", ")})`);
        }

        insertQuery += `) VALUES ${valuePlaceholders.join(", ")}`;

        // Step 3: Execute the bulk INSERT query
        connection.query(insertQuery, insertValues, (err, result) => {
          connection.release();

          if (err) {
            console.error("Error inserting sale records:", err);
            return res
              .status(500)
              .json({ success: false, message: "Error creating sale records" });
          }
          console.log(result.affectedRows);
          res.status(201).json({
            success: true,
            message: "Sale records created successfully",
            insertedRows: result.affectedRows,
          });
        });
      }
    );
  });
};

//-------------------------------------------------------------------------->
//getting all sales -------------------------------------------------------->
//-------------------------------------------------------------------------->

exports.getPaginatedSales = async (req, res) => {
  const { date1, date2, fcode, ...dynamicFields } = req.query;
  const dairy_id = req.user.dairy_id;

  let query = `
    SELECT * 
    FROM salesmaster 
    WHERE 1=1`;
  let countQuery = `
    SELECT COUNT(*) AS totalRecords 
    FROM salesmaster 
    WHERE 1=1`;

  const queryParams = [];

  // Append filters for date range
  if (date1 && date2) {
    query += ` AND BillDate BETWEEN ? AND ?`;
    countQuery += ` AND BillDate BETWEEN ? AND ?`;
    queryParams.push(date1, date2);
  } else {
    query += ` AND BillDate = CURDATE()`;
    countQuery += ` AND BillDate = CURDATE()`;
  }

  // Append filter for fcode
  if (fcode) {
    query += ` AND CustCode = ?`;
    countQuery += ` AND CustCode = ?`;
    queryParams.push(fcode);
  }

  if (dairy_id) {
    query += ` AND companyid = ?`; // Assuming companyid column exists in salesmaster
    countQuery += ` AND companyid = ?`;
    queryParams.push(dairy_id);
  }

  // Append dynamic fields
  for (const [field, value] of Object.entries(dynamicFields)) {
    if (value) {
      query += ` AND ${field} = ?`;
      countQuery += ` AND ${field} = ?`;
      queryParams.push(value);
    }
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(countQuery, queryParams, (err, countResult) => {
      if (err) {
        connection.release();
        console.error("Error executing count query: ", err);
        return res
          .status(500)
          .json({ message: "Error fetching total record count", error: err });
      }

      const totalRecords = countResult[0]?.totalRecords || 0;

      connection.query(query, queryParams, (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ message: "Error fetching sales data", error: err });
        }

        res.status(200).json({
          success: true,
          totalRecords,
          salesData: result,
        });
      });
    });
  });
};

//-------------------------------------------------------------------------->
// Get Sale by SaleID or billNo -------------------------------------------->
//-------------------------------------------------------------------------->

exports.getSale = async (req, res) => {
  const { saleid, billNo } = req.params;

  // Validate that either saleid or billNo is provided
  if (!saleid && !billNo) {
    return res.status(400).json({
      success: false,
      message: "Either SaleID or BillNo is required.",
    });
  }

  const identifier = saleid ? saleid : billNo;
  const column = saleid ? "saleid" : "billNo";

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const query = `SELECT * FROM salesmaster WHERE ${column} = ?`;
      connection.query(query, [identifier], (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(404).json({
            success: false,
            message: `Sale with ${column} ${identifier} not found.`,
          });
        }

        res.status(200).json({
          success: true,
          message: "Sale record retrieved successfully",
          sale: result[0],
        });
      });
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

//-------------------------------------------------------------------------->
// Delete sale through its saleid or billNo ------------------------------------------->
//-------------------------------------------------------------------------->

exports.deleteSale = async (req, res) => {
  const { saleid, billNo } = req.body;
  const dairy_id = req.user.dairy_id;

  // Validate that at least one identifier is provided
  if (!saleid && !billNo) {
    return res.status(400).json({
      success: false,
      message: "Either saleid or billNo is required to delete a sale record.",
    });
  }

  const query = `
    DELETE FROM salesmaster 
    WHERE (saleid = ? OR billNo = ?) 
    AND companyid = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(
      query,
      [saleid || null, billNo || null, dairy_id],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ message: "Error deleting sale record from the database" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message:
              "Sale record not found or does not belong to your company.",
          });
        }

        res.status(200).json({
          success: true,
          message: "Sale record deleted successfully",
        });
      }
    );
  });
};

//-------------------------------------------------------------------------->
//update sale through its saleid ------------------------------------------->
//-------------------------------------------------------------------------->
exports.updateSale = async (req, res) => {
  const { saleid, ...updateFields } = req.body;

  // Ensure the saleid is provided
  if (!saleid) {
    return res.status(400).json({
      success: false,
      message: "saleid is required to update a sale record.",
    });
  }

  // Ensure at least one field to update is provided
  if (Object.keys(updateFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field must be provided to update.",
    });
  }

  // Construct dynamic query
  let updateQuery = "UPDATE salesmaster SET ";
  const updateValues = [];

  // Dynamically build the update query
  for (const [key, value] of Object.entries(updateFields)) {
    updateQuery += `${key} = ?, `;
    updateValues.push(value);
  }

  // Remove trailing comma
  updateQuery = updateQuery.slice(0, -2);
  updateQuery += " WHERE saleid = ?";
  updateValues.push(saleid); // Add saleid for WHERE clause

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(updateQuery, updateValues, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({ message: "Error updating sale record" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Sale record not found or no changes made." });
      }

      res.status(200).json({
        success: true,
        message: "Sale record updated successfully",
      });
    });
  });
};

//-------------------------------------------------------------------------->
// fetch vehicle sales ----------------------------------------------------->
//-------------------------------------------------------------------------->

exports.fetchVehicleSales = (req, res) => {
  const { fromdate, todate } = req.query;
  console.log(fromdate, todate);
  const { dairy_id, center_id, user_id } = req.user;

  if (!fromdate || !todate) {
    return res.status(400).json({
      message: "Date required to fetch data!.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      const getSalesQuery =
        "SELECT BillDate, BillNo, ReceiptNo, CustCode, cust_name,ItemCode, ItemName, Qty, rate, Amount, cgst, sgst, cn FROM salesmaster WHERE companyid = ? AND center_id = ? AND createdby = ? AND BillDate BETWEEN ? AND ? ";

      connection.query(
        getSalesQuery,
        [dairy_id, center_id, user_id, fromdate, todate],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error deleting purchase record: ", err);
            return res.status(500).json({
              success: false,
              message: "Error deleting purchase record",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "No sales record found with the given criteria.",
            });
          }

          res.status(200).json({
            vehicleSales: result,
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};

//-------------------------------------------------------------------------->
// fetch All sales for (admin) --------------------------------------------->
//-------------------------------------------------------------------------->

exports.fetchAllSales = (req, res) => {
  const { fromdate, todate } = req.query;
  console.log(fromdate, todate);
  const { dairy_id, center_id} = req.user;

  if (!fromdate || !todate) {
    return res.status(400).json({
      message: "Date required to fetch data!.",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    try {
      const getSalesQuery =
        "SELECT BillDate, BillNo, ReceiptNo, CustCode, cust_name, ItemCode, ItemName, Qty, rate, Amount, cgst, sgst, cn ,createdby FROM salesmaster WHERE companyid = ? AND center_id = ? AND BillDate BETWEEN ? AND ? ";

      connection.query(
        getSalesQuery,
        [dairy_id, center_id, fromdate, todate],
        (err, result) => {
          connection.release();

          if (err) {
            console.error("Error deleting purchase record: ", err);
            return res.status(500).json({
              success: false,
              message: "Error deleting purchase record",
            });
          }

          if (result.affectedRows === 0) {
            return res.status(404).json({
              success: false,
              message: "No sales record found with the given criteria.",
            });
          }
          // console.log(result);
          res.status(200).json({
            allSales: result,
          });
        }
      );
    } catch (error) {
      connection.release();
      console.error("Unexpected error: ", error);
      return res.status(500).json({
        success: false,
        message: "Unexpected error occurred",
        error: error.message,
      });
    }
  });
};
