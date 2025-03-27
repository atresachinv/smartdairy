import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdDeleteForever } from "react-icons/md";
import {
  deleteEmp,
  listEmployee,
} from "../../../../../App/Features/Mainapp/Masters/empMasterSlice";
import "../../../../../Styles/Mainapp/Masters/EmpMaster.css";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { centersLists } from "../../../../../App/Features/Dairy/Center/centerSlice";
import { toast } from "react-toastify";

const EmployeeList = () => {
  const { t } = useTranslation(["master", "milkcollection", "common"]);
  const dispatch = useDispatch();
  const Emplist = useSelector((state) => state.emp.emplist || []);
  const deleteStatus = useSelector((state) => state.emp.deleteStatus);
  const [filteredEmpList, setFilteredEmpList] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );

  useEffect(() => {
    dispatch(centersLists());
    dispatch(listEmployee());
  }, [dispatch]);

  useEffect(() => {
    setFilteredEmpList(Emplist);
  }, [Emplist]);

  const handleFilter = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);

    const filteredList = centerId
      ? Emplist.filter((emp) => emp.center_id.toString() === centerId)
      : Emplist;
    setFilteredEmpList(filteredList);
  };

  const handleDelete = async ({ id, mobile }) => {
    console.log(id, mobile);
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      width: "400px",
      customClass: {
        popup: "custom-swal-popup",
        title: "custom-swal-title",
        content: "custom-swal-content",
        icon: "custom-swal-icon",
      },
    });

    if (result.isConfirmed) {
      const res = await dispatch(
        deleteEmp({ emp_id: id, mobile: mobile })
      ).unwrap();
      dispatch(listEmployee());
      console.log(res);
      if (res && res.status === 200) {
        toast.success("Employee deleted successfully!");
      } else {
        toast.error(res?.message);
      }
    }
  };

  return (
    <div className="emp-list-container w70 h90 d-flex-col">
      <div className="title-div w100 h10 d-flex a-center sb px10">
        <span className="heading w30 t-center">Employee List</span>
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
          <span className="label-text w10">Id</span>
          <span className="label-text w30">Employee Name</span>
          <span className="label-text w20">Designation</span>
          <span className="label-text w15">Mobile</span>
          <span className="label-text w20">Salary</span>
          <span className="label-text w10">Action</span>
        </div>
        <div className="emp-data-list-div w100 h90 mh90 d-flex-col hidescrollbar">
          {filteredEmpList.map((emp, i) => (
            <div
              key={i + 3}
              className={`emp-data-div w100 h10 d-flex a-center t-center sb ${
                i % 2 === 0 ? "bg-light" : "bg-dark"
              }`}
              style={{ backgroundColor: i % 2 === 0 ? "#faefe3" : "#fff" }}
            >
              <span className="text w10">{emp.emp_id}</span>
              <span className="text w30">{emp.emp_name}</span>
              <span className="text w20">{emp.designation}</span>
              <span className="text w15">{emp.emp_mobile}</span>
              <span className="text w20">{emp.salary}</span>
              <span className="icon w10" disabled>
                <MdDeleteForever
                  className="req"
                  onClick={() =>
                    handleDelete({ id: emp.emp_id, mobile: emp.emp_mobile })
                  }
                />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;
