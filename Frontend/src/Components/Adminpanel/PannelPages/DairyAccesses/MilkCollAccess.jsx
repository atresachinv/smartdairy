import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDairyInfo } from "../../../../App/Features/Admin/Dairyinfo/dairySlice";
import "../../../../Styles/AdminPannel/AccessControls/MilkAccess.css";
import Select from "react-select";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "38px",
    borderRadius: "8px",
    borderColor: state.isFocused ? "#4A90E2" : "#ccc",
    boxShadow: state.isFocused ? "0 0 0 1px #4A90E2" : "none",
    "&:hover": {
      borderColor: "#4A90E2",
    },
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#4A90E2"
      : state.isFocused
      ? "#f0f8ff"
      : "white",
    color: "black",
    padding: 10,
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 200,
    padding: 10,
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#aaa",
  }),

  singleValue: (provided) => ({
    ...provided,
    color: "#333",
  }),
};

const MilkCollAccess = () => {
  const dispatch = useDispatch();
  const dairyList = useSelector((state) => state.dairy.allDairyData);
  const [dairylist, setDairyList] = useState([]);
  const [accessRights, setAccessRights] = useState([]);

  const initialValues = {
    dairy_id: 0,
    vehicle_milk: 0, // Store 0 for false, 1 for true
    retail_sales: 0,
    wp_sms: 0,
    gen_pdf: 0,
    create_center: 0,
    add_sledger: 0,
  };

  const [values, setValues] = useState(initialValues);
  console.log("values", values);
  useEffect(() => {
    dispatch(fetchAllDairyInfo());
    setDairyList(dairyList);
  }, []);

  // console.log(accessRights);

  const handleToggle = (key) => {
    setAccessRights((prevAccessRights) => {
      const isActive = prevAccessRights.includes(key);
      const updatedAccess = isActive
        ? prevAccessRights.filter((item) => item !== key)
        : [...prevAccessRights, key];

      // Also update values state
      setValues((prevValues) => ({
        ...prevValues,
        [key]: isActive ? 0 : 1, // 1 if turned ON, 0 if OFF
      }));

      return updatedAccess;
    });
  };

  const dairyOptions = dairyList.map((item) => ({
    value: item.SocietyCode,
    label: `${item.SocietyName}`,
  }));
  const dairyOptions1 = dairyList.map((item) => ({
    value: item.SocietyCode,
    label: `${item.SocietyCode}`,
  }));

  return (
    <div className="milk-access-container w100 h1 d-flex-col">
      <div className="select-dairy-to-add-remove-access w100 h10 d-flex a-center">
        <div className="label-text">Select Dairy :</div>
        <Select
          options={dairyOptions1}
          className="mx5 w10"
          placeholder=""
          isSearchable
          styles={customStyles}
          value={
            values.dairy_id
              ? dairyOptions1.find(
                  (option) => option.value === Number(values.dairy_id)
                )
              : null
          }
          onChange={(selectedOption) => {
            setValues({ ...values, dairy_id: selectedOption.value });
          }}
        />
        <Select
          options={dairyOptions}
          className="mx5 w40"
          placeholder=""
          isSearchable
          styles={customStyles}
          value={
            values.dairy_id
              ? dairyOptions.find(
                  (option) => option.value === Number(values.dairy_id)
                )
              : null
          }
          onChange={(selectedOption) => {
            setValues({ ...values, dairy_id: selectedOption.value });
          }}
        />
      </div>
      <div className="main-access-add-remove-outer-container w100 h80 d-flex-col">
        <span className="w100 heading">Milk Collection Access</span>
        <div className="main-access-add-remove-container w100 h90 d-flex">
          {/* Vehicle Milk Collection */}
          <div className="access-controller-div h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Vehicle Milk Collection
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.vehicle_milk === 0 ? "OFF" : "ON"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={accessRights.includes("vehicle_milk")}
                  onChange={() => handleToggle("vehicle_milk")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Retail Milk Sales */}
          <div className="access-controller-div h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Retail Milk Sales
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.retail_sales === 0 ? "OFF" : "ON"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={accessRights.includes("retail_sales")}
                  onChange={() => handleToggle("retail_sales")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          {/* Whatsapp Message */}
          <div className="access-controller-div h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Whatsapp Message
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.wp_sms === 0 ? "OFF" : "ON"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={accessRights.includes("wp_sms")}
                  onChange={() => handleToggle("wp_sms")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          {/* Generate PDF */}
          <div className="access-controller-div h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Generate PDF
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.gen_pdf === 0 ? "OFF" : "ON"}</span>
              <label className="switch">
                <input
                  name="gen_pdf"
                  type="checkbox"
                  checked={accessRights.includes("gen_pdf")}
                  onChange={() => handleToggle("gen_pdf")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          {/* Create Center */}
          <div className="access-controller-div h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Create Center
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.create_center === 0 ? "OFF" : "ON"}</span>
              <label className="switch">
                <input
                  name="create_center"
                  type="checkbox"
                  checked={accessRights.includes("create_center")}
                  onChange={() => handleToggle("create_center")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
          <div className="access-controller-div h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Create Sub Ladger
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.add_sledger === 0 ? "OFF" : "ON"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={accessRights.includes("add_sledger")}
                  onChange={() => handleToggle("add_sledger")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkCollAccess;
