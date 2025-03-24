const express = require("express");
const verifyToken = require("../Middlewares/VerifyToken");

const {
  getAllDeductions,
  createDeduction,
  updateDynamicFields,
  deleteDeductions,
  getAllDeductionsDetails,
  createDeductionDetails,
  updateDynamicFieldsDetails,
  deleteDeductionsDetails,
  getDeductionsDid,
  getDedDetailDid,
} = require("../Controllers/DeductionController");

const router = express.Router();

// Deduction routes
router.route("/deductions").post(verifyToken, getAllDeductions);
router.route("/getmax-deductions").post(verifyToken, getDeductionsDid);
router.route("/create-deduction").post(verifyToken, createDeduction);
router.route("/update-deduction").patch(verifyToken, updateDynamicFields);
router.route("/delete-deduction").delete(verifyToken, deleteDeductions);

//deduction details routes
router.route("/getmax-ded-details").post(verifyToken, getDedDetailDid);
router.route("/deduction-details").post(verifyToken, getAllDeductionsDetails);
router
  .route("/create-deduction-details")
  .post(verifyToken, createDeductionDetails);
router
  .route("/update-deduction-details")
  .patch(verifyToken, updateDynamicFieldsDetails);
router
  .route("/delete-deduction-details")
  .delete(verifyToken, deleteDeductionsDetails);

module.exports = router;
