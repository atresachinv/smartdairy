const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");

const {
  createSanghaMColl,
  fetchSanghaMColl,
  updateSanghaMColl,
  delteSanghaMColl,
  fetchSanghaMilkDetails,
  fetchSanghaledger,
  saveSanghaPayment,
  updateSanghaPayment,
  fetchSanghaMilkPay,
  deleteSanghaMilkPay,
} = require("../Controllers/SanghaController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/add/sangha/milk-coll").post(verifyToken, createSanghaMColl);
router.route("/fetch/sangha/milk-coll").get(verifyToken, fetchSanghaMColl);
router
  .route("/fetch/sangha/milkdetails")
  .get(verifyToken, fetchSanghaMilkDetails);
router.route("/fetch/sangha/ledger").get(verifyToken, fetchSanghaledger);
router.route("/update/sangha/milk-coll").put(verifyToken, updateSanghaMColl);
router.route("/delete/sangha/milk-coll").delete(verifyToken, delteSanghaMColl);
router.route("/save/sangha-milk/payment").post(verifyToken, saveSanghaPayment);
router
  .route("/update/sangha-milk/payment")
  .post(verifyToken, updateSanghaPayment);
router.route("/fetch/sangha-milk/payment").get(verifyToken, fetchSanghaMilkPay);
router
  .route("/delete/sangha-milk/payment")
  .delete(verifyToken, deleteSanghaMilkPay);

module.exports = router;
