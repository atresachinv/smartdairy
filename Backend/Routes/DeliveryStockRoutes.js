const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  createDeliverStock,
  getDeliverStocks,
} = require("../Controllers/DeliveryStocks");

const router = express.Router();

//Delivery stocks routes
router.route("/new/deliverystock").post(verifyToken, createDeliverStock);
router.route("/all/deliverystock").get(verifyToken, getDeliverStocks);

module.exports = router;
