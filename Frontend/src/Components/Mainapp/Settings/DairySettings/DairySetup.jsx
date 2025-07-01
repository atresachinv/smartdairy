import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import "../../../../Styles/Mainapp/Setting/DairySetup.css";
import {
  getCenterSetting,
  getDairySettings,
  updateDairySetup,
} from "../../../../App/Features/Mainapp/Settings/dairySettingSlice";

const DairySetup = () => {
  const dispatch = useDispatch();
  const centerSetting = useSelector(
    (state) => state.dairySetting.dairySettings
  );
  const status = useSelector((state) => state.dairySetting.cupdateStatus);

  const centerList = useSelector((state) => state.center.centersList || []);

  const center_id = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );

  const [centerid, setCenterid] = useState("0");
  const [cSettings, setCSettings] = useState({});

  // Printer type list ------------------------------------------------------------>
  const printerTypes = {
    LA4: "Laser Printer A4",
    LA5: "Laser Printer A5",
    DA4: "Dot Matrix Printer A4",
    T58: "Thurmal Printer 58mm",
    T80: "Thurmal Printer 80mm",
  };

  const initialFormState = {
    id: "",
    billDays: 0,
    minPayment: 0,
    milkRate: 0,
    pType: "",
    salesms: 0,
    vSalesms: 0,
    millcoll: 0,
    vMillcoll: 0,
    cmillcoll: 0,
    noRatesms: 0,
    printmilKcoll: 0,
    printSales: 0,
    KgLitres: 0,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    dispatch(getDairySettings());
  }, []);

  // filter center settings ------------------------------------------------------->

  useEffect(() => {
    if (centerSetting) {
      const settings = centerSetting.filter(
        (setting) => setting.center_id.toString() === centerid
      );
      if (settings.length !== 0) {
        setCSettings(settings[0]);
      } else {
        setCSettings({});
      }
    }
  }, [centerSetting, centerid]);

  // set form data ---------------------------------------------------------------->
  useEffect(() => {
    if (cSettings) {
      setFormData({
        id: cSettings.id,
        billDays: cSettings.billDays,
        minPayment: parseFloat(cSettings.minPayment) || 0,
        milkRate: parseFloat(cSettings.milkRate) || 0,
        pType: cSettings.pType,
        salesms: cSettings.salesms,
        vSalesms: cSettings.vSalesms,
        millcoll: cSettings.millcoll,
        vMillcoll: cSettings.vMillcoll,
        cmillcoll: cSettings.cmillcoll,
        noRatesms: cSettings.noRatesms,
        printmilKcoll: cSettings.printmilKcoll,
        printSales: cSettings.printSales,
        KgLitres: cSettings.KgLitres,
      });
    }
  }, [cSettings]);

  // handle form input change ---------------------------------------------------->
  const handleInputChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // Handle Enter key press to move to the next field ---------------------------->
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  // handlinng form data submition ---------------------------------------------->
  const handleSubmit = async (e) => {
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
      await dispatch(updateDairySetup({ formData, centerid }));
      dispatch(getCenterSetting());
    }
  };

  return (
    <div className="sanstha-setup-container w100 h1 d-flex-col sb p10">
      <div className="page-title-container w100 h10 d-flex j-start a-center">
        <label className="heading mx10">डेअरी सेटिंग :</label>
        {center_id === 0 ? (
          <select
            className="data w40"
            name="center_id"
            id=""
            value={formData.center_id}
            onChange={(e) => setCenterid(e.target.value)}
            onKeyDown={(e) =>
              handleKeyPress(e, document.getElementById("billDays"))
            }
          >
            {centerList.map((center, index) => (
              <option key={index} value={center.center_id}>
                {center.center_name}
              </option>
            ))}
          </select>
        ) : (
          ""
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="dairy-setup-inner-container w100 h95 d-flex-col bg5 p10"
      >
        <div className="dairy-setup-inner-container w100 h20 d-flex se bg-light-skyblue br9">
          <div className="dairy-setup-form w20 h1 d-flex-col se">
            <label htmlFor="billDays" className="label-text">
              दुधबिल निर्माणाचे दिवस :
            </label>
            <input
              id="billDays"
              type="tel"
              name="billDays"
              inputMode="numeric"
              maxLength={2}
              className="data"
              placeholder="10"
              value={formData.billDays || ""}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("minPayment"))
              }
            />
          </div>
          <div className="dairy-setup-form w30 h1 d-flex-col se">
            <label htmlFor="minPayment" className="label-text">
              कमीत-कमी दुधबील पेमेंट रक्कम :
            </label>
            <input
              id="minPayment"
              type="text"
              name="minPayment"
              className="data"
              placeholder="0.0"
              value={formData.minPayment || ""}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("milkRate"))
              }
            />
          </div>
          <div className="dairy-setup-form w20 h1 d-flex-col a-center se">
            <label htmlFor="milkRate" className="label-text w100">
              किरकोळ दुधविक्री दर :
            </label>
            <input
              id="milkRate"
              type="text"
              name="milkRate"
              className="data w100"
              placeholder="0.0"
              value={formData.milkRate || ""}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("printer"))
              }
            />
          </div>
          <div className="dairy-setup-form w25 h1 d-flex-col se">
            <label htmlFor="printer" className="printer-txt label-text">
              प्रिंटर प्रकार निवडा :
            </label>
            <select
              id="printer"
              name="pType"
              className="data"
              value={formData.pType}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("uset-btn"))
              }
            >
              <option value="">-- select Printer --</option>
              {Object.entries(printerTypes).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sms-setting-container w100 h30 d-flex-col sb bg-light-green br9 my10">
          <label htmlFor="" className="label-text p10">
            व्हाट्सअँप मेसेज सेटिंग :
          </label>
          <div className="option-setting-container w100 h90 d-flex f-wrap px10">
            <div className="dairy-setup-form w25 h20 d-flex a-center se">
              <label htmlFor="milkCollection" className="label-text w100">
                दुध संकलन :
              </label>
              <input
                id="milkCollection"
                type="checkbox"
                name="millcoll"
                className=" w100 h70"
                placeholder="0.0"
                checked={formData.millcoll}
                onChange={handleInputChange}
              />
            </div>
            <div className="dairy-setup-form w25 h20 d-flex a-center se">
              <label htmlFor="withoutRate" className="label-text w100">
                रेट शिवाय :
              </label>
              <input
                id="withoutRate"
                type="checkbox"
                name="noRatesms"
                className=" w100 h70"
                placeholder="0.0"
                checked={formData.noRatesms}
                onChange={handleInputChange}
              />
            </div>
            <div className="dairy-setup-form w25 h20 d-flex a-center se">
              <label htmlFor="vehicleCollection" className="label-text w100">
                गाडी संकलन :
              </label>
              <input
                id="vehicleCollection"
                type="checkbox"
                name="vMillcoll"
                className=" w100 h70"
                placeholder="0.0"
                checked={formData.vMillcoll}
                onChange={handleInputChange}
              />
            </div>
            <div className="dairy-setup-form w25 h20 d-flex a-center se">
              <label htmlFor="fullCollection" className="label-text w100">
                पुर्ण संकलन :
              </label>
              <input
                id="fullCollection"
                type="checkbox"
                name="cmillcoll"
                className=" w100 h70"
                placeholder="0.0"
                checked={formData.cmillcoll}
                onChange={handleInputChange}
              />
            </div>
            <div className="dairy-setup-form w25 h20 d-flex a-center se">
              <label htmlFor="cattleFeedSale" className="label-text w100">
                पशु खाद्यविक्री :
              </label>
              <input
                id="cattleFeedSale"
                type="checkbox"
                name="salesms"
                className=" w100 h70"
                placeholder="0.0"
                checked={formData.salesms}
                onChange={handleInputChange}
              />
            </div>
            <div className="dairy-setup-form w25 h20 d-flex a-center se">
              <label htmlFor="vehicleFeedSale" className="label-text w100">
                गाडी खाद्यविक्री :
              </label>
              <input
                id="vehicleFeedSale"
                type="checkbox"
                name="vSalesms"
                className=" w100 h70"
                placeholder="0.0"
                checked={formData.vSalesms}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="sms-setting-outer-container w100 h25 d-flex se bg-light-skyblue br9">
          <div className="sms-setting-container w50 h1 d-flex-col sb">
            <label htmlFor="" className="label-text p10">
              प्रिंट सेटिंग :
            </label>
            <div className="option-setting-container w100 h90 d-flex f-wrap px10">
              <div className="dairy-setup-form w50 h50 d-flex a-center se">
                <label htmlFor="printmilKcoll" className="label-text w100">
                  दुध संकलन :
                </label>
                <input
                  id="printmilKcoll"
                  type="checkbox"
                  name="printmilKcoll"
                  className=" w100"
                  placeholder="0.0"
                  checked={formData.printmilKcoll}
                  onChange={handleInputChange}
                />
              </div>
              <div className="dairy-setup-form w50 h50 d-flex a-center se">
                <label htmlFor="printSales" className="label-text w100">
                  पशु खाद्यविक्री :
                </label>
                <input
                  id="printSales"
                  type="checkbox"
                  name="printSales"
                  className=" w100"
                  placeholder="0.0"
                  checked={formData.printSales}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="kg-liters-setting-container w50 h1 d-flex-col se">
            <label htmlFor="KgLitres" className="label-text py10">
              किलो-लिटर / लिटर-किलो :
            </label>
            <input
              id="KgLitres"
              type="number"
              name="KgLitres"
              inputMode="numeric"
              maxLength={8}
              className="data w30"
              placeholder="00.0000"
              value={formData.KgLitres || ""}
              onChange={handleInputChange}
              onKeyDown={(e) =>
                handleKeyPress(e, document.getElementById("uset-btn"))
              }
            />
          </div>
        </div>
        <div className="btn-container w100 h10 d-flex j-end a-center">
          <button
            id="uset-btn"
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}
          >
            {status === "loading" ? " Updating..." : " Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DairySetup;
