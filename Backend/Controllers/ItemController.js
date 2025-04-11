const pool = require("../Configs/Database");

//get all items
exports.getAllItems = async (req, res) => {
  const { autoCenter, ...dynamicFields } = req.query; // Capture dynamic fields from query parameters
  const { dairy_id: companyid, center_id } = req.user; // Get the company id from the user's session or request

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let query = `SELECT * FROM itemmaster WHERE companyid = ? `;
      const queryParams = [companyid];

      // Append dynamic filters
      for (const [field, value] of Object.entries(dynamicFields)) {
        if (value) {
          query += ` AND ${field} = ?`;
          queryParams.push(value);
        }
      }

      if (autoCenter === 1) {
        query += " AND center_id = ?";
        queryParams.push(center_id);
      } else if (center_id > 0) {
        query += " AND (center_id = 0 OR center_id = ?)";
        queryParams.push(center_id);
      }
      connection.query(query, queryParams, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(200).json({
            message: "No items found matching criteria!",
            itemsData: result || [],
          });
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
  const { autoCenter } = req.query;
  const autoCenterNumber = Number(autoCenter); // Convert to number for comparison
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }
    const dairy_id = req.user.dairy_id;
    const center_id = req.user.center_id;

    try {
      let query = `SELECT  id,ItemGroupCode, ItemCode, ItemName FROM itemmaster WHERE companyid = ? `;
      let queryParams = [dairy_id];

      if (autoCenterNumber === 1) {
        // If autoCenter is enabled, fetch only for the specific center
        query += " AND center_id = ?";
        queryParams.push(center_id);
      } else if (center_id > 0) {
        // If autoCenter is disabled, fetch items for both global (center_id = 0) and the specific center
        query += " AND (center_id = 0 OR center_id = ?)";
        queryParams.push(center_id);
      }

      connection.query(query, queryParams, (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res.status(500).json({ message: "Database query error" });
        }

        if (result.length === 0) {
          return res.status(200).json({
            message: "No product found matching criteria!",
            productData: [],
          });
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
// ------------------------------------------------------------------------------------------->
// Create new Cattle Feed Bill (Pramod) updated by shubham ----------------------------------->
// ------------------------------------------------------------------------------------------->

///add new product if also no in itemgroupmaster
exports.createItem = async (req, res) => {
  // Extract companyid (from dairy_id), centerid, and user_role from req.user
  const { dairy_id: companyid, center_id } = req.user;
  const { ItemCode, ItemName, ItemGroupCode, ...otherFields } = req.body;

  // Validate required fields dynamically
  if (!ItemCode || !ItemName || !ItemGroupCode || !companyid) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: ItemCode, ItemName, ItemGroupCode, or companyid",
    });
  }

  // Establish database connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    // Check if ItemGroupCode exists in itemgroupmaster
    connection.query(
      "SELECT ItemGroupCode FROM itemgroupmaster WHERE ItemGroupCode = ? AND companyid = ? AND center_id = ?",
      [ItemGroupCode, companyid, center_id],
      (err, groupResult) => {
        if (err) {
          connection.release();
          console.error("Error checking ItemGroupCode: ", err);
          return res
            .status(500)
            .json({ success: false, message: "Error checking ItemGroupCode" });
        }

        const insertItemMaster = () => {
          // Build the INSERT query dynamically
          let insertQuery =
            "INSERT INTO itemmaster (ItemCode, ItemName, ItemGroupCode, companyid, center_id";
          const insertValues = [
            ItemCode, // Use the ItemCode from frontend
            ItemName,
            ItemGroupCode,
            companyid,
            center_id,
          ];

          for (const [key, value] of Object.entries(otherFields)) {
            insertQuery += `, ${key}`;
            insertValues.push(value);
          }

          insertQuery += ") VALUES (?";
          insertQuery += ", ?".repeat(insertValues.length - 1) + ")";

          // Execute the INSERT query
          connection.query(insertQuery, insertValues, (err, result) => {
            connection.release();

            if (err) {
              console.error("Error inserting item record: ", err);
              return res.status(500).json({
                success: false,
                message: "Error creating item record",
              });
            }

            return res.status(201).json({
              success: true,
              message: "Item record created successfully",
              itemid: ItemCode, // Returning the ItemCode used
            });
          });
        };

        if (groupResult.length === 0) {
          const valuesMap = {
            1: [22, 107, 245, 221, "CattleFeed", "पशुखाद्य"],
            2: [22, 280, 290, 222, "Medicine", " औषध"],
            3: [22, 279, 286, 223, "Grocery", "किराणा"],
            4: [22, 273, 283, 225, "Other", "इतर"],
          };

          let [
            kharediKharchNo,
            vikriUtpannaNo,
            kharediDeneNo,
            VikriYeneNo,
            ItemGroupName,
            MarItemGroupName,
          ] = valuesMap[ItemGroupCode] || [0, 0, 0, 0, "Unknown", "Unknown"];

          // ItemGroupCode does not exist, insert into itemg    roupmaster
          connection.query(
            "INSERT INTO itemgroupmaster (ItemGroupCode,ItemGroupName, kharediKharchNo, vikriUtpannaNo, kharediDeneNo, VikriYeneNo,GhatnashakNo, companyid, MarItemGroupName, HinItemGroupName,center_id) VALUES (?,?,?,?, ?, ?, ?, ?, ?, ?, ?)",
            [
              ItemGroupCode,
              ItemGroupName,
              kharediKharchNo,
              vikriUtpannaNo,
              kharediDeneNo,
              VikriYeneNo,
              379,
              companyid,
              MarItemGroupName,
              "N/A",
              center_id,
            ],
            (err, insertResult) => {
              if (err) {
                connection.release();
                console.error("Error inserting into itemgroupmaster: ", err);
                return res.status(500).json({
                  success: false,
                  message: "Error inserting into itemgroupmaster",
                });
              }
              // Proceed to insert into itemmaster
              insertItemMaster();
            }
          );
        } else {
          // ItemGroupCode exists, proceed to insert into itemmaster
          insertItemMaster();
        }
      }
    );
  });
};

