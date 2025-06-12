import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";
import { listEmployee } from "../../../../App/Features/Mainapp/Masters/empMasterSlice";
import { useTranslation } from "react-i18next";
import { MdDeleteForever } from "react-icons/md";
import "../../../../Styles/Mainapp/Reports/CenterMilkReports.css";
import Swal from "sweetalert2";
import {
  deleteCenterMilkColl,
  getMasterCenterMilkCOll,
} from "../../../../App/Features/Mainapp/Milk/DairyMilkSalesSlice";
import Spinner from "../../../Home/Spinner/Spinner";
import { toast } from "react-toastify";

const CenterReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common", "master"]);
  const tDate = useSelector((state) => state.date.toDate);
  const centerList = useSelector((state) => state.center.centersList);
  const Emplist = useSelector((state) => state.emp.emplist || []);
  const cMReport = useSelector(
    (state) => state.dMilkSales.masterMilkData || []
  );
  const fetchStatus = useSelector(
    (state) => state.dMilkSales.fetchstatus || []
  );

  const [errors, setErrors] = useState({});
  const fdateRef = useRef(null);
  const tdateRef = useRef(null);
  const centerRef = useRef(null);
  const collRef = useRef(null);
  const litersRef = useRef(null);

  const initialValues = {
    centerid: "",
    collectedBy: "",
    fromDate: tDate || "",
    toDate: tDate || "",
  };

  const [values, setValues] = useState(initialValues);

  //  -------------------------------------------------------------------------------------------------->
  //  -------------------------------------------------------------------------------------------------->

  // console.log("cMReport", cMReport);

  useEffect(() => {
    dispatch(centersLists());
    dispatch(listEmployee());
  }, []);

  const milkCollectors = useMemo(() => {
    return Emplist.filter(
      (emp) =>
        emp.center_id.toString() === values.centerid &&
        emp.designation === "milkcollector"
    );
  }, [values.centerid, Emplist]);

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "liters":
        if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
          error[name] = "Invalid liters.";
        } else {
          delete errors[name];
        }
        break;

      case "fat":
      case "snf":
        if (!/^\d+(\.\d{1,1})?$/.test(value.toString())) {
          error[name] = `Invalid ${[name]}.`;
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
      "code",
      "cname",
      "liters",
      "fat",
      "snf",
      "rate",
      "amt",
    ];

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

  //  handle input fields ------------------------------------------------------------------------>
  const handleInputs = (e) => {
    const { name, value } = e.target;

    // Update values state
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    // Validate the field and update error state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldError,
    }));
  };

  // handle center milk collection report ------------------------------->
  const handleCenterColl = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      getMasterCenterMilkCOll({
        fromDate: values.fromDate,
        toDate: values.toDate,
      })
    ).unwrap();
  };

  // delete selected center milk collection report ------------------------------->

  const handleDeleteCenterColl = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await dispatch(
          deleteCenterMilkColl({
            id: id,
          })
        ).unwrap();
        if (res.status === 200) {
          dispatch(
            getMasterCenterMilkCOll({
              fromDate: values.fromDate,
              toDate: values.toDate,
            })
          );
          toast.success("Center Milk Collection deleted successfully");
        } else {
          toast.error("Failed to delete Center Milk Collection");
        }
      } catch (error) {
        toast.error("Failed to server delete the Center Milk Collection");
      }
    }
  };

  return (
    <div className="center-milk-coll-report-container w100 h1 d-flex-col p10 sb">
      <span className="heading">सेंटर दुध संकलन रिपोर्ट :</span>
      <div className="master-dates-btn-outer-container w100 h30 d-flex-col a-center sb bg-light-green br9 py10 my10">
        <div className="master-dates-btn-container w100 h50 d-flex a-center sa bg-light-green br9">
          <div className="master-dates-container w70 h10 d-flex a-center sa">
            <label className="flabel label-text w25" htmlFor="fromdate">
              मस्टर निवडा
            </label>
            <label className="fd-txt label-text w15" htmlFor="fromdate">
              पासुन :
            </label>
            <input
              className="data w25"
              type="date"
              name="fromDate"
              id="fromdate"
              value={values.fromDate || ""}
              onChange={handleInputs}
            />
            <label className="td-txt label-text w5" htmlFor="todate">
              ते :
            </label>
            <input
              className="data w25"
              type="date"
              name="toDate"
              id="toDate"
              value={values.toDate || ""}
              onChange={handleInputs}
            />
          </div>
          <button className="w-btn" type="button" onClick={handleCenterColl}>
            रिपोर्ट
          </button>
        </div>
        <div className="center-milk-coll-details-div w100 h50 d-flex a-center">
          <div className="select-center-div w50 d-flex a-center sb px10">
            <label htmlFor="centerid" className="info-text w30">
              सेंटर निवडा : <span className="req">*</span>{" "}
            </label>
            <select
              className="data w70"
              name="centerid"
              id="centerid"
              value={values.centerid}
              onChange={handleInputs}
              ref={centerRef}
              onKeyDown={(e) => handleKeyDown(e, collRef)}
            >
              <option value="">-- सेंटर निवडा --</option>
              {centerList.length > 0 ? (
                centerList.map((center, i) => (
                  <option key={i} value={center.center_id}>
                    {center.center_name}
                  </option>
                ))
              ) : (
                <></>
              )}
            </select>
          </div>
          <div className="select-center-div w50 d-flex a-center sb px10">
            <label htmlFor="collectedBy" className="info-text w35">
              संकलक निवडा :
            </label>
            <select
              className="data w65"
              name="collectedBy"
              id="collectedBy"
              value={values.collectedBy}
              onChange={handleInputs}
              disabled={!values.centerid}
              ref={collRef}
              onKeyDown={(e) => handleKeyDown(e, litersRef)}
            >
              <option value="">-- संकलक निवडा --</option>
              {milkCollectors.map((emp, i) => (
                <option key={i} value={emp.emp_mobile}>
                  {emp.emp_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="center-milk-collection-details w100 h80 d-flex-col mh80 bg">
        <div className="center-milk-heading-container w100 h20 p10 d-flex t-center sticky-top sb bg7 br-top">
          <div className="m-date w10 h1 d-flex a-center f-label-text">
            दिनांक
          </div>
          <div className="m-date w5 h1 d-flex a-center f-label-text">सत्र</div>
          <div className="center-milk-container w25 h1 d-flex-col">
            <div className="center-milk-container w100 h50 d-flex a-center sb">
              <span className="w100 f-label-text t-center">
                सेंटर दुध संकलन
              </span>
            </div>
            <div className="center-milk-container w100 h50 d-flex a-center sa">
              <span className="f-label-text w20">लिटर</span>
              <span className="f-label-text w15">Fat</span>
              <span className="f-label-text w15">Snf</span>
              <span className="f-label-text w20">दर</span>
              <span className="f-label-text w20">रक्कम</span>
            </div>
          </div>
          <div className="center-milk-container w25 h1 d-flex-col">
            <div className="center-milk-container w100 h50 d-flex a-center sb">
              <span className="w100 f-label-text t-center">
                मिळालेले दुध संकलन
              </span>
            </div>
            <div className="center-milk-container w100 h50 d-flex a-center sa">
              <span className="f-label-text w20">लिटर</span>
              <span className="f-label-text w15">Fat</span>
              <span className="f-label-text w15">Snf</span>
              <span className="f-label-text w20">दर</span>
              <span className="f-label-text w20">रक्कम</span>
            </div>
          </div>
          <div className="center-milk-container w25 h1 d-flex-col">
            <div className="center-milk-container w100 h50 d-flex a-center sb">
              <span className="w100 f-label-text t-center">दुध संकलन फरक</span>
            </div>
            <div className="center-milk-container w100 h50 d-flex a-center sa">
              <span className="f-label-text w20">लिटर</span>
              <span className="f-label-text w15">Fat</span>
              <span className="f-label-text w15">Snf</span>
              <span className="f-label-text w20">दर</span>
              <span className="f-label-text w20">रक्कम</span>
            </div>
          </div>
          <div className="m-date w5 h1 d-flex a-center f-label-text t-centerw">
            <span className="w100 t-center">Action</span>
          </div>
        </div>
        {fetchStatus === "loading" ? (
          <div className="box d-flex center">
            <Spinner />
          </div>
        ) : cMReport && cMReport.length > 0 ? (
          cMReport.map((data, i) => (
            <div
              className="center-milk-data-container w100 p10 d-flex a-center t-center sticky-top sb"
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <div className="m-date w10 h1 d-flex a-center text">
                {data.coll_date.slice(0, 10)}
              </div>
              <div className="m-date w5 h1 d-flex a-center text">
                {data.coll_shift === 0 ? "M" : "E"}
              </div>
              <div className="center-milk-container w25 h1 d-flex-col">
                <div className="center-milk-container w100 h1 d-flex a-center sa">
                  <span className="text w20">{data.R_tliter}</span>
                  <span className="text w15">{data.R_afat}</span>
                  <span className="text w15">{data.R_asnf}</span>
                  <span className="text w20">{data.R_arate}</span>
                  <span className="text w20">{data.R_tamt}</span>
                </div>
              </div>
              <div className="center-milk-container w25 h1 d-flex-col">
                <div className="center-milk-container w100 h1 d-flex a-center sa">
                  <span className="text w20">{data.tliter}</span>
                  <span className="text w15">{data.afat}</span>
                  <span className="text w15">{data.asnf}</span>
                  <span className="text w20">{data.arate}</span>
                  <span className="text w20">{data.tamt}</span>
                </div>
              </div>
              <div className="center-milk-container w25 h1 d-flex-col">
                <div className="center-milk-container w100 h1 d-flex a-center sa">
                  <span className="text w20">{data.D_tliter}</span>
                  <span className="text w15">{data.D_afat}</span>
                  <span className="text w15">{data.D_asnf}</span>
                  <span className="text w20">{data.D_arate}</span>
                  <span className="text w20">{data.D_tamt}</span>
                </div>
              </div>
              <div className="m-date w5 h1 d-flex a-center">
                <span
                  className="w100 label-text t-center req"
                  onClick={() => handleDeleteCenterColl(data.id)}
                >
                  <MdDeleteForever />
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="box d-flex center">No record found!</div>
        )}
      </div>
    </div>
  );
};

export default CenterReports;
