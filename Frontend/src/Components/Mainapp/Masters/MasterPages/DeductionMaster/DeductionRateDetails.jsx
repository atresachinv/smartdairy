import React, { useEffect, useState } from "react";
import "../../../../../Styles/DeductionReport/DeductionRateDetails.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getDeductionDetails,
  getDeductionMaster,
} from "../../../../../App/Features/Deduction/deductionSlice";
import Select from "react-select";
import axiosInstance from "../../../../../App/axiosInstance";
import { toast } from "react-toastify";
import { listSubLedger } from "../../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";

const DeductionRateDetails = () => {
  const [formData, setFormData] = useState({
    id: "",
    DDId: "",
    DeductionId: "",
    GLCode: 0,
    RatePerLitre: "",
    ApplyDate: "",
    FixedVariable: 0,
    LP: 0,
  });
  const dispatch = useDispatch();
  const deductionData = useSelector((state) => state.deduction.deductionData);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const deductionDetails = useSelector(
    (state) => state.deduction.deductionDetails
  );

  const [isEdit, setIsEdit] = useState(false);
  const [isDisable, setIsDisable] = useState(false);

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
  }, [centerSetting]);

  //option list show only name
  const options = deductionData.map((item) => ({
    DeductionId: item.DeductionId,
    GLCode: item.GLCode,
    value: item.DeductionId,
    label: `${item.DeductionName}`,
    GLCode: item.GLCode,
  }));
  const options1 = deductionData.map((item) => ({
    DeductionId: item.DeductionId,
    value: item.DeductionId,
    label: `${item.DeductionId}`,
    GLCode: item.GLCode,
  }));

  // handle Select Change
  const handleSelectChange = (selectedOption) => {
    setFormData({
      ...formData,
      DeductionId: selectedOption.value,
      GLCode: selectedOption.GLCode,
    });
  };

  //handle Submit to save new recored and also update record----->
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.DeductionId) {
      toast.warn("Please select कपात");
      return;
    }
    if (!formData.ApplyDate) {
      toast.warn("Please select apply date ");
      return;
    }
    if (!formData.RatePerLitre) {
      toast.warn("Please enter कपात दर ");
      return;
    }
    if (!isEdit) {
      // console.log(formData);
      try {
        const res = await axiosInstance.post(
          "/create-deduction-details",
          formData
        );
        if (res?.data?.success) {
          toast.success("Successfully save the deduction");
          handleClear();
          dispatch(getDeductionDetails(autoCenter));
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
          const res = await axiosInstance.patch(
            "update-deduction-details",
            formData
          );
          if (res?.data?.success) {
            toast.success("Update Successfully");
            handleClear();
            dispatch(getDeductionDetails(autoCenter));
          }
        } catch (error) {
          console.error(error);
          toast.error("Error to server");
        }
      }
    }
  };

  //get max Deduction id
  const getMaxDDid = async () => {
    try {
      const res = await axiosInstance.post(
        `/getmax-ded-details?autoCenter=${autoCenter}`
      );
      setFormData((prevFormData) => ({
        ...prevFormData,
        DDId: res.data.maxDDId,
      }));
    } catch (error) {
      // console.log(error);
      // toast.error("Error to server");
    }
  };

  useEffect(() => {
    if (settings?.autoCenter !== undefined) {
      getMaxDDid();
      dispatch(getDeductionMaster(autoCenter));
      dispatch(getDeductionDetails(autoCenter));
      dispatch(listSubLedger());
    }
  }, [settings]);

  //handle clear
  const handleClear = () => {
    setFormData({
      id: "",
      DDId: "",
      DeductionId: "",
      GLCode: 0,
      RatePerLitre: "",
      ApplyDate: "",
      FixedVariable: 0,
      LP: 0,
    });
    getMaxDDid();
    setIsEdit(false);
    setIsDisable(false);
  };

  //find deduction name
  const findDeduction = (ddid) => {
    const foundItem = deductionData.find((item) => item.DeductionId === ddid);
    return (
      foundItem?.DeductionName || foundItem?.deductionNameeng || "Not Found"
    );
  };

  //find subleger name
  const findLedger = (ddid) => {
    const foundItem = sledgerlist.find(
      (item) => Number(item.lno) === Number(ddid)
    );
    // console.log("pra:", ddid);
    // console.log(foundItem);
    return foundItem?.marathi_name || foundItem?.ledger_name || "Not Found";
  };

  //handel Edit
  const handleEdit = (id) => {
    const item = deductionDetails.find(
      (item) => Number(item.id) === Number(id)
    );

    if (!item) {
      toast.warn("Do Not found deductions");
      return;
    }
    const formattedApplyDate = item.ApplyDate.substring(0, 10);
    setFormData({
      id: item.id,
      DDId: item.DDId,
      DeductionId: item.DeductionId,
      GLCode: item.GLCode,
      RatePerLitre: item.RatePerLitre,
      ApplyDate: formattedApplyDate,
      FixedVariable: item.FixedVariable,
      LP: item.LP,
    });
    setIsEdit(true);
    setIsDisable(true);
  };

  //handle delete
  const handleDeleteItem = async (id) => {
    if (!id) {
      toast.error("Not identify id");
      return;
    }
    // console.log("handle delete");
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to Delete this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it!",
    });
    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `/delete-deduction-details?id=${id}`
        );
        if (res?.data?.success) {
          toast.success("Successfully delete the deduction");
          dispatch(getDeductionDetails(autoCenter));
        }
      } catch (error) {
        console.error(error);
        toast.error("Error to server");
      }
    }
  };

  return (
    <>
      <div className="deduction-details-report-container w100 h1 d-flex-col bg ">
        <span className="heading">Deduction Details</span>
        <div className="deduction-details-first-half-div w100 h40 d-flex-col ">
          <div className="deduction-name-div w100 d-flex h20 a-center ">
            <span className="label-text w15">कपातीचे नाव :</span>

            <Select
              options={options1}
              className="w10 mx5"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={options1.find(
                (option) => option.value === formData.DeductionId
              )}
              onChange={handleSelectChange}
              isDisabled={isDisable}
            />

            {/* Second Select */}
            <Select
              options={options}
              className="w30 mx5"
              placeholder=""
              isSearchable
              styles={{
                menu: (provided) => ({
                  ...provided,
                  zIndex: 200,
                }),
              }}
              value={options.find(
                (option) => option.value === formData.DeductionId
              )}
              onChange={(selectedOption) => handleSelectChange(selectedOption)}
              isDisabled={isDisable}
            />
          </div>
          <div className="deduction-code-and-date w80 d-flex h30 a-center">
            <div className="deduction-code-div w40 d-flex h1 a-center">
              <span className="label-text w30 ">Code:</span>
              <input
                className="data w60"
                type="text"
                disabled
                value={formData.DDId}
              />
            </div>
            <div className="deduction-code-date-div w40 d-flex h1 a-center">
              <span className="label-text w30 ">लागू दिनांक :</span>
              <input
                className="data w50"
                type="date"
                value={formData.ApplyDate}
                disabled={isDisable}
                onChange={(e) =>
                  setFormData({ ...formData, ApplyDate: e.target.value })
                }
              />
            </div>
          </div>
          <div className="radio-buttonsdeductiona-deatilas w80 d-flex h20 a-center">
            <div className="as-per-liter-deduction-div w30 d-flex h1 a-center">
              <input
                className="w20"
                type="radio"
                name="option0"
                value="0"
                checked={formData.LP === 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    LP: Number(e.target.value),
                  })
                }
              />
              <span className="label-text">प्रती लीटर प्रमाणे</span>
            </div>
            <div className="Pymentwise-deduction-div w30 d-flex h1 a-center">
              <input
                className="w20"
                type="radio"
                name="option0"
                value="1"
                checked={formData.LP === 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    LP: Number(e.target.value),
                  })
                }
              />
              <span className="label-text">प्रती पेमेंट प्रमाणे</span>
            </div>
            <div className="as-per-liter-deduction-div w30 d-flex h1 a-center">
              <input
                className="w20"
                type="radio"
                name="option0"
                value="2"
                checked={formData.LP === 2}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    LP: Number(e.target.value),
                  })
                }
              />
              <span className="label-text">
                माल विक्री प्रमाणे/जमा-नावे प्रमाणे
              </span>
            </div>
          </div>
          <div className="Rate-typecontainer-div w80 h20 d-flex a-center">
            <div className="One-rate-div w30 d-flex h1 a-center">
              <input
                className="w20"
                type="radio"
                name="option1"
                value="0"
                checked={formData.FixedVariable === 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    FixedVariable: Number(e.target.value),
                  })
                }
              />
              <span className="label-text">एक दर </span>
            </div>
            <div className="Round-AMount-div w30 d-flex h1 a-center">
              <input
                className="w20"
                type="radio"
                name="option1"
                value="1"
                checked={formData.FixedVariable === 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    FixedVariable: Number(e.target.value),
                  })
                }
              />
              <span className="label-text">+Round AMt</span>
            </div>
            <div className="deduction-rate-div w30 h1 d-flex a-center ">
              <span className="label-text w100"> कपात दर :</span>
              <input
                className="data w50"
                type="text"
                value={formData.RatePerLitre}
                onChange={(e) =>
                  setFormData({ ...formData, RatePerLitre: e.target.value })
                }
              />
            </div>
          </div>
          <div className="Deduction-details-button w100 h30 d-flex a-center sa  ">
            <button type="submit" className="w-btn" onClick={handleSubmit}>
              {!isEdit ? "Save" : "Update"}
            </button>
            <button className="w-btn" type="button" onClick={handleClear}>
              Cancel
            </button>
          </div>
        </div>
        <div className="Deduction-details-table-container-div w100 h60 d-flex-col ">
          <div className="table-heading-deduction-details w100 d-flex h10 sa">
            <span className="label-text ">Edit </span>
            <span className="label-text ">कपात </span>
            <span className="label-text ">खतावणी </span>
            <span className="label-text ">दर </span>
            <span className="label-text ">लागू दिनांक </span>
            <span className="label-text ">दर प्रकार </span>
            <span className="label-text ">दर प्रती </span>
            <span className="label-text ">Action </span>
          </div>
          {deductionDetails ? (
            deductionDetails.map((item) => (
              <div
                key={item.id}
                className="deduction-details-table-data-div w100 d-flex sa h90"
              >
                <span
                  className=""
                  onClick={() => handleEdit(item.id)}
                  style={{ cursor: "pointer" }}
                >
                  <FaRegEdit />
                </span>
                <span className="label-text ">
                  {findDeduction(item.DeductionId)}
                </span>
                <span className="label-text ">{findLedger(item.GLCode)}</span>
                <span className="label-text ">{item.RatePerLitre}</span>
                <span className="label-text ">
                  {item.ApplyDate.substring(0, 10)}
                </span>
                <span className="label-text ">
                  {Number(item.FixedVariable) === 0 ? "एक दर " : "Round Amt"}
                </span>
                <span className="label-text ">
                  {Number(item.LP) === 0
                    ? "प्रती लीटर प्रमाणे"
                    : Number(item.LP) === 1
                    ? "प्रती पेमेंट प्रमाणे"
                    : "माल विक्री प्रमाणे/जमा-नावे प्रमाणे"}
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
            ))
          ) : (
            <div className="w100 h1 d-flex center">No Data Found</div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeductionRateDetails;