//update itemmaster its desc and name
exports.updateItem = async (req, res) => {
  const { dairy_id: companyid, center_id } = req.user;
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

  const query = `UPDATE itemmaster SET ${updates} WHERE ItemCode = ? AND companyid = ? AND center_id = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(
      query,
      [...values, ItemCode, companyid, center_id],
      (err, result) => {
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
      }
    );
  });
};

//delete itemmaster its item code and company id and center id are provided
exports.deleteItem = async (req, res) => {
  const { dairy_id: companyid, center_id } = req.user;
  const { ItemCode } = req.body;

  // Validate required field
  if (!ItemCode) {
    return res.status(400).json({
      success: false,
      message: "ItemCode is required to delete an item.",
    });
  }

  const query = `DELETE FROM itemmaster WHERE ItemCode = ? AND companyid = ? AND center_id = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    connection.query(query, [ItemCode, companyid, center_id], (err, result) => {
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

//get all ItemGroupMaster with url cond
exports.getAllGrpItems = async (req, res) => {
  const { autoCenter, ...dynamicFields } = req.query; // Capture dynamic fields from query parameters
  const { dairy_id: companyid, center_id } = req.user;
  const autoConterNumber = Number(autoCenter);
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      let query = `SELECT * FROM itemgroupmaster WHERE companyid=?`; // Base query
      const queryParams = [companyid];

      if (autoConterNumber === 1) {
        // If autoCenter is enabled, fetch only for the specific center
        query += " AND center_id = ?";
        queryParams.push(center_id);
      }

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
// create new in itemGroupMaster
exports.createMasterGrpItem = async (req, res) => {
  const {
    ItemGroupName,
    kharediKharchNo,
    vikriUtpannaNo,
    kharediDeneNo,
    VikriYeneNo,
    companyid,
    MarItemGroupName,
    HinItemGroupName,
    GhatnashakNo,
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
    !HinItemGroupName ||
    !GhatnashakNo
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
            "INSERT INTO itemgroupmaster (GhatnashakNo,ItemGroupCode, ItemGroupName, kharediKharchNo, vikriUtpannaNo, kharediDeneNo, VikriYeneNo,companyid, MarItemGroupName, HinItemGroupName";
          const insertValues = [
            GhatnashakNo,
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

//get max Itemcode on based companyid (from dairy_id) and center_id
exports.getMaxItemCode = async (req, res) => {
  const { autoCenter } = req.query; // Capture dynamic fields from query parameters
  const { dairy_id: companyid, center_id } = req.user;

  // Validate required fields
  if (companyid == null || center_id == null) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: companyid or center_id",
    });
  }

  // Establish database connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    let getMaxItemCodeQuery = `SELECT MAX(ItemCode) AS maxItemCode FROM itemmaster WHERE companyid = ? `;

    let queryParams = [companyid];

    if (autoCenter === 1) {
      // Only fetch the max ItemCode for the specific center
      getMaxItemCodeQuery += " AND center_id = ?";
      queryParams.push(center_id);
    } else if (center_id > 0) {
      // Fetch the max ItemCode for either centerid = 0 (global) or the user's center
      getMaxItemCodeQuery += " AND (center_id = 0 OR center_id = ?)";
      queryParams.push(center_id);
    }

    // Fetch max ItemCode from itemmaster
    connection.query(getMaxItemCodeQuery, queryParams, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error fetching max ItemCode: ", err);
        return res.status(500).json({
          success: false,
          message: "Error fetching max ItemCode",
        });
      }

      const maxItemCode = result[0]?.maxItemCode || 0;

      return res.status(200).json({
        success: true,
        maxItemCode: maxItemCode,
      });
    });
  });
};
