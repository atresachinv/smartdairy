const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  updateSelectedRecord,
  milkTransferToMorning,
  milkTransferToEvening,
  getMilkTrasferToCustomer,
  milkTrasferToCustomer,
  deleteSelectedMilkRecord,
  copyMilkCollection,
  deleteMilkCollection,
  transferMilkCollectionToShift,
  getTrasferedMilk,
  milkTrasferToDates,
  milkTrasferToShift,
  getMilkPayAmt,
  checkZeroAmt,
  saveFixDeductions,
  fetchSelectedPayAmt,
  checkPaymentExists,
  fetchTrnDeductionData,
  fetchLastReAmt,
  fetchTrnRemAmt,
  saveOtherDeductions,
  updatePaymentDetails,
  fetchPaymentMasters,
  lockMilkPayment,
  deleteSelectedMilkPays,
  deleteAllMilkPay,
  paymentDetails,
  paymentsDetail,
  fetchPaySummary,
  fetchSelectedPayData,
} = require("../Controllers/PaymentController");

const router = express.Router();

// --------------------- customer app routes ----------------------------//

router.route("/payment-info").post(verifyToken, paymentDetails);
router.route("/payments-info").post(verifyToken, paymentsDetail);

// ------------------------------ end --=--------------------------------//

router.route("/update/milk-data").patch(verifyToken, updateSelectedRecord);
router
  .route("/transfer/milk-time/evening")
  .patch(verifyToken, milkTransferToEvening);
router
  .route("/transfer/milk-time/morning")
  .patch(verifyToken, milkTransferToMorning);
router
  .route("/customer/milkdata/to-transfer")
  .get(verifyToken, getMilkTrasferToCustomer);
router
  .route("/customer/transfered/milkdata")
  .get(verifyToken, getTrasferedMilk);
router.route("/transfer/milk-to/date").patch(verifyToken, milkTrasferToDates);
router
  .route("/transfer/milk-to/customer")
  .patch(verifyToken, milkTrasferToCustomer);
router
  .route("/delete/milk-record")
  .delete(verifyToken, deleteSelectedMilkRecord);
router.route("/milk/copy-paste").put(verifyToken, copyMilkCollection);
router.route("/transfer-milk/to-shift").patch(verifyToken, milkTrasferToShift);
router
  .route("/milk/correction/delete-milk")
  .delete(verifyToken, deleteMilkCollection);
// ---------------------------------------------------------------------->
// generate payment
// ---------------------------------------------------------------------->
router.route("/check/payment/exists").get(verifyToken, checkPaymentExists);
router.route("/check/amt-zero").get(verifyToken, checkZeroAmt);
router.route("/get/total/payment-amt").get(verifyToken, getMilkPayAmt);
router.route("/save/milk/payment").post(verifyToken, saveFixDeductions);
router.route("/save/other/deductions").post(verifyToken, saveOtherDeductions);
router
  .route("/update/payment/deductions")
  .put(verifyToken, updatePaymentDetails);
router.route("/fetch/trn/deductions").get(verifyToken, fetchTrnDeductionData);
router.route("/fetch/payment/mamt").get(verifyToken, fetchTrnRemAmt);
router.route("/fetch/payment").get(verifyToken, fetchSelectedPayAmt);
router.route("/fetch/payment/bill-data").get(verifyToken, fetchSelectedPayData); // fetch payment to print bill
router.route("/update/payment/lock").put(verifyToken, lockMilkPayment);
router.route("/fetch/payment/masters").get(verifyToken, fetchPaymentMasters);
router
  .route("/delete/selected/bill")
  .delete(verifyToken, deleteSelectedMilkPays);
router.route("/delete/all/payment").delete(verifyToken, deleteAllMilkPay);
router.route("/payment/summary").get(verifyToken, fetchPaySummary);

module.exports = router;
