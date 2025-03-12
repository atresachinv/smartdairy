import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listEmployee } from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import "../../../../../Styles/Common.css";
import { useTranslation } from "react-i18next";

const EmployeeList = () => {
  const { t } = useTranslation(["master", "milkcollection", "common"]);
  const dispatch = useDispatch();
  const Emplist = useSelector((state) => state.emp.emplist);
  const [filteredEmpList, setFilteredEmpList] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );
  useEffect(() => {
    dispatch(listEmployee());
  }, []);

  useEffect(() => {
    setFilteredEmpList(Emplist);
  }, [Emplist]);

  const handleFilter = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);

    // Filter employees based on the selected center
    const filteredList = centerId
      ? Emplist.filter((emp) => emp.center_id.toString() === centerId)
      : Emplist;

    setFilteredEmpList(filteredList);
  };

  return (
    <div className="emp-list-container w70 h90 d-flex-col">
      <div className="title-div w100 h10 d-flex a-center sb px10">
        <span className="heading w30 t-center">Employee List</span>{" "}
        <div className="filter-emp-by-center w60 d-flex a-center">
          <span className="label-text w40 p10">{t("center List")}</span>
          <select
            className="data w60"
            name="center"
            onChange={handleFilter}
            value={selectedCenter}
          >
            <option value="">-- Select Center --</option>
            {centerList.map((center) => (
              <option key={center.center_id} value={center.center_id}>
                {center.center_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="emp-data-list-container w100 h1 d-flex-col bg">
        <div className="emp-data-heading-div w100 h10 d-flex a-center t-center sb bg2">
          <span className="label-text w10">No</span>
          <span className="label-text w30">Employee Name</span>
          <span className="label-text w20">Designation</span>
          <span className="label-text w15">Mobile</span>
          <span className="label-text w20">Salary</span>
        </div>
        <div className="emp-data-list-div w100 h90 mh90 d-flex-col hidescrollbar">
          {filteredEmpList.map((emp, i) => (
            <div
              key={emp.i}
              className={`emp-data-div w100 h10 d-flex a-center t-center sb ${
                i % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{
                backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="text w10">{emp.emp_id}</span>
              <span className="text w30">{emp.emp_name}</span>
              <span className="text w20">{emp.designation}</span>
              <span className="text w15">{emp.emp_mobile}</span>
              <span className="text w20">{emp.salary}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
