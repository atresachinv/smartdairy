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
  getCheckTrn,
  getGroupedStatement,
  getGeneralLedgerStatements,
} = require("../Controllers/AcountController");

const router = express.Router();

router.route("/all/voucher").get(verifyToken, getAllVoucher); //get all voucher
router.route("/voucher-sublegder-list").get(verifyToken, getGroupedVoucher); //get all voucher by grouping Accode and glcode
router.route("/statements").get(verifyToken, getGroupedStatement); //get all voucher  Accode and glcode and rage of date
router.route("/general-ledger-statements").get(verifyToken, getGeneralLedgerStatements); //get all voucher  Accode and glcode and rage of date
router.route("/voucher/new").post(verifyToken, insertNewVoucher); //new voucher
router.route("/voucher/upload").post(verifyToken, manyNewVoucher); //upload voucher
router.route("/voucher/update").patch(verifyToken, updateVoucher); //update voucher
router.route("/voucher/delete").delete(verifyToken, deleteVoucher); //delete voucher
router.route("/balance").get(verifyToken, generateBalance); //generate balance

//TRN Check routes
router.route("/trn-check").get(verifyToken, getCheckTrn); //get getCheckTrn data sale/purchase and voucher

module.exports = router;
