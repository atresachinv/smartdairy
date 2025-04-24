const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const NodeCache = require("node-cache");
const cache = new NodeCache({});

// --------------------------------------------------------------------------------------->
// fetch deleted milk collection of perticular dairy / center ---------------------------->
// --------------------------------------------------------------------------------------->

exports.fetchDeleteColl = async (req, res) => {
  const { values } = req.body;
  const { dairy_id, user_id } = req.user;

  // Validate request body
  if (!values || Object.keys(values).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "All fields data required!",
    });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const { fromDate, toDate, dairy_id, center_id } = values;
      const dairy_table = `dailymilkentry_${dairy_id}`;

      const fetchQuery = `
          SELECT *
          FROM ${dairy_table} 
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ? 
          AND ME IN (0, 1) AND isDeleted = 1
        `;
      const queryParams = [fromDate, toDate];

      connection.query(fetchQuery, queryParams, (err, result) => {
        connection.release(); // Release connection after query execution

        if (err) {
          console.error("Error executing delete query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        res.status(200).json({
          status: 200,
          deletedColl: result,
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

// --------------------------------------------------------------------------------------->
// Retrive deleted milk collection of perticular dairy / center -------------------------->
// --------------------------------------------------------------------------------------->

exports.retriveDeleteColl = async (req, res) => {
  const { values } = req.body;
  const { dairy_id, user_id } = req.user;

  // Validate request body
  if (!values || Object.keys(values).length === 0) {
    return res.status(400).json({
      status: 400,
      message: "All fields data required!",
    });
  }

  if (!dairy_id) {
    return res.status(401).json({
      status: 401,
      message: "Unauthorized User!",
    });
  }

  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 19).replace("T", " ");

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({ message: "Database connection error" });
    }

    try {
      const { fromDate, toDate, dairy_id, center_id } = values;
      const dairy_table = `dailymilkentry_${dairy_id}`;

      const updateQuery = `
          UPDATE ${dairy_table} 
          SET isDeleted = 0 , UpdatedBy = ?, updatedOn = ?
          WHERE center_id = ? AND ReceiptDate BETWEEN ? AND ? 
          AND ME IN (0, 1) AND isDeleted = 1
        `;

      const queryParams = [user_id, formattedDate, center_id, fromDate, toDate];

      connection.query(updateQuery, queryParams, (err, result) => {
        connection.release(); // Release connection after query execution

        if (err) {
          console.error("Error executing delete query: ", err);
          return res.status(500).json({ message: "Query execution error" });
        }

        if (result.affectedRows === 0) {
          return res.status(200).json({
            status: 201,
            message: "No delete records found!",
          });
        }

        res.status(200).json({
          status: 200,
          message: "Deleted records retrived successfully!",
        });
      });
    } catch (error) {
      console.error("Error processing request: ", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

