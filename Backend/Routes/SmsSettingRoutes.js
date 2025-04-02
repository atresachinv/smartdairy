const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getRechargeHistory,
  getBalance,
  getAllSmsHistory,
} = require("../Controllers/SmsSettingController");

const router = express.Router();

router.route("/whsms-history").get(verifyToken, getAllSmsHistory);
router.route("/whsms-balance").get(verifyToken, getBalance);
router.route("/admin-whsms-recharge").get(verifyToken, getRechargeHistory);

module.exports = router;
