const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  addNewTanker,
  maxTankerNO,
  updateTankerDetails,
  fetchAllTankers,
  deleteTanker,
} = require("../Controllers/TankerController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/tanker/maxcode").get(verifyToken, maxTankerNO);
router.route("/tanker/create").post(verifyToken, addNewTanker);
router.route("/tanker/update").put(verifyToken, updateTankerDetails);
router.route("/tanker/list").get(verifyToken, fetchAllTankers);
router.route("/tanker/delete").delete(verifyToken, deleteTanker);

module.exports = router;
