/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";
import { IoSettingsOutline } from "react-icons/io5";
import "../../../../Styles/Mainapp/Setting/DairySetting.css";
import Swal from "sweetalert2";
import {
  getCenterSetting,
  getDairySettings,
  updateDairySettings,
} from "../../../../App/Features/Mainapp/Settings/dairySettingSlice";

const DairySettings = () => {
  const dispatch = useDispatch();
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );
  const DairySetting = useSelector((state) => state.dairySetting.dairySettings);
  const [model, setModel] = useState(false);
  const [center, setCenter] = useState({});
  const [id, setId] = useState();
  const [settings, setSettings] = useState({
    auto: false,
    whatsapp: false,
    duplicateEntry: false,
    printer: false,
  });

  useEffect(() => {
    dispatch(getDairySettings());
    dispatch(centersLists());
  }, [dispatch]);

  //handle onchange
  const handleChange = (name, value) => {
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  //handle model
  const handleOnsetting = (id) => {
    setModel(true);

    const center = centerList.find((item) => item.center_id === id);
    setCenter(center);

    if (DairySetting && center) {
      const centerSetting = DairySetting.find(
        (setting) => setting.center_id === id
      );

      if (centerSetting) {
        setId(centerSetting.id);
        setSettings({
          auto: centerSetting.autoCenter == 1,
          whatsapp: centerSetting.whsms == 1,
          duplicateEntry: centerSetting.duplicateEntry == 1,
          printer: centerSetting.printer == 1,
        });
      }
    }
  };

  //handle model close
  const handleModelColse = () => {
    setModel(false);
    setCenter({});
    setId("");
    setSettings({
      auto: false,
      whatsapp: false,
      duplicateEntry: false,
      printer: false,
    });
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
        id: id,
        printer: settings.printer ? 1 : 0,
        whsms: settings.whatsapp ? 1 : 0,
        autoCenter: settings.auto ? 1 : 0,
        duplicateEntry: settings.duplicateEntry ? 1 : 0,
        center_id: center.center_id,
      };
      await dispatch(updateDairySettings(data));
      dispatch(getCenterSetting());
      handleModelColse();
    }
  };
  // console.log(DairySetting);

  return (
    <div className="dairy-settings-page w100 h1 d-flex-col">
      <span className="heading p10 w100 d-flex j-center">Dairy Settings</span>

      <div className="h1 w100 d-flex j-center ">
        <div className="mx5 my5 w90 d-flex-col bg center">
          {[...centerList]
            .sort((a, b) => a.center_id - b.center_id)
            .map((center) => (
              <>
                <div
                  key={center.center_id}
                  className="w50 h10  d-flex px10 sa dairy-settings-page-main-item"
                >
                  <div className="px10w10 info-text">{center.center_id}</div>
                  <div className="w80">
                    <div className="info-text">
                      {center.marathi_name || center.center_name}
                    </div>
                    {/* <div className="info-text">{center.city}</div> */}
                  </div>
                  <div className="w10">
                    <IoSettingsOutline
                      style={{ cursor: "pointer" }}
                      className="icon"
                      onClick={() => handleOnsetting(center.center_id)}
                    />
                  </div>
                </div>
              </>
            ))}
        </div>
        {model && (
          <>
            <div className="dairyModelOverlay"></div>

            <div className="dairyModel">
              <div className="header">
                <div>Dairy Setting</div>
                <div
                  style={{ color: "red", cursor: "pointer" }}
                  onClick={() => handleModelColse()}
                >
                  Close
                </div>
              </div>

              {/* Autonomous Centre Radio Buttons */}
              <div className="dairyModelContent my10 w100">
                <label>Autonomous Centre</label>
                <div className="d-flex j-center a-center  ">
                  <div className="px10">
                    <input
                      type="radio"
                      name="auto"
                      checked={!settings.auto}
                      onChange={() => handleChange("auto", false)}
                    />
                    <label className="info-text px10">No</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="auto"
                      checked={settings.auto}
                      onChange={() => handleChange("auto", true)}
                    />
                    <label className="info-text px10">Yes</label>
                  </div>
                </div>
              </div>

              {/* WhatsApp Message Radio Buttons */}
              <div className="dairyModelContent my10 w100">
                <label>WhatsApp Message</label>
                <div className="d-flex j-center a-center  ">
                  <div className="px10">
                    <input
                      type="radio"
                      name="whatsapp"
                      checked={!settings.whatsapp}
                      onChange={() => handleChange("whatsapp", false)}
                    />
                    <label className="info-text px10">No</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="whatsapp"
                      checked={settings.whatsapp}
                      onChange={() => handleChange("whatsapp", true)}
                    />
                    <label className="info-text px10">Yes</label>
                  </div>
                </div>
              </div>

              {/* Allow Duplicate Milk Entry Radio Buttons */}
              <div className="dairyModelContent my10 w100">
                <label>Allow Duplicate Milk Entry</label>
                <div className="d-flex j-center a-center  ">
                  <div className="px10">
                    <input
                      type="radio"
                      name="duplicateEntry"
                      checked={!settings.duplicateEntry}
                      onChange={() => handleChange("duplicateEntry", false)}
                    />
                    <label className="info-text px10">No</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="duplicateEntry"
                      checked={settings.duplicateEntry}
                      onChange={() => handleChange("duplicateEntry", true)}
                    />
                    <label className="info-text px10">Yes</label>
                  </div>
                </div>
              </div>
              <div className="dairyModelContent my10 w100">
                <label>Allow Print</label>
                <div className="d-flex j-center a-center  ">
                  <div className="px10">
                    <input
                      type="radio"
                      name="printer"
                      checked={!settings.printer}
                      onChange={() => handleChange("printer", false)}
                    />
                    <label className="info-text px10">No</label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      name="printer"
                      checked={settings.printer}
                      onChange={() => handleChange("printer", true)}
                    />
                    <label className="info-text px10">Yes</label>
                  </div>
                </div>
              </div>

              <div
                className="w100 d-flex j-end px5  "
                style={{ marginTop: "20px" }}
              >
                <button className="w-btn" onClick={() => handleOnsave()}>
                  Save
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DairySettings;
