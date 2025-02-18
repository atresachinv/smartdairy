const pool = require("../Configs/Database");

//new create deliver stock
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
      console.log(item);
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
    ]);

    // Insert multiple rows
    connection.query(
      `INSERT INTO delivery_stocks 
      (dairy_id, center_id, itemgroupcode, ItemCode, ItemName, Qty, cn, saledate, to_user, salerate, saleby) 
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
          data: insertResult,
        });
      }
    );
  });
};

//get All delivery stock
exports.getDeliverStocks = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const filters = req.query; // Get all query parameters dynamically

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Base Query
    let query = `SELECT * FROM delivery_stocks WHERE dairy_id = ? AND center_id = ?`;
    let queryParams = [dairy_id, center_id];

    // Dynamically add WHERE conditions based on provided query params
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        query += ` AND ${key} LIKE ?`;
        queryParams.push(`%${filters[key]}%`);
      }
    });

    // Sorting
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
