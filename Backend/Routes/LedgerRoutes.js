const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  maxMainLCode,
  createMainLedger,
  fetchAllMainLedger,
  createSubLedger,
  updateSubLedger,
  fetchAllSubLedger,
  deleteSubLedger,
  maxSubLCode,
} = require("../Controllers/LedgerController");

const router = express.Router();

//Main Ledger routes
router.route("/main/ledger/maxcode").post(verifyToken, maxMainLCode);
router.route("/create/main/ledger").post(verifyToken, createMainLedger);
router.route("/list/main/ledger").get(verifyToken, fetchAllMainLedger);
//Sub Ledger routes
router.route("/sub/ledger/maxcode").get(verifyToken, maxSubLCode);
router.route("/create/sub/ledger").post(verifyToken, createSubLedger);
router.route("/update/sub/ledger").put(verifyToken, updateSubLedger);
router.route("/list/sub/ledger").get(verifyToken, fetchAllSubLedger);
router.route("/delete/sub/ledger").delete(verifyToken, deleteSubLedger);

module.exports = router;
