import { useEffect, useState } from "react";
import Select from "react-select";
import "../../../../Styles/AdminPannel/AccessControls/WhatsapSms.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getCenterList,
  getDairyList,
} from "../../../../App/Features/Admin/SuperAdmin/accessSlice";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";

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
  return (
    <>
      <div className="abmin-whatsapp-sms j-center d-flex-col">
        <div className="d-flex w100 sa m10">
          <div className="heading">WhatsApp Sms Recharge</div>
        </div>
        <div className="d-flex-col mx10   bg w100 recharge-whsms-container">
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
                formData.center_id
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
                formData.center_id
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
            <button className="w-btn" type="submit" onClick={handleSubmit}>
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default WhatsappSms;
