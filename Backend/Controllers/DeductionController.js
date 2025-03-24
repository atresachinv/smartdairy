const pool = require("../Configs/Database");

//deductionmaster  controller start ---->

//getAll deduction with autoCenter
exports.getAllDeductions = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { autoCenter, ...filters } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    let query = `SELECT * FROM deductionmaster WHERE orgid = ? `;
    let queryParams = [dairy_id];

    if (autoCenter === 1) {
      // If autoCenter is enabled, fetch only for the specific center
      query += " AND center_id = ?";
      queryParams.push(center_id);
    } else if (center_id > 0) {
      // If autoCenter is disabled, fetch items for both global (center_id = 0) and the specific center
      query += " AND (center_id = 0 OR center_id = ?)";
      queryParams.push(center_id);
    }

    if (filters) {
      for (const [field, value] of Object.entries(filters)) {
        if (value) {
          query += ` AND ${field} = ?`;
          queryParams.push(value);
        }
      }
    }

    connection.query(query, queryParams, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Database query error" });
      }
      if (result.length === 0) {
        return res.status(201).json({
          success: true,
          message: "No product found matching criteria!",
          DeductionData: [],
        });
      }
      res.status(200).json({
        success: true,
        DeductionData: result,
      });
    });
  });
};
exports.getDeductionsDid = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { autoCenter } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    let query = `SELECT MAX(DeductionId) AS DeductionId FROM deductionmaster WHERE orgid = ?`;
    let queryParams = [dairy_id];

    // Add center_id filter based on autoCenter and center_id conditions
    if (autoCenter === "1") {
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
        return res
          .status(500)
          .json({ success: false, message: "Database query error" });
      }

      const maxDeductionId = result[0]?.DeductionId || 0;

      return res.status(200).json({ maxDeductionId: maxDeductionId + 1 });
    });
  });
};

