import { useEffect, useState } from "react";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/collsetting.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getCenterSetting,
  updateDairySetup,
} from "../../../../../App/Features/Mainapp/Settings/dairySettingSlice";
import Swal from "sweetalert2";

const CollSettings = ({ clsebtn, isModalOpen }) => {
  const dispatch = useDispatch();
  const dairyInfo = useSelector((state) => state.dairy.dairyData || []);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const status = useSelector((state) => state.dairySetting.cupdateStatus);
  // const { status, error } = useSelector((state) => state.milkCollection);

  // Initialize state for form inputs
  const [formData, setFormData] = useState({
    id: "",
    milkType: "",
    collUnit: "",
    previnfo: "",
    fill_manually: "",
    whsms: 0,
    print: 0,
  });

  // Array of manual entry options
  const manualOptions = [
    { label: "लिटर", value: "0" },
    { label: "फॅट", value: "1" },
    { label: "SNF", value: "2" },
    { label: "डिग्री", value: "3" },
  ];

  const prevOptions = [
    { label: "फॅट", value: "0" },
    { label: "SNF", value: "1" },
    { label: "डिग्री", value: "2" },
  ];

  // Toggle manual checkbox value in comma-separated string
  const handleInputChange = (name, value) => {
    if (name === "fill_manually" || name === "previnfo") {
      const selected = formData[name] ? formData[name].split(",") : [];

      const updated = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value];

      setFormData((prev) => ({
        ...prev,
        [name]: updated.sort().join(","),
      }));
    } else {
      // For radio buttons (single value fields)
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked ? 1 : 0,
    }));
  };

  // console.log("centerSetting", centerSetting, dairyInfo.center_id);

  useEffect(() => {
    if (centerSetting.length > 0) {
      setFormData((prev) => ({
        ...prev,
        id: centerSetting[0]?.id,
        milkType: centerSetting[0]?.milkType,
        previnfo: centerSetting[0]?.previnfo,
        fill_manually: centerSetting[0]?.fill_manually,
        whsms: centerSetting[0]?.whsms,
        print: centerSetting[0]?.print,
        collUnit: centerSetting[0]?.collUnit,
      }));
    }
  }, [centerSetting]);
  useEffect(() => {
    dispatch(getCenterSetting({ centerid: dairyInfo.center_id }));
  }, []);

  // handlinng form data submition ---------------------------------------------->
  const handleSettings = async (e) => {
    e.preventDefault();
    const result = await Swal.fire({
      title: "Updation Confirmation?",
      text: "Are you sure you want to Update this?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Update it!",
    });

    if (result.isConfirmed) {
      await dispatch(updateDairySetup({ formData, centerid: null })).unwrap();
      dispatch(getCenterSetting({ centerid: dairyInfo.center_id }));
      clsebtn(false);
    }
  };

  return (
    <div className="milk-col-form w50 h70 d-flex-col bg-light-green br9 p10">
      <div className="setting-btn-switch w100 h10 d-flex a-center sb">
        <span className="heading">दुध संकलन सेटिंग :</span>{" "}
        <span
          type="button"
          className="text btn-danger"
          onClick={() => clsebtn(false)}
        >
          बाहेर पडा
        </span>
      </div>
      <form
        onSubmit={handleSettings}
        className="collection-settings-form-div w100 h90 d-flex-col sa"
      >
        <div className="coll-inputs-outer-div w100 h20 d-flex sb">
          <div className="coll-inputs-div w50 h1 d-flex-col sa">
            <span className="label-text">दुध प्रकार निवडा :</span>
            <div className="col-inputs-div w100 d-flex a-center sb">
              <div className="input-radio-btn w50 h1 d-flex a-center sb">
                <input
                  className="w20"
                  type="radio"
                  name="milkType"
                  value={0}
                  checked={formData.milkType === 0}
                  onChange={(e) =>
                    handleInputChange("milkType", Number(e.target.value))
                  }
                />
                <span className="info-text w70">गाय </span>
              </div>
              <div className="input-radio-btn w50 h1 d-flex a-center sb">
                <input
                  className="w20"
                  type="radio"
                  name="milkType"
                  value={1}
                  checked={formData.milkType === 1}
                  onChange={(e) =>
                    handleInputChange("milkType", Number(e.target.value))
                  }
                />
                <span className="info-text w70">म्हैस</span>
              </div>
            </div>
          </div>
          <div className="coll-inputs-div w50 h1 d-flex-col sa">
            <span className="label-text">संकलन मोजण्याचे युनिट :</span>
            <div className="col-inputs-div w100 d-flex a-center sb">
              <div className="input-radio-btn w50 h1 d-flex a-center sb">
                <input
                  className="w20"
                  type="radio"
                  name="collUnit"
                  value={0}
                  checked={formData.collUnit === 0}
                  onChange={(e) =>
                    handleInputChange("collUnit", Number(e.target.value))
                  }
                />
                <span className="info-text w70">लिटर </span>
              </div>
              <div className="input-radio-btn w50 h1 d-flex a-center sb">
                <input
                  className="w20"
                  type="radio"
                  name="collUnit"
                  value={1}
                  checked={formData.collUnit === 1}
                  onChange={(e) =>
                    handleInputChange("collUnit", Number(e.target.value))
                  }
                />
                <span className="info-text w70">किलो</span>
              </div>
            </div>
          </div>
        </div>

        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="label-text">
            मागील माहिती वापरण्यासाठी पर्याय निवडा :
          </span>
          <div className="col-inputs-div w60 h50 d-flex sb">
            {prevOptions.map((opt) => (
              <div
                key={opt.value}
                className="input-radio-btn w30 h1 d-flex a-center sa"
              >
                <input
                  className="w20"
                  type="checkbox"
                  value={opt.value}
                  checked={formData.previnfo?.split(",").includes(opt.value)}
                  onChange={() => handleInputChange("previnfo", opt.value)}
                />
                <span className="info-text w70 a-center">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="label-text">
            हाताने भरण्यासाठी माहितीचा पर्याय निवडा :
          </span>
          <div className="col-inputs-div w60 h50 d-flex sb">
            {manualOptions.map((opt) => (
              <div
                key={opt.value}
                className="input-radio-btn w25 h1 d-flex a-center sa"
              >
                <input
                  className="w20"
                  type="checkbox"
                  value={opt.value}
                  checked={formData.fill_manually
                    ?.split(",")
                    .includes(opt.value)}
                  onChange={() => handleInputChange("fill_manually", opt.value)}
                />
                <span className="info-text w70">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="label-text">
            संकलन मेसेज व प्रिंट साठी पर्याय निवडा :
          </span>
          <div className="col-inputs-div w100 h50 d-flex">
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="whsms"
                checked={formData.whsms === 1}
                onChange={handleCheckboxChange}
              />
              <span className="info-text w70">व्हाट्सअँप मेसेज</span>
            </div>
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input
                className="w20"
                type="checkbox"
                name="print"
                checked={formData.print === 1}
                onChange={handleCheckboxChange}
              />
              <span className="info-text w70">प्रिंट</span>
            </div>
          </div>
        </div>

        <div className="button-container w100 h20 d-flex j-end">
          <button
            type="submit"
            className="btn f-btn info-text mx10"
            disabled={status === "loading"}
          >
            {status === "loading" ? "सेव्ह करा..." : "सेव्ह करा"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollSettings;
