const express = require("express");
const { masterDates } = require("../Controllers/DairyController");
const router = express.Router();

//dairy routes
router.route("/dairy/masters").post(masterDates);

module.exports = router;