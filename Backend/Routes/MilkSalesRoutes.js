const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  fetchCenterMilkColl,
  addCenterMilkColl,
  getCenterMilkReport,
  getMasterCenterMilkReport,
  updateCenterMilkColl,
  deleteCenterMilkColl,
} = require("../Controllers/MilkSalesController");

const router = express.Router();

// center Milk Routes
router.route("/fetch/center/milkcoll").get(verifyToken, fetchCenterMilkColl);
router.route("/center/milk/coll").post(verifyToken, addCenterMilkColl);
router
  .route("/fetch/center/coll/one/report")
  .get(verifyToken, getCenterMilkReport);
router
  .route("/fetch/center/coll/master/report")
  .get(verifyToken, getMasterCenterMilkReport);
router.route("/update/center/milkcoll").put(verifyToken, updateCenterMilkColl);
router.route("/delete/center/milkcoll").put(verifyToken, deleteCenterMilkColl);


module.exports = router;
