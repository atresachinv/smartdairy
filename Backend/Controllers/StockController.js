const pool = require("../Configs/Database");

//get all sale data to start date is 1/04/YYYY to today date
exports.getSaleStock = async (req, res) => {
  const dairy_id = req.user.dairy_id;
  const center_id = req.user.center_id;
  const {ItemGroupCode, fromdate, todate } = req.query;
  // Get the current date


  let query = `
    SELECT companyid,
            userid,
            saleid,
            BillNo,
            ItemCode,
            BillDate,
            Qty,
            Rate,
            Amount,
            CustCode,
            cust_name, ItemGroupCode, createdby, ItemName, center_id
    FROM salesmaster 
    WHERE BillDate BETWEEN ? AND ?`;

  const queryParams = [fromdate, todate];

  if (dairy_id ) {
    query += ` AND companyid = ? AND center_id=?`;
    queryParams.push(dairy_id, center_id);
  } else {
    return res
      .status(500)
      .json({ message: "DairyId and Center Id are required" });
  }
  if (ItemGroupCode) {
    query += ` AND ItemGroupCode = ?`;
    queryParams.push(ItemGroupCode);
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

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
        salesData: result,
      });
    });
  });
};

//get all purchase data to start date is 1/04/YYYY to today date
exports.getPurchaseStock = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { ItemGroupCode } = req.query;

  // Get the current date
  const today = new Date();
  const year = today.getFullYear();
  const startYear = today.getMonth() >= 3 ? year : year - 1;
  const startDate = `${startYear}-04-01`;
  const endDate = today.toISOString().split("T")[0];

  let query = `
    SELECT * 
    FROM PurchaseMaster 
    WHERE purchasedate BETWEEN ? AND ?`;

  const queryParams = [startDate, endDate];

  // Ensure dairy_id and center_id are included
  if (dairy_id) {
    query += ` AND dairy_id = ? AND center_id = ?`;
    queryParams.push(dairy_id, center_id);
  } else {
    return res
      .status(400)
      .json({ message: "DairyId and CenterId are required" });
  }

  // Filter by ItemGroupCode if provided
  if (ItemGroupCode) {
    query += ` AND ItemGroupCode = ?`;
    queryParams.push(ItemGroupCode);
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    // Fetch purchase data
    connection.query(query, queryParams, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ message: "Error fetching purchase data", error: err });
      }

      res.status(200).json({
        success: true,
        purchaseData: result,
      });
    });
  });
};

//get all item qty data to start date is 1/04/YYYY to today date
exports.getQtyStock = (req, res) => {
  const { dairy_id, center_id } = req.user;

  if (!dairy_id || !center_id) {
    return res
      .status(400)
      .json({ message: "DairyId and CenterId are required" });
  }

  // Get from and to date from query parameters, or use default dates
  const { fromDate, toDate } = req.query;
  const today = new Date();
  const year = today.getFullYear();
  const startYear = today.getMonth() >= 3 ? year : year - 1;
  const defaultStartDate = `${startYear}-04-01`; // Financial year starts from April 1st
  const defaultEndDate = today.toISOString().split("T")[0]; // Today's date in YYYY-MM-DD format

  // Use the provided dates or fallback to default values
  const startDate = fromDate || defaultStartDate;
  const endDate = toDate || defaultEndDate;

  // Queries
  let purchaseQuery = `
    SELECT itemgroupcode, itemcode, SUM(qty) AS totalPurchased, 
           SUM(CASE WHEN cn = 1 THEN qty ELSE 0 END) AS totalReturn
    FROM PurchaseMaster
    WHERE purchasedate BETWEEN ? AND ? 
    AND dairy_id = ? AND center_id = ?
    GROUP BY itemgroupcode, itemcode`;

  let salesQuery = `
    SELECT ItemGroupCode, ItemCode, 
           SUM(CASE WHEN cn = 0 THEN Qty ELSE 0 END) AS totalSold, 
           SUM(CASE WHEN cn = 1 THEN Qty ELSE 0 END) AS totalSaleReturn
    FROM salesmaster
    WHERE BillDate BETWEEN ? AND ? 
    AND companyid = ? AND center_id = ?
    GROUP BY ItemGroupCode, ItemCode`;

  let initialStockQuery = `
    SELECT ItemGroupCode, ItemCode, ItemQty AS initialStock
    FROM itemStockMaster
    WHERE dairy_id = ? AND center_id = ?`;

  const queryParams = [startDate, endDate, dairy_id, center_id];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Database connection error:", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(
      initialStockQuery,
      [dairy_id, center_id],
      (err, initialStockResults) => {
        if (err) {
          connection.release();
          console.error("Error fetching initial stock:", err);
          return res
            .status(500)
            .json({ message: "Error fetching initial stock" });
        }

        connection.query(purchaseQuery, queryParams, (err, purchaseResults) => {
          if (err) {
            connection.release();
            console.error("Error fetching purchase data:", err);
            return res
              .status(500)
              .json({ message: "Error fetching purchase data" });
          }

          connection.query(salesQuery, queryParams, (err, salesResults) => {
            connection.release();

            if (err) {
              console.error("Error fetching sales data:", err);
              return res
                .status(500)
                .json({ message: "Error fetching sales data" });
            }

            // Map initial stock by ItemGroupCode & ItemCode
            let stockMap = {};
            initialStockResults.forEach(
              ({ ItemGroupCode, ItemCode, initialStock }) => {
                const key = `${ItemGroupCode}-${ItemCode}`;
                stockMap[key] = {
                  ItemGroupCode,
                  ItemCode,
                  initialStock,
                  totalPurchased: 0,
                  totalSold: 0,
                  totalReturn: 0,
                  totalSaleReturn: 0,
                  stock: initialStock,
                };
              }
            );

            // Map purchases and apply purchase returns
            purchaseResults.forEach(
              ({ itemgroupcode, itemcode, totalPurchased, totalReturn }) => {
                const key = `${itemgroupcode}-${itemcode}`;
                if (!stockMap[key]) {
                  stockMap[key] = {
                    ItemGroupCode: itemgroupcode,
                    ItemCode: itemcode,
                    initialStock: 0,
                    totalPurchased,
                    totalSold: 0,
                    totalReturn,
                    totalSaleReturn: 0,
                    stock: 0,
                  };
                } else {
                  stockMap[key].totalPurchased = totalPurchased;
                  stockMap[key].totalReturn = totalReturn;
                }
              }
            );

            // Map sales and apply sales returns
            salesResults.forEach(
              ({ ItemGroupCode, ItemCode, totalSold, totalSaleReturn }) => {
                const key = `${ItemGroupCode}-${ItemCode}`;
                if (stockMap[key]) {
                  stockMap[key].totalSold = totalSold;
                  stockMap[key].totalSaleReturn = totalSaleReturn;
                }
              }
            );

            // Final stock calculation
            Object.keys(stockMap).forEach((key) => {
              const item = stockMap[key];
              item.stock =
                item.initialStock +
                item.totalPurchased -
                item.totalSold +
                item.totalSaleReturn -
                item.totalReturn;
            });

            // Group stock data by ItemGroupCode
            let groupedStockData = {};
            Object.values(stockMap).forEach((item) => {
              if (!groupedStockData[item.ItemGroupCode]) {
                groupedStockData[item.ItemGroupCode] = [];
              }
              groupedStockData[item.ItemGroupCode].push(item);
            });

            res.status(200).json({
              success: true,
              stockData: groupedStockData,
            });
          });
        });
      }
    );
  });
};
