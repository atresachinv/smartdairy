const express = require("express");
const {
  userLogin,
  userRegister,
  userLogout,
} = require("../Controllers/UserController");

const router = express.Router();

// User Routes

router.route("/register").post(userRegister);
router.route("/login").post(userLogin);
router.route("/logout").post(userLogout);

// Milk Routes


// Customer Routes
module.exports = router;
