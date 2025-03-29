const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  addNewBank,
  maxBankNO,
  updateBankDetails,
  fetchAllBanks,
  deleteBank,
} = require("../Controllers/BankController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/bank/maxcode").get(verifyToken, maxBankNO);
router.route("/bank/create").post(verifyToken, addNewBank);
router.route("/bank/update").put(verifyToken, updateBankDetails);
router.route("/bank/list").get(verifyToken, fetchAllBanks);
router.route("/bank/delete").delete(verifyToken, deleteBank);

module.exports = router;
