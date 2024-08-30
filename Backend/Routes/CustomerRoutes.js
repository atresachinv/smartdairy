const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const { dashboardInfo, milkReport, custMilkReport } = require("../Controllers/CustomerController");

const router = express.Router();
// Customer Routes

router.route("/customer/dashboard").post(verifyToken, dashboardInfo);
router.route("/customer/milkreport").post(verifyToken, milkReport);
router.route("/app/milk-report").post(custMilkReport);

module.exports = router;
