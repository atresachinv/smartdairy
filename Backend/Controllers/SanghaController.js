const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const util = require("util");

//------------------------------------------------------------------------------------------------------------------->
// add sangha milk collection --------------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->
exports.createSanghaMColl = async (req, res) => {
  const { ...values } = req.body;
  const { dairy_id, center_id, user_role } = req.user;
  const {
    date,
    sanghname,
    shift,
    liters,
    kpliters,
    nashliters,
    otherCharges,
    chilling,
    fat,
    snf,
    rate,
    amt,
  } = values;
  if (!date || !liters || !rate || !amt) {
    return res
      .status(400)
      .json({ status: 400, message: "All info is Required!" });
  }
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  const today = new Date().toISOString().split("T")[0];
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const insertQuery = `INSERT INTO sanghmilkentry (
      dairy_id, center_id, sanghname, shift, colldate, liter, kamiprat_ltr, otherCharges,
      chilling, nash_ltr, fat, snf, rate, amt, createdOn, createdBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      connection.query(
        insertQuery,
        [
          dairy_id,
          center_id,
          sanghname,
          shift,
          date,
          liters,
          kpliters,
          otherCharges,
          chilling,
          nashliters,
          fat,
          snf,
          rate,
          amt,
          today,
          user_role,
        ],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          res.status(200).json({
            status: 200,
            message: "Sangha milk collection saved successfully!",
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

//------------------------------------------------------------------------------------------------------------------->
// fetch sangha milk collection ------------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->

exports.fetchSanghaMColl = async (req, res) => {
  const { fromDate, toDate } = req.query;
  const { dairy_id, center_id } = req.user;

  if (!fromDate || !toDate) {
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
      const fetchQuery = `
        SELECT * FROM sanghmilkentry 
            WHERE dairy_id = ? AND center_id = ? AND colldate BETWEEN ? AND ?
        `;

      connection.query(
        fetchQuery,
        [dairy_id, center_id, fromDate, toDate],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          if (result.length === 0) {
            return res.status(200).json({
              status: 200,
              sanghaMilkSales: [],
              message: "Sangha milk collection not found!",
            });
          }

          res.status(200).json({
            status: 200,
            sanghaMilkSales: result,
            message: "Sangha milk collection fetched successfully!",
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

//------------------------------------------------------------------------------------------------------------------->
// update sangha milk collection ------------------------------------------------------------------------------------>
//------------------------------------------------------------------------------------------------------------------->
exports.updateSanghaMColl = async (req, res) => {
  const {
    sanghaid,
    shift,
    date,
    liters,
    kpliters,
    nashliters,
    fat,
    snf,
    rate,
    amt,
  } = req.body.values;

  const { dairy_id, center_id, user_role } = req.user;
  if (
    !date ||
    !sanghaid ||
    !shift ||
    !liters ||
    !kpliters ||
    !nashliters ||
    !fat ||
    !snf ||
    !rate ||
    !amt
  ) {
    return res
      .status(400)
      .json({ status: 400, message: "User code Required!" });
  }
  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorized User!" });
  }
  const today = new Date().toISOString().split("T")[0];
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection error!" });
    }

    try {
      const updateQuery = `UPDATE sanghmilkentry SET
          sanghcode = ? shift = ? colldate = ? liter = ? kamiprat_ltr = ? nash_ltr = ?
          fat = ? snf = ? rate = ? amt = ? updatedOn = ? updatedBy = ?) WHERE id = ?`;

      connection.query(
        updateQuery,
        [
          dairy_id,
          center_id,
          sanghaid,
          shift,
          date,
          liters,
          kpliters,
          nashliters,
          fat,
          snf,
          rate,
          amt,
          today,
          user_role,
        ],
        (err, result) => {
          connection.release();
          if (err) {
            console.error("Error executing query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          res.status(200).json({
            status: 200,
            message: "Sangha milk collection updated successfully!",
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

//------------------------------------------------------------------------------------------------------------------->
// delete sangha milk collection ------------------------------------------------------------------------------------>
//------------------------------------------------------------------------------------------------------------------->
exports.delteSanghaMColl = async (req, res) => {
  const { id } = req.body;
  const { dairy_id, center_id } = req.user;
  if (!id) {
    return res.status(400).json({
      status: 400,
      message: "Id is required to delete sangha milk collection!",
    });
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
      const getCustname = `DELETE FROM sanghmilkentry WHERE id = ?`;

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

          res.status(200).json({
            status: 200,
            message: "Sangha milk collection deleted successfully!",
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
