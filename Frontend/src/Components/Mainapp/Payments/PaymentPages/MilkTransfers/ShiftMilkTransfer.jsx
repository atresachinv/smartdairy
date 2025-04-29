import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import { toast } from "react-toastify";
import { transferToShift } from "../../../../../App/Features/Payments/paymentSlice";
import { selectPaymasters } from "../../../../../App/Features/Payments/paymentSelectors";

const ShiftMilkTransfer = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate); // today's date
  const status = useSelector((state) => state.payment.transferCollshiftstatus); // today's date
  const payMasters = useSelector(selectPaymasters); // is payment lock
  const [isLocked, setIsLocked] = useState(false); // is payment master lock
  const [customerList, setCustomerList] = useState([]); // customerlist
  const [currentDate, setCurrentDate] = useState(""); //current date
  const [updatedDate, setUpdatedDate] = useState(""); //updated date
  const [errors, setErrors] = useState({});

  // ------------------------------------------------------------------->
  // form Data --------------------------------------------------------->
  const initialValues = {
    currentdate: currentDate || tDate,
    updatedate: updatedDate || tDate,
    fromCode: 1 || "",
    toCode: "",
    time: 0,
    updatetime: 0,
  };
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues((prevFormData) => ({
      ...prevFormData,
      toCode: customerList.length || "",
    }));
  }, [customerList]);

  // ------------------------------------------------------------------->
  // handle form inputs ------------------------------------------------>
  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "currentDate") {
      setCurrentDate(value);

      // Update the values state
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }

    if (name === "updatedate") {
      setUpdatedDate(value);
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
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Customer code.";
        } else {
          delete errors[name];
        }
        break;

      case "cname":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid Customer Name.";
        } else {
          delete errors[name];
        }
        break;

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
      "urrentDate",
      "updatedate",
      "fromCode",
      "toCode",
      "time",
      "updatetime",
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
  // Milk copy to database function ------------------------------------>
  const handleMilkTransferToShift = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Payment Master is lock, Unlock and try again!");
      return;
    }
    try {
      const result = await dispatch(
        transferToShift({
          currentdate: values.currentdate,
          updatedate: values.updatedate,
          fromCode: values.fromCode,
          toCode: values.toCode,
          time: values.time,
          updatetime: values.updatetime,
        })
      ).unwrap();
      if (result?.status === 200) {
        toast.success(result.message);
      } else {
        toast.error(`Milk Collection Transfer to shift failed, try again! `);
      }
    } catch (error) {
      console.error("Milk Collection transfer to shift Error:", error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <form
      onSubmit={handleMilkTransferToShift}
      className="shift-wise-milk-transfer-container w100 h1 d-flex-col a-center "
    >
      <span className="heading p10">Transfer Shift Wise Milk Collection</span>
      <div className="milk-date-transfer-container w50 h90 d-flex-col sa bg p10">
        <span className="sub-heading t-center">From This Date</span>
        <div className="transfer-dates-container w100 h40 d-flex-col sa bg3 br6 p10">
          <input
            type="date"
            className="data w40"
            name="currentdate"
            id="date"
            value={values.currentdate || ""}
            max={tDate}
            onChange={handleInputs}
          />
          <div className="customer-codes-container w100  d-flex  a-center sb">
            <span className="label-text">Code</span>
            <label htmlFor="fromCode" className="label-text px10">
              From
            </label>
            <input
              className="data w20"
              type="number"
              name="fromCode"
              id="fromCode"
              value={values.fromCode || ""}
              onChange={handleInputs}
            />
            <label htmlFor="toCode" className="label-text">
              TO
            </label>
            <input
              className="data w20"
              type="number"
              name="toCode"
              id="toCode"
              value={values.toCode || ""}
              onChange={handleInputs}
            />
          </div>
          <div className="customer-codes-container w100  d-flex  a-center sb">
            <span className="w20 label-text px10">Time</span>
            {/* <input
              className="w20 h1"
              type="radio"
              name="time"
              id="all"
              defaultChecked
              onChange={handleInputs}
            />
            <label
              htmlFor="all"
              className="info-text px10"
              name="time"
              value={2}>
              All
            </label> */}
            <input
              className="w20 h1"
              type="radio"
              name="time"
              id="mrg"
              value={0}
              defaultChecked
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
        <span className="sub-heading t-center">To This Date</span>
        <div className="transfer-dates-container w100 h40 d-flex-col sa bg3 br6 p10">
          <input
            type="date"
            className="data w40"
            name="updatedate"
            id="updatedate"
            value={values.updatedate || ""}
            max={tDate}
            onChange={handleInputs}
          />
          <div className="customer-codes-container w100  d-flex  a-center sb">
            <span className="w20 label-text px10">Time</span>
            {/* <input
              className="w20 h1"
              type="radio"
              name="updatetime"
              id="all"
              value={2}
              defaultChecked
              onChange={handleInputs}
            />
            <label htmlFor="all" className="info-text px10">
              All
            </label> */}
            <input
              className="w20 h1"
              type="radio"
              name="updatetime"
              id="mrg"
              value={0}
              defaultChecked
              onChange={handleInputs}
            />
            <label htmlFor="mrg" className="info-text px10">
              Morning
            </label>
            <input
              className="w20 h1"
              type="radio"
              name="updatetime"
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
          <button type="reset" className="w-btn m10">
            Cancel
          </button>
          <button
            type="submit"
            className="w-btn m10"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Transfering..." : "Transfer"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ShiftMilkTransfer;
