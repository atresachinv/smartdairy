const pool = require("../Configs/Database");

exports.getAllItems = async (req, res) => {
  const { ...dynamicFields } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let query = `SELECT * FROM itemmaster WHERE 1 = 1`; // Base query
      const queryParams = [];

      // Append dynamic filters
      for (const [field, value] of Object.entries(dynamicFields)) {
        if (value) {
          query += ` AND ${field} = ?`;
          queryParams.push(value);
        }
      }

      connection.query(query, queryParams, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "No items found matching criteria!" });
        }

        res.status(200).json({
          total: result.length, // Return total number of items
          itemsData: result,
        });
      });
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching items",
        error: error.message,
      });
    }
  });
};

//------------------------------------------------------------------------------>
// Get All Product for mobilecollector ----------------------------------------->
//------------------------------------------------------------------------------>

exports.getAllProducts = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    try {
      const query = `SELECT  ItemGroupCode, ItemCode, ItemName FROM itemmaster WHERE companyid = ? AND center_id = ?`;

      connection.query(query, [dairy_id, center_id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res
            .status(200)
            .json({ message: "No product found matching criteria!" });
        }

        res.status(200).json({
          productData: result,
        });
      });
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        message: "Error while fetching products!",
      });
    }
  });
};

exports.getAllGrpItems = async (req, res) => {
  const { ...dynamicFields } = req.query; // Capture dynamic fields from query parameters

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let query = `SELECT * FROM itemgroupmaster WHERE 1=1`; // Base query
      const queryParams = [];

      // Append dynamic filters
      for (const [field, value] of Object.entries(dynamicFields)) {
        if (value) {
          query += ` AND ${field} = ?`;
          queryParams.push(value);
        }
      }

      connection.query(query, queryParams, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res
            .status(404)
            .json({ message: "No items found matching criteria!" });
        }

        res.status(200).json({
          total: result.length, // Return total number of items
          itemsData: result,
        });
      });
    } catch (error) {
      console.error("Error while fetching items: ", error);
      return res.status(500).json({
        success: false,
        message: "Error while fetching items",
        error: error.message,
      });
    }
  });
};

exports.getItemById = async (req, res) => {
  const { id } = req.params; // Assume the item ID is passed as a URL parameter

  // Validate if ID is provided
  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Item ID is required",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    // Step 1: Query to get item details by ID
    connection.query(
      "SELECT * FROM itemmaster WHERE ItemCode = ?",
      [id],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error fetching item: ", err);
          return res
            .status(500)
            .json({ message: "Error fetching item record" });
        }

        if (result.length === 0) {
          return res.status(404).json({
            success: false,
            message: "Item not found",
          });
        }

        res.status(200).json({
          success: true,
          data: result[0], // Return the first matching item
        });
      }
    );
  });
};

exports.createItem = async (req, res) => {
  const {
    ItemName,
    ItemGroupCode,
    companyid,
    ...otherFields // Rest of the fields
  } = req.body;

  // Validate required fields dynamically
  if (!ItemName || !ItemGroupCode || !companyid) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: ItemCode, ItemName, ItemGroupCode, or companyid",
    });
  }
  // ItemCode, ItemName, ItemGroupCode, ItemPurchaseExpenseGL, ItemSaleIncomeGL, ItemPurchaseGl, ItemSaleGl, UnitCode, ITFlag, ItemDesc, Manufacturer, vat, disc, transport, min_qty, maxqty, reorderqty, location, ManufacturerName, packing, itemNameeng, cgst, sgst, UnitName, ITFlagName, companyid, marname, hinname, groupid, hsn
  // Prepare insert query dynamically

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      connection.query(
        "SELECT MAX(ItemCode) AS totalRows FROM itemmaster",
        (err, countResult) => {
          if (err) {
            connection.release();
            console.error("Error counting rows: ", err);
            return res
              .status(500)
              .json({ message: "Error fetching row count" });
          }

          const newItemId = countResult[0].totalRows + 1; // Generate new saleid

          // Step 2: Build the INSERT query dynamically
          let insertQuery =
            "INSERT INTO itemmaster (ItemCode,ItemName,ItemGroupCode,companyid";
          const insertValues = [newItemId, ItemName, ItemGroupCode, companyid];

          for (const [key, value] of Object.entries(otherFields)) {
            insertQuery += `, ${key}`;
            insertValues.push(value);
          }

          insertQuery += ") VALUES (?";
          insertQuery += ", ?".repeat(insertValues.length - 1) + ")";

          // Step 3: Execute the INSERT query
          connection.query(insertQuery, insertValues, (err, result) => {
            connection.release();

            if (err) {
              console.error("Error inserting item record: ", err);
              return res
                .status(500)
                .json({ message: "Error creating item record" });
            }

            res.status(201).json({
              success: true,
              message: "Item record created successfully",
              itemid: newItemId,
            });
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

exports.updateItem = async (req, res) => {
  const { ItemCode, ...fieldsToUpdate } = req.body;

  // Validate required field
  if (!ItemCode) {
    return res.status(400).json({
      success: false,
      message: "ItemCode is required to update an item.",
    });
  }

  // Build the query dynamically based on the provided fields
  const updates = Object.keys(fieldsToUpdate)
    .map((field) => `${field} = ?`)
    .join(", ");

  const values = Object.values(fieldsToUpdate);

  if (!updates) {
    return res.status(400).json({
      success: false,
      message: "No fields to update provided.",
    });
  }

  const query = `UPDATE itemmaster SET ${updates} WHERE ItemCode = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(query, [...values, ItemCode], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ message: "Error updating item in the database" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Item not found or no changes made." });
      }

      res.status(200).json({
        success: true,
        message: "Item updated successfully",
      });
    });
  });
};

exports.deleteItem = async (req, res) => {
  const { ItemCode } = req.body;

  // Validate required field
  if (!ItemCode) {
    return res.status(400).json({
      success: false,
      message: "ItemCode is required to delete an item.",
    });
  }

  const query = `DELETE FROM itemmaster WHERE ItemCode = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(query, [ItemCode], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ message: "Error deleting item from the database" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Item not found." });
      }

      res.status(200).json({
        success: true,
        message: "Item deleted successfully",
      });
    });
  });
};

