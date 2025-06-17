const dotenv = require("dotenv");
const pool = require("../Configs/Database");
dotenv.config({ path: "Backend/.env" });
const util = require("util");

//------------------------------------------------------------------------------------------------------------------->
// add sangha milk collection --------------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->

exports.createSanghaMColl = (req, res) => {
  try {
    const { ...values } = req.body;
    const { dairy_id, center_id, user_role } = req.user;
    const {
      date,
      sanghid,
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

    // Input validation
    if (!date || !liters || !rate || !amt) {
      return res
        .status(400)
        .json({ status: 400, message: "All info is Required!" });
    }

    if (!dairy_id) {
      return res
        .status(401)
        .json({ status: 401, message: "Unauthorized User!" });
    }

    const today = new Date().toISOString().split("T")[0];

    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Database connection error!" });
      }

      const checkQuery = `
        SELECT COUNT(sanghid) AS count 
        FROM sanghmilkentry 
        WHERE dairy_id = ? AND center_id = ? AND colldate = ? AND shift = ? AND sanghid = ?
      `;

      connection.query(
        checkQuery,
        [dairy_id, center_id, date, shift, sanghid],
        (err, result) => {
          if (err) {
            connection.release();
            console.error("Error executing select query: ", err);
            return res
              .status(500)
              .json({ status: 500, message: "Query execution error!" });
          }

          if (result[0].count > 0) {
            connection.release();
            return res.status(400).json({
              status: 400,
              message: "Duplicate entry! Sangh milk collection already exists.",
            });
          }

          const insertQuery = `
          INSERT INTO sanghmilkentry (
            dairy_id, center_id, sanghid, shift, colldate, liter, kamiprat_ltr,
            otherCharges, chilling, nash_ltr, fat, snf, rate, amt, createdOn, createdBy
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

          connection.query(
            insertQuery,
            [
              dairy_id,
              center_id,
              sanghid,
              shift,
              date,
              liters || 0.0,
              kpliters || 0.0,
              otherCharges || 0.0,
              chilling || 0.0,
              nashliters || 0.0,
              fat || 0.0,
              snf || 0.0,
              rate || 0.0,
              amt || 0.0,
              today,
              user_role,
            ],
            (err, result) => {
              connection.release();
              if (err) {
                console.error("Error executing insert query: ", err);
                return res
                  .status(500)
                  .json({ status: 500, message: "Insert query error!" });
              }

              return res.status(200).json({
                status: 200,
                message: "Sangha milk collection saved successfully!",
              });
            }
          );
        }
      );
    });
  } catch (err) {
    console.error("Unexpected server error: ", err);
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error!" });
  }
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
      .json({ status: 400, message: "All data is required!" });
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
      .json({ status: 400, message: "All data is required!" });
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

//------------------------------------------------------------------------------------------------------------------->
// fetch sangha milk collection for payment ------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->
exports.fetchSanghaMilkDetails = async (req, res) => {
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
        SELECT
          sanghid,
          SUM(CASE WHEN shift = 0 THEN liter ELSE 0 END) AS mrgLiters,
          SUM(CASE WHEN shift = 1 THEN liter ELSE 0 END) AS eveLiters,
          SUM(liter) AS totalLiters,
          SUM(amt) AS totalAmt,
          SUM(otherCharges) AS totalOtherCharges,
          SUM(chilling) AS totalChilling
        FROM sanghmilkentry
        WHERE dairy_id = ? AND center_id = ? AND colldate BETWEEN ? AND ?
        GROUP BY sanghid
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
              sanghaSaleDetails: [],
              message: "Sangha milk collection details not found!",
            });
          }

          res.status(200).json({
            status: 200,
            sanghaSaleDetails: result,
            message: "Sangha milk collection details fetched successfully!",
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
// fetch sangha ledger for payment ---------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->
exports.fetchSanghaledger = async (req, res) => {
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
      const fetchQuery = `
          SELECT lno, ledger_name, marathi_name, per_ltr_amt, group_code
          FROM subledgermaster
          WHERE dairy_id = ? AND center_id = ? AND sangha_head = 1
        `;

      connection.query(fetchQuery, [dairy_id, center_id], (err, result) => {
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
            sanghaLedger: [],
            message: "Sangha milk ledger not found!",
          });
        }

        res.status(200).json({
          status: 200,
          sanghaLedger: result,
          message: "Sangha milk ledger fetched successfully!",
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

//------------------------------------------------------------------------------------------------------------------->
// Save sangha milk Payment ----------------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->

exports.saveSanghaPayment = async (req, res) => {
  const { dairy_id, center_id, user_role } = req.user;
  const { formData, paymentDetails } = req.body;

  const {
    billdate,
    sanghacode,
    morningliters,
    eveningliters,
    totalcollection,
    othercommission,
    chilling,
    overrate,
    totalPayment,
    totalcommission,
    totalDeduction,
    netPayment,
  } = formData;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorised User!" });
  }

  if (!Array.isArray(paymentDetails) || paymentDetails.length === 0) {
    return res
      .status(400)
      .json({ status: 400, message: "No payment data provided!" });
  }

  pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Connection error:", err);
      return res
        .status(500)
        .json({ status: 500, message: "Database connection failed!" });
    }

    const query = util.promisify(connection.query).bind(connection);
    const beginTransaction = util
      .promisify(connection.beginTransaction)
      .bind(connection);
    const commit = util.promisify(connection.commit).bind(connection);
    const rollback = util.promisify(connection.rollback).bind(connection);
    const release = connection.release.bind(connection);

    try {
      await beginTransaction();

      // Get max BillNo
      const billResult = await query(
        `SELECT MAX(CAST(billno AS UNSIGNED)) AS maxBillNo FROM sanghMilkBillDetails WHERE dairy_id = ? AND center_id = ?`,
        [dairy_id, center_id]
      );

      const maxBillNo = parseInt(billResult[0].maxBillNo) || 0;
      const billNo = maxBillNo + 1;

      // Insert summary into sanghMilkBillDetails
      await query(
        `INSERT INTO sanghMilkBillDetails 
        (dairy_id, center_id, billno, billdate, sangh_id, ledgerCode, mrgltr, eveltr, totalltr, otherCommission,
        chilling, overrate, totalAmount, totalComm, totalDeduction, netPayment, createdOn, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dairy_id,
          center_id,
          billNo,
          billdate,
          sanghacode,
          0,
          morningliters || 0.0,
          eveningliters || 0.0,
          totalcollection || 0.0,
          othercommission || 0.0,
          chilling || 0.0,
          overrate || 0.0,
          totalPayment || 0.0,
          totalcommission || 0.0,
          totalDeduction || 0.0,
          netPayment,
          new Date(),
          user_role,
        ]
      );

      // Prepare detail insert values
      const valuesArray = paymentDetails.map(
        ({ lno, marathi_name, Amount }) => [
          dairy_id,
          center_id,
          billNo,
          billdate,
          sanghacode,
          lno,
          marathi_name,
          Amount,
          new Date(),
          user_role,
        ]
      );

      const insertQuery = `
        INSERT INTO sanghMilkBillDetails (
          dairy_id, center_id, billno, billdate, sangh_id, ledgerCode, ledgerName, Amount, createdOn, createdBy
        ) VALUES ?
      `;

      await query(insertQuery, [valuesArray]);

      await commit();
      release();
      return res.status(200).json({
        status: 200,
        message: "Sangha payment saved successfully.",
      });
    } catch (error) {
      await rollback();
      release();
      console.error("Transaction error:", error.sqlMessage || error.message);
      return res.status(500).json({
        status: 500,
        message: "Transaction failed!",
        error: error.sqlMessage || error.message,
      });
    }
  });
};

//------------------------------------------------------------------------------------------------------------------->
// fetch sangha milk Payment ----------------------------------------------------------------------------------------->
//------------------------------------------------------------------------------------------------------------------->

exports.fetchSanghaMilkPay = async (req, res) => {
  const { dairy_id, center_id } = req.user;
  const { fromDate, toDate, sanghaid } = req.query;

  if (!dairy_id) {
    return res.status(401).json({ status: 401, message: "Unauthorised User!" });
  }
  if (!fromDate || !toDate) {
    return res
      .status(400)
      .json({ status: 400, message: "All data is required!" });
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
        SELECT * FROM sanghMilkBillDetails 
          WHERE dairy_id = ? AND center_id = ? AND sangh_id = ? AND billdate BETWEEN ? AND ?
        `;

      connection.query(
        fetchQuery,
        [dairy_id, center_id, sanghaid, fromDate, toDate],
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
              sanghaMilkPay: [],
              message: "Sangha milk payment not found!",
            });
          }

          res.status(200).json({
            status: 200,
            sanghaMilkPay: result,
            message: "Sangha milk payment fetched successfully!",
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
