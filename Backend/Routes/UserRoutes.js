const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  userLogin,
  userRegister,
  userLogout,
  dairyInfo,
} = require("../Controllers/UserController");

const router = express.Router();

// User Routes

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);

// Dairy info Route
router.route("/dairyinfo").post(verifyToken, dairyInfo);

// Customer Routes
module.exports = router;
