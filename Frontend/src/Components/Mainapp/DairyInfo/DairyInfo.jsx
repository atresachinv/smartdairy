import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  resetUpdateState,
  updateDairyDetails,
} from "../../../App/Features/Dairy/registerSlice";
import { toast } from "react-toastify";
import { fetchDairyInfo } from "../../../App/Features/Admin/Dairyinfo/dairySlice";
import "../../../Styles/Mainapp/Dairy/Dairy.css";

const DairyInfo = () => {
  const dispatch = useDispatch();
  const dairyInfo = useSelector((state) => state.dairy.dairyData);
  const loading = useSelector((state) => state.register.loading);
  const error = useSelector((state) => state.register.error);
  const success = useSelector((state) => state.register.success);

  const [formData, setFormData] = useState({
    marathiName: "",
    SocietyName: "",
    RegNo: "",
    RegDate: "",
    gstno: "",
    AuditClass: "",
    PhoneNo: "",
    email: "",
    city: "",
    tel: "",
    dist: "",
    PinCode: "",
  });

  useEffect(() => {
    if (dairyInfo) {
      setFormData(dairyInfo);
    }
  }, [dairyInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateDairyDetails(formData)); // Dispatch the update action
  };

  useEffect(() => {
    if (success) {
      toast.success("Dairy information updated successfully!");
      dispatch(resetUpdateState()); // Reset state after success
    }
    if (error) {
      toast.error(`Error: ${error}`);
      dispatch(resetUpdateState()); // Reset state after error handling
    }
    dispatch(fetchDairyInfo());
  }, [success, error, dispatch]);

  return (
    <div className="dairy-main-container w100 h1 d-flex center">
      <form
        className="dairy-information-div w50 h90 d-flex-col bg p10"
        onSubmit={handleSubmit}>
        <span className="heading ">Dairy Information</span>
        <div className="dairy-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100 ">Marathi Name : </span>
          <input
            className="data w100 "
            type="text"
            name="marathiName"
            placeholder="डेरीचे नाव"
            value={formData.marathiName} // Use formData here
            required
            onChange={handleChange}
          />
        </div>
        <div className="dairy-name-div w100 h15 d-flex-col sa">
          <span className="info-text w100 ">English Name :</span>
          <input
            className="data w100 "
            type="text"
            name="SocietyName"
            placeholder="Dairy Name"
            value={formData.SocietyName} // Use formData here
            required
            onChange={handleChange}
          />
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="regi-no-div w45 h1 d-flex-col sa">
            <span className="info-text w100 ">Register Number :</span>
            <input
              className="data w100"
              type="number"
              name="RegNo"
              value={formData.RegNo}
              onChange={handleChange}
            />
          </div>
          <div className="regi-no-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Register Date :</span>
            <input
              className="data w100"
              type="date"
              name="RegDate"
              value={formData.RegDate}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">GST Number :</span>
            <input
              className="data w100 "
              type="text"
              name="gstno"
              value={formData.gstno}
              onChange={handleChange}
            />
          </div>
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Audit Class :</span>
            <input
              className="data w100 "
              type="text"
              name="AuditClass"
              value={formData.AuditClass}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Mobile Number :</span>
            <input
              className="data w100 "
              type="tel"
              name="PhoneNo"
              value={formData.PhoneNo}
              onChange={handleChange}
            />
          </div>
          <div className="gst-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Email :</span>
            <input
              className="data w100 "
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sb ">
            <span className="info-text w100 ">City :</span>
            <input
              className="data w100"
              type="text"
              name="city" // Updated name for this input
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Tehsil :</span>
            <input
              className="data w100 "
              type="text"
              name="tel" // Updated name for this input
              value={formData.tel}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="dairy-div w100 h15 d-flex sb">
          <div className="add-div w45 h1 d-flex-col sa">
            <span className="info-text w100 ">District :</span>
            <input
              className="data w100"
              type="text"
              name="dist" // Updated name for this input
              value={formData.dist}
              onChange={handleChange}
            />
          </div>
          <div className="add-div w45 h1 d-flex-col sb">
            <span className="info-text w100 ">Pincode :</span>
            <input
              className="data w100 "
              type="text"
              name="PinCode" // Updated name for this input
              value={formData.PinCode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="button-container d-flex w100 h10 my10 center">
          <button className="btn w50 h1" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Dairy Info"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DairyInfo;
