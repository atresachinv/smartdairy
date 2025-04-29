import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "../../../../../Styles/Mainapp/Payments/MilkTransfer.css";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../../Home/Spinner/Spinner";
import {
  getMilkToTransfer,
  getPayMasters,
  getTransferedMilk,
  transferTOCustomer,
} from "../../../../../App/Features/Payments/paymentSlice";
import { selectPaymasters } from "../../../../../App/Features/Payments/paymentSelectors";

const CustomerMilkTransfer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const tDate = useSelector((state) => state.date.toDate);
  const payMasters = useSelector(selectPaymasters); // is payment lock
  const MilkData = useSelector((state) => state.payment.customerMilkData);
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const transferedMilk = useSelector(
    (state) => state.payment.transferedMilkData || []
  );
  const milkStatus = useSelector((state) => state.payment.getMilkstatus);
  const tranStatus = useSelector((state) => state.payment.transferedMilkstatus);
  const [isLocked, setIsLocked] = useState(false); // is payment master lock
  const [customerList, setCustomerList] = useState([]);
  const [changedDate, setChangedDate] = useState("");
  const [errors, setErrors] = useState({});

  const initialValues = {
    date: changedDate || tDate,
    code: "",
    cname: "",
    updatecode: "",
    updatecname: "",
    acccode: "",
    fromDate: "",
    toDate: "",
  };

  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      // Update the values state
      setValues((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));

      // Validate the field for other errors
      const fieldError = validateField(name, value);
      setErrors((prevErrors) => ({
        ...prevErrors,
        ...fieldError,
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
      "code",
      "cname",
      "updatecode",
      "updatecname",
      "acccode",
      "formDate",
      "toDate",
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
  // ----------------------------------------------------------------------->
  // check if payment is lock or not ------------------------------------->
  useEffect(() => {
    if (!payMasters || payMasters.length === 0) {
      dispatch(getPayMasters());
    }
  }, [dispatch, payMasters]);

  useEffect(() => {
    if (values.fromDate && values.toDate) {
      const foundLocked = payMasters.some(
        (master) =>
          master.FromDate?.slice(0, 10) === values.fromDate.slice(0, 10) &&
          master.ToDate?.slice(0, 10) === values.toDate.slice(0, 10) &&
          master.islock === 1
      );

      setIsLocked(foundLocked);
    } else {
      setIsLocked(false);
    }
  }, [values, payMasters]);
  // ----------------------------------------------------------------------->

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  const findCustomerByCode = (code) => {
    if (!code) {
      setValues((prev) => ({ ...prev, cname: "" }));
      return;
    }
    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );

    if (customer) {
      setValues((prev) => ({
        ...prev,
        cname: customer.cname,
      }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  // Effect to search for customer when code changes
  useEffect(() => {
    if (values.code.trim().length > 0) {
      const handler = setTimeout(() => {
        findCustomerByCode(values.code.trim());
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [values.code, dispatch]);

  //-------------------------------------------------------------------------------->
  // find customer by code for to  --------------------------------------------------------->

  const findToCustomerByCode = (code) => {
    if (!code) {
      setValues((prev) => ({ ...prev, updatecname: "" }));
      return;
    }

    // Ensure the code is a string for comparison
    const customer = customerList.find(
      (customer) => customer.srno.toString() === code
    );

    if (customer) {
      setValues((prev) => ({
        ...prev,
        updatecname: customer.cname,
        acccode: customer.cid,
      }));
    } else {
      setValues((prev) => ({ ...prev, updatecname: "" })); // Clear cname if not found
    }
  };

  // Effect to search for customer when code changes for to --------------------------------->
  useEffect(() => {
    if (values.updatecode.trim().length > 0) {
      const handler = setTimeout(() => {
        findToCustomerByCode(values.updatecode.trim());
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [values.updatecode, dispatch]);
  //------------------------------------------------------------------------------------>

  // Select all the text when input is focused
  const handleFocus = (e) => {
    e.target.select();
  };

  const fetchCustomerMilkRecords = (e) => {
    e.preventDefault();
    if (!values.code || !values.cname || !values.fromDate || !values.toDate) {
      toast.error("Please Fill All Fields!");
      return;
    }
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    dispatch(
      getMilkToTransfer({
        code: values.code,
        fromDate: values.fromDate,
        toDate: values.toDate,
      })
    );
  };

  const UpdateCustomerMilkRecords = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Payment Master is lock, Unlock and try again!");
      return;
    }

    if (!values.updatecode || !values.updatecname || !values.acccode) {
      toast.error("Please enter customer code to transfer milk!");
      return;
    }
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const result = await dispatch(
        transferTOCustomer({
          ucode: values.updatecode,
          ucname: values.updatecname,
          uacccode: values.acccode,
          fromDate: values.fromDate,
          toDate: values.toDate,
          records: MilkData || [],
        })
      ).unwrap();

      if (result?.status === 200) {
        const res = await dispatch(
          getMilkToTransfer({
            code: values.code,
            fromDate: values.fromDate,
            toDate: values.toDate,
          })
        ).unwrap();
        const result = await dispatch(
          getTransferedMilk({
            code: values.updatecode,
            fromDate: values.fromDate,
            toDate: values.toDate,
          })
        ).unwrap();
        toast.success(result?.message);
      } else {
        toast.error("Failed milk transferd to customer!");
      }
    } catch (error) {
      console.error("Milk transfer error:", error);
      toast.error(
        error?.message || "Failed to transfer milk collection to customer!"
      );
    }
  };

  return (
    <div className="customer-milk-transfer-container w100 h1 d-flex-col sb">
      <span className="heading h10 d-flex a-center px10">
        Customer Milk Transfer
      </span>
      <div className="view-milk-collection-container w100 h90 d-flex-col sb">
        <div className="customer-details-container w100 h20 d-flex sb">
          <form
            onSubmit={fetchCustomerMilkRecords}
            className="from-cutsomer-details w45 h1 d-flex-col"
          >
            <div className="from-customer-details-container w100 h50 d-flex a-center sb">
              <label htmlFor="code" className="label-text px10">
                Customer
              </label>
              <input
                className="data w20 t-center mx10"
                type="text"
                name="code"
                id="code"
                placeholder="code"
                value={values.code}
                onChange={handleInputs}
              />
              <input
                className="data w60"
                type="text"
                name="cname"
                id="cname"
                list="customer-list"
                readOnly
                value={values.cname}
                placeholder="Customer Name"
                onChange={handleInputs}
                onFocus={handleFocus}
              />
              <datalist id="customer-list">
                {customerlist
                  .filter((customer) =>
                    customer.cname
                      ?.toLowerCase()
                      .includes(values.cname?.toLowerCase() || "")
                  )
                  .map((customer, index) => (
                    <option key={index} value={customer.cname} />
                  ))}
              </datalist>
            </div>
            <div className="date-container w100 h50 d-flex a-center sb">
              {/* <span className="label-text px10">Dates</span> */}
              <input
                className="data w30 mx10"
                type="date"
                value={values.fromDate || ""}
                name="fromDate"
                placeholder="code"
                onChange={handleInputs}
                max={tDate}
              />
              <label htmlFor="toDate" className="label-text">
                TO
              </label>
              <input
                className="data w30 mx10"
                type="date"
                name="toDate"
                id="toDate"
                value={values.toDate || ""}
                max={tDate}
                min={values.fromDate}
                onChange={handleInputs}
              />
              <button
                type="submit"
                className="btn"
                disabled={milkStatus === "loading"}
              >
                {milkStatus === "loading" ? "SHOW..." : "SHOW"}
              </button>
            </div>
          </form>
          <div className="cutsomer-details w45 h1 d-flex-col ">
            <div className="to-customer-details-container w100 h50 d-flex a-center sb">
              <label htmlFor="updatecode" className="label-text ">
                Customer
              </label>
              <input
                className="data w20 t-center mx10"
                type="text"
                id="updatecode"
                name="updatecode"
                value={values.updatecode || ""}
                placeholder="code"
                onChange={handleInputs}
              />
              <input
                className="data w60 mx10"
                type="text"
                name="updatecname"
                value={values.updatecname}
                readOnly
                placeholder="Customer Name"
                onChange={handleInputs}
              />
            </div>
          </div>
        </div>
        <div className="milk-collection-data-container w100 h80 d-flex se">
          <div className="morning-milk-collection-data w45 h1 mh100 hidescrollbar d-flex-col bg">
            <div className="collection-heading-container w100 p10 d-flex a-center bg7 sticky-top sa">
              <span className="f-info-text w5">M/E</span>
              <span className="f-info-text w20">Date </span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              <span className="f-info-text w10">Deg</span>
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {milkStatus === "loading" ? (
              <div className="box d-flex center">
                <Spinner />
              </div>
            ) : MilkData.length > 0 ? (
              MilkData.map((milk, index) => (
                <div
                  key={index}
                  className={`collection-data-container w100 h10 d-flex a-center t-center sb`}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  <span className="text w5">{milk.ME === 0 ? "M" : "E"}</span>
                  <span className="text w20 t-start">
                    {milk.ReceiptDate.slice(0, 10) || ""}
                  </span>
                  <span className="text w10">{milk.Litres}</span>
                  <span className="text w10">{milk.fat}</span>
                  <span className="text w10">{milk.digree || 0}</span>
                  <span className="text w10">{milk.snf}</span>
                  <span className="text w10">{milk.rate}</span>
                  <span className="text w15">{milk.Amt}</span>
                </div>
              ))
            ) : (
              <div className="no-records w100 h1 d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
          <div className="transfer-logos-container w5 h1 d-flex-col center">
            <FaArrowCircleRight
              className="transfer-icons laptop-icons my10"
              onClick={UpdateCustomerMilkRecords}
            />
            <FaArrowCircleLeft className="transfer-icons laptop-icons my10" />
            <FaArrowCircleUp className="transfer-icons mobile-icons my10" />
            <FaArrowCircleDown
              className="transfer-icons mobile-icons my10"
              onClick={UpdateCustomerMilkRecords}
            />
          </div>
          <div className="evening-milk-collection-data w45 h1 mh100 hidescrollbar d-flex-col bg">
            <div className="collection-heading-container w100 h10 d-flex a-center bg7 sticky-top  sa">
              <span className="f-info-text w10">Edit</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              <span className="f-info-text w10">Deg</span>
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {tranStatus === "loading" ? (
              <div className="box d-flex center">
                <Spinner />
              </div>
            ) : transferedMilk.length > 0 ? (
              transferedMilk.map((milk, index) => (
                <div
                  key={index}
                  className={`collection-data-container w100 h10 d-flex a-center t-center sb`}
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  <span className="text w5">{milk.ME === 0 ? "M" : "E"}</span>
                  <span className="text w20 t-start">
                    {milk.ReceiptDate.slice(0, 10) || ""}
                  </span>
                  <span className="text w10">{milk.Litres}</span>
                  <span className="text w10">{milk.fat}</span>
                  <span className="text w10">{milk.digree || 0}</span>
                  <span className="text w10">{milk.snf}</span>
                  <span className="text w10">{milk.rate}</span>
                  <span className="text w15">{milk.Amt}</span>
                </div>
              ))
            ) : (
              <div className="no-records w100 h1 d-flex center">
                <span className="label-text">{t("common:c-no-data-avai")}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMilkTransfer;
