const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  rechargeWhatsappSms,
  centerList,
  dairyList,
} = require("../Controllers/DairySettingController");
const router = express.Router();

router.route("/sadmin/dairy-list").post(verifyToken, dairyList);
router.route("/sadmin/center-list").post(verifyToken, centerList);
router
  .route("/sadmin/recharge-whatsapp-sms")
  .post(verifyToken, rechargeWhatsappSms);

module.exports = router;
