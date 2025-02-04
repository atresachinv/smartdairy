const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  updateSelectedRecord,
  milkTransferToMorning,
  milkTransferToEvening,
  milkTrasferToCustomer,
  deleteSelectedMilkRecord,
  copyMilkCollection,
  deleteMilkCollection,
  transferMilkCollectionToShift,
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
  .route("/transfer/milk-to/customer")
  .patch(verifyToken, milkTrasferToCustomer);
router
  .route("/transfer/milk-to/date")
  .patch(verifyToken, milkTrasferToCustomer);
router
  .route("/delete/milk-record")
  .delete(verifyToken, deleteSelectedMilkRecord);
router.route("/copy-milk").put(verifyToken, copyMilkCollection);
router
  .route("/transfer-milk/to-shift")
  .patch(verifyToken, transferMilkCollectionToShift);
router
  .route("/milk/correction/delete-milk")
  .post(verifyToken, deleteMilkCollection);

module.exports = router;
