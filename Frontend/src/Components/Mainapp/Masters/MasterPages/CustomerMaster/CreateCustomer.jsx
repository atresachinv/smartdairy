import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { FaFileExcel } from "react-icons/fa";
import {
  createCustomer,
  getMaxCustNo,
  listCustomer,
  updateCustomer,
  uploadCustomerExcel,
} from "../../../../../App/Features/Mainapp/Masters/custMasterSlice";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
import { listRateCharts } from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import { useTranslation } from "react-i18next";
import { getBankList } from "../../../../../App/Features/Mainapp/Masters/bankSlice";
import { useParams, useSearchParams } from "react-router-dom";

const CreateCustomer = () => {
  const dispatch = useDispatch();
  const { cust_code } = useParams();
  const [searchParams] = useSearchParams();
  const isedit = searchParams.get("isedit") === "true";
  const { t } = useTranslation(["master", "common"]);
  const bankList = useSelector((state) => state.bank.banksList || []);
  const [isActive, setIsActive] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const toDate = useSelector((state) => state.date.toDate);
  const custno = useSelector((state) => state.customers.maxCustNo);
  const prefix = useSelector((state) => state.dairy.dairyData.prefix);
  const createstatus = useSelector((state) => state.customers.createstatus);
  const updatestatus = useSelector((state) => state.customers.updatestatus);
  const excelstatus = useSelector((state) => state.customers.excelstatus);
  const ratechartlist = useSelector((state) => state.ratechart.ratechartList);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null); // for excel file input
  const [excelData, setExcelData] = useState(null); // selected excel file data
  const [selectedBank, setSelectedBank] = useState("");

  const [formData, setFormData] = useState({
    cid: "",
    isActive: 1,
    isMember: 0,
    date: toDate,
    prefix: prefix,
    cust_no: custno,
    marathi_name: "",
    cust_name: "",
    member_date: null,
    mobile: "",
    aadhaar_no: "",
    caste: "",
    gender: 0,
    city: "",
    tehsil: "",
    district: "",
    pincode: "",
    milktype: 0,
    rctype: "",
    farmerid: "",
    bankNo: "",
    bankName: "",
    bank_ac: "",
    bankIFSC: "",
    deposit: 0,
    commission: 0,
    rebet: 0,
    transportation: 0,
    h_deposit: 0,
    h_deduction: 0,
    h_allrebet: 0,
    h_sanghrebet: 0,
    h_dairyrebet: 0,
    h_transportation: 0,
  });
  // console.log("first,", cust_code, isedit);
  useState(() => {
    dispatch(listRateCharts());
    dispatch(getBankList());
    dispatch(getMaxCustNo());
  }, [dispatch]);

  useEffect(() => {
    if (isedit) {
      setIsEditing(true); // Set editing mode explicitly

      setFormData((prevData) => ({
        ...prevData,
        cust_no: cust_code,
      }));

      // You can fetch customer data here if needed
    } else {
      setIsEditing(false); // Optional: reset if not in edit mode
    }
  }, [isedit, cust_code]);

  const resetForm = () => {
    setFormData({
      isActive: 1,
      isMember: 0,
      date: toDate,
      prefix: prefix,
      cust_no: custno,
      marathi_name: "",
      cust_name: "",
      member_date: null,
      mobile: "",
      aadhaar_no: "",
      caste: "",
      gender: 0,
      city: "",
      tehsil: "",
      district: "",
      pincode: "",
      milktype: 0,
      rctype: 0,
      farmerid: "",
      bankName: "",
      bank_ac: "",
      bankIFSC: "",
      deposit: 0,
      commission: 0,
      rebet: 0,
      transportation: 0,
      h_deposit: 0,
      h_deduction: 0,
      h_allrebet: 0,
      h_sanghrebet: 0,
      h_dairyrebet: 0,
      h_transportation: 0,
    });
    setErrors({});
    setIsEditing(false);
  };

  const handleIsActive = () => {
    setIsActive((prev) => !prev);
    setFormData((prevData) => ({
      ...prevData,
      isActive: !isActive ? 1 : 0, // Set 1 for true, 0 for false
    }));
  };

  const handleIsMember = () => {
    setIsMember((prev) => !prev);
    setFormData((prevData) => ({
      ...prevData,
      isMember: !isMember ? 1 : 0, // Set 1 for true, 0 for false
    }));
  };

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;

    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10), // For radio buttons, set the value as integer
      }));
    } else if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked ? 1 : 0, // For checkboxes, set 1 for true, 0 for false
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));

      const fieldError = validateField(name, value);
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors, ...fieldError };
        if (!value) delete updatedErrors[name]; // Clear error if field is empty
        return updatedErrors;
      });
    }
  };

  // ----------------------------------------------------------------------------------->
  // validate fields ------------------------------------------------------------------->

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "cust_no":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Cust number.";
        } else {
          delete errors[name];
        }
        break;

      case "marathi_name":
        if (!/^[\u0900-\u097F\sA-Za-z0-9\/]+$/.test(value)) {
          error[name] = "Invalid Marathi name.";
        } else {
          delete errors[name];
        }
        break;

      case "cust_name":
        if (!/^[a-zA-Z0-9\s\/]+$/.test(value)) {
          error[name] = "Invalid English name.";
        } else {
          delete errors[name];
        }
        break;

      case "mobile":
        if (!/^\d{10}$/.test(value.toString())) {
          error[name] = "Invalid Mobile number.";
        } else {
          delete errors[name];
        }
        break;

      case "aadhaar_no":
        if (!/^\d{12}$/.test(value.toString())) {
          error[name] = "Invalid Aadhaar number.";
        } else {
          delete errors[name];
        }
        break;

      case "city":
      case "tehsil":
      case "district":
      case "bankName":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid name.";
        } else {
          delete errors[name];
        }
        break;

      case "pincode":
        if (!/^\d{6}$/.test(value.toString())) {
          error[name] = "Invalid Pincode.";
        } else {
          delete errors[name];
        }
        break;

      case "farmerid":
        if (!/^\d{12}$/.test(value.toString())) {
          error[name] = "Invalid Farmer ID.";
        } else {
          delete errors[name];
        }
        break;

      case "bank_ac":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Bank Account.";
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = [
      "cust_no",
      "marathi_name",
      "cust_name",
      "mobile",
      "gender",
      "city",
      "tehsil",
      "district",
      "pincode",
      "milktype",
      "rctype",
    ];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };

  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  // Effect to search for customer when code changes ---------------------------------->
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.cust_no.length >= 1) {
        // Adjust length as necessary
        findCustomerByCode(formData.cust_no);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [formData.cust_no, isEditing]);

  const findCustomerByCode = (code) => {
    if (isEditing) {
      const customer = customerList.find(
        (customer) => customer.srno.toString() === code
      );

      if (customer) {
        setFormData((prev) => ({
          ...prev,
          cid: customer.cid,
          marathi_name: customer.engName,
          cust_name: customer.cname,
          mobile: customer.Phone,
          aadhaar_no: customer.cust_addhar,
          pincode: customer.cust_pincode,
          caste: customer.caste,
          bankIFSC: customer.cust_ifsc,
          gender: customer.gender,
          city: customer.City,
          tehsil: customer.tal,
          district: customer.dist,
          milktype: customer.milktype,
          rctype: customer.rcName,
          farmerid: customer.cust_farmerid,
          bankNo: customer.BankNo,
          bankName: customer.cust_bankname,
          bank_ac: customer.cust_accno,
          h_deposit: customer.h_deposit,
          h_deduction: customer.h_deduction,
          h_allrebet: customer.h_allrebet,
          h_sanghrebet: customer.h_sanghrebet,
          h_dairyrebet: customer.h_dairyrebet,
          h_transportation: customer.h_transportation,
        }));
      } else {
        toast.error("Customer not found.");
      }
    }
  };

  // handle bank selection ------------------------------------------------------------>
  // const handleBankChange = (e) => {
  //   const bid = e.target.value;
  //   setSelectedBank(bid);
  //   const bankdetails = bankList.filter((bank) => bank.id.toString() === bid);
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     bankName: bankdetails[0].name,
  //     bankIFSC: bankdetails[0].ifsc,
  //   }));
  // };

  useEffect(() => {
    const bankdetails = bankList.filter(
      (bank) => bank.id.toString() === formData.bankNo
    );
    setFormData((prevData) => ({
      ...prevData,
      bankName: bankdetails[0]?.name,
      bankIFSC: bankdetails[0]?.ifsc,
    }));
  }, [formData.bankNo, bankList]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!formData.bankName || !formData.bankIFSC) {
      return toast.error("Select Bank Again!");
    }
    try {
      if (isEditing) {
        // Update existing customer in DB
        const result = await dispatch(updateCustomer(formData)).unwrap();
        if (result.status === 200) {
          dispatch(listCustomer());
          resetForm();
          setIsEditing(false);
          toast.success("Customer updated successfully.");
        } else {
          toast.error(result.message);
        }
      } else {
        // Create new customer
        const result = await dispatch(createCustomer(formData)).unwrap();
        if (result.status === 200) {
          dispatch(listCustomer());
          dispatch(getMaxCustNo());
          resetForm();
          toast.success("Customer created successfully.");
        } else {
          toast.error(result.message);
        }
      }
      // Reset the form after fetching the new cust_no
    } catch (error) {
      toast.error("Failed to create Customer. Please try again.");
    }
  };

  //----------------------------------------------------------------------------------->
  // Download Excel format fto Upload customer >>>>>>>>>

  const downloadEmptyExcel = () => {
    // Define the column headers
    const headers = [
      "Code",
      "Customer_Name",
      "Marathi_Name",
      "Mobile",
      "Addhar_No",
      "Farmer_Id",
      "City",
      "Tehsil",
      "District",
      "Pincode",
      "Bank_Name",
      "Bank_AccNo",
      "Bank_IFSC",
      "Caste",
      "Gender",
      "Ratechart_Type",
    ];

    // Create a new workbook and add a worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, "customer_excel_format.xlsx");
  };

  //----------------------------------------------------------------------------------->
  // select excel file and upload

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger the file input click
  };

  const handleExcelChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Set file name after selection
      const reader = new FileReader();
      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        setExcelData(data);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleClear = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (excelData && excelData.length > 0) {
      const result = await dispatch(
        uploadCustomerExcel({ excelData, prefix })
      ).unwrap();
      if (result.status === 200) {
        setExcelData([]);
        dispatch(listCustomer());
        dispatch(getMaxCustNo());
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } else {
      toast.error("Please select and process an Excel file first.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`cust-details-setting-div w100 h1 d-flex sa ${
        isEditing ? "edit-bg" : "bg"
      }`}
    >
      <div className="customer-details-container w60 h1 d-flex-col">
        <div className="tilte-container w100 d-flex a-center sb p10">
          <span className="heading ">
            {isEditing ? `${t("m-custupdate")}` : `${t("m-custadd")}`}
          </span>
          <div className="toggle-inputs-div w30 h40 d-flex a-center sa">
            <span className="info-text w70 px10">
              Is Active <span className="req">*</span>
            </span>
            <button
              type="button"
              onClick={handleIsActive}
              className={`toggle-button ${isActive ? "on" : "off"}`}
              aria-pressed={isActive}
            >
              {isActive ? `${t("m-yes")}` : `${t("m-no")}`}
            </button>
          </div>
        </div>
        <div className="cust-div cust-details-div w100 h15 d-flex a-center sb">
          <div className="details-div w30 d-flex-col a-center px10">
            <span className="info-text w100">
              {t("m-ccode")}
              <span className="req">*</span>{" "}
              {errors.cust_no && (
                <span className="text error-message">{errors.cust_no}</span>
              )}
            </span>
            <input
              required
              className={`data w100 ${errors.cust_no ? "input-error" : ""}`}
              type="number"
              name="cust_no"
              value={formData.cust_no || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="details-div w70 d-flex a-center sb">
            <div className="toggle-inputs-div  h50 d-flex-col a-center sa">
              <span className="info-text w100 px10">{t("m-ismem")}</span>
              <button
                type="button"
                onClick={handleIsMember}
                className={`toggle-button ${isMember ? "on" : "off"}`}
              >
                {isMember ? `${t("m-yes")}` : `${t("m-no")}`}
              </button>
            </div>
            {isMember && (
              <div className="toggle-inputs-div w60 h50 d-flex-col sb">
                <label htmlFor="member_date" className="info-text w100 px10">
                  {t("m-mdate")}Membership Date
                </label>
                <input
                  className={`data w100 ${errors.cust_no ? "input-error" : ""}`}
                  type="date"
                  name="member_date"
                  id=""
                  onChange={handleInputChange}
                />
              </div>
            )}
          </div>
        </div>
        <div className="cust-div cust-details-div w100 h15 d-flex sb">
          <div className="mcname-details-div w50 d-flex-col a-center px10">
            <span className=" info-text w100">
              {t("m-mcname")}
              <span className="req">*</span>{" "}
              {errors.marathi_name && (
                <span className="text error-message">
                  {errors.marathi_name}
                </span>
              )}
            </span>
            <input
              required
              className={`data w100 ${
                errors.marathi_name ? "input-error" : ""
              }`}
              type="text"
              name="marathi_name"
              id=""
              onChange={handleInputChange}
              value={formData.marathi_name || ""}
            />
          </div>
          <div className="cname-details-div w50 d-flex-col a-center px10">
            <span className="info-text w100">
              {t("m-ecname")}
              <span className="req">*</span>
            </span>
            <input
              required
              className={`data w100 ${errors.cust_name ? "input-error" : ""}`}
              type="text"
              name="cust_name"
              id=""
              value={formData.cust_name || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="cust-div contact-details-div w100 h15 d-flex sb">
          <div className="mobile-details-div w25 d-flex-col a-center px10">
            <span className="info-text w100 ">
              {t("m-mobile")}
              <span className="req">*</span>
            </span>
            <input
              required
              className={`data w100 ${errors.mobile ? "input-error" : ""}`}
              type="number"
              name="mobile"
              id=""
              onChange={handleInputChange}
              value={formData.mobile || ""}
            />
          </div>
          <div className="Aadhhar-details-div w30 d-flex-col a-center px10">
            <span className="info-text w100">{t("m-addhar")}</span>{" "}
            {errors.aadhaar_no && (
              <span className="text error-message">{errors.aadhaar_no}</span>
            )}
            <input
              className={`data w100 ${errors.aadhaar_no ? "input-error" : ""}`}
              type="text"
              name="aadhaar_no"
              onChange={handleInputChange}
              value={formData.aadhaar_no || ""}
            />
          </div>
          <div className="caste-details-div w20 d-flex-col a-center px10">
            <span className="info-text w100">{t("m-caste")}</span>{" "}
            {errors.caste && (
              <span className="text error-message">{errors.caste}</span>
            )}
            <input
              className={`data w100 ${errors.caste ? "input-error" : ""}`}
              type="text"
              name="caste"
              onChange={handleInputChange}
              value={formData.caste || ""}
            />
          </div>
          <div className="gender-details-div w30 d-flex-col a-center px10">
            <span className="info-text w100 h50">{t("m-gender")}</span>
            <div className="gender-input-div w100 h50 d-flex">
              <div className="gender-input w50 h40 d-flex a-center sb">
                <input
                  className="data w20"
                  type="radio"
                  name="gender"
                  value="0"
                  id="male"
                  onChange={handleInputChange}
                  checked={formData.gender === 0}
                />
                <span className="info-text w80">{t("m-male")}</span>
              </div>
              <div className="gender-input w50 h40 d-flex a-center sb">
                <input
                  className="data w20"
                  type="radio"
                  name="gender"
                  value="1"
                  id="female"
                  onChange={handleInputChange}
                  checked={formData.gender === 1}
                />
                <span className="info-text w80">{t("m-female")}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="cust-div address-details-div w100 h15 d-flex-col sb">
          {/* <span className="info-text px10">Address Details :</span> */}
          <div className="address-details w100 h1 d-flex sb">
            <div className="city-details-div w25 d-flex-col a-center px10">
              <span className="info-text w100 ">
                {t("m-city")}
                <span className="req">*</span>
              </span>
              <input
                required
                className={`data w100 ${errors.city ? "input-error" : ""}`}
                type="text"
                name="city"
                id=""
                onChange={handleInputChange}
                value={formData.city || ""}
              />
            </div>
            <div className="tehsil-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">
                {t("m-tel")}
                <span className="req">*</span>{" "}
                {errors.tehsil && (
                  <span className="text error-message">{errors.tehsil}</span>
                )}
              </span>
              <input
                required
                className={`data w100 ${errors.tehsil ? "input-error" : ""}`}
                type="text"
                name="tehsil"
                id=""
                onChange={handleInputChange}
                value={formData.tehsil || ""}
              />
            </div>
            <div className="dist-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">
                {t("m-dist")}
                <span className="req">*</span>{" "}
                {errors.district && (
                  <span className="text error-message">{errors.district}</span>
                )}
              </span>
              <input
                required
                className={`data w100 ${errors.district ? "input-error" : ""}`}
                type="text"
                name="district"
                id=""
                onChange={handleInputChange}
                value={formData.district || ""}
              />
            </div>
            <div className="pincode-details-div w20 d-flex-col a-center px10">
              <span className="info-text w100">
                {t("m-pincode")}
                <span className="req">*</span>{" "}
                {errors.pincode && (
                  <span className="text error-message">{errors.pincode}</span>
                )}
              </span>
              <input
                required
                className={`data w100 ${errors.pincode ? "input-error" : ""}`}
                type="text"
                name="pincode"
                onChange={handleInputChange}
                value={formData.pincode || ""}
              />
            </div>
          </div>
        </div>
        <div className="cust-div milk-details-container w100 h15 d-flex-col sb">
          {/* <span className="info-text px10">Milk Details :</span> */}
          <div className="milk-details-div w100 h1 d-flex  sb">
            <div className="milk-type-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100 h50">
                {t("m-mtype")}
                <span className="req">*</span>
              </span>
              <div className="gender-input-div w100 h50 d-flex">
                <div className="gender-input w50 h40 d-flex a-center sb">
                  <input
                    className="data w20"
                    type="radio"
                    name="milktype"
                    value={0}
                    id="cow"
                    onChange={handleInputChange}
                    checked={formData.milktype === 0}
                  />
                  <span className="info-text w80">{t("m-mcow")}</span>
                </div>
                <div className="gender-input w50 h40 d-flex a-center sb">
                  <input
                    className="data w20"
                    type="radio"
                    name="milktype"
                    id="buffalo"
                    value={1}
                    onChange={handleInputChange}
                    checked={formData.milktype === 1}
                  />
                  <span className="info-text w80">{t("m-mbuffalo")}</span>
                </div>
              </div>
            </div>
            <div className="ratechart-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100">{t("m-rtype")}</span>{" "}
              <select
                name="rctype"
                id="ratechartlist"
                className={`data w100 ${errors.rctype ? "input-error" : ""}`}
                onChange={handleInputChange}
                value={formData.rctype || ""}
                aria-label="Select Ratechart"
              >
                <option value="">-- {t("m-select")} --</option>
                {ratechartlist && ratechartlist.length > 0 ? (
                  [
                    ...new Set(ratechartlist.map((chart) => chart.rctypename)),
                  ].map((rctypename, i) => (
                    <option key={i} value={rctypename}>
                      {rctypename}
                    </option>
                  ))
                ) : (
                  <option disabled>{t("m-no-rctype")}</option>
                )}
              </select>
            </div>

            <div className="farmerid-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100">{t("m-farmerid")}</span>{" "}
              {errors.farmerid && (
                <span className="text error-message">{errors.farmerid}</span>
              )}
              <input
                className={`data w100 ${errors.farmerid ? "input-error" : ""}`}
                type="number"
                name="farmerid"
                id=""
                onChange={handleInputChange}
                value={formData.farmerid}
              />
            </div>
          </div>
        </div>
        <div className="Bank-details-div w100 h15 d-flex sb">
          {/* <div className="bank-details w100 h1 d-flex f-wrap sb"> */}
          {/* <div className="bankname-details-div w40 d-flex-col a-center px10">
              <span className="info-text w100 ">{t("m-bname")}</span>{" "}
              {errors.bankName && (
                <span className="text error-message">{errors.bankName}</span>
              )}
              <input
                className={`data w100 ${errors.bankName ? "input-error" : ""}`}
                type="text"
                name="bankName"
                id=""
                onChange={handleInputChange}
                value={formData.bankName || ""}
              />
            </div>

            <div className="ifsc-details-div w30 d-flex-col a-center px10">
              <span className="info-text w100">{t("m-ifsc")}</span>{" "}
              {errors.bankIFSC && (
                <span className="text error-message">{errors.bankIFSC}</span>
              )}
              <input
                className={`data w100 ${errors.bankIFSC ? "input-error" : ""}`}
                type="text"
                name="bankIFSC"
                id=""
                onChange={handleInputChange}
                value={formData.bankIFSC || ""}
              />
            </div> */}

          <div className="details-div w40 d-flex-col a-center px10">
            <span className="info-text w100">{t("Select Bank")}</span>{" "}
            {errors.bankIFSC && (
              <span className="text error-message">{errors.bankIFSC}</span>
            )}
            <select
              name="bankNo"
              id="bankname"
              className="data"
              onChange={handleInputChange}
              value={formData.bankNo || ""}
            >
              <option value="">-- select bank --</option>
              {bankList.length > 0 ? (
                bankList.map((bank, i) => (
                  <option key={i} value={bank.id}>
                    {bank.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Banks Not Found!
                </option>
              )}
            </select>
          </div>

          <div className="details-div w40 d-flex-col a-center px10">
            <span className="info-text w100">{t("m-accno")}</span>{" "}
            {errors.bank_ac && (
              <span className="text error-message">{errors.bank_ac}</span>
            )}
            <input
              className={`data w100 ${errors.bank_ac ? "input-error" : ""}`}
              type="number"
              name="bank_ac"
              id=""
              onChange={handleInputChange}
              value={formData.bank_ac || ""}
            />
          </div>
          {/* </div> */}
        </div>
      </div>
      <div className="cust-data-settings w40 h1 d-flex-col p10">
        <span className="sub-heading px10">{t("m-settings-rl")} : </span>
        <div className="cust-div milk-settings-div w100 h20 d-flex sa">
          <div className="details-div w45 h50 d-flex a-center">
            <span className="info-text w70">{t("m-deposit")} :</span>
            <input
              className="data w30"
              type="number"
              name="deposit"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.deposit || ""}
            />
          </div>
          <div className="details-div w45 h50 d-flex a-center ">
            <span className="info-text w70">{t("m-commission")} :</span>
            <input
              className="data w30"
              type="number"
              name="commission"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.commission || ""}
            />
          </div>
        </div>
        <div className="cust-div milk-settings-div w100 h15 d-flex sa">
          <div className="details-div w45 h50 d-flex a-center ">
            <span className="info-text w70">{t("m-rebet")} :</span>
            <input
              className="data w30"
              type="number"
              name="rebet"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.rebet || ""}
            />
          </div>
          <div className="details-div w45 h50 d-flex a-center ">
            <span className="info-text w70">{t("m-transportation")} :</span>
            <input
              className="data w30"
              type="number"
              name="transportation"
              placeholder="0.00"
              onChange={handleInputChange}
              value={formData.transportation || ""}
            />
          </div>
        </div>
        <div className="data-show-hide--setting-container w100 h60 d-flex-col">
          <span className="sub-heading px10">{t("m-h-s-settings")} :</span>
          <div className="show-hide-content-div w100 h20 d-flex sa">
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_deposit"
                onChange={handleInputChange}
              />
              <span className="label-text w90">{t("m-off-deposit")}</span>
            </div>
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_deduction"
                onChange={handleInputChange}
              />
              <span className="label-text w90">{t("m-off-deduction")}</span>
            </div>
          </div>
          <div className="show-hide-content-div w100 h20 d-flex sa">
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_allrebet"
                id=""
                onChange={handleInputChange}
              />
              <span className="label-text w90">{t("m-off-allrebet")}</span>
            </div>
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_sanghrebet"
                onChange={handleInputChange}
              />
              <span className="label-text w90">{t("m-off-sanghrebet")}</span>
            </div>
          </div>
          <div className="show-hide-content-div w100 h20 d-flex sa">
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_dairyrebet"
                onChange={handleInputChange}
              />
              <span className="label-text w90">{t("m-off-dairyrebet")}</span>
            </div>
            <div className="details-div w50 d-flex a-center ">
              <input
                className="data w10"
                type="checkbox"
                name="h_transportation"
                id=""
                onChange={handleInputChange}
              />
              <span className="label-text w90">
                {t("m-off-transportation")}
              </span>
            </div>
          </div>
        </div>

        <div className="button-container w100 h10 d-flex j-end">
          {/* <button
            className="w-btn mx10"
            type="submit"
            onClick={handleEditClick}
          >
            {isEditing ? `${t("m-create")}` : `${t("m-edit")}`}
          </button> */}
          {isEditing ? (
            <button
              className="w-btn"
              type="submit"
              disabled={updatestatus === "loading"}
            >
              {updatestatus === "loading"
                ? `${t("m-updating")}`
                : `${t("m-update")}`}
            </button>
          ) : (
            <button
              className="w-btn"
              type="submit"
              disabled={createstatus === "loading"}
            >
              {createstatus === "loading"
                ? `${t("m-creating")}`
                : `${t("m-create")}`}
            </button>
          )}
        </div>
        <div className="select-excel-button-container w100 h30 d-flex-col sa">
          <div className="excel-format-container w100 h50 d-flex a-center sb">
            <label htmlFor="d-excel" className="label-text">
              {t("m-d-excel")}
            </label>
            <button
              type="button"
              className="w-btn"
              id="d-excel"
              onClick={downloadEmptyExcel}
            >
              {t("m-download")}
            </button>
          </div>
          <div className="excel-format-container w100 h50 d-flex a-center sb">
            {!fileName ? (
              <>
                <label htmlFor="selectExcel" className="label-text">
                  {t("m-excel")}
                </label>
                <button
                  id="selectExcel"
                  className="choose-excel-btn"
                  type="button"
                  onClick={handleButtonClick}
                >
                  {t("m-c-file")}
                </button>
              </>
            ) : (
              <div className="selected-file d-flex a-center">
                <FaFileExcel
                  className="file-icon"
                  style={{ color: "green", fontSize: "20px" }}
                />
                <span className="file-name px10">{fileName}</span>
                <span onClick={handleClear} className="btn">
                  X
                </span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleExcelChange}
            />
            <button
              className="w-btn "
              type="submit"
              onClick={handleExcelUpload}
              disabled={excelstatus === "loading"}
            >
              {excelstatus === "loading"
                ? `${t("m-uploading")}`
                : `${t("m-upload")}`}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateCustomer;