exports.createMasterGrpItem = async (req, res) => {
  // ItemGroupCode, ItemGroupName, kharediKharchNo, vikriUtpannaNo, kharediDeneNo, VikriYeneNo, l1, l2, l3, l4, companyid, MarItemGroupName, HinItemGroupName, groupid, isactive
  // 1, 'Group Name', 22, 107, 245, 221, '', '', '', '', 2, 'Group Name', 'Group Name', ,
  const {
    ItemGroupName,
    kharediKharchNo,
    vikriUtpannaNo,
    kharediDeneNo,
    VikriYeneNo,
    companyid,
    MarItemGroupName,
    HinItemGroupName,
    ...otherFields // Rest of the fields
  } = req.body;

  // Validate required fields dynamically
  if (
    !ItemGroupName ||
    !kharediKharchNo ||
    !vikriUtpannaNo ||
    !kharediDeneNo ||
    !VikriYeneNo ||
    !companyid ||
    !MarItemGroupName ||
    !HinItemGroupName
  ) {
    return res.status(400).json({
      success: false,
      message: "Missing fileds",
    });
  }
  // Prepare insert query dynamically

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      connection.query(
        "SELECT MAX(ItemGroupCode) AS totalRows FROM itemgroupmaster",
        (err, countResult) => {
          if (err) {
            connection.release();
            console.error("Error counting rows: ", err);
            return res
              .status(500)
              .json({ message: "Error fetching row count" });
          }

          const newItemId = countResult[0].totalRows + 1; // Generate new saleid

          // Step 2: Build the INSERT query dynamically
          let insertQuery =
            "INSERT INTO itemgroupmaster (ItemGroupCode, ItemGroupName, kharediKharchNo, vikriUtpannaNo, kharediDeneNo, VikriYeneNo,companyid, MarItemGroupName, HinItemGroupName";
          const insertValues = [
            newItemId,
            ItemGroupName,
            kharediKharchNo,
            vikriUtpannaNo,
            kharediDeneNo,
            VikriYeneNo,
            companyid,
            MarItemGroupName,
            HinItemGroupName,
          ];

          for (const [key, value] of Object.entries(otherFields)) {
            if (key === "ItemGroupCode") continue; // Skip if the key is ItemGroupCode
            insertQuery += `, ${key}`;
            insertValues.push(value);
          }

          insertQuery += ") VALUES (?";
          insertQuery += ", ?".repeat(insertValues.length - 1) + ")";

          // Step 3: Execute the INSERT query
          connection.query(insertQuery, insertValues, (err, result) => {
            connection.release();

            if (err) {
              console.error("Error inserting item record: ", err);
              return res
                .status(500)
                .json({ message: "Error creating item record", err });
            }

            res.status(201).json({
              success: true,
              message: "Item record created successfully",
              itemid: newItemId,
            });
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
