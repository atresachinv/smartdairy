const express = require("express");
const {
  todaysReport,
  milkReport,
  dashboardInfo,
  custName,
  getRateAmount,
  milkCollection,
} = require("../Controllers/MilkController");
const verifyToken = require("../Middlewares/VerifyToken");

const router = express.Router();
// Milk Routes

router.route("/milk/report").post(todaysReport);
router.route("/milkreport").post(verifyToken, milkReport);

router.route("/dashboard").post(verifyToken, dashboardInfo);

//Milk Collection Customer Name 
router.route("/collection/custname").post(verifyToken, custName);
router.route("/collection/rateamt").post(verifyToken, getRateAmount);
router.route("/milk/collection").post(verifyToken, milkCollection);


// Customer Routes
module.exports = router;


          