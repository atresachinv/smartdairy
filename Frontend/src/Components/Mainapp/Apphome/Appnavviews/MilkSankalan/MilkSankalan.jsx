import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsGearFill } from "react-icons/bs";
import { mobileMilkCollection } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { toast } from "react-toastify";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkSankalan = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const { customerlist, loading } = useSelector((state) => state.customer);

  const [customerList, setCustomerList] = useState([]);
  const [errors, setErrors] = useState({});

  const initialValues = {
    date: tDate,
    code: "",
    animal: 0,
    liters: "",
    cname: "",
    sample: "",
    acccode: "",
  };

  const [values, setValues] = useState(initialValues);

  //.....................................................
  // Customer List ......................................
  //.....................................................

  useEffect(() => {
    dispatch(listCustomer());
  }, []);

  useEffect(() => {
    // When the customer list is updated, store it in localStorage
    if (customerlist.length > 0) {
      localStorage.setItem("customerlist", JSON.stringify(customerlist));
    }
  }, [customerlist]);

  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, []);

  //finding customer name
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
      setValues((prev) => ({ ...prev, cname: customer.cname }));
      setValues((prev) => ({ ...prev, acccode: customer.cid }));
      setValues((prev) => ({ ...prev, rateChartNo: customer.rateChartNo }));
    } else {
      setValues((prev) => ({ ...prev, cname: "" })); // Clear cname if not found
    }
  };

  // Effect to search for customer when code changes

  useEffect(() => {
    const handler = setTimeout(() => {
      if (values.code.length >= 1) {
        // Adjust length as necessary
        findCustomerByCode(values.code);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [values.code]);

  //.....................................................
  // Customer Info ......................................
  //.....................................................

  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name === "date") {
      if (value > tDate) {
        // Set an error for the date field
        setErrors((prevErrors) => ({
          ...prevErrors,
          date: "Selected date cannot be greater than the current date.",
        }));
        return; // Prevent updating the state if the date is invalid
      } else {
        // Clear the error if the date is valid
        setErrors((prevErrors) => {
          const { date, ...rest } = prevErrors;
          return rest; // Remove date error if valid
        });
      }

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
      case "sample":
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
      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["code", "cname", "liters", "sample"];

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

  const handleMobileCollection = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await dispatch(mobileMilkCollection(values));
      setValues(initialValues);
      toast.success("Milk Collection Saved Successfully!");
    } catch (error) {
      setValues(initialValues);
      toast.error("failed to save Milk Collection, try again!");
    }
  };

  return (
    <>
      <form
        onSubmit={handleMobileCollection}
        className="mobile-milk-coll-form w60 h70 d-flex-col sa bg p10">
        <span className="heading w100 h10 t-center">Complete Milk Collection </span>
        <div className="form-setting w100 h10 d-flex a-center sb">
          <div className="form-date w40 d-flex a-center">
            <label htmlFor="date" className="info-text w40">
              Date <span className="req">*</span>{" "}
            </label>
            <input
              className={`data w60 ${errors.date ? "input-error" : ""}`}
              type="date"
              required
              placeholder="0000"
              name="date"
              id="date"
              onChange={handleInputs}
              value={values.date || ""}
              max={values.date}
            />
          </div>
          <div className="milk-details w50 d-flex px10">
            <label htmlFor="animal" className="info-text w50">
              Select Milk Type <span className="req">*</span>{" "}
            </label>
            <select
              className="data w50"
              name="animal"
              id="animal"
              onChange={handleInputs}>
              <option value="0">Cow</option>
              <option value="1">Buffalo</option>
            </select>
          </div>
        </div>

        <div className="milk-details-div w100 h15 d-flex-col">
          <div className="milk-details w100 h90 d-flex">
            <div className="form-div user-code w30 px10">
              <label htmlFor="code" className="info-text">
                Enter User Code <span className="req">*</span>{" "}
              </label>
              <input
                id="code"
                className={`data  ${errors.code ? "input-error" : ""}`}
                type="number"
                required
                placeholder="0000"
                name="code"
                value={values.code}
                onChange={handleInputs}
              />
            </div>
            <div className="form-div user-name w70 px10">
              <label htmlFor="cname" className="info-text">
                Customer Name <span className="req">*</span>{" "}
              </label>
              <input
                id="cname"
                className={`data ${errors.cname ? "input-error" : ""}`}
                type="text"
                required
                placeholder="smartdairy user"
                name="cname"
                value={values.cname}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="milk-details-div w100 h15 d-flex-col">
          <div className="milk-details w100 h90 d-flex">
            <div className="milk-info w50 h1 ">
              <div className="form-div px10">
                <label htmlFor="liters" className="info-text">
                  Litters <span className="req">*</span>{" "}
                </label>
                <input
                  id="liters"
                  className={`data ${errors.liters ? "input-error" : ""}`}
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="liters"
                  onChange={handleInputs}
                  value={values.liters}
                />
              </div>
            </div>
            <div className="milk-info w50 h1 d-flex-col">
              <div className="form-div px10">
                <label htmlFor="sample" className="info-text">
                  Sample No. <span className="req">*</span>{" "}
                </label>
                <input
                  id="sample"
                  className={`data ${errors.sample ? "input-error" : ""}`}
                  type="number"
                  required
                  placeholder="0"
                  name="sample"
                  value={values.sample || ""}
                  onChange={handleInputs}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mobile-milkcoll-form-btns w100 h15 d-flex a-center j-end">
          <button className="btn mx10" type="submit">
            Save Collection
          </button>
        </div>
      </form>
    </>
  );
};

export default MilkSankalan;
