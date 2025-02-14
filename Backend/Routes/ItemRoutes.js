const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem, 
  createMasterGrpItem,
  getAllGrpItems,
  getAllProducts,
} = require("../Controllers/ItemController");

const router = express.Router();

// Sale Routes
//Itemmaster routes
// router.route("/sale/create").post(createItem);
router.route("/item/all").get(verifyToken, getAllItems);
router.route("/all/products").get(verifyToken, getAllProducts); // mobilecollector
router.route("/grpitem/all").get(verifyToken, getAllGrpItems); 
router.route("/item/new").post(verifyToken, createItem);
router.route("/item/update").put(verifyToken, updateItem);
router.route("/item/delete").post(verifyToken, deleteItem);

//itemgroupmaster routes
router.route("/grpitem/new").post(createMasterGrpItem);

module.exports = router;
