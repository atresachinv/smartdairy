import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllDairyInfo } from "../../../../App/Features/Admin/Dairyinfo/dairySlice";
import "../../../../Styles/AdminPannel/AccessControls/MilkAccess.css";

const MilkCollAccess = () => {
  const dispatch = useDispatch();
  const dairyList = useSelector((state) => state.dairy.allDairyData);
  const [dairylist, setDairyList] = useState([]);

  const initialValues = {
    dairyid: 0,
    dairyname: "",
    vehicle_milk: 0, // Store 0 for false, 1 for true
    retail_sales: 0,
  };

  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    dispatch(fetchAllDairyInfo());
    setDairyList(dairyList);
  }, []);

  console.log(dairyList);

  const handleToggle = (name) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: prevValues[name] === 0 ? 1 : 0, // Toggle between 1 and 0
    }));
  };

  // Effect to search for dairy when dairyid changes
  //   useEffect(() => {
  //     if (values.dairyid.trim().length > 0) {
  //       const handler = setTimeout(() => {
  //         // Ensure `code` has valid content before making API calls
  //         findCustomerBydairyid(values.dairyid.trim());
  //         getToken();
  //       }, 500);

  //       return () => clearTimeout(handler);
  //     }
  //   }, [values.dairyid, dispatch]);

  //finding customer name
  //   const findCustomerBydairyid = (code) => {
  //     if (!code) {
  //       setValues((prev) => ({ ...prev, cname: "" }));
  //       return;
  //     }
  //     // Ensure the dairyid is a string for comparison
  //     const dairy = dairylist.find(
  //       (dairy) => dairy.SocietyCode.toString() === dairyid
  //     );

  //     if (dairy) {
  //       setValues((prev) => ({
  //         ...prev,
  //         dairyname: dairy.SocietyName,
  //       }));
  //     } else {
  //       setValues((prev) => ({ ...prev, dairyname: "" })); // Clear cname if not found
  //     }
  //   };

  return (
    <div className="milk-access-container w100 h1 d-flex-col">
      <div className="select-dairy-to-add-remove-access w100 h10 d-flex a-center">
        <label htmlFor="select_dairy">Search Dairy</label>
        <input className="data w5 mx10" type="number" />
        <input className="data w30" type="text" placeholder="dairy name" />
      </div>
      <div className="main-access-add-remove-container w100 h80 d-flex-col">
        <span className="w100 heading">Milk Collection Access</span>
        <div className="main-access-add-remove-container w100 h90 d-flex">
          {/* Vehicle Milk Collection */}
          <div className="access-controller-div w20 h20 d-flex-col bg p10">
            <label htmlFor="milk-access" className="label-text t-center">
              Vehicle Milk Collection
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.vehicle_milk === 1 ? "ON" : "OFF"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={values.vehicle_milk === 1}
                  onChange={() => handleToggle("vehicle_milk")}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>

          {/* Retail Milk Sales */}
          <div className="access-controller-div w20 h20 d-flex-col bg p10 mx10">
            <label htmlFor="milk-access" className="label-text t-center">
              Retail Milk Sales
            </label>
            <div className="toggle-container w100 h50 d-flex center">
              <span>{values.retail_sales === 1 ? "ON" : "OFF"}</span>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={values.retail_sales === 1}
                  onChange={() => handleToggle("retail_sales")}
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
