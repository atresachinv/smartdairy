const pool = require("../Configs/Database");

//get all sms history
exports.getAllSmsHistory = (req, res) => {
  const { dairy_id, center_id } = req.user;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Server connection failed",
      });
    }

    const query = `SELECT * FROM sms_history_master WHERE dairy_id = ? AND center_id = ?`;
    connection.query(query, [dairy_id, center_id], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error getting recharge history: ", err);
        return res.status(500).json({
          success: false,
          status: 500,
          message: "Server connection failed",
        });
      }
      res.status(200).json({
        success: true,
        status: 200,
        message: "Recharge history fetched successfully",
        data: results,
      });
    });
  });
};

//get balance
exports.getBalance = (req, res) => {
  const { dairy_id, center_id } = req.user;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Server connection failed",
      });
    }

    const query = `SELECT SUM(balance) as total_balance FROM smsRechargeMaster WHERE center_id=? AND dairy_id=  ?`;
    connection.query(query, [center_id, dairy_id], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error getting balance: ", err);
        return res.status(500).json({
          success: false,
          status: 500,
          message: "Server connection failed",
        });
      }
      res.status(200).json({
        success: true,
        status: 200,
        message: "Balance fetched successfully",
        data: results[0]?.total_balance || 0,
      });
    });
  });
};

//get recharge history
exports.getRechargeHistory = (req, res) => {
  const { user_id } = req.user;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        success: false,
        status: 500,
        message: "Server connection failed",
      });
    }

    const query = `SELECT * FROM smsRechargeMaster where createdby=? ORDER BY bal_date DESC`;
    connection.query(query, [user_id], (err, results) => {
      connection.release();
      if (err) {
        console.error("Error getting recharge history: ", err);
        return res.status(500).json({
          success: false,
          status: 500,
          message: "Server execution failed",
        });
      }
      res.status(200).json({
        success: true,
        status: 200,
        message: "Recharge history fetched successfully",
        data: results,
      });
    });
  });
};
