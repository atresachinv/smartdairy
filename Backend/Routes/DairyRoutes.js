const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  masterDates,
  dairyDashboardInfo,
} = require("../Controllers/DairyController");
const router = express.Router();

//dairy routes
router.route("/dairy/masters").post(masterDates);
router.route("/dairy/dashboard").post(verifyToken, dairyDashboardInfo);

module.exports = router;
