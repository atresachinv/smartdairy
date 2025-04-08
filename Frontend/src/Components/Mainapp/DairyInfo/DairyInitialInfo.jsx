import { useEffect, useState } from "react";
import "../../../Styles/DairyInitialInfo/DairyInitialInfo.css";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  listMainLedger,
  listSubLedger,
} from "../../../App/Features/Mainapp/Masters/ledgerSlice";
import { toast } from "react-toastify";
import {
  createInitInfo,
  updateInitInfo,
  fetchInitInfo,
} from "../../../App/Features/Mainapp/Dairyinfo/dairyDetailsSlice";

const DairyInitialInfo = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  const dinitInfo = useSelector((state) => state.dairyInfo.initialInfo || {});
  const status = useSelector((state) => state.dairyInfo.updateStatus);
  const SubLedgers = useSelector((state) => state.ledger.sledgerlist);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    id: "",
    ShareCapitalAmt: "",
    ClosingDate: "",
    CashOnHandAmt: "",
    CashOnHandAmt_3: "",
    CashOnHandGlcode: "",
    PLGLCode: "",
    PreviousPLGLCode: "",
    TreadingPLGlCode: "",
    MilkPurchaseGL: "",
    MilkSaleGL: "",
    MilkPurchasePaybleGL: "",
    MilkSaleRecivableGl: "",
    saleincomeGL: "",
    RoundAmtGL: "",
    anamatGlcode: "",
    advGL: "",
    kirkolmilksale_yene: "",
    ghutnashgl: "",
    ArambhiShillakMalGL: "",
    AkherShillakMal: "",
    MilkCommisionAndAnudan: "",
    ribetIncome: "",
    ribetExpense: "",
    milkRateDiff: "",
    chillinggl: "",
    transportgl: "",
  });

  useEffect(() => {
    dispatch(listMainLedger());
    dispatch(listSubLedger());
    dispatch(fetchInitInfo());
  }, [dispatch]);

  useEffect(() => {
    if (dinitInfo && Object.keys(dinitInfo).length > 0) {
      setFormData({
        id: dinitInfo.id || "",
        ShareCapitalAmt: dinitInfo.ShareCapitalAmt || "",
        ClosingDate: dinitInfo.ClosingDate.split("T")[0] || "",
        CashOnHandAmt: dinitInfo.CashOnHandAmt || "",
        CashOnHandAmt_3: dinitInfo.CashOnHandAmt_3 || "",
        CashOnHandGlcode: dinitInfo.CashOnHandGlcode || "",
        PLGLCode: dinitInfo.PLGLCode || "",
        PreviousPLGLCode: dinitInfo.PreviousPLGLCode || "",
        TreadingPLGlCode: dinitInfo.TreadingPLGlCode || "",
        MilkPurchaseGL: dinitInfo.MilkPurchaseGL || "",
        MilkSaleGL: dinitInfo.MilkSaleGL || "",
        MilkPurchasePaybleGL: dinitInfo.MilkPurchasePaybleGL || "",
        MilkSaleRecivableGl: dinitInfo.MilkSaleRecivableGl || "",
        saleincomeGL: dinitInfo.saleincomeGL || "",
        RoundAmtGL: dinitInfo.RoundAmtGL || "",
        anamatGlcode: dinitInfo.anamatGlcode || "",
        advGL: dinitInfo.advGL || "",
        kirkolmilksale_yene: dinitInfo.kirkolmilksale_yene || "",
        ghutnashgl: dinitInfo.ghutnashgl || "",
        ArambhiShillakMalGL: dinitInfo.ArambhiShillakMalGL || "",
        AkherShillakMal: dinitInfo.AkherShillakMal || "",
        MilkCommisionAndAnudan: dinitInfo.MilkCommisionAndAnudan || "",
        ribetIncome: dinitInfo.ribetIncome || "",
        ribetExpense: dinitInfo.ribetExpense || "",
        milkRateDiff: dinitInfo.milkRateDiff || "",
        chillinggl: dinitInfo.chillinggl || "",
        transportgl: dinitInfo.transportgl || "",
      });
    }
  }, [dinitInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name]; // Clear error if field is empty
      return updatedErrors;
    });
  };

  const sglOptions = SubLedgers.map((i) => ({
    value: i.lno,
    label: i.lno,
  }));

  const sglOptions1 = SubLedgers.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "ShareCapitalAmt":
      case "CashOnHandAmt":
      case "CashOnHandAmt_3":
        if (value && !/^-?\d+(\.\d+)?$/.test(value)) {
          error[name] = "Invalid Value.";
        }
        break;

      case "RoundAmtGL":
      case "anamatGlcode":
      case "advGL":
      case "kirkolmilksale_yene":
      case "ghutnashgl":
      case "ArambhiShillakMalGL":
      case "AkherShillakMal":
      case "MilkCommisionAndAnudan":
      case "ribetIncome":
      case "ribetExpense":
      case "milkRateDiff":
      case "chillinggl":
      case "transportgl":
        if (value && !/^\d+$/.test(value)) {
          error[name] = "Invalid Value.";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "ShareCapitalAmt",
      "ClosingDate",
      "CashOnHandAmt",
      "CashOnHandAmt_3",
      "CashOnHandGlcode",
      "PLGLCode",
      "PreviousPLGLCode",
      "TreadingPLGlCode",
      "MilkPurchaseGL",
      "MilkSaleGL",
      "MilkPurchasePaybleGL",
      "MilkSaleRecivableGl",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      if (formData.id) {
        const result = await dispatch(updateInitInfo({ formData })).unwrap();
        if (result.status === 200) {
          toast.success("Dairy initial information updated successfully!");
        } else {
          toast.error("Failed to update dairy initial information!");
        }
      } else {
        const result = await dispatch(createInitInfo({ formData })).unwrap();
        if (result.status === 201) {
          toast.success("Dairy initial information created successfully!");
        } else {
          toast.error("Failed to create dairy initial information!");
        }
      }
    } catch (error) {
      toast.error("An error occurred while updating information");
      console.error("Update error:", error);
    }
  };

  return (
    <>
      <div className="society-initial-info-contianer w100 h1 d-flex-col sb">
        <span className="heading px10">संस्था आरंभीची माहिती :</span>
        <form
          onSubmit={handleSubmit}
          className="dairy-ladger-info-outer-container w100 h95 d-flex sa"
        >
          <div className="dairy-main-ladger-info-container w65 h1 d-flex-col sb p10 bg">
            <div className="dairy-initial-cash-info-div w100 h10 d-flex a-center sb">
              <div className="starting-info-div w50 d-flex a-center sb">
                <label htmlFor="iamt" className="label-text w60 px10">
                  अधिकृत भागभांडवल :
                </label>
                <input
                  id="iamt"
                  className={`data w35 ${
                    errors.ShareCapitalAmt ? "input-error" : ""
                  }`}
                  type="text"
                  name="ShareCapitalAmt"
                  required
                  value={formData.ShareCapitalAmt}
                  step={"any"}
                  placeholder="0.000"
                  onChange={(e) => handleChange(e)}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("cdate"))
                  }
                />
              </div>
              <div className="starting-info-div w50 d-flex a-center sb">
                <label htmlFor="cdate" className="label-text w55 px10">
                  क्लोजिंग कॅश दिनांक :
                </label>
                <input
                  id="cdate"
                  className="data w45"
                  name="ClosingDate"
                  required
                  value={formData.ClosingDate}
                  type="date"
                  onChange={(e) => handleChange(e)}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("rsamt"))
                  }
                />
              </div>
            </div>
            <div className="dairy-initial-cash-gl-info-div w100 h10 d-flex a-center sb">
              <div className="cashgl-info-div w50 h10 d-flex a-center sa">
                <label htmlFor="rsamt" className="label-text w65 px10">
                  रोख शिल्लख रक्कम :
                </label>
                <input
                  id="rsamt"
                  className="data w35"
                  placeholder="0.000"
                  required
                  type="text"
                  name="CashOnHandAmt"
                  value={formData.CashOnHandAmt}
                  onChange={(e) => handleChange(e)}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("cashRemgoods"))
                  }
                />
              </div>
              <div className="cashgl-info-div w50 d-flex a-center sb">
                <label htmlFor="cashRemgoods" className="label-text w55 px10">
                  रोख शिल्लख किराणा :
                </label>
                <input
                  id="cashRemgoods"
                  className="data w45"
                  placeholder="0.000"
                  type="text"
                  required
                  name="CashOnHandAmt_3"
                  value={formData.CashOnHandAmt_3}
                  onChange={(e) => handleChange(e)}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("cashgl"))
                  }
                />
              </div>
            </div>
            <div className="select-dairy-gl-div w100 h10 d-flex a-center sb">
              <label htmlFor="cashgl" className="label-text w30 px10">
                कॅश खतवानी क्र.
              </label>
              <Select
                id="cashgl"
                options={sglOptions}
                className="s1 w15"
                name="CashOnHandGlcode"
                isSearchable
                styles={{ menu: (provided) => ({ ...provided, zIndex: 200 }) }}
                value={
                  formData.CashOnHandGlcode
                    ? sglOptions.find(
                        (option) =>
                          Number(option.value) ===
                          Number(formData.CashOnHandGlcode)
                      )
                    : null
                }
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    CashOnHandGlcode: selectedOption.value,
                  })
                }
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("plgl"))
                }
              />

              <Select
                options={sglOptions1}
                className="s2 w50"
                isSearchable
                name="cashinhandgl_txt"
                styles={{ menu: (provided) => ({ ...provided, zIndex: 200 }) }}
                value={
                  formData.CashOnHandGlcode
                    ? sglOptions1.find(
                        (option) =>
                          Number(option.value) ===
                          Number(formData.CashOnHandGlcode)
                      )
                    : null
                }
                onChange={(selectedOption) =>
                  setFormData({
                    ...formData,
                    CashOnHandGlcode: selectedOption.value,
                  })
                }
              />
            </div>
            <div className="select-dairy-gl-outer-div w100 h30 d-flex-col sa">
              <span className="label-text px10">नफा तोटा खतावणी संबंधित :</span>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="plgl" className="label-text w30 px10 ">
                  चालू नफा तोटा ख. क्र.
                </label>
                <Select
                  id="plgl"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.PLGLCode
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) === Number(formData.PLGLCode)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      PLGLCode: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("prevplgl"))
                  }
                />

                <Select
                  id="plgl_txt"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.PLGLCode
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) === Number(formData.PLGLCode)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      PLGLCode: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="prevplgl" className="label-text w30 px10 ">
                  मागील नफा तोटा ख. क्र.
                </label>
                <Select
                  id="prevplgl"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.PreviousPLGLCode
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.PreviousPLGLCode)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      PreviousPLGLCode: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("traderlggl"))
                  }
                />

                <Select
                  id="prevplgl"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.PreviousPLGLCode
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.PreviousPLGLCode)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      PreviousPLGLCode: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="select-dairy-gl-div w100 d-flex  sb a-center">
                <label htmlFor="traderlggl" className="label-text w30 px10 ">
                  व्यापारी नफा तोटा ख. क्र.
                </label>
                <Select
                  id="traderlggl"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.TreadingPLGlCode
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.TreadingPLGlCode)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      TreadingPLGlCode: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("purch_expe"))
                  }
                />

                <Select
                  id="tradergl_txt"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.TreadingPLGlCode
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.TreadingPLGlCode)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      TreadingPLGlCode: selectedOption.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="select-dairy-gl-outer-div w100 h40 d-flex-col sb">
              <label htmlFor="spglr" className="label-text px10">
                खरेदी विक्री खतावणी संबंधित :
              </label>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="purch_expe" className="label-text w30 px10 ">
                  खरेदी खर्च ख. क्र.
                </label>
                <Select
                  id="purch_expe"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkPurchaseGL
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.MilkPurchaseGL)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkPurchaseGL: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("saleincgl"))
                  }
                />

                <Select
                  id="purch_expetxt"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkPurchaseGL
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.MilkPurchaseGL)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkPurchaseGL: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="saleincgl" className="label-text w30 px10 ">
                  विक्री उत्पन्न ख. क्र.
                </label>
                <Select
                  id="saleincgl"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkSaleGL
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) === Number(formData.MilkSaleGL)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkSaleGL: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("purch_inc"))
                  }
                />

                <Select
                  id="saleincgl"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkSaleGL
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) === Number(formData.MilkSaleGL)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkSaleGL: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="purch_inc" className="label-text w30 px10 ">
                  खरेदी देणे ख. क्र.
                </label>
                <Select
                  id="purch_inc"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkPurchasePaybleGL
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.MilkPurchasePaybleGL)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkPurchasePaybleGL: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("saleincome"))
                  }
                />

                <Select
                  id="purch_inc"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkPurchasePaybleGL
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.MilkPurchasePaybleGL)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkPurchasePaybleGL: selectedOption.value,
                    })
                  }
                />
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="saleincome" className="label-text w30 px10 ">
                  विक्री येणे ख. क्र.
                </label>
                <Select
                  id="saleincome"
                  options={sglOptions}
                  className="s1 w15"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkSaleRecivableGl
                      ? sglOptions.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.MilkSaleRecivableGl)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkSaleRecivableGl: selectedOption.value,
                    })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("roundoff"))
                  }
                />

                <Select
                  id="saleincome"
                  options={sglOptions1}
                  className="s2 w50"
                  isSearchable
                  styles={{
                    menu: (provided) => ({ ...provided, zIndex: 200 }),
                  }}
                  value={
                    formData.MilkSaleRecivableGl
                      ? sglOptions1.find(
                          (option) =>
                            Number(option.value) ===
                            Number(formData.MilkSaleRecivableGl)
                        )
                      : null
                  }
                  onChange={(selectedOption) =>
                    setFormData({
                      ...formData,
                      MilkSaleRecivableGl: selectedOption.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="ladger-settings-container w30 d-flex f-wrap h1 sb p10 bg">
            <div className="round-amount-container w45 h10 d-flex-col sb">
              <label htmlFor="roundoff" className="label-text w100">
                राऊंड रक्कम :
              </label>
              <input
                id="roundoff"
                className="data w100 h60"
                type="number"
                required
                name="RoundAmtGL"
                value={formData.RoundAmtGL}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("cattlefeedgl"))
                }
              />
            </div>
            <div className="round-amount-container w45 h10 d-flex-col sb">
              <label htmlFor="cattlefeedgl" className="label-text w100">
                पशुखाद्य :
              </label>
              <input
                id="cattlefeedgl"
                className="data w100 h60"
                type="number"
                required
                name="saleincomeGL"
                value={formData.saleincomeGL}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("commissiongl"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="commissiongl" className="label-text w100">
                अनामत :
              </label>
              <input
                id="commissiongl"
                className="data w100 h60"
                type="number"
                required
                name="anamatGlcode"
                value={formData.anamatGlcode}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("advgl"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="advgl" className="label-text w100">
                ऍडव्हान्स :
              </label>
              <input
                id="advgl"
                className="data w100 h60"
                type="number"
                required
                name="advGL"
                value={formData.advGL}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("retailmsale"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sa">
              <label htmlFor="retailmsale" className="label-text w100">
                किरकोळ दूध विक्रि :
              </label>
              <input
                id="retailmsale"
                className="data w100 h60"
                type="number"
                required
                name="kirkolmilksale_yene"
                value={formData.kirkolmilksale_yene}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("ghatnash"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="ghatnash" className="label-text w100">
                घट नाश खतावणी :
              </label>
              <input
                id="ghatnash"
                className="data w100 h60"
                type="number"
                required
                name="ghutnashgl"
                value={formData.ghutnashgl}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("sremaingl"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="sremaingl" className="label-text w100">
                आरंभी शिल्लख माल :
              </label>
              <input
                id="sremaingl"
                className="data w100 h60"
                type="number"
                required
                name="ArambhiShillakMalGL"
                value={formData.ArambhiShillakMalGL}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("lasteremgl"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="lasteremgl" className="label-text w100">
                अखेर शिल्लख माल :
              </label>
              <input
                id="lasteremgl"
                className="data w100 h60"
                type="number"
                required
                name="AkherShillakMal"
                value={formData.AkherShillakMal}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("comanuexpe"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="comanuexpe" className="label-text w100">
                कमि./अनुदान व खर्च :
              </label>
              <input
                id="comanuexpe"
                className="data w100 h60"
                type="number"
                required
                name="MilkCommisionAndAnudan"
                value={formData.MilkCommisionAndAnudan}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("ribetIncome"))
                }
              />
            </div>

            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="ribetIncome" className="label-text w100">
                रिबेट उत्त्पन्न
              </label>
              <input
                id="ribetIncome"
                className="data w100 h60"
                type="number"
                required
                name="ribetIncome"
                value={formData.ribetIncome}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("rebbetExpe"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="rebbetExpe" className="label-text w100">
                रिबेट खर्च :
              </label>
              <input
                id="rebbetExpe"
                className="data w100 h60"
                type="number"
                required
                name="ribetExpense"
                value={formData.ribetExpense}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("rdiffgl"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="rdiffgl" className="label-text w100">
                दूध दर फरक:
              </label>
              <input
                id="rdiffgl"
                className="data w100 h60"
                type="number"
                required
                name="milkRateDiff"
                value={formData.milkRateDiff}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("coolgl"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="coolgl" className="label-text w100">
                शितकार :
              </label>
              <input
                id="coolgl"
                className="data w100 h60"
                type="number"
                required
                name="chillinggl"
                value={formData.chillinggl}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("vexpe"))
                }
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="vexpe" className="label-text w100">
                वाहतूक खर्च :
              </label>
              <input
                id="vexpe"
                className="data w100 h60"
                type="number"
                required
                name="transportgl"
                value={formData.transportgl}
                onChange={(e) => handleChange(e)}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("submitbtn"))
                }
              />
            </div>
            <div className="buttons-amount-container w100 d-flex j-end">
              <button id="submitbtn" type="submit" className="w-btn">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DairyInitialInfo;
