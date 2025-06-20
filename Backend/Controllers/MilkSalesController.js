const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const util = require("util");

//----------------------------------------------------------------------------------->
// Fetch Center milk Coll of milkCollector or Center  ------------------------------->
//----------------------------------------------------------------------------------->

exports.fetchCenterMilkColl = async (req, res) => {
  const { date, centerid, collectedBy, shift } = req.query;
  const { dairy_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized user!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;
  let getMilkData = "";

  // Conditional query based on collectedBy
  if (collectedBy !== "" || !collectedBy) {
    getMilkData = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM ${dairy_table} 
      WHERE companyid = ? AND ReceiptDate = ? AND center_id = ? 
        AND ME = ? AND isDeleted = 0
  `;
  } else {
    getMilkData = `
      SELECT fat, snf, rate, Litres, Amt 
      FROM ${dairy_table} 
      WHERE companyid = ? AND ReceiptDate = ? AND center_id = ? 
        AND userid = ? AND ME = ? AND isDeleted = 0
    `;
  }

  const params =
    collectedBy && collectedBy !== ""
      ? [dairy_id, date, centerid, shift]
      : [dairy_id, date, centerid, collectedBy, shift];

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    connection.query(getMilkData, params, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Query execution error!" });
      }

      if (!result || result.length === 0) {
        return res.status(204).json({
          status: 204,
          centerMilkColl: [],
          message: "Milk Collection details not found!",
        });
      }

      res.status(200).json({
        status: 200,
        centerMilkColl: result,
        message: "Milk Collection details found!",
      });
    });
  });
};

//-------------------------------------------------------------------------------->
// Center milk collection  ------------------------------------------------------->
//-------------------------------------------------------------------------------->
exports.addCenterMilkColl = async (req, res) => {
  const {
    centerid,
    collectedBy,
    date,
    shift,
    liters,
    fat,
    snf,
    rate,
    amt,
    cliters,
    cfat,
    csnf,
    crate,
    camt,
    dliters,
    dfat,
    dsnf,
    drate,
    damt,
  } = req.body.values;

  const { dairy_id, user_role } = req.user;

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

    const currentDate = new Date();
    const insertQuery = `
      INSERT INTO center_milkcoll (
        dairy_id, center_id, collection_by, coll_date, coll_shift, 
        tliter, afat, asnf, arate, tamt, 
        R_tliter, R_afat, R_asnf, R_arate, R_tamt, 
        D_tliter, D_afat, D_asnf, D_arate, D_tamt, 
        createdOn, createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dairy_id,
      centerid,
      collectedBy || "Admin",
      date,
      shift,
      liters,
      fat,
      snf,
      rate,
      amt,
      cliters,
      cfat,
      csnf,
      crate,
      camt,
      dliters,
      dfat,
      dsnf,
      drate,
      damt,
      currentDate,
      user_role,
    ];

    connection.query(insertQuery, values, (err, result) => {
      connection.release();

      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Query execution error!" });
      }

      res.status(201).json({
        status: 200,
        message: "Center milk collection saved successfully!",
      });
    });
  });
};

