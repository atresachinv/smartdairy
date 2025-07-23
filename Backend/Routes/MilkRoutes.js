const express = require("express");
const {
  todaysReport,
  milkReport,
  dashboardInfo,
  custDetails,
  getRateAmount,
  milkCollection,
  saveRateChart,
  milkCollectionOneEntry,
  mobileMilkCollection,
  allMilkCollReport,
  fetchMobileMilkColl,
  fetchMobileMilkCollection,
  updateMobileCollection,
  allMilkCollection,
  fetchPrevLiters,
  fetchPrevFSD,
  todaysMilkCollReport,
  completedMilkReport,
  RetailMilkCollection,
  createRetailCustomer,
  retailMilkReports,
  centerReMilkReports,
  getRetailCustomer,
  fetchRegCustomers,
  uploadMilkCollection,
  updateFatGeneral,
  updateFatDifference,
  updateSnfGeneral,
  updateSnfDifference,
  updateKGLiters,
  finallyApplyRateChart,
  updateFatToLastFat,
  updateSnfToLastSnf,
  dairyMilkLossGain,
  fetchBillMilkColl,
} = require("../Controllers/MilkController");
const verifyToken = require("../Middlewares/VerifyToken");

const router = express.Router();

// Milk Routes

router.route("/milk/report").post(todaysReport);
router.route("/milkreport").post(verifyToken, milkReport);
router.route("/dashboard").post(verifyToken, dashboardInfo);

//Milk Collection Customer Name
router.route("/collection/custdata").post(verifyToken, custDetails);
router.route("/collection/milkrate").post(verifyToken, getRateAmount);

//dairy milk collection ------------------------------------------------------------------------------------------------->
router.route("/save/milk/collection").post(verifyToken, milkCollection);
router.route("/milk/sankalan").get(verifyToken, allMilkCollection); //milk collector milk collection
router.route("/save/milk/one").post(verifyToken, milkCollectionOneEntry);

// mobile Milkcollector-------------------------------------------------------------------------------------------------->
router
  .route("/save/mobile/milkcollection")
  .post(verifyToken, mobileMilkCollection); // mobile Milkcollector
router.route("/mobile/milkreport").get(verifyToken, fetchMobileMilkColl); // mobile Milkcollector
router.route("/regular/customer/list").get(verifyToken, fetchRegCustomers); // regular customer list
router.route("/mobile/prevliters").get(verifyToken, fetchPrevLiters); // mobile Milkcollector
router.route("/prev/milkdata").get(verifyToken, fetchPrevFSD);
router
  .route("/fetch/mobile/collection")
  .get(verifyToken, fetchMobileMilkCollection); // fetch mobile milk collection
router.route("/update/mobile/coll").post(verifyToken, updateMobileCollection);
router.route("/milk/coll/report").get(verifyToken, allMilkCollReport); // All milk collection Records
router.route("/payment-bill/milk-coll").get(verifyToken, fetchBillMilkColl); // milk coll to print bills
router
  .route("/completed/collection/report")
  .get(verifyToken, completedMilkReport);
router.route("/upload/milk/collection").post(verifyToken, uploadMilkCollection);
//Retail milk sales-------------------------------------------------------------------------------------------------------->
router.route("/create/retail-customer").post(verifyToken, createRetailCustomer);
router.route("/get/retail-customer").get(verifyToken, getRetailCustomer);
router.route("/retail/save/collection").post(verifyToken, RetailMilkCollection);
router.route("/retail/sale-report").get(verifyToken, retailMilkReports);
router
  .route("/retail/center/sale-report")
  .get(verifyToken, centerReMilkReports);
router.route("/dairy/daily/loss-gain").get(verifyToken, dairyMilkLossGain); // -------------------------------------------------------------->
//FAt SNF TADJOD-------------------------------------------------------------------------------------------------------->
router
  .route("/update/fat")
  .put(verifyToken, updateFatGeneral, finallyApplyRateChart);
router
  .route("/update/previous/fat")
  .put(verifyToken, updateFatToLastFat, finallyApplyRateChart);
router
  .route("/update/fat-diff")
  .put(verifyToken, updateFatDifference, finallyApplyRateChart);
router
  .route("/update/snf")
  .put(verifyToken, updateSnfGeneral, finallyApplyRateChart);
router
  .route("/update/previous/snf")
  .put(verifyToken, updateSnfToLastSnf, finallyApplyRateChart);
router
  .route("/update/snf-diff")
  .put(verifyToken, updateSnfDifference, finallyApplyRateChart);
router.route("/convert/kg-ltr/ltr-kg").put(verifyToken, updateKGLiters);

// Customer Routes
module.exports = router;
