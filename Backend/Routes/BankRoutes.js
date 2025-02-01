const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const { addNewBank } = require("../Controllers/BankController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/bank/create").post(verifyToken, addNewBank);
// router.route("/bank/update").put(verifyToken, updateDealer);
// router.route("/bank/delete").delete(verifyToken, updateDealer);

module.exports = router;
