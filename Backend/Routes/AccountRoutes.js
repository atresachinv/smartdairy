const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getAllVoucher,
  deleteVoucher,
  updateVoucher,
  insertNewVoucher,
} = require("../Controllers/AcountController");

const router = express.Router();

router.route("/all/voucher").get(verifyToken, getAllVoucher); //get all voucher
router.route("/voucher/new").post(verifyToken, insertNewVoucher); //new voucher
router.route("/voucher/update").patch(verifyToken, updateVoucher); //update voucher
router.route("/voucher/delete").delete(verifyToken, deleteVoucher); //delete voucher

module.exports = router;
