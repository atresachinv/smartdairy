const pool = require("../Configs/Database");

//dairy list
exports.dairyList = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        message: "Server connection failed",
        success: false,
      });
    }

    const query = `select SocietyCode,SocietyName,marathiName from societymaster`;
    connection.query(query, [], (err, rows) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({
          status: 500,
          message: "Server query failed",
          success: false,
        });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No dairies found",
          success: false,
          data: [],
        });
      }

      res.status(200).json({
        status: 200,
        message: "Dairy list retrieved successfully",
        success: true,
        data: rows,
      });
    });
  });
};
//center list
exports.centerList = async (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res.status(500).json({
        status: 500,
        message: "Server connection failed",
        success: false,
      });
    }

    const query = `select orgid,center_id,center_name,marathi_name from centermaster`;
    connection.query(query, [], (err, rows) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res.status(500).json({
          status: 500,
          message: "Server query failed",
          success: false,
        });
      }

      if (!rows || rows.length === 0) {
        return res.status(404).json({
          status: 404,
          message: "No centers found",
          success: false,
          data: [],
        });
      }

      res.status(200).json({
        status: 200,
        message: "Center list retrieved successfully",
        success: true,
        data: rows,
      });
    });
  });
};

//recharge whatsapp sms
exports.rechargeWhatsappSms = async (req, res) => {
  const { user_id } = req.user;
  const { dairy_id, center_id, balance } = req.body;
  // console.log(dairy_id, center_id, balance);
  if (!dairy_id || center_id === null || !balance) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are required" });
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting MySQL connection: ", err);
      return res
        .status(500)
        .json({ status: 500, message: "Server connection failed" });
    }

    const query = `INSERT INTO smsRechargeMaster ( dairy_id, center_id,balance,createdby) VALUES (?, ?, ?, ?)`;
    connection.query(query, [dairy_id, center_id, balance, user_id], (err) => {
      connection.release();
      if (err) {
        console.error("Error executing query: ", err);
        return res
          .status(500)
          .json({ status: 500, message: "Server query failed" });
      }
      res.status(200).json({
        status: 200,
        message: "Whatsapp SMS Recharge successfully",
      });
    });
  });
};

//get whatsapp sms balance
exports.getWhatsappSmsBalance = async (req, res) => {
  const { dairy_id, center_id } = req.body;
  
};
