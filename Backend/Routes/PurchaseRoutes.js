const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  purchaseInfo,
  deductionInfo,
  paymentDetails,
  allPaymentDetails,
  paymentDeductionInfo,
  createPurchases,
  getAllPurchases,
  updatePurchase,
  deletePurchase,
  getAllProductSaleRate,
  deductionsInfo,
} = require("../Controllers/PurchaseController");
const router = express.Router();
// ------------------------ customer app routes -------------------------------//

router.route("/deduction-info").post(verifyToken, deductionInfo);
router.route("/deductions-info").post(verifyToken, deductionsInfo);

// -------------------------------- end ---------------------------------------//
//purchase Routes

router.route("/sales/report").post(verifyToken, purchaseInfo);

//Deduction Routes

router.route("/payment/details").post(verifyToken, allPaymentDetails);
router.route("/payment/deduction-info").post(verifyToken, paymentDeductionInfo);

//dev pramod
router.route("/purchase/new").post(verifyToken, createPurchases);
router.route("/purchase/all").get(verifyToken, getAllPurchases);
router.route("/purchase/update").put(verifyToken, updatePurchase);
router.route("/sales-rate").get(verifyToken, getAllProductSaleRate);
router
  .route("/purchase/delete/:purchaseid")
  .delete(verifyToken, deletePurchase);

module.exports = router;
