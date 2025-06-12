import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { FaEdit } from "react-icons/fa";
import Spinner from "../../../Home/Spinner/Spinner";
import { MdDeleteForever } from "react-icons/md";
import Select from "react-select";
import Swal from "sweetalert2";
import "../../../../Styles/Mainapp/Masters/AnimalMaster.css";
import {
  addAnimal,
  fetchCustAnimals,
  updateAnimal,
  fetchMaxCode,
  deleteAnimal,
} from "../../../../App/Features/Mainapp/Masters/animalSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";

const AnimalMaster = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const tDate = useSelector((state) => state.date.toDate);
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const maxCode = useSelector((state) => state.animal.maxCode);
  const animalList = useSelector((state) => state.animal.animalList || []);
  const addstatus = useSelector((state) => state.animal.addstatus);
  const updateStatus = useSelector((state) => state.animal.upadatestatus);
  const listStatus = useSelector((state) => state.animal.liststatus);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [filteredNames, setFilteredNames] = useState([]);
  const custcodeRef = useRef(null);
  const listbtnRef = useRef(null);
  const codeRef = useRef(null);
  const anameRef = useRef(null);
  const tagRef = useRef(null);
  const atypeRef = useRef(null);
  const isMilkingRef = useRef(null);
  const litersRef = useRef(null);
  const addbuttonRef = useRef(null);

  const initialValues = {
    id: "",
    date: "",
    cust_code: "",
    cname: "",
    code: "",
    aname: "",
    tagno: "",
    atype: "",
    isMilking: 0,
    liters: "",
  };

  const [values, setValues] = useState(initialValues);
  // console.log("updateStatus", updateStatus);
  // animal type list ------------------------------------------------------>
  const animalTypes = {
    1: "AMRITMAHAL",
    2: "AYRSHIRE",
    3: "BROWN SWIS",
    4: "DESI",
    5: "GIR",
    6: "GUERNSEY",
    7: "HALLIKAR",
    8: "HF",
    9: "HFCB",
    10: "JERSEY",
    11: "KHILLARI",
    12: "RED SINDHI",
    13: "SAHIWAL",
    14: "VIDESHI",
  };
  //------------------------------------------------------------------------>
  useEffect(() => {
    dispatch(listCustomer());
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      setValues((prevData) => ({
        ...prevData,
        date: tDate,
        code: maxCode,
      }));
    }
  }, [maxCode, isEditMode]);

  // Handle input changes
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name];
      return updatedErrors;
    });
  };

  const handleNameSelect = (selectedCustomer) => {
    setValues({
      cust_code: selectedCustomer.cust_code.toString(),
      cname: selectedCustomer.cname,
    });
    setFilteredNames([]);
  };

  const validateField = (name, value) => {
    let error = {};
    switch (name) {
      case "code":
      case "cust_code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid Animal Code.";
        } else {
          delete errors[name];
        }
        break;
      case "liters":
        if (!/^\d+(\.\d+)?$/.test(value.toString())) {
          error[name] = "Invalid Animal Code.";
        } else {
          delete errors[name];
        }
        break;
      case "tagno":
        if (!/^\d{12}$/.test(value.toString())) {
          error[name] = "Invalid Tag Number.";
        } else {
          delete errors[name];
        }
        break;
      case "aname":
        if (!/^[a-zA-Z0-9\s]+$/.test(value)) {
          error[name] = `Invalid Doctor Name.`;
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
    const fieldsToValidate = ["cust_code", "code", "tagno", "aname", "liters"];
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

  // generate new max code for perticular customer ---------------------------->

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  // Customer options for Select component ------------------------------------>
  const custOptions1 = customerlist.map((item) => ({
    srno: item.srno,
    value: item.srno,
    label: `${item.cname}`,
  }));

  // Handle Select change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setValues({
      ...values,
      [keyToUpdate]: selectedOption.value,
    });
  };

  //--------------------------------------------------------------------------->
  // handle fetch customer animal list ---------------------------------------->
  const handlefetchAnimalList = async () => {
    if (values.cust_code === "") {
      return toast.error(
        "customer code or name is required to fetch animal list!"
      );
    }
    dispatch(fetchMaxCode({ cust_code: values.cust_code }));
    dispatch(fetchCustAnimals(values.cust_code));
  };

  const handleAddorUpdate = async (e) => {
    e.preventDefault();

    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!values.code || !values.aname || !values.tagno) {
      toast.info("Please add animal details!");
      return;
    }

    if (isEditMode) {
      // UPDATE Animal
      const res = await dispatch(updateAnimal({ values })).unwrap();
      if (res.status === 200) {
        handleReset();
        toast.success("Animal details updated successfully!");
      } else {
        toast.error("Failed to update animal!");
      }
    } else {
      // ADD Animal
      const res = await dispatch(addAnimal({ values })).unwrap();
      if (res.status === 200) {
        toast.success("New Animal Added Successfully!");
      } else {
        toast.error("Failed to add new animal!");
      }
    }

    dispatch(fetchCustAnimals({ cust_code: values.cust_code }));
    setValues(initialValues);
    setIsEditMode(false);
  };

  const handleEditAnimal = (animal) => {
    setValues({
      id: animal.id,
      date: tDate,
      cust_code: animal.cust_code,
      code: animal.code,
      aname: animal.aname,
      tagno: animal.tagno,
      atype: animal.atype,
      isMilking: animal.isMilking,
      liters: animal.liters,
    });
    setIsEditMode(true);
  };

  // delete animal based on id
  const handleDeleteAnimal = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete Animal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await dispatch(deleteAnimal({ id })).unwrap();
        if (res.status === 200) {
          dispatch(fetchCustAnimals(values.cust_code));
          toast.success("Animal deleted successfully!");
        } else {
          toast.error("Failed to delete animal!");
        }
      } catch (error) {
        toast.error("Server failed to delete the animal!");
      }
    }
  };

  const handleReset = () => {
    setValues({
      id: "",
      date: "",
      cust_code: "",
      aname: "",
      tagno: "",
      atype: "",
      isMilking: "",
      liters: "",
    });
    setIsEditMode(false);
  };

  return (
    <div className="animal-master-container w100 h1 d-flex-col sb p10">
      <span className="heading">
        {isEditMode ? "पशुची माहिती बदला" : "नवीन पशुची नोंद करा"}
      </span>
      <form
        onSubmit={handleAddorUpdate}
        className="animal-master-form-container w100 h40 d-flex-col se"
      >
        <div className="animal-info-details-code w100 h10 d-flex a-center sb">
          <div className="animal-details-code w70 h1 d-flex a-center sb">
            <label htmlFor="ccode" className="ccode label-text w10">
              कोड :
            </label>

            <input
              type="text"
              id="ccode"
              className="codetxt data w10"
              autoComplete="off"
              onFocus={(e) => e.target.select()}
              value={values.cust_code}
              onChange={(e) => {
                setValues({ ...values, cust_code: e.target.value });
              }}
            />
            <Select
              options={custOptions1}
              className="cnametxt w45"
              placeholder="उत्पादकाचे नावं टाका"
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={
                values.cust_code
                  ? custOptions1.find(
                      (option) => option.srno === Number(values.cust_code)
                    )
                  : null
              }
              onChange={(selectedOption) => {
                handleSelectChange(selectedOption, "cust_code");
              }}
            />
            <button
              type="button"
              className="w-btn mx10"
              onClick={handlefetchAnimalList}
            >
              पशु यादी
            </button>
          </div>
        </div>
        <div className="animal-info-details-code w100 h30 d-flex a-center sb">
          <div className="animal-details w10 d-flex-col sb">
            <label htmlFor="code" className="label-text w100">
              कोड <span className="req">*</span> :
            </label>
            <input
              type="text"
              className={`data ${errors.code ? "input-error" : ""}`}
              id="code"
              name="code"
              value={values.code}
              ref={codeRef}
              onKeyDown={(e) => handleKeyDown(e, anameRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="animal-details-aname w20 d-flex-col sb">
            <label htmlFor="drname" className="w100 label-text">
              पशुचे नाव<span className="req">*</span> :
            </label>
            <input
              type="text"
              className={`data ${errors.aname ? "input-error" : ""}`}
              id="aname"
              name="aname"
              value={values.aname}
              ref={anameRef}
              disabled={!values.code}
              onKeyDown={(e) => handleKeyDown(e, tagRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="animal-details-tagno w25 d-flex-col sb">
            <label htmlFor="tagno" className="label-text w100">
              टॅग क्र <span className="req">*</span> :
            </label>
            <input
              type="number"
              className={`data ${errors.tagno ? "input-error" : ""}`}
              id="tagno"
              name="tagno"
              value={values.tagno}
              ref={tagRef}
              disabled={!values.code}
              onKeyDown={(e) => handleKeyDown(e, atypeRef)}
              onChange={handleInputs}
            />
          </div>
          <div className="animal-details-type w15 d-flex-col sb">
            <label htmlFor="atype" className="label-text w100">
              प्रकार <span className="req">*</span> :
            </label>
            <select
              name="atype"
              id="atype"
              ref={atypeRef}
              className="data w100"
              value={values.atype}
              onKeyDown={(e) => handleKeyDown(e, isMilkingRef)}
              onChange={handleInputs}
            >
              <option value="">Select Type</option>
              {Object.entries(animalTypes).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div className="animal-details-ismilk w10 d-flex-col sb">
            <label htmlFor="ismilk" className="label-text w">
              दुधारू <span className="req">*</span> :
            </label>
            <select
              name="isMilking"
              id="ismilk"
              className="data w100"
              ref={isMilkingRef}
              value={values.isMilking}
              onKeyDown={(e) => handleKeyDown(e, litersRef)}
              onChange={handleInputs}
            >
              <option value="0">YES</option>
              <option value="1">NO</option>
            </select>
          </div>
          <div className="animal-details-ltr w10 d-flex-col sb">
            <label htmlFor="ltr" className="label-text w100">
              लिटर <span className="req">*</span> :
            </label>
            <input
              type="text"
              className={`data ${errors.liters ? "input-error" : ""}`}
              id="ltr"
              name="liters"
              value={values.liters}
              ref={litersRef}
              placeholder="15"
              disabled={!values.code}
              onKeyDown={(e) => handleKeyDown(e, addbuttonRef)}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="animal-info-btns w100 h10 d-flex a-center j-end ">
          <button type="reset" className="w-btn mx10" onClick={handleReset}>
            नमुना एक्सेल
          </button>
          <button type="reset" className="w-btn mx10" onClick={handleReset}>
            उपलोड
          </button>
          <button type="reset" className="w-btn mx10" onClick={handleReset}>
            रद्द करा
          </button>
          {isEditMode ? (
            <button type="submit" className="w-btn" ref={addbuttonRef}>
              {updateStatus === "loading" ? "Updating..." : "बदल करा"}
            </button>
          ) : (
            <button type="submit" className="w-btn" ref={addbuttonRef}>
              {addstatus === "loading" ? "Adding..." : "सेव्ह करा"}
            </button>
          )}
        </div>
      </form>
      <div className="animal-details-info-container w100 h60 mh60 hidescrollbar d-flex-col bg">
        <div className="animal-details-headings w100 p10 d-flex a-center t-center sticky-top bg7 sa">
          <span className="f-label-text w5">क्र.</span>
          <span className="f-label-text w20">पशुचे नाव</span>
          <span className="f-label-text w25">टॅग क्र.</span>
          <span className="f-label-text w20">प्रकार</span>
          <span className="f-label-text w5">दुधारू</span>
          <span className="f-label-text w10">लिटर</span>
          <span className="f-label-text w10">Action</span>
        </div>
        {listStatus === "loading" ? (
          <Spinner />
        ) : animalList.length > 0 ? (
          animalList.map((animal, index) => (
            <div
              key={index}
              className="animal-details-headings w100 p10 d-flex a-center sa"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="info-text w5 t-start">{animal.code}</span>
              <span className="info-text w20 t-start">{animal.aname}</span>
              <span className="info-text w25 t-start">{animal.tagno}</span>
              <span className="info-text w20 t-start">{animal.atype}</span>
              <span className="info-text w5 t-center">
                {animal.isMilking === 0 ? "होय" : "नाही"}
              </span>
              <span className="info-text w10 t-end">{animal.liters}</span>
              <span className="label-text w10 d-flex sa t-center">
                <FaEdit
                  type="button"
                  className="color-icon w50"
                  onClick={() => handleEditAnimal(animal)}
                />
                <MdDeleteForever
                  className="req"
                  type="button"
                  onClick={() => handleDeleteAnimal(animal.id)}
                />
              </span>
            </div>
          ))
        ) : (
          <div className="box d-flex center">
            <span className="label-text">No records Forund</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalMaster;
