const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  addNewAnimal,
  updateAnimalDetails,
  fetchAllAnimals,
  deleteAnimal,
  maxAnimalNO,
} = require("../Controllers/AnimalController");

const router = express.Router();

// bank routes --------------------------------------------------->
router.route("/animal/create").post(verifyToken, addNewAnimal);
router.route("/animal/update").put(verifyToken, updateAnimalDetails);
router.route("/animal/maxno").get(verifyToken, maxAnimalNO);
router.route("/animal/list").get(verifyToken, fetchAllAnimals);
router.route("/animal/delete").delete(verifyToken, deleteAnimal);

module.exports = router;
