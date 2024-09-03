const express = require("express");
const {
  todaysReport,
  milkReport,
  dashboardInfo,
} = require("../Controllers/MilkController");
const verifyToken = require("../Middlewares/VerifyToken");

const router = express.Router();
// Milk Routes

router.route("/milk/report").post(todaysReport);
router.route("/milkreport").post(verifyToken, milkReport);

router.route("/dashboard").post(verifyToken, dashboardInfo);

// Customer Routes
module.exports = router;
