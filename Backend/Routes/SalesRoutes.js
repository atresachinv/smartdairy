const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getPaginatedSales,
  deleteSale,
  updateSale,
  getSale,
  createSales,
  fetchVehicleSales,
  fetchAllSales,
  getSaleStock,
  getPurchaseStock,
} = require("../Controllers/SalesController");

const router = express.Router();

// Sale Routes

router.route("/sale/create").post(verifyToken, createSales);
router.route("/sale/all").get(verifyToken, getPaginatedSales);
router.route("/sale/:saleid").get(verifyToken, getSale);
router.route("/sale/:billNo").get(verifyToken, getSale);
router.route("/sale/delete").post(verifyToken, deleteSale);
router.route("/sale/update").put(verifyToken, updateSale);
router.route("/vehicle-sales").get(verifyToken, fetchVehicleSales);
router.route("/admin/all-sales").get(verifyToken, fetchAllSales);


module.exports = router;
