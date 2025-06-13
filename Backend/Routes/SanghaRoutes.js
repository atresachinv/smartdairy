const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");

const {
  createSanghaMColl,
  fetchSanghaMColl,
  updateSanghaMColl,
  delteSanghaMColl,
} = require("../Controllers/SanghaController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/add/sangha/milk-coll").post(verifyToken, createSanghaMColl);
router.route("/fetch/sangha/milk-coll").get(verifyToken, fetchSanghaMColl);
router.route("/update/sangha/milk-coll").put(verifyToken, updateSanghaMColl);
router.route("/delete/sangha/milk-coll").delete(verifyToken, delteSanghaMColl);

module.exports = router;
