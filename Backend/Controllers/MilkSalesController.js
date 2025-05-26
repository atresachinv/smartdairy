const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const util = require("util");

//------------------------------------------------------------------------------------------------------------------->
// Sangha milk Sales ------------------------------------------------------------------------------------------------>
//------------------------------------------------------------------------------------------------------------------->

//------------------------------------------------------------------------------------------------------------------->
// Center milk collection  ------------------------------------------------------------------------------------------>
//------------------------------------------------------------------------------------------------------------------->
//----------------------------------------------------------------------------------->
// Fetch Center milk Coll of milkCollector or Center  ------------------------------->
//----------------------------------------------------------------------------------->

exports.fetchCenterMilkColl = async (req, res) => {
  const { date, centerid, collectedBy, shift } = req.body;
  const dairy_id = req.user.dairy_id;

  if (!user_code) {
    return res
      .status(400)
      .json({ status: 400, message: "User code Required!" });
  }
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }

  const dairy_table = `dailymilkentry_${dairy_id}`;
  const getCustname = `
    SELECT fat, snf, rate, Litres, Amt 
        FROM ${dairy_table} 
        WHERE companyid = ? AND ReceiptDate AND center_id = ?  AND userid = ? AND ME = ? AND isDeleted = 0 
    `;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      connection.query(
        getCustname,
        [dairy_id, date, centerid, collectedBy, shift],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          if (result.length === 0) {
            return res.status(404).json({
              status: 404,
              message: "Milk Collection details not found!",
            });
          }

          res.status(200).json({
            status: 200,
            centerMilkColl: result,
            message: "Milk Collection details found!",
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
exports.addCenterMilkColl = async (req, res) => {
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
      const getCustname = `
        INSERT INTO center_milkcoll (dairy_id, center_id, collection_by,
            coll_date, coll_shift, tliter, afat, asnf, arate, tamt, R_tliter,
            R_afat, R_asnf, R_arate, R_tamt, D_tliter, D_afat, D_asnf, D_arate,
            D_tamt, createdOn, createdBy)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

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
      const getCustname = `SELECT * FROM center_milkcoll WHERE dairy_id = ? AND center_id = ?, coll_date BETWEEN ? AND ? AND isDeleted = 0`;

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
