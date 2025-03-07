const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  checkUniqueDname,
  checkUniqueusername,
  userLogin,
  userRegister,
  userLogout,
  sendOtp,
  getUserProfile,
  verifySession,
} = require("../Controllers/UserController");

const router = express.Router();

// User Routes

router.route("/check/dairyname").post(checkUniqueDname);
router.route("/check/username").post(checkUniqueusername);
router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyToken, userLogout);
router.route("/verify-session").post(verifyToken, verifySession);
router.route("/profile/info").post(verifyToken, getUserProfile);
router.route("/send/otp").post(sendOtp);

// Customer Routes
module.exports = router;
