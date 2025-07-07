import { useEffect, useState } from "react";
import Select from "react-select";
import { useSelector, useDispatch } from "react-redux";
import {
  getCenterList,
  getDairyList,
} from "../../../../App/Features/Admin/SuperAdmin/accessSlice";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import "../../../../Styles/AdminPannel/AccessControls/WhatsapSms.css";

const WhatsappSms = () => {
  const { dairyList, centerList } = useSelector((state) => state.access);

  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    dairy_id: "",
    center_id: "",
    balance: "",
  });
  const [filterCenter, setFilterCenter] = useState([]);

  useEffect(() => {
    dispatch(getDairyList());
    dispatch(getCenterList());
  }, [dispatch]);

  const dairyOptions = dairyList.map((item) => ({
    value: item.SocietyCode,
    label: `${item.SocietyName}`,
  }));
  const dairyOptions1 = dairyList.map((item) => ({
    value: item.SocietyCode,
    label: `${item.SocietyCode}`,
  }));
  const centerOptions = filterCenter.map((item) => ({
    value: item.center_id,
    label: `${item.center_name}`,
  }));
  const centerOptions1 = filterCenter.map((item) => ({
    value: item.center_id,
    label: `${item.center_id}`,
  }));

  useEffect(() => {
    if (dairyList.length > 0 && formData.dairy_id) {
      setFilterCenter(
        centerList.filter((item) => item.orgid === formData.dairy_id)
      );
    }
  }, [dairyList, centerList, formData.dairy_id]);

  //handle submit
  const handleSubmit = async () => {
    if (
      formData.dairy_id === "" ||
      formData.center_id === "" ||
      formData.balance === ""
    ) {
      toast.error("All fields are required");
      return;
    }
    const data = {
      dairy_id: Number(formData.dairy_id),
      center_id: Number(formData.center_id),
      balance: Number(formData.balance),
    };

    try {
      const response = await axiosInstance.post(
        "/sadmin/recharge-whatsapp-sms",
        data
      );

      if (response.status === 200) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
      setFormData({ ...formData, center_id: "", balance: "" });
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  //handle reset
  const handleReset = () => {
    setFormData({ dairy_id: "", center_id: "", balance: "" });
  };

  return (
    <>
      <div className=" w100 h1 j-center d-flex-col">
        <div className="w100 d-flex sb">
          <div className="heading">WhatsApp Sms Recharge</div>
          <NavLink to="/adminpanel/whatsapp-sms" className="w-btn">
            Back
          </NavLink>
        </div>
        <div className="d-flex j-center abmin-whatsapp-sms">
          <div className=" d-flex-col m10   bg w100 recharge-whsms-container">
            <div className="d-flex a-center w100">
              <div className="info-text">Select Dairy :-</div>
              <Select
                options={dairyOptions1}
                className="mx5 w20"
                placeholder=""
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 200,
                  }),
                }}
                value={
                  formData.dairy_id
                    ? dairyOptions1.find(
                        (option) => option.value === Number(formData.dairy_id)
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData({ ...formData, dairy_id: selectedOption.value });
                }}
              />
              <Select
                options={dairyOptions}
                className=" mx5 w50"
                placeholder=""
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 200,
                  }),
                }}
                value={
                  formData.dairy_id
                    ? dairyOptions.find(
                        (option) => option.value === Number(formData.dairy_id)
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData({ ...formData, dairy_id: selectedOption.value });
                }}
              />
            </div>
            <div className="d-flex a-center my15">
              <div className="info-text">Select Center :-</div>
              <Select
                options={centerOptions1}
                className="  w20"
                placeholder=""
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 200,
                  }),
                }}
                value={
                  formData.center_id !== ""
                    ? centerOptions1.find(
                        (option) => option.value === Number(formData.center_id)
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData({ ...formData, center_id: selectedOption.value });
                }}
              />
              <Select
                options={centerOptions}
                className=" mx5 w50"
                placeholder=""
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 200,
                  }),
                }}
                value={
                  formData.center_id !== ""
                    ? centerOptions.find(
                        (option) => option.value === Number(formData.center_id)
                      )
                    : null
                }
                onChange={(selectedOption) => {
                  setFormData({ ...formData, center_id: selectedOption.value });
                }}
              />
            </div>
            <div className="d-flex a-center my5">
              <div className="info-text">Balance :-</div>
              <input
                type="number"
                className="data mx10 w30"
                placeholder=""
                value={formData.balance}
                onChange={(e) => {
                  setFormData({ ...formData, balance: e.target.value });
                }}
              />
            </div>
            <div className="d-flex j-end mx10 ">
              <button className="w-btn" type="submit" onClick={handleReset}>
                Reset
              </button>
              <button
                className="w-btn mx10"
                type="submit"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsappSms;
