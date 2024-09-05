const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const { purchaseInfo } = require("../Controllers/PurchaseController");
const router = express.Router();

//purchase Routes

router.route("/sales/report").post(verifyToken, purchaseInfo);

module.exports = router;
