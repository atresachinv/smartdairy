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
} = require("../Controllers/PaymentController");

const router = express.Router();
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
router.route("/get/total/payment-amt").get(verifyToken, getMilkPayAmt);

module.exports = router;
