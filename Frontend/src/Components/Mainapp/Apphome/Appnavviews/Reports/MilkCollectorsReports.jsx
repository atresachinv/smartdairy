import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";
import {
  getAllMilkSankalan,
  mobileMilkCollReport,
} from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";

const MilkCollectorsReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const tDate = useSelector((state) => state.date.toDate);
  const [errors, setErrors] = useState({});
  const milkData = useSelector(
    (state) => state.milkCollection.allMilkCollector
  );
  const Emplist = useSelector((state) => state.emp.emplist);

  useEffect(() => {
    dispatch(listEmployee());
  }, []);

  // Fillterd Only Milk Collectors
  const milkCollectors = Emplist.filter(
    (employee) => employee.designation === "milkcollector"
  );

  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );

  useEffect(() => {
    dispatch(mobileMilkCollReport());
  }, [dispatch]);

  const calculateTotalLiters = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.Litres), 0);
  };

  const records = mobileMilkReport.length;
  const totalLiters = calculateTotalLiters(mobileMilkReport);

  // Function to download Excel file
  const downloadExcel = () => {
    if (mobileMilkReport.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel (excluding automatic headers)
    const excelData = mobileMilkReport.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres,
      collection.SampleNo,
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Code", "Customer Name", "Liters", "Sample No."],
      ...excelData,
      [],
      ["Total Liters", "=", totalLiters.toFixed(2)],
    ]);

    // Get current date and time for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Mobile_Milk_Collection_${formattedDate}.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };

  const initialValues = {
    fromDate: "",
    toDate: "",
  };

  const [values, setValues] = useState(initialValues);

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "fromDate":
      case "toDate":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value.toString())) {
          error[name] = "Invalid Customer code.";
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
    const fieldsToValidate = ["fromDate", "toDate"];

    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, values[field]);
      if (Object.keys(fieldError).length > 0) {
        validationErrors[field] = fieldError[field];
      }
    });

    setErrors(validationErrors);
    return validationErrors;
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;

    // Update values state
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Additional validation logic if needed
    const fieldError = validateField(name, value);
    if (fieldError) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldError,
      }));
    }
  };

  const handleShowData = (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(
      getAllMilkSankalan({ fromDate: values.fromDate, toDate: values.toDate })
    );
  };

  return (
    <>
      <div className="milk-collector-reports w100 h1 d-flex-col sb">
        <div className="select-milk-collector-conatiner w100 h20 d-flex a-center sb px10">
          <form
            onSubmit={handleShowData}
            className="label-select-div w50 d-flex-col a-center j-start ">
            <label htmlFor="date" className="label-text w100">
              Select Dates
            </label>
            <div className="dates-btn-container w100 h1 d-flex a-center sb">
              <div className="dates-container w80 h1 d-flex a-center">
                <input
                  className={`data w45 ${errors.fromDate ? "input-error" : ""}`}
                  type="date"
                  name="fromDate"
                  id="fromDate"
                  onChange={handleInputs}
                  required
                  max={tDate}
                />
                <label htmlFor="toDate" className="label-text px10">
                  To
                </label>
                <input
                  className={`data w45 ${errors.toDate ? "input-error" : ""}`}
                  type="date"
                  name="toDate"
                  id="toDate"
                  onChange={handleInputs}
                  required
                  max={tDate}
                />
              </div>
              <button type="submit" className="btn">
                Show
              </button>
            </div>
          </form>
          <div className="label-select-div w30 d-flex-col a-center j-start">
            <label htmlFor="milk-collector" className="label-text w100">
              Select Milk Collector
            </label>
            <select className="data w100 h1" name="" id="milk-collector">
              <option value="">--Select--</option>
              {milkCollectors.map((emp, i) => (
                <option key={i} value={emp.emp_id}>
                  {emp.emp_name}
                </option>
              ))}
            </select>
          </div>

          <button className="btn" onClick={downloadExcel}>
            <span className="f-heading px10">
              {t("milkcollection:m-d-excel")}
            </span>
            <FaDownload />
          </button>
        </div>
        <div className="milkdata-container w100 h80 d-flex-col mh90 hidescrollbar  bg">
          <div className="employeename-and-data-tile-container w100 h15 d-flex-col t-center bg1">
            <div className="empname-container w100 h50 d-flex a-center">
              <span className="f-label-text w10">Emp ID</span>
              <span className="f-label-text w40">Employee Name</span>
            </div>
            <div className="data-headings w100 h50 d-flex a-center sb">
              <span className="f-label-text w10">Code</span>
              <span className="f-label-text w40">Customer Name</span>
              <span className="f-label-text w10">Liters</span>
              <span className="f-label-text w15">SampleNo</span>
            </div>
          </div>
          {milkData.map((milk, i) => (
            <div className="milk-data-container w100 h10 d-flex a-center t-center sb">
              <span className="text w10">{milk.rno}</span>
              <span className="text w40 t-start">{milk.cname}</span>
              <span className="text w10">{milk.Litres}</span>
              <span className="text w15">{milk.SampleNo}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MilkCollectorsReports;
