const pool = require("../Configs/Database");

//new create deliver stock
// New create deliver stock
exports.createDeliverStock = async (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;
  const { items } = req.body; // Expecting an array of items

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Missing or invalid items array" });
  }

  // Validate each item
  for (const item of items) {
    if (
      !item.to_user ||
      !item.ItemCode ||
      !item.ItemName ||
      !item.itemgroupcode ||
      !item.Qty ||
      !item.saledate
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields in one or more items",
      });
    }
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Get max billno for the current dairy_id and center_id
    connection.query(
      `SELECT MAX(billno) AS maxBillNo FROM delivery_stocks WHERE dairy_id = ? AND center_id = ?`,
      [dairy_id, center_id],
      (err, billResult) => {
        if (err) {
          connection.release();
          console.error("Error fetching max billno: ", err);
          return res
            .status(500)
            .json({ success: false, message: "Error fetching bill number" });
        }

        const newBillNo = (billResult[0]?.maxBillNo || 0) + 1; // Increment bill number

        // Prepare values for bulk insert
        const values = items.map((item) => [
          dairy_id,
          center_id,
          item.itemgroupcode,
          item.ItemCode,
          item.ItemName,
          item.Qty,
          item.cn || 0,
          item.saledate,
          item.to_user,
          item.salerate || 0,
          user_id,
          newBillNo, // Assign same bill number to all items
          item.rctno,
          item.deliver_to,
          item.emp_mobile,
        ]);

        // Insert multiple rows
        connection.query(
          `INSERT INTO delivery_stocks 
          (dairy_id, center_id, itemgroupcode, ItemCode, ItemName, Qty, cn, saledate, to_user, salerate, saleby, billno,rctno,deliver_to,emp_mobile) 
          VALUES ?`,
          [values],
          (err, insertResult) => {
            connection.release();
            if (err) {
              console.error("Error inserting into delivery_stock: ", err);
              return res
                .status(500)
                .json({ success: false, message: "Error inserting data" });
            }

            res.status(201).json({
              success: true,
              message: "Delivery stock added successfully",
              billno: newBillNo, // Return new bill number
              data: insertResult,
            });
          }
        );
      }
    );
  });
};

// Get All Delivery Stocks with Date Range Filter
exports.getDeliverStocks = async (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;
  const { from_date, to_date, role, ...filters } = req.query; // Extract date filters separately
  const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Base Query
    let query = `SELECT * FROM delivery_stocks WHERE dairy_id = ? `;
    let queryParams = [dairy_id];

    if (center_id > 0) {
      query += `AND center_id = ? `;
      queryParams.push(center_id);
    }

    if (from_date && to_date) {
      // Apply Date Filter (Use provided range or default to today's date)
      query += ` AND saledate BETWEEN ? AND ?`;
      queryParams.push(from_date, to_date);
    } else {
      query += ` AND saledate = ?`; // Default: Fetch current date data
      queryParams.push(today);
    }
    //if user can login as admin then he can see all the data
    if (role && role === "salesman") {
      query += `AND saleby=? `;
      queryParams.push(user_id);
    }

    // Dynamically add other filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query += ` AND ${key} LIKE ?`;
        queryParams.push(`%${filters[key]}%`);
      }
    });

    // Sorting by sale date (latest first)
    query += " ORDER BY saledate DESC";

    // Execute Query
    connection.query(query, queryParams, (err, results) => {
      connection.release();
      if (err) {
        console.error("Error fetching delivery stocks: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching data" });
      }

      res.status(200).json({
        success: true,
        message: "Delivery stocks fetched successfully",
        data: results,
      });
    });
  });
};

// Get user Delivery Stocks with Date Range Filter
exports.getUserDeliverStocks = async (req, res) => {
  const { dairy_id, center_id, user_id } = req.user;

  const { from_date, to_date, ...filters } = req.query;
  const today = new Date().toISOString().split("T")[0];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Base Query
    let query = `SELECT * FROM delivery_stocks WHERE dairy_id = ? AND emp_mobile=? AND deliver_to=? `;
    let queryParams = [dairy_id, user_id, 2];

    if (from_date && to_date) {
      query += ` AND saledate BETWEEN ? AND ?`;
      queryParams.push(from_date, to_date);
    } else {
      query += ` AND saledate = ?`;
      queryParams.push(today);
    }

    // Dynamically add other filters
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query += ` AND ${key} LIKE ?`;
        queryParams.push(`%${filters[key]}%`);
      }
    });

    // Sorting by sale date (latest first)
    query += " ORDER BY saledate DESC";

    // Execute Query
    connection.query(query, queryParams, (err, results) => {
      connection.release();
      if (err) {
        console.error("Error fetching delivery stocks: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Error fetching data" });
      }

      res.status(200).json({
        success: true,
        message: "Delivery stocks fetched successfully",
        data: results,
      });
    });
  });
};
