import React, { useEffect, useState } from "react";
import "../../../Styles/DairyInitialInfo/DairyInitialInfo.css";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  listMainLedger,
  listSubLedger,
} from "../../../App/Features/Mainapp/Masters/ledgerSlice";

const DairyInitialInfo = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["milkcollection", "common"]);
  // const MainLedgers = useSelector((state) => state.ledger.mledgerlist);
  const SubLedgers = useSelector((state) => state.ledger.sledgerlist);
  const [formData, setFormData] = useState({
    id: "",
    date: "",
    ShareCapitalAmt: "",
    ClosingDate: "",
    CashOnHandAmt: "",
    CashOnHandAmt_3: "",
    CashOnHandGlcode: "",
    cashinhandgl_txt: "",
    PLGLCode: "",
    plgl_txt: "",
    PreviousPLGLCode: "",
    prevplgl_txt: "",
    TreadingPLGlCode: "",
    tradergl_txt: "",
    MilkPurchaseGL: "",
    milkpgl_txt: "",
    MilkSaleGL: "",
    msaleegl_txt: "",
    MilkPurchasePaybleGL: "",
    purch_inc_txt: "",
    MilkSaleRecivableGl: "",
    saleincome_txt: "",
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
  console.log( SubLedgers);
  useEffect(() => {
    dispatch(listMainLedger());
    dispatch(listSubLedger());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

  const handleform = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="society-initial-info-contianer w100 h1 d-flex-col">
        <span className="heading px10">संस्था आरंभीची माहिती :</span>
        <form
          onSubmit={handleform}
          className="dairy-ladger-info-outer-container w100 h1 d-flex sa"
        >
          <div className="dairy-main-ladger-info-container w65 h1 d-flex-col sb p10 bg">
            <div className="dairy-initial-cash-info-div w100 h10 d-flex a-center sb">
              <div className="starting-info-div w50 d-flex a-center sb">
                <label htmlFor="iamt" className="label-text w60 px10">
                  अधिकृत भागभांडवल :
                </label>
                <input
                  id="iamt"
                  className="data w35"
                  type="text"
                  name="ShareCapitalAmt"
                  required
                  value={formData.ShareCapitalAmt}
                  step={"any"}
                  placeholder="0.000"
                  onChange={handleChange}
                />
              </div>
              <div className="starting-info-div w50 d-flex a-center sb">
                <label htmlFor="cdate" className="label-text w50 px10">
                  क्लोजिंग कॅश दिनांक :
                </label>
                <input
                  id="cdate"
                  className="data w45"
                  name="ClosingDate"
                  required
                  value={formData.ClosingDate}
                  type="date"
                  onChange={handleChange}
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
                  onChange={handleChange}
                />
              </div>
              <div className="cashgl-info-div w50 d-flex a-center sb">
                <label htmlFor="cashRemgoods" className="label-text w65 px10">
                  रोख शिल्लख किराणा :
                </label>
                <input
                  id="cashRemgoods"
                  className="data w30"
                  placeholder="0.000"
                  type="text"
                  required
                  name="CashOnHandAmt_3"
                  value={formData.CashOnHandAmt_3}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="select-dairy-gl-div w100 h10 d-flex a-center sb">
              <label htmlFor="cashgl" className="label-text w30 px10">
                कॅश खतवानी क्र.
              </label>
              <select
                id="cashgl"
                className="s1 data w15"
                required
                name="CashOnHandGlcode"
                onChange={handleChange}
              >
                <option value="">-- Code --</option>
              </select>
              <select
                id="cashgl"
                className="s2 data w50"
                name="cashinhandgl_txt"
                value={formData.cashinhandgl_txt}
                onChange={handleChange}
              >
                <option value=""></option>
              </select>
            </div>
            <div className="select-dairy-gl-outer-div w100 h30 d-flex-col sa">
              <span className="label-text px10">नफा तोटा खतावणी संबंधित :</span>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="plgl" className="label-text w30 px10 ">
                  चालू नफा तोटा ख. क्र.
                </label>
                <select
                  id="plgl"
                  className="s1 data w15"
                  name="PLGLCode"
                  required
                  value={formData.PLGLCode}
                  onChange={handleChange}
                ></select>
                <select
                  id="plgl"
                  className="s2 data w50"
                  name="plgl_txt"
                  value={formData.plgl_txt}
                  onChange={handleChange}
                ></select>
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="prevplgl" className="label-text w30 px10 ">
                  मागील नफा तोटा ख. क्र.
                </label>
                <select
                  id="prevplgl"
                  className="s1 data w15"
                  required
                  name="PreviousPLGLCode"
                  value={formData.PreviousPLGLCode}
                  onChange={handleChange}
                ></select>
                <select
                  id="prevplgl"
                  className="s2 data w50"
                  name="prevplgl_txt"
                  value={formData.prevplgl_txt}
                  onChange={handleChange}
                ></select>
              </div>
              <div className="select-dairy-gl-div w100 d-flex  sb a-center">
                <label htmlFor="traderlggl" className="label-text w30 px10 ">
                  व्यापारी नफा तोटा ख. क्र.
                </label>
                <select
                  id="traderlggl"
                  className="s1 data w15"
                  required
                  name="TreadingPLGlCode"
                  value={formData.TreadingPLGlCode}
                  onChange={handleChange}
                ></select>
                <select
                  id="traderlggl"
                  className="s2 data w50"
                  name="tradergl_txt"
                  value={formData.tradergl_txt}
                  onChange={handleChange}
                ></select>
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
                <select
                  id="purch_expe"
                  className="s1 data w15"
                  required
                  name="MilkPurchaseGL"
                  value={formData.MilkPurchaseGL}
                  onChange={handleChange}
                ></select>
                <select
                  id="purch_expe"
                  className="s2 data w50"
                  name="milkpgl_txt"
                  value={formData.milkpgl_txt}
                  onChange={handleChange}
                ></select>
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="saleincgl" className="label-text w30 px10 ">
                  विक्री उत्पन्न ख. क्र.
                </label>
                <select
                  id="saleincgl"
                  className="s1 data w15"
                  required
                  name="MilkSaleGL"
                  value={formData.MilkSaleGL}
                  onChange={handleChange}
                ></select>
                <select
                  id="saleincgl"
                  className="s2 data w50"
                  name="msaleegl_txt"
                  value={formData.msaleegl_txt}
                  onChange={handleChange}
                ></select>
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label
                  htmlFor="purchase_income"
                  className="label-text w30 px10 "
                >
                  खरेदी देणे ख. क्र.
                </label>
                <select
                  id="purchase_income"
                  className="s1 data w15"
                  required
                  name="MilkPurchasePaybleGL"
                  value={formData.MilkPurchasePaybleGL}
                  onChange={handleChange}
                ></select>
                <select
                  id="purchase_income"
                  className="s2 data w50"
                  name="purch_inc_txt"
                  value={formData.purch_inc_txt}
                  onChange={handleChange}
                ></select>
              </div>
              <div className="select-dairy-gl-div w100 d-flex sb a-center">
                <label htmlFor="saleincome" className="label-text w30 px10 ">
                  विक्री येणे ख. क्र.
                </label>
                <select
                  id="saleincome"
                  className="s1 data w15"
                  required
                  name="MilkSaleRecivableGl"
                  value={formData.MilkSaleRecivableGl}
                  onChange={handleChange}
                ></select>
                <select
                  id="saleincome"
                  className="s2 data w50"
                  name="saleincome_txt"
                  value={formData.saleincome_txt}
                  onChange={handleChange}
                ></select>
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
                className="data w100"
                type="text"
                required
                name="RoundAmtGL"
                value={formData.RoundAmtGL}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w45 h10 d-flex-col sb">
              <label htmlFor="cattlefeedgl" className="label-text w100">
                पशुखाद्य :
              </label>
              <input
                id="cattlefeedgl"
                className="data w100"
                type="text"
                required
                name="saleincomeGL"
                value={formData.saleincomeGL}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="commissiongl" className="label-text w100">
                अनामत :
              </label>
              <input
                id="commissiongl"
                className="data w100"
                type="text"
                required
                name="anamatGlcode"
                value={formData.anamatGlcode}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="advgl" className="label-text w100">
                ऍडव्हान्स :
              </label>
              <input
                id="advgl"
                className="data w100"
                type="text"
                required
                name="advGL"
                value={formData.advGL}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sa">
              <label htmlFor="retailmsale" className="label-text w100">
                किरकोळ दूध विक्रि :
              </label>
              <input
                id="retailmsale"
                className="data w100"
                type="text"
                required
                name="kirkolmilksale_yene"
                value={formData.kirkolmilksale_yene}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="ghatnash" className="label-text w100">
                घट नाश खतावणी :
              </label>
              <input
                id="ghatnash"
                className="data w100"
                type="text"
                required
                name="ghutnashgl"
                value={formData.ghutnashgl}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="sremaingl" className="label-text w100">
                आरंभी शिल्लख माल :
              </label>
              <input
                id="sremaingl"
                className="data w100"
                type="text"
                required
                name="ArambhiShillakMalGL"
                value={formData.ArambhiShillakMalGL}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="lasteremgl" className="label-text w100">
                अखेर शिल्लख माल :
              </label>
              <input
                id="lasteremgl"
                className="data w100"
                type="text"
                required
                name="AkherShillakMal"
                value={formData.AkherShillakMal}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="comanuexpe" className="label-text w100">
                कमि./अनुदान व खर्च :
              </label>
              <input
                id="comanuexpe"
                className="data w100"
                type="text"
                required
                name="MilkCommisionAndAnudan"
                value={formData.MilkCommisionAndAnudan}
                onChange={handleChange}
              />
            </div>

            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="ribetIncome" className="label-text w100">
                रिबेट उत्त्पन्न
              </label>
              <input
                id="ribetIncome"
                className="data w100"
                type="text"
                required
                name="ribetIncome"
                value={formData.ribetIncome}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="rebbetExpe" className="label-text w100">
                रिबेट खर्च :
              </label>
              <input
                id="rebbetExpe"
                className="data w100"
                type="text"
                required
                name="ribetExpense"
                value={formData.ribetExpense}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="rdiffgl" className="label-text w100">
                दूध दर फरक:
              </label>
              <input
                id="rdiffgl"
                className="data w100"
                type="text"
                required
                name="milkRateDiff"
                value={formData.milkRateDiff}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="coolgl" className="label-text w100">
                शितकार :
              </label>
              <input
                id="coolgl"
                className="data w100"
                type="text"
                required
                name="chillinggl"
                value={formData.chillinggl}
                onChange={handleChange}
              />
            </div>
            <div className="round-amount-container w100 w45 h10 d-flex-col sb">
              <label htmlFor="vexpe" className="label-text w100">
                वाहतूक खर्च :
              </label>
              <input
                id="vexpe"
                className="data w100"
                type="text"
                required
                name="transportgl"
                value={formData.transportgl}
                onChange={handleChange}
              />
            </div>
            <div className="buttons-amount-container w100 d-flex j-end">
              <button type="submit" className="w-btn">
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