//-------------------------------------------------------------------------------->
// Get Center milk collection Report --------------------------------------------->
//-------------------------------------------------------------------------------->
exports.getCenterMilkReport = async (req, res) => {
  const { dairy_id, center_id } = req.user;

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
      const getCustname = `SELECT * FROM center_milkcoll WHERE dairy_id = ? AND center_id = ?, coll_date = ? AND isDeleted = 0`;

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
            return res.status(404).json({
              status: 404,
              message: "Center milk collection details not found!",
            });
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

//-------------------------------------------------------------------------------->
// Get Center milk collection Report of master ----------------------------------->
//-------------------------------------------------------------------------------->
exports.getMasterCenterMilkReport = async (req, res) => {
  const { fromDate, toDate } = req.query;
  const { dairy_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ status: 400, message: "formDate and toDate is required!" });
  }
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const getCustname = `SELECT * FROM center_milkcoll WHERE dairy_id = ? AND coll_date BETWEEN ? AND ? AND isDeleted = 0`;

      connection.query(
        getCustname,
        [dairy_id, fromDate, toDate],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          // Check if result is empty (no customer found)
          if (!result || result.length === 0) {
            return res.status(204).json({
              status: 204,
              centerMReport: [],
              message: "Center milk collection details not found!",
            });
          }

          res.status(200).json({
            status: 200,
            centerMReport: result,
            message: "Center milk collection details found!",
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

//-------------------------------------------------------------------------------->
// Center milk collection  ------------------------------------------------------->
//-------------------------------------------------------------------------------->
exports.updateCenterMilkColl = async (req, res) => {
  const { user_code } = req.body;
  const user_role = req.user.user_role;

  if (!user_code) {
    return res
      .status(400)
      .json({ status: 400, message: "User code Required!" });
  }
  if (!user_role) {
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
      const getCustname = `
        UPDATE center_milkcoll SET ( tliter = ?, afat = ?, asnf = ?, arate = ?, tamt = ?,
            R_tliter = ?, R_afat = ?, R_asnf = ?, R_arate = ?, R_tamt = ?, D_tliter = ?,
            D_afat = ?, D_asnf = ?, D_arate = ?, D_tamt = ?, updatedOn = ?, updatedBy = ?)
        WHERE id = ?`;

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
            return res.status(404).json({
              status: 404,
              message: "Center milk collection record not found!",
            });
          }

          // Proceed if customer details are found
          const custdetails = result[0];
          res.status(200).json({
            status: 200,
            custdetails,
            message: "Center milk collection record updated successfully!",
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

//-------------------------------------------------------------------------------->
// Set center milk collection Record is deleted ---------------------------------->
//-------------------------------------------------------------------------------->
exports.deleteCenterMilkColl = async (req, res) => {
  const { id } = req.body;
  const { user_role } = req.user;

  if (!id) {
    return res.status(400).json({ status: 400, message: "id is Required!" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const getCustname = `UPDATE center_milkcoll SET isDeleted = 1, deletedOn = NOW(), deletedBy = ? WHERE id = ?`;

      connection.query(getCustname, [user_role, id], (err, result) => {
        connection.release();
        if (err) {
          console.error("Error executing query: ", err);
          return res
            .status(500)
            .json({ status: 500, message: "Query execution error!" });
        }

        res.status(200).json({
          status: 200,
          message: "Center milk collection deleted successfully!",
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error!" });
    }
  });
};

//-------------------------------------------------------------------------------->
// Get dairy daily milk collection Report of master ------------------------------>
//-------------------------------------------------------------------------------->

exports.getDairyMilkReport = async (req, res) => {
  const { fromDate, toDate } = req.query;
  const { dairy_id, center_id } = req.user;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ status: 400, message: "formDate and toDate is required!" });
  }
  const dairy_table = `dailymilkentry_${dairy_id}`;
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const getquery = `
      SELECT 
        ReceiptDate,
        SUM(CASE WHEN ME = 0 THEN Litres ELSE 0 END) AS mrgTotalLitres,
        ROUND(SUM(CASE WHEN ME = 0 THEN fat * Litres ELSE 0 END) / NULLIF(SUM(CASE WHEN ME = 0 THEN Litres ELSE 0 END), 0), 2) AS mrgAvgFat,
        ROUND(SUM(CASE WHEN ME = 0 THEN snf * Litres ELSE 0 END) / NULLIF(SUM(CASE WHEN ME = 0 THEN Litres ELSE 0 END), 0), 2) AS mrgAvgSnf,
        SUM(CASE WHEN ME = 0 THEN Amt ELSE 0 END) AS mrgTotalAmt,
        SUM(CASE WHEN ME = 1 THEN Litres ELSE 0 END) AS eveTotalLitres,
        ROUND(SUM(CASE WHEN ME = 1 THEN fat * Litres ELSE 0 END) / NULLIF(SUM(CASE WHEN ME = 1 THEN Litres ELSE 0 END), 0), 2) AS eveAvgFat,
        ROUND(SUM(CASE WHEN ME = 1 THEN snf * Litres ELSE 0 END) / NULLIF(SUM(CASE WHEN ME = 1 THEN Litres ELSE 0 END), 0), 2) AS eveAvgSnf,
        SUM(CASE WHEN ME = 1 THEN Amt ELSE 0 END) AS eveTotalAmt
      FROM 
      ${dairy_table}
      WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ?
      GROUP BY ReceiptDate
      ORDER BY ReceiptDate ASC;
      `;

      connection.query(
        getquery,
        [center_id, fromDate, toDate],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          if (!result || result.length === 0) {
            return res.status(200).json({
              status: 200,
              dairyMilk: [],
              message: "Center milk collection details not found!",
            });
          }

          res.status(200).json({
            status: 200,
            dairyMilk: result,
            message: "Center milk collection details found!",
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
