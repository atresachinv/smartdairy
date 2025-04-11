import { useEffect, useState } from "react";
import {
  getCenterSetting,
  updateDairySettings,
} from "../../../../App/Features/Mainapp/Settings/dairySettingSlice";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import "../../../../Styles/Mainapp/Setting/DairySetting.css";

const MachineSettings = () => {
  const dispatch = useDispatch();
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);

  const [settings, setSettings] = useState({
    id: "",
    center_id: "",
    salesms: false,
    vSalesms: false,
    pType: 0,
    millcoll: false,
    vMillcoll: false,
    cmillcoll: false,
    noRatesms: false,
  });

  // Fetch settings when component mounts
  useEffect(() => {
    dispatch(getCenterSetting());
  }, [dispatch]);

  // Bind data when `centerSetting` updates
  useEffect(() => {
    if (Array.isArray(centerSetting) && centerSetting.length > 0) {
      setSettings({
        id: centerSetting[0].id || "",
        center_id: centerSetting[0].center_id || "",
        salesms: centerSetting[0].salesms === 1,
        vSalesms: centerSetting[0].vSalesms === 1,
        pType: centerSetting[0].pType || 0,
        millcoll: centerSetting[0].millcoll === 1,
        vMillcoll: centerSetting[0].vMillcoll === 1,
        cmillcoll: centerSetting[0].cmillcoll === 1,
        noRatesms: centerSetting[0].noRatesms === 1,
      });
    }
  }, [centerSetting]);

  // Function to handle radio button changes
  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  //Handle on save
  const handleOnsave = async () => {
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
      const data = {
        center_id: centerId,
        id: settings.id,
        salesms: settings.salesms ? 1 : 0,
        vSalesms: settings.vSalesms ? 1 : 0,
        pType: settings.pType,
        millcoll: settings.millcoll ? 1 : 0,
        vMillcoll: settings.vMillcoll ? 1 : 0,
        cmillcoll: settings.cmillcoll ? 1 : 0,
        noRatesms: settings.noRatesms ? 1 : 0,
      };

      await dispatch(updateDairySettings(data));
      dispatch(getCenterSetting());
    }
  };

  return (
    <div className="dairy-settings-page w100 h1 d-flex-col">
      <span className="heading p10 w100 d-flex j-center"> Settings</span>
      <div className="h1 w100 d-flex j-center ">
        <div className="w90 d-flex-col bg center">
          <div className="w100 machineContainer">
            {/* Printer Selection */}
            <div className="w90 d-flex j-center px10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">Select Printer</div>
              <div className="w40 d-flex">
                {["A4", "58mm", "80mm"].map((label, index) => (
                  <div key={index} className="px5 settings-page-printer-item">
                    <input
                      type="radio"
                      name="pType"
                      checked={settings.pType === index}
                      onChange={() => handleChange("pType", index)}
                    />
                    <label className="info-text px10 settings-page-printer-item">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {/* Sale WhatsApp Message */}
            <div className="w90 d-flex j-center p10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">
                Sale WhatsApp Message
              </div>
              <div className="w40 d-flex">
                <div>
                  <input
                    type="radio"
                    name="salesms"
                    checked={settings.salesms}
                    onChange={() => handleChange("salesms", true)}
                  />
                  <label className="info-text px10">Yes</label>
                </div>
                <div className="px5">
                  <input
                    type="radio"
                    name="salesms"
                    checked={!settings.salesms}
                    onChange={() => handleChange("salesms", false)}
                  />
                  <label className="info-text px10">No</label>
                </div>
              </div>
            </div>
            {/* Vehicle Sale WhatsApp Message */}
            <div className="w90 d-flex j-center px10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">
                Vehicle Sale WhatsApp Message
              </div>
              <div className="w40 d-flex">
                <div>
                  <input
                    type="radio"
                    name="vSalesms"
                    checked={settings.vSalesms}
                    onChange={() => handleChange("vSalesms", true)}
                  />
                  <label className="info-text px10">Yes</label>
                </div>
                <div className="px5">
                  <input
                    type="radio"
                    name="vSalesms"
                    checked={!settings.vSalesms}
                    onChange={() => handleChange("vSalesms", false)}
                  />
                  <label className="info-text px10">No</label>
                </div>
              </div>
            </div>
            {/* Milk Collection WhatsApp Message */}
            <div className="w90 d-flex j-center p10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">
                Milk Collection WhatsApp Message
              </div>
              <div className="w40 d-flex">
                <div>
                  <input
                    type="radio"
                    name="millcoll"
                    checked={settings.millcoll}
                    onChange={() => handleChange("millcoll", true)}
                  />
                  <label className="info-text px10">Yes</label>
                </div>
                <div className="px5">
                  <input
                    type="radio"
                    name="millcoll"
                    checked={!settings.millcoll}
                    onChange={() => handleChange("millcoll", false)}
                  />
                  <label className="info-text px10">No</label>
                </div>
              </div>
            </div>
            {/* Vehicle Milk Collection WhatsApp Message */}
            <div className="w90 d-flex j-center px10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">
                Vehicle Milk Collection WhatsApp Message
              </div>
              <div className="w40 d-flex">
                <div>
                  <input
                    type="radio"
                    name="vMillcoll"
                    checked={settings.vMillcoll}
                    onChange={() => handleChange("vMillcoll", true)}
                  />
                  <label className="info-text px10">Yes</label>
                </div>
                <div className="px5">
                  <input
                    type="radio"
                    name="vMillcoll"
                    checked={!settings.vMillcoll}
                    onChange={() => handleChange("vMillcoll", false)}
                  />
                  <label className="info-text px10">No</label>
                </div>
              </div>
            </div>
            {/* Complete Milk Collection WhatsApp Message */}
            <div className="w90 d-flex j-center p10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">
                Complete Milk Collection WhatsApp Message
              </div>
              <div className="w40 d-flex">
                <div>
                  <input
                    type="radio"
                    name="cmillcoll"
                    checked={settings.cmillcoll}
                    onChange={() => handleChange("cmillcoll", true)}
                  />
                  <label className="info-text px10">Yes</label>
                </div>
                <div className="px5">
                  <input
                    type="radio"
                    name="cmillcoll"
                    checked={!settings.cmillcoll}
                    onChange={() => handleChange("cmillcoll", false)}
                  />
                  <label className="info-text px10">No</label>
                </div>
              </div>
            </div>
            <div className="w90 d-flex j-center p10 settings-page-main-item">
              <div className="w60 d-flex px10 info-text">
                Milk Collection WhatsApp Message Without Rate
              </div>
              <div className="w40 d-flex">
                <div>
                  <input
                    type="radio"
                    name="noRatesms"
                    checked={settings.noRatesms}
                    onChange={() => handleChange("noRatesms", true)}
                  />
                  <label className="info-text px10">Yes</label>
                </div>
                <div className="px5">
                  <input
                    type="radio"
                    name="noRatesms"
                    checked={!settings.noRatesms}
                    onChange={() => handleChange("noRatesms", false)}
                  />
                  <label className="info-text px10">No</label>
                </div>
              </div>
            </div>
            <div className="w90 d-flex j-end p25">
              <button className="w-btn" onClick={() => handleOnsave()}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MachineSettings;
