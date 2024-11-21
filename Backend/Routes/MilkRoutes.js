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
router.route("/save/milk/collection").post(verifyToken, milkCollection);
router.route("/save/milk/one").post(verifyToken, milkCollectionOneEntry);
router.route("/save/milk/one").post(verifyToken, milkCollectionOneEntry);
router
  .route("/save/mobile/milkcollection")
  .post(verifyToken, mobileMilkCollection); // mobile Milkcollector
router.route("/mobile/milkreport").get(verifyToken, fetchMobileMilkColl); // mobile Milkcollector
router
  .route("/fetch/mobile/collection")
  .get(verifyToken, fetchMobileMilkCollection);
router.route("/update/mobile/coll").post(verifyToken, updateMobileCollection);
router.route("/milk/coll/report").get(verifyToken, allMilkCollReport);

// Customer Routes
module.exports = router;
