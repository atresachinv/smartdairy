const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  saveRateChart,
  maxRateChartNo,
  saveRateChartType,
  listRatecharts,
  applyRateChart,
  rateChartMilkColl,
  getSelectedRateChart,
  updateSelectedRateChart,
  saveUpdatedRC,
  deleteSelectedRatechart,
  maxRCTypeNo,
  listAllRCTypes,
} = require("../Controllers/RatechartController");

const router = express.Router();
// rate chart
router.route("/ratechart/maxrccode").post(verifyToken, maxRateChartNo);
router.route("/ratechart/maxrctype").post(verifyToken, maxRCTypeNo);
router.route("/ratechart/save/rc-type").post(verifyToken, saveRateChartType);
router.route("/upload/ratechart").post(verifyToken, saveRateChart);
router.route("/ratechart/type-list").post(verifyToken, listAllRCTypes); //list of ratecharts
router.route("/ratechart/list").post(verifyToken, listRatecharts); // list of ratechart added by dairy
router.route("/delete/ratechart").post(verifyToken, deleteSelectedRatechart);
router.route("/apply/ratechart").post(verifyToken, applyRateChart);
router.route("/sankalan/ratechart").post(verifyToken, rateChartMilkColl);
router.route("/selected/ratechart").get(verifyToken, getSelectedRateChart);
router.route("/update/ratechart").post(verifyToken, updateSelectedRateChart);
router.route("/save/updated/ratechart").post(verifyToken, saveUpdatedRC);
module.exports = router;
