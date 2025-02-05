const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  userLogin,
  userRegister,
  userLogout,
  sendOtp,
  getUserProfile,
  verifySession,
} = require("../Controllers/UserController");

const router = express.Router();

// User Routes

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyToken, userLogout);
router.route("/verify-session").post(verifyToken, verifySession);
router.route("/profile/info").post(verifyToken, getUserProfile);
router.route("/send/otp").post(sendOtp);

// Customer Routes
module.exports = router;
