const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  saveRateChart,
  maxRateChartNo,
  listRatecharts,
  applyRateChart,
  rateChartMilkColl,
  getSelectedRateChart,
  updateSelectedRateChart,
  saveUpdatedRC,
  deleteSelectedRatechart,
} = require("../Controllers/RatechartController");

const router = express.Router();
// rate chart
router.route("/ratechart/maxrccode").post(verifyToken, maxRateChartNo);
router.route("/upload/ratechart").post(verifyToken, saveRateChart);
router.route("/ratechart/list").post(verifyToken, listRatecharts);
router.route("/delete/ratechart").post(verifyToken, deleteSelectedRatechart);
router.route("/apply/ratechart").post(verifyToken, applyRateChart);
router.route("/sankalan/ratechart").post(verifyToken, rateChartMilkColl);
router.route("/selected/ratechart").get(verifyToken, getSelectedRateChart);
router.route("/update/ratechart").post(verifyToken, updateSelectedRateChart);
router.route("/save/updated/ratechart").post(verifyToken, saveUpdatedRC);
module.exports = router;
