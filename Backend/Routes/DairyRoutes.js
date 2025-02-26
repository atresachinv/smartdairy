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
<<<<<<< HEAD
<<<<<<< HEAD
  getCenterCustomerCount,
=======
  getCenterSetting,
  updateCenterSetting,
  getOneCenterSetting,
>>>>>>> b2bb2dd (setting can done)
=======
  getCenterSetting,
  updateCenterSetting,
  getOneCenterSetting,
=======
  getCenterCustomerCount,
>>>>>>> 5bbda2edb697ed748cbaf2919dcf0fb2e05d7379
>>>>>>> 434e666 (Local changes before merging)
} = require("../Controllers/DairyController");
const router = express.Router();

//dairy routes
router.route("/dairy/masters").post(masterDates);
router.route("/dairy/dashboard").post(verifyToken, dairyDashboardInfo);
router.route("/dairyinfo").post(verifyToken, dairyInfo);
router.route("/update/dairyinfo").post(verifyToken, updatedetails);
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

module.exports = router;
