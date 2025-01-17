const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  createCustomer,
  profileInfo,
  customMilkReport,
  custDashboardInfo,
  getMaxCustNo,
  customerList,
  updateCustomer,
  uniqueRchartList,
  milkcollReport,
  uploadExcelCustomer,
} = require("../Controllers/CustomerController");

const router = express.Router();

// Customer Routes

router.route("/customer/maxcustno").post(verifyToken, getMaxCustNo);
router.route("/create/customer").post(verifyToken, createCustomer);
router.route("/update/customer").post(verifyToken, updateCustomer);
router.route("/customer/list").post(verifyToken, customerList);
router.route("/customer/profile").post(verifyToken, profileInfo);
router.route("/customer/dashboard").post(verifyToken, custDashboardInfo);
router.route("/customer/milkreport").post(verifyToken, milkcollReport);
router.route("/customer/master/report").post(verifyToken, customMilkReport);
router.route("/upload/customer/excel").post(verifyToken, uploadExcelCustomer);

//Ratechart Routes
router.route("/unique/rclist").post(verifyToken, uniqueRchartList);
router.route("/customer/used/ratechartno").post(verifyToken, uniqueRchartList);
// router.route("/app/milk-report").post(custMilkReport);

module.exports = router;