//create deduction
exports.createDeduction = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const {
    DeductionId,
    DeductionName,
    GLCode,
    Active,
    PriorityNo,
    GLCodeCR,
    deductionNameeng,
    show_outstanding,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Insert query
    const query = `
      INSERT INTO deductionmaster 
      (orgid, center_id, DeductionId, DeductionName, GLCode,  Active, PriorityNo, GLCodeCR, deductionNameeng, show_outstanding) 
      VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    // Query parameters
    const queryParams = [
      dairy_id,
      center_id,
      DeductionId,
      DeductionName,
      GLCode,
      Active,
      PriorityNo,
      GLCodeCR,
      deductionNameeng,
      show_outstanding,
    ];

    connection.query(query, queryParams, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({
          success: false,
          message: "Error inserting deduction record",
        });
      }

      res.status(201).json({
        success: true,
        message: "Deduction record created successfully",
        deduction: {
          id: result.insertId, // Auto-generated ID of the inserted row
          dairy_id,
          center_id,
          DeductionId,
          DeductionName,
          GLCode,
          Active,
          PriorityNo,
          GLCodeCR,
          deductionNameeng,
          show_outstanding,
        },
      });
    });
  });
};

//update deduction record
exports.updateDynamicFields = async (req, res) => {
  const { dairy_id } = req.user;
  const { id, ...dynamicFields } = req.body;

  // Ensure that dynamicFields is not empty
  if (Object.keys(dynamicFields).length === 0) {
    return res.status(400).json({
      success: false,
      message: "No fields provided for update",
    });
  }

  // Create the SET part of the SQL query dynamically
  const updates = Object.keys(dynamicFields)
    .map((field) => `${field} = ?`)
    .join(", ");

  // Get the values of the fields to be updated
  const values = Object.values(dynamicFields);

  // Final SQL query for updating
  const query = `UPDATE deductionmaster SET ${updates} WHERE id = ? AND orgid = ? `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    connection.query(query, [...values, id, dairy_id], (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ message: "Error updating item in the database" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: true,
          message: "Deduction not found or no changes made.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Deduction updated successfully",
      });
    });
  });
};

//delete deductionmaster
exports.deleteDeductions = async (req, res) => {
  const { dairy_id } = req.user;
  const { id } = req.query;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }
    if (!id) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: id" });
    }

    let query = `DELETE FROM deductionmaster WHERE orgid = ? AND id=?`;
    let queryParams = [dairy_id, id];

    connection.query(query, queryParams, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Database query error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "No matching records found to delete!",
        });
      }

      res.status(200).json({
        success: true,
        message: "Records deleted successfully!",
      });
    });
  });
};
//deductionmaster controller end ---->

//deduction details controller start ---->

//get all deduction details
exports.getAllDeductionsDetails = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { autoCenter, ...filters } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    let query = `SELECT * FROM DeductionDetails WHERE dairy_id = ? `;
    let queryParams = [dairy_id];

    if (autoCenter === 1) {
      // If autoCenter is enabled, fetch only for the specific center
      query += " AND center_id = ?";
      queryParams.push(center_id);
    } else if (center_id > 0) {
      // If autoCenter is disabled, fetch items for both global (center_id = 0) and the specific center
      query += " AND (center_id = 0 OR center_id = ?)";
      queryParams.push(center_id);
    }

    if (filters) {
      for (const [field, value] of Object.entries(filters)) {
        if (value) {
          query += ` AND ${field} = ?`;
          queryParams.push(value);
        }
      }
    }

    connection.query(query, queryParams, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ success: false, message: "Database query error" });
      }
      if (result.length === 0) {
        return res.status(201).json({
          success: true,
          message: "No product found matching criteria!",
          DedDetailsData: [],
        });
      }
      res.status(200).json({
        success: true,
        DedDetailsData: result,
      });
    });
  });
};

//get create deduction details
exports.createDeductionDetails = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const {
    DDId,
    DeductionId,
    GLCode,
    RatePerLitre,
    ApplyDate,
    FixedVariable,
    LP,
  } = req.body;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    // Insert query

    const query = `
      INSERT INTO DeductionDetails 
      (dairy_id, center_id,DDId, DeductionId, GLCode, RatePerLitre, ApplyDate, FixedVariable, LP ) 
      VALUES (?, ?,?, ?, ?, ?, ?, ?, ?)`;

    // Query parameters
    const queryParams = [
      dairy_id,
      center_id,
      DDId,
      DeductionId,
      GLCode,
      RatePerLitre,
      ApplyDate,
      FixedVariable,
      LP,
    ];

    connection.query(query, queryParams, (err, result) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({
          success: false,
          message: "Error inserting deduction record",
        });
      }

      res.status(201).json({
        success: true,
        message: "Deduction details record created successfully",
        deduction: {
          DDid: result.insertId, // Auto-generated ID of the inserted row
          dairy_id,
          center_id,
          DDId,
          DeductionId,
          GLCode,
          RatePerLitre,
          ApplyDate,
          FixedVariable,
          LP,
        },
      });
    });
  });
};

//get update deduction details
exports.updateDynamicFieldsDetails = async (req, res) => {
  const { dairy_id } = req.user;
  const { id, LP, FixedVariable, RatePerLitre } = req.body;

  // Final SQL query for updating
  const query = `UPDATE DeductionDetails SET LP=?, FixedVariable=?, RatePerLitre=?  WHERE id = ? AND dairy_id = ? `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    connection.query(
      query,
      [LP, FixedVariable, RatePerLitre, id, dairy_id],
      (err, result) => {
        connection.release();

        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ message: "Error updating item in the database" });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            message: "Deduction details not found or no changes made.",
          });
        }

        res.status(200).json({
          success: true,
          message: "Deduction details updated successfully",
        });
      }
    );
  });
};

//get delete deduction details
exports.deleteDeductionsDetails = async (req, res) => {
  const { dairy_id } = req.user;
  const { id } = req.query;

  // Final SQL query for updating
  const query = `delete from DeductionDetails WHERE id = ? AND dairy_id = ? `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        message: "Database connection error",
      });
    }

    connection.query(query, [id, dairy_id], (err, result) => {
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
          .json({ message: "Deduction details not found or no changes made." });
      }

      res.status(200).json({
        success: true,
        message: "Deduction details  updated successfully",
      });
    });
  });
};

exports.getDedDetailDid = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { autoCenter } = req.query;

  pool.getConnection((err, connection) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Database connection error" });
    }

    let query = `SELECT MAX(DDId) AS DDId FROM DeductionDetails WHERE dairy_id = ?`;
    let queryParams = [dairy_id];

    // Add center_id filter based on autoCenter and center_id conditions
    if (autoCenter === "1") {
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
        return res
          .status(500)
          .json({ success: false, message: "Database query error" });
      }

      const maxDeductionId = result[0]?.DDId || 0;

      return res.status(200).json({ maxDDId: maxDeductionId + 1 });
    });
  });
};
