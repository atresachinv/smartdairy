const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getSaleStock,
  getPurchaseStock,
  getQtyStock,
} = require("../Controllers/StockController");

const router = express.Router();

router.route("/stock/sale/all").get(verifyToken, getSaleStock);
router.route("/stock/purchase/all").get(verifyToken, getPurchaseStock);
router.route("/stock/item/all").get(verifyToken, getQtyStock);

module.exports = router;
