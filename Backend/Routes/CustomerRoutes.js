const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  dashboardInfo,
  // custMilkReport,
  createCustomer,
  profileInfo,
  milkReport,
  customMilkReport,
} = require("../Controllers/CustomerController");

const router = express.Router();

// Customer Routes

router.route("/create/customer").post(createCustomer);
router.route("/customer/profile").post(verifyToken, profileInfo);
router.route("/customer/dashboard").post(verifyToken, dashboardInfo);
router.route("/customer/milkreport").post(verifyToken, milkReport);
// router.route("/app/milk-report").post(custMilkReport);
router.route("/customer/master/report").post(verifyToken, customMilkReport);

module.exports = router;
