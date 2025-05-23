import React, { useEffect, useState } from "react";
import "../../../../../Styles/Mainapp/Payments/MilkTransfer.css";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import { toast } from "react-toastify";
import { deleteCollection, getPayMasters } from "../../../../../App/Features/Payments/paymentSlice";
import { selectPaymasters } from "../../../../../App/Features/Payments/paymentSelectors";

const DeleteCollection = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate); // today's date
  const status = useSelector((state) => state.payment.deleteCollstatus); // today's date
  const payMasters = useSelector(selectPaymasters); // is payment lock
  const [isLocked, setIsLocked] = useState(false); // is payment master lock
  const [customerList, setCustomerList] = useState([]); // customerlist
  const [startDate, setStartDate] = useState(""); //start date
  const [endDate, setEndDate] = useState(""); //end date
  const [errors, setErrors] = useState({});
  // ------------------------------------------------------------------->
  // form Data --------------------------------------------------------->
  const initialValues = {
    currentdate: startDate || tDate,
    updatedate: endDate || tDate,
    fromCode: 1 || "",
    toCode: "",
    time: 2,
  };
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues((prevFormData) => ({
      ...prevFormData,
      toCode: customerList.length || "",
    }));
  }, [customerList]);

  // ------------------------------------------------------------------->
  // call customer data ------------------------------------------------>
  useEffect(() => {
    dispatch(listCustomer());
  }, []);

  // ------------------------------------------------------------------->
  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, []);

  // ----------------------------------------------------------------------->
  // check if payment is lock or not ------------------------------------->
  useEffect(() => {
    if (!payMasters || payMasters.length === 0) {
      dispatch(getPayMasters());
    }
  }, [dispatch, payMasters]);

  useEffect(() => {
    if (values.currentdate || values.updatedate) {
      const foundLocked = payMasters.some((master) => {
        const fromDate = new Date(master.FromDate);
        const toDate = new Date(master.ToDate);

        const currentdate = values.currentdate
          ? new Date(values.currentdate)
          : null;
        const updatedate = values.updatedate
          ? new Date(values.updatedate)
          : null;

        const isCurrentBetween =
          currentdate && currentdate >= fromDate && currentdate <= toDate;
        const isUpdateBetween =
          updatedate && updatedate >= fromDate && updatedate <= toDate;

        return (isCurrentBetween || isUpdateBetween) && master.islock === 1;
      });

      setIsLocked(foundLocked);
    } else {
      setIsLocked(false);
    }
  }, [values, payMasters]);
  // ----------------------------------------------------------------------->

  // ------------------------------------------------------------------->
  // handle form inputs ------------------------------------------------>
  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "fromDate") {
      setStartDate(value);

      // Update the values state
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    if (name === "toDate") {
      setEndDate(value);
      // Update the values state
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    setValues({ ...values, [name]: value });

    // Validate field and update errors state
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...fieldError,
    }));
  };

  // ------------------------------------------------------------------->
  // handle filed validation ------------------------------------------->
  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "fromCode":
      case "toCode":
        if (!/^\d+$/.test(value.toString())) {
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
    const fieldsToValidate = ["fromCode", "toCode", "time"];

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

  // ------------------------------------------------------------------->
  // Delete Milk Collection function ------------------------------------>
  const handleMilkCollectionDelete = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (isLocked) {
      toast.error("Payment Master is lock, Unlock and try again!");
      setValues({
        currentdate: tDate,
        updatedate: tDate,
        fromCode: 1,
        toCode: customerList.length,
        time: 2,
      });
      return;
    }

    try {
      const result = await dispatch(deleteCollection({ values })).unwrap();
      if (result?.status === 200) {
        setValues({
          currentdate: tDate,
          updatedate: tDate,
          fromCode: 1,
          toCode: customerList.length,
          time: 2,
        });
        toast.success("Milk Collection Deleted Successfully!");
      } else {
        toast.error("Failed to delete milk collection!");
      }
    } catch (error) {
      console.error("Milk transfer error:", error);
      toast.error(error?.message || "Failed to delete milk collection!");
    }
  };

  return (
    <form
      onSubmit={handleMilkCollectionDelete}
      className="delete-milk-collection-container w100 h1 d-flex-col a-center "
    >
      <span className="heading p10">Delete Milk Collection</span>
      <div className="milk-date-delete-container w50 h50 d-flex-col bg p10">
        {/* <span className="sub-heading t-center">From This Date</span> */}
        <div className="delete-dates-container w100 h80 d-flex-col sa bg3 br6 p10">
          <div className="date-container w100 d-flex a-center sa">
            <label htmlFor="fromDate" className="label-text">
              Dates
            </label>
            <input
              type="date"
              className="data w30"
              id="fromDate"
              name="currentdate"
              value={values.currentdate || ""}
              max={values.updatedate}
              onChange={handleInputs}
            />
            <label htmlFor="toDate" className="label-text">
              To
            </label>
            <input
              type="date"
              className="data w30"
              id="toDate"
              name="updatedate"
              value={values.updatedate || ""}
              max={tDate}
              onChange={handleInputs}
            />
          </div>
          <div className="customer-codes-container w100  d-flex  a-center sa">
            <label htmlFor="fromCode" className="label-text">
              Code
            </label>
            <label htmlFor="fromCode" className="label-text px10">
              From
            </label>
            <input
              className={`data w20 ${errors.fromCode ? "input-error" : ""}`}
              type="number"
              name="fromCode"
              id="fromCode"
              value={values.fromCode || ""}
              onChange={handleInputs}
              required
            />
            <label htmlFor="toCode" className="label-text">
              TO
            </label>
            <input
              className={`data w20 ${errors.toCode ? "input-error" : ""}`}
              type="number"
              name="toCode"
              id="toCode"
              value={values.toCode || ""}
              onChange={handleInputs}
              required
            />
          </div>
          <div className="customer-codes-container w100  d-flex  a-center sa">
            <span className="w20 label-text px10">Time</span>
            <input
              className="w20 h1"
              type="radio"
              name="time"
              id="all"
              defaultChecked
              value={2}
              onChange={handleInputs}
            />
            <label htmlFor="all" className="info-text px10">
              All
            </label>
            <input
              className="w20 h1"
              type="radio"
              name="time"
              id="mrg"
              value={0}
              onChange={handleInputs}
            />
            <label htmlFor="mrg" className="info-text px10">
              Morning
            </label>
            <input
              className="w20 h1"
              type="radio"
              name="time"
              id="eve"
              value={1}
              onChange={handleInputs}
            />
            <label htmlFor="eve" className="info-text px10">
              Evening
            </label>
          </div>
        </div>
        <div className="btn-container w100 h10 d-flex j-end">
          <button
            type="submit"
            className="w-btn m10"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteCollection;
