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
} = require("../Controllers/DairyController");
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
router.route("/center/setting").post(verifyToken, getCenterSetting);
router.route("/center/setting/one").post(verifyToken, getOneCenterSetting);
router.route("/center/update-setting").post(verifyToken, updateCenterSetting);
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

module.exports = router;
