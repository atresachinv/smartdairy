const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  masterDates,
  dairyInfo,
  dairyDashboardInfo,
  updatedetails,
  maxCenterId,
  createCenter,
  updateCenterInfo,
  getCenterDetails,
  getAllcenters,
  sendMessage,
  getCenterWiseMilkData,
  getCenterCustomerCount,
  getCenterSetting,
  updateCenterSetting,
  getOneCenterSetting,
  createMilkSangha,
  updateMilkSangha,
  listMilkSangha,
  deleteMilkSangha,
  saveMessage,
  createDairyInitInfo,
  updateDairyInitInfo,
  fetchDairyInitInfo,
  sendOTPMessage,
  saveOTP,
  updateCenterSetup,
} = require("../Controllers/DairyController");
const { verifyOtp } = require("../Controllers/UserController");
const router = express.Router();

//dairy routes
router.route("/dairy/masters").post(masterDates);
router.route("/dairy/dashboard").post(verifyToken, dairyDashboardInfo);
router.route("/dairyinfo").post(verifyToken, dairyInfo);
router.route("/update/dairyinfo").put(verifyToken, updatedetails);
router.route("/center/maxid").post(verifyToken, maxCenterId);
router.route("/create/center").post(verifyToken, createCenter);
router.route("/update/centerdetails").post(verifyToken, updateCenterInfo);
router.route("/center/details").post(verifyToken, getCenterDetails);
router.route("/all/centerdetails").post(verifyToken, getAllcenters);
router.route("/send-message").post(verifyToken, sendMessage); //send whats app message
router.route("/save-message").post(verifyToken, saveMessage); //save whats app message
router.route("/send-message/otp").post(sendOTPMessage); //send otp on whatsapp
router.route("/save-otp").put(saveOTP); //save otp
router.route("/verify-otp").post(verifyOtp); //verify otp
router.route("/update/user/password").post(verifyOtp); //verify otp
router.route("/center/setting").post(verifyToken, getCenterSetting);
router.route("/center/setting/one").post(verifyToken, getOneCenterSetting);
router.route("/center/update-setting").post(verifyToken, updateCenterSetting);
router.route("/center/update/setting").post(verifyToken, updateCenterSetup);
// Dashboard data display routes -------------------------------------------------------------------->
router
  .route("/dashboard/centers-data")
  .post(verifyToken, getCenterWiseMilkData);
router
  .route("/dashboard/centers/customer-count")
  .post(verifyToken, getCenterCustomerCount);

// Sangha routes ----------------------------------------------------------------------------------->
router.route("/create/sangha").post(verifyToken, createMilkSangha);
router.route("/update/sangha").post(verifyToken, updateMilkSangha);
router.route("/list/sangha").get(verifyToken, listMilkSangha);
router.route("/delete/sangha").post(verifyToken, deleteMilkSangha);

// Dairy info routes ----------------------------------------------------------------------------------->
router.route("/dairy/create/init-info").post(verifyToken, createDairyInitInfo);
router.route("/dairy/update/init-info").put(verifyToken, updateDairyInitInfo);
router.route("/dairy/fetch/init-info").get(verifyToken, fetchDairyInitInfo);

module.exports = router;
