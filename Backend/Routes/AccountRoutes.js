const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getAllVoucher,
  deleteVoucher,
  updateVoucher,
  insertNewVoucher,
  generateBalance,
  manyNewVoucher,
  getGroupedVoucher,
  getGroupedStaement,
} = require("../Controllers/AcountController");

const router = express.Router();

router.route("/all/voucher").get(verifyToken, getAllVoucher); //get all voucher
router.route("/voucher-sublegder-list").get(verifyToken, getGroupedVoucher); //get all voucher by grouping Accode and glcode
router.route("/statements").get(verifyToken, getGroupedStaement); //get all voucher  Accode and glcode and rage of date
router.route("/voucher/new").post(verifyToken, insertNewVoucher); //new voucher
router.route("/voucher/upload").post(verifyToken, manyNewVoucher); //upload voucher
router.route("/voucher/update").patch(verifyToken, updateVoucher); //update voucher
router.route("/voucher/delete").delete(verifyToken, deleteVoucher); //delete voucher
router.route("/balance").get(verifyToken, generateBalance); //generate balance
module.exports = router;
