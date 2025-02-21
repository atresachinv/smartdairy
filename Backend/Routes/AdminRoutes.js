const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getAllDairy,
  createNewAccess,
} = require("../Controllers/AdminController");

const router = express.Router();

router.route("/all/dairies").post(verifyToken, getAllDairy);
router.route("/add/new-access").post(verifyToken, createNewAccess);

module.exports = router;
