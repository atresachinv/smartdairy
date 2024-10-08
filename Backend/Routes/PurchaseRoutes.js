const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  purchaseInfo,
  deductionInfo,
  paymentDetails,
} = require("../Controllers/PurchaseController");
const router = express.Router();

//purchase Routes

router.route("/sales/report").post(verifyToken, purchaseInfo);

//Deduction Routes

router.route("/payment-info").post(verifyToken, paymentDetails);
router.route("/deduction-info").post(verifyToken, deductionInfo);

module.exports = router;
