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
import "../../../../Styles/AdminPannel/WhatsapSms.css";

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
      <div className="whatsapp-sms-outer-container w100 h1 a-center d-flex-col">
        <div className="whatsapp-sms-container w70 h60 d-flex j-center">
          <div className="page-title-container w100 d-flex sb">
            <div className="heading">WhatsApp Sms Recharge</div>
            <NavLink to="/adminpanel/whatsapp-sms" className="w-btn d-none">
              Back
            </NavLink>
          </div>
          <div className="recharge-whsms-container w100 h90 d-flex-col sa my10 p10 bg">
            <div className="sms-seting-div w100 h30 d-flex a-center sb">
              <div className="label-text w20">Select Dairy :</div>
              <Select
                options={dairyOptions1}
                className="dairyid w20"
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
                className="dairyname w50"
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
            <div className="sms-seting-div w100 h30 d-flex a-center sb">
              <div className="label-text w20">Select Center :</div>
              <Select
                options={centerOptions1}
                className="dairyid w20"
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
                className="dairyname w50"
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
            <div className="sms-seting-div w100 h30 d-flex a-center">
              <div className="label-text w25">Balance :</div>
              <input
                type="number"
                className="w20 data dairyid"
                placeholder=""
                value={formData.balance}
                onChange={(e) => {
                  setFormData({ ...formData, balance: e.target.value });
                }}
              />
            </div>
            <div className="form-btn-container w100 d-flex j-end">
              <button
                className="w-btn mx10"
                type="submit"
                onClick={handleReset}
              >
                Reset
              </button>
              <button className="w-btn" type="submit" onClick={handleSubmit}>
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
