const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  maxDrNo,
  addNewDoctor,
  updateDoctorDetails,
  fetchAllDoctors,
} = require("../Controllers/DoctorController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/doctor/maxcode").get(verifyToken, maxDrNo);
router.route("/doctor/create").post(verifyToken, addNewDoctor);
router.route("/doctor/update").put(verifyToken, updateDoctorDetails);
router.route("/doctor/list").get(verifyToken, fetchAllDoctors);

module.exports = router;
