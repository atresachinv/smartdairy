const express = require("express");
const { userLogin } = require("../Controllers/UserController");

const router = express.Router();

router.route("/login").post(userLogin);

module.exports = router;
