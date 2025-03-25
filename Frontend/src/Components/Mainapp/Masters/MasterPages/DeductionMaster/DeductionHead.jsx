import React, { useEffect, useState } from "react";
import "../../../../../Styles/DeductionReport/Deduction.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axiosInstance from "../../../../../App/axiosInstance";
import { getDeductionMaster } from "../../../../../App/Features/Deduction/deductionSlice";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { listSubLedger } from "../../../../../App/Features/Mainapp/Masters/ledgerSlice";
import Swal from "sweetalert2";

const DeductionHead = () => {
  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    DeductionId: 0,
    DeductionName: "",
    GLCode: 0,
    Active: "N",
    PriorityNo: "",
    GLCodeCR: 0,
    deductionNameeng: "",
    show_outstanding: 0,
    id: 0,
  });

  const deductionData = useSelector((state) => state.deduction.deductionData);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);

  // const sledgerlist = [
  //   { id: 1, name: "sLedger1" },
  //   { id: 2, name: "sLedger2" },
  //   { id: 3, name: "sLedger3" },
  // ];

  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [settings, setSettings] = useState({});
  const autoCenter = settings?.autoCenter;
  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }

    dispatch(getDeductionMaster());
    dispatch(listSubLedger());
    // dispatch(listSubLedger());
  }, [centerSetting]);

  //option list show only name
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));
  //option list show only id
  const options2 = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.lno,
  }));

  // handle Select Change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
  };

  //handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.PriorityNo || !formData.GLCode) {
      toast.warn("Please enter both Deduction No and नावे खाते क्र.");
      return;
    }
    if (!formData.DeductionName || !formData.deductionNameeng) {
      toast.warn("Please Enter both कपात मराठी AND इंग्लिश ");
      return;
    }
    if (!isEdit) {
      try {
        const res = await axiosInstance.post("/create-deduction", formData);
        if (res?.data?.success) {
          toast.success("Successfully save the deduction");
          setFormData({
            id: 0,
            DeductionId: 0,
            DeductionName: "",
            GLCode: 0,
            Active: "N",
            PriorityNo: "",
            GLCodeCR: 0,
            deductionNameeng: "",
            show_outstanding: 0,
          });
          getMaxDDid();
          dispatch(getDeductionMaster());
        }
      } catch (error) {
        console.error(error);
        toast.error("Error to server");
      }

      // console.log(formData);
    } else {
      const result = await Swal.fire({
        title: "Confirm Updation?",
        text: "Are you sure you want to Update this?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Update it!",
      });
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.patch("/update-deduction", formData);
          if (res?.data?.success) {
            toast.success("Update Successfully");
            setFormData({
              DeductionId: 0,
              DeductionName: "",
              GLCode: 0,
              Active: "N",
              PriorityNo: "",
              GLCodeCR: 0,
              deductionNameeng: "",
              show_outstanding: 0,
            });
            getMaxDDid();
            dispatch(getDeductionMaster());
            setIsEdit(false);
          }
        } catch (error) {
          console.error(error);
          toast.error("Error to server");
        }
      }
    }
  };

  //handel Edit
  const handleEdit = (id) => {
    const item = deductionData.find((item) => Number(item.id) === Number(id));

    if (!item) {
      toast.warn("Do Not found deductions");
      return;
    }
    setFormData({
      DeductionId: item.DeductionId,
      DeductionName: item.DeductionName,
      GLCode: item.GLCode,
      Active: item.Active,
      PriorityNo: item.PriorityNo,
      GLCodeCR: item.GLCodeCR,
      deductionNameeng: item.deductionNameeng,
      show_outstanding: item.show_outstanding,
      id: item.id,
    });
    setIsEdit(true);
  };
  //handle delete
  const handleDeleteItem = async (id) => {
    if (!id) {
      toast.error("Not identify id");
      return;
    }
    // console.log("handle delete");
    const result = await Swal.fire({
      title: "Confirm Delete?",
      text: "Are you sure you want to Delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`/delete-deduction?id=${id}`);
        if (res?.data?.success) {
          toast.success("Successfully delete the deduction");
          dispatch(getDeductionMaster());
        }
      } catch (error) {
        console.error(error);
        toast.error("Error to server");
      }
    }
  };

  //get max Deduction id
  const getMaxDDid = async () => {
    try {
      const res = await axiosInstance.post(
        `/getmax-deductions?autoCenter=${autoCenter}`
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        DeductionId: res.data.maxDeductionId,
      }));
    } catch (error) {
      console.log(error);
      // toast.error("Error to server");
    }
  };

  useEffect(() => {
    if (settings?.autoCenter !== undefined) {
      getMaxDDid();
    }
  }, [settings]);

  //handle clear
  const handleClear = (e) => {
    e.preventDefault();
    setFormData({
      DeductionName: "",
      GLCode: 0,
      Active: "N",
      PriorityNo: "",
      GLCodeCR: 0,
      deductionNameeng: "",
      show_outstanding: 0,
    });
    getMaxDDid();
    setIsEdit(false);
  };

  return (
    <>
      <div className="Deduction-head-container w100 h1 d-flex-col bg ">
        <h1 className="heading ">Deduction Head</h1>
        <div className="deduction-head-span-input-half-div w100 h40 d-flex-col">
          <div className="deduction-no-and-checkbox-div d-flex h20 a-center  ">
            <div className="deduction-code-milk-payment-div w50 h1 d-flex a-center">
              <div className="deduction-number-div w50 h1 d-flex a-center">
                <span className="label-text w50">Deduction No:</span>
                <input
                  className="data w30"
                  type="text"
                  value={formData.PriorityNo}
                  onChange={(e) =>
                    setFormData({ ...formData, PriorityNo: e.target.value })
                  }
                />
              </div>
              <div className="code-number-div w50 h1 d-flex a-center">
                <span className="label-text w20"> Code:</span>
                <input
                  className="data w30"
                  type="text"
                  value={formData.DeductionId}
                  disabled
                />
              </div>
            </div>
            <div className="checkbox-payment-bill-all-deduction w50 h1 d-flex a-center">
              <div className="Milk-pyment-Show-Stop-div w50 h1 d-flex a-center">
                <input
                  className="data w20"
                  type="checkbox"
                  checked={formData.show_outstanding === 1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      show_outstanding: e.target.checked ? 1 : 0,
                    })
                  }
                />
                <span className="label-text w100">शिल्लक दाखवणे बंद</span>
              </div>
              <div className="All-Deduction-Div w50 h1 d-flex a-center">
                <input
                  className="data w20"
                  type="checkbox"
                  checked={formData.Active === "Y"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      Active: e.target.checked ? "Y" : "N",
                    })
                  }
                />
                <span className="label-text w100">संपूर्ण कपात</span>
              </div>
            </div>
          </div>
          <div className="deduction-name-eng-and-marathi  w100 h25 d-flex a-center">
            <div className="Marathi-name-deduction-div d-flex w50 h1 a-center">
              <span className="label-text w30">कपात मराठी नाव:</span>
              <input
                className="data w60"
                type="text"
                value={formData.DeductionName}
                onChange={(e) =>
                  setFormData({ ...formData, DeductionName: e.target.value })
                }
              />
            </div>
            <div className="English-name-deduction-div d-flex w50 h1 a-center">
              <span className="label-text w30">कपात इंग्लिश नाव:</span>
              <input
                className="data w60"
                type="text"
                value={formData.deductionNameeng}
                onChange={(e) =>
                  setFormData({ ...formData, deductionNameeng: e.target.value })
                }
              />
            </div>
          </div>
          <div className="nave-acc-no-jama-Acc-no w100 d-flex h20 a-center">
            <div className="name-acc-contsiner-div w50 d-flex h1 ">
              <div className="nave-acc-no-div w40 d-flex h1 a-center p10">
                <span className="label-text w80">नावे खाते क्र:</span>
              </div>
              <div className="select-input-deduction-div w60 d-flex">
                <Select
                  options={options2}
                  className="w30 mx5"
                  placeholder=""
                  isSearchable
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 200,
                    }),
                  }}
                  value={options2.find(
                    (option) => option.value === formData.GLCode
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "GLCode")
                  }
                />

                {/* Second Select */}
                <Select
                  options={options}
                  className="w60 mx5"
                  placeholder=""
                  isSearchable
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 200,
                    }),
                  }}
                  value={options.find(
                    (option) => option.value === formData.GLCode
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "GLCode")
                  }
                />
              </div>
            </div>

            <div className="name-acc-contsiner-div w50 d-flex h1 ">
              <div className="nave-acc-no-div w40 d-flex h1 a-center p10">
                <span className="label-text w80">जमा खाते क्र:</span>
              </div>
              <div className="select-input-deduction-jama-div w60 d-flex">
                <Select
                  options={options2}
                  className="w30 mx5"
                  placeholder=""
                  isSearchable
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 200,
                    }),
                  }}
                  value={options2.find(
                    (option) => option.value === formData.GLCodeCR
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "GLCodeCR")
                  }
                />

                {/* Second Select */}
                <Select
                  options={options}
                  className="w60 mx5"
                  placeholder=""
                  isSearchable
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      zIndex: 200,
                    }),
                  }}
                  value={options.find(
                    (option) => option.value === formData.GLCodeCR
                  )}
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption, "GLCodeCR")
                  }
                />
              </div>
            </div>
          </div>
          <div className="deduction-button-div w100 h20 d-flex a-center sa">
            <button type="submit" className="w-btn" onClick={handleSubmit}>
              {!isEdit ? "Save" : "Update"}
            </button>
            {/* <button type="button" className="w-btn" onClick={handleEdit}>
              Edit
            </button> */}
            {/* <button type="button" className="w-btn">
              Delete
            </button> */}
            <button type="reset" className="w-btn" onClick={handleClear}>
              Cancel
            </button>
          </div>
        </div>
        <div className="Deductionhead-table-section-container w100 h60 d-flex-col">
          <div className="Deductionhead-table-heading-container w100  h10 d-flex sa a-center">
            <span className="">Edit</span>
            <span className=""> Code</span>
            <span className=""> Name</span>
            <span className="">GL Number</span>
            <span className="">GL Name</span>
            <span className="">Action</span>
          </div>
          {deductionData &&
            deductionData.map((item) => (
              <div className="w100  h20 d-flex sa a-center" key={item.id}>
                <span
                  className=""
                  onClick={() => handleEdit(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <FaRegEdit />
                </span>
                <span className="">{item.PriorityNo}</span>
                <span className="">{item.DeductionName}</span>
                <span className="">{item.GLCode}</span>
                <span className="">
                  {(sledgerlist &&
                    sledgerlist.find((item) => item.GLCode === item.GLCode)
                      ?.marathi_name) ||
                    "Not Found"}
                </span>
                <span className="">
                  <MdDeleteOutline
                    size={20}
                    className="table-icon"
                    style={{ color: "red" }}
                    onClick={() => handleDeleteItem(item.id)}
                  />
                </span>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default DeductionHead;
