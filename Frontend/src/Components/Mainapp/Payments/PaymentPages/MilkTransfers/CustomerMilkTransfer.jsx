import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FaArrowCircleRight,
  FaArrowCircleLeft,
  FaArrowCircleUp,
  FaArrowCircleDown,
} from "react-icons/fa";
import "../../../../../Styles/Mainapp/Payments/MilkTransfer.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getMilkToTransfer,
  transferTOCustomer,
} from "../../../../../App/Features/Payments/paymentSlice";

const CustomerMilkTransfer = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const tDate = useSelector((state) => state.date.toDate);
  const MilkData = useSelector((state) => state.payment.customerMilkData);
  const milkStatus = useSelector((state) => state.payment.getMilkstatus);
  const [customerList, setCustomerList] = useState([]);
  const [custList, setCustList] = useState({});
  const [changedDate, setChangedDate] = useState("");
  const [errors, setErrors] = useState({});

  const initialValues = {
    date: changedDate || tDate,
    code: "",
    cname: "",
    updatecode: "",
    updatecname: "",
    acccode: "",
    formDate: "",
    toDate: "",
  };

  const [values, setValues] = useState(initialValues);
  console.log("form values", values);
  console.log("milk data", MilkData);

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
  // console.log(customerList);

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  //   const findCustomerByCname = (cname) => {
  //     if (!cname) {
  //       setValues((prev) => ({ ...prev, cname: "" }));
  //       return;
  //     }
  //     // Ensure the code is a string for comparison
  //     const customer = customerList.find((customer) =>
  //       customer.cname.toLowerCase().includes(values.cname.toLowerCase())
  //     );
  // console.log(customer);
  //
  //     if (customer) {
  //       setValues((prev) => ({
  //         ...prev,
  //         code: customer.srno,
  //         cname: customer.cname,
  //         acccode: customer.cid,
  //       }));
  //     } else {
  //       setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
  //     }
  //   };
  //
  //   useEffect(() => {
  //     if (values.cname) {
  //       const handler = setTimeout(() => {
  //         findCustomerByCname();
  //       }, 500);
  //       return () => clearTimeout(handler);
  //     }
  //   }, [values.cname]);

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
        updatecname: customer.cname,
        acccode: customer.cid,
      }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
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
    console.log("hello");
    if (!values.code || !values.cname || !values.formDate || !values.toDate) {
      toast.error("Please Fill All Fields!");
      return;
    }
    console.log("hello");
    dispatch(
      getMilkToTransfer({
        code: values.code,
        fromDate: values.formDate,
        toDate: values.toDate,
      })
    );
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  };

  const UpdateCustomerMilkRecords = (e) => {
    e.preventDefault();
    if (!values.updatecode || !values.updatecname || !values.acccode) {
      toast.error("Please Fill All Fields!");
      return;
    }
    dispatch(
      transferTOCustomer({
        code: values.code,
        cname: values.cname,
        formDate: values.formDate,
        toDate: values.toDate,
      })
    );
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
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
            className="from-cutsomer-details w45 h1 d-flex-col">
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
                {customerList
                  .filter((customer) =>
                    customer.cname
                      .toLowerCase()
                      .includes(values.cname.toLowerCase())
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
                value={values.formDate || ""}
                name="formDate"
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
                min={values.formDate}
                onChange={handleInputs}
              />
              <button type="submit" className="w-btn">
                SHOW
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
            <div className="collection-heading-container w100 h10 d-flex a-center bg7 sticky-top sa">
              <span className="f-info-text w10">Edit</span>
              <span className="f-info-text w20">Date</span>
              <span className="f-info-text w10">Liters</span>
              <span className="f-info-text w10">Fat</span>
              <span className="f-info-text w10">Deg</span>
              <span className="f-info-text w10">Snf</span>
              <span className="f-info-text w10">Rate</span>
              <span className="f-info-text w15">Amount</span>
            </div>
            {/* {morningData.length > 0 ? (
                    morningData.map((milk, index) => (
                      <div
                        key={index}
                        className={`collection-data-container w100 h10 d-flex a-center t-center sb`}
                        style={{
                          backgroundColor:
                            selectedMorningItems.includes(milk.id) ||
                            editmrgIndex === index
                              ? "#f7bb79"
                              : index % 2 === 0
                              ? "#faefe3"
                              : "#fff",
                        }}
                        onClick={() => handleSelectItem("morning", milk.id)}>
                        <span className="text w10 t-center d-flex a-center sa">
                          {editmrgIndex === index ? (
                            <FaSave
                              className="color-icon"
                              onClick={() => handleSaveData(milk)}
                            />
                          ) : (
                            <FaEdit
                              className="color-icon"
                              onClick={() => handleEditMrgClick(index, milk)}
                            />
                          )}
                        </span>
                        <span className="text w20 t-start">
                          {milk.ReceiptDate.slice(0, 10)}
                        </span>
                        {editmrgIndex === index ? (
                          <>
                            <span className="text w10 d-flex center">
                              <input
                                className="data w100 t-center"
                                type="text"
                                value={editedData.liters}
                                onChange={(e) =>
                                  handleEditedDataChange("liters", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">
                              <input
                                className="data w100 d-flex center t-center"
                                type="text"
                                value={editedData.fat}
                                onChange={(e) =>
                                  handleEditedDataChange("fat", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">
                              <input
                                className="data w100 h1 d-flex center t-center"
                                type="text"
                                value={editedData.snf}
                                onChange={(e) =>
                                  handleEditedDataChange("snf", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{editedData.rate}</span>
                            <span className="text w15">{editedData.amt}</span>
                          </>
                        ) : (
                          <>
                            <span className="text w10">{milk.Litres}</span>
                            <span className="text w10">{milk.fat}</span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">{milk.snf}</span>
                            <span className="text w10">{milk.rate}</span>
                            <span className="text w15">{milk.Amt}</span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-records w100 h1 d-flex center">
                      <span className="label-text">{t("common:c-no-data-avai")}</span>
                    </div>
                  )} */}
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
            {/* {eveningData.length > 0 ? (
                    eveningData.map((milk, index) => (
                      <div
                        key={index}
                        className={`collection-data-container w100 h10 d-flex a-center t-center sb ${
                          index % 2 === 0 ? "bg-light" : "bg-dark"
                        }`}
                        style={{
                          backgroundColor:
                            selectedEveningItems.includes(milk.id) ||
                            editeveIndex === index
                              ? "#f7bb79"
                              : index % 2 === 0
                              ? "#faefe3"
                              : "#fff",
                        }}
                        onClick={() => handleSelectItem("evening", milk.id)}>
                        <span className="text w10 t-center d-flex a-center sa">
                          {editeveIndex === index ? (
                            <FaSave
                              className="color-icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleSaveData(milk);
                              }}
                            />
                          ) : (
                            <FaEdit
                              className="color-icon"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click event
                                handleEditEveClick(index, milk);
                              }}
                            />
                          )}
                        </span>
                        <span className="text w20 t-start">
                          {milk.ReceiptDate.slice(0, 10)}
                        </span>
                        {editeveIndex === index ? (
                          <>
                            <span className="text w10 d-flex center">
                              <input
                                className="data w100 t-center"
                                type="text"
                                value={editedData.liters}
                                onClick={(e) => e.stopPropagation()} // Prevent row click event
                                onChange={(e) =>
                                  handleEditedDataChange("liters", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">
                              <input
                                className="data w100 d-flex center t-center"
                                type="text"
                                value={editedData.fat}
                                onClick={(e) => e.stopPropagation()} // Prevent row click event
                                onChange={(e) =>
                                  handleEditedDataChange("fat", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">
                              <input
                                className="data w100 h1 d-flex center t-center"
                                type="text"
                                value={editedData.snf}
                                onClick={(e) => e.stopPropagation()} // Prevent row click event
                                onChange={(e) =>
                                  handleEditedDataChange("snf", e.target.value)
                                }
                              />
                            </span>
                            <span className="text w10">{editedData.rate}</span>
                            <span className="text w15">{editedData.amt}</span>
                          </>
                        ) : (
                          <>
                            <span className="text w10">{milk.Litres}</span>
                            <span className="text w10">{milk.fat}</span>
                            <span className="text w10">{milk.degree || 0}</span>
                            <span className="text w10">{milk.snf}</span>
                            <span className="text w10">{milk.rate}</span>
                            <span className="text w15">{milk.Amt}</span>
                          </>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="no-records w100 h1 d-flex center">
                      <span className="label-text">{t("common:c-no-data-avai")}</span>
                    </div>
                  )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerMilkTransfer;
