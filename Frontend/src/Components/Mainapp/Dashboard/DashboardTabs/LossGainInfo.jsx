import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../Home/Spinner/Spinner";
import { dairydailyLossGain } from "../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";
import "../../../../Styles/Mainapp/Dashbaord/LossGain.css";

const LossGainInfo = ({ setIsSelected }) => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date?.toDate); // to fetch default date data
  const centerList = useSelector((state) => state.center.centersList || []);
  const dairyinfo = useSelector((state) => state.dairy.dairyData);
  const allData = useSelector((state) => state.custinfo.dairyColl); // sangha and dairy sales and collection
  const status = useSelector((state) => state.custinfo.dailylsStatus); // sangha and dairy sales and collection

  useEffect(() => {
    setIsSelected(2);
  }, []);

  const initialValues = {
    fromDate: "",
    toDate: "",
    centerid: "",
  };
  const [values, setValues] = useState(initialValues);

  useEffect(() => {
    setValues((prevData) => ({
      ...prevData,
      fromDate: tDate,
      toDate: tDate,
    }));
  }, [tDate]);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleShowLossGain = (e) => {
    e.preventDefault();
    // console.log("values", values);
    dispatch(
      dairydailyLossGain({
        fromDate: values.fromDate,
        toDate: values.toDate,
        centerid: values.centerid,
      })
    );
  };

  const groupDataByDateAndShift = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const key = `${item.colldate}-${item.shift}`;
      if (!grouped[key]) grouped[key] = {};
      grouped[key][item.type] = item;
    });

    return grouped;
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("hi-IN");

  const groupedData = groupDataByDateAndShift(allData);

  return (
    <div className="loss-gain-info-container w100 h1 d-flex-col sb p10">
      <span className="heading">घट / वाढ रिपोर्ट :</span>
      <form
        onSubmit={handleShowLossGain}
        className="selection-container w100 h10 d-flex a-center sb"
      >
        <div className="dates-outer-container w45 h1 d-flex a-center sb">
          <div className="dates-container w48 h1 d-flex a-center sa">
            <label htmlFor="fromDate" className="w30 label-text">
              पासुन :
            </label>
            <input
              type="date"
              name="fromDate"
              id="fromDate"
              className="data w70"
              value={values.fromDate}
              max={values.toDate}
              onChange={handleInputs}
            />
          </div>
          <div className="dates-container w48 h1 d-flex a-center sa">
            <label htmlFor="toDate" className="w30 label-text">
              पर्यंत :
            </label>
            <input
              type="date"
              name="toDate"
              id="toDate"
              className="data w70"
              max={tDate}
              value={values.toDate}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="loss-gain-center-select-container w40 d-flex a-center sb">
          <select
            className="data"
            name="centerid"
            onChange={handleInputs}
            value={values.centerid}
          >
            <option value="">-- {t("c-se-center")} --</option>
            {centerList.map((center, index) => (
              <option key={index} value={center.center_id}>
                {center.center_name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-btn mx10"
          disabled={status === "loading"}
        >
          {status === "loading" ? "दाखवा..." : "दाखवा"}
        </button>
      </form>
      <div className="loss-gain-details-container w100 h80 d-flex-col">
        {status === "loading" ? (
          <Spinner />
        ) : Object.entries(groupedData).length > 0 ? (
          <div className="loss-gain-details-table-container w100 h1 mh100 hidescrollbar d-flex-col a-center bg6 br9">
            {Object.entries(groupedData).map(
              ([key, { sangh, dairy }], index) => {
                const date = formatDate(sangh?.colldate || dairy?.colldate);
                const shift = sangh?.shift ?? dairy?.shift;

                // Values
                const dairyVals = {
                  litres: dairy?.totalLitres ?? 0,
                  fat: dairy?.avgFat ?? 0,
                  snf: dairy?.avgSnf ?? 0,
                  rate: dairy?.avgRate ?? 0,
                  amt: dairy?.totalAmt ?? 0,
                };

                const sanghVals = {
                  litres: sangh?.totalLitres ?? 0,
                  fat: sangh?.avgFat ?? 0,
                  snf: sangh?.avgSnf ?? 0,
                  rate: sangh?.avgRate ?? 0,
                  amt: sangh?.totalAmt ?? 0,
                };

                const diffVals = {
                  litres: (sanghVals.litres - dairyVals.litres).toFixed(2),
                  fat: (sanghVals.fat - dairyVals.fat).toFixed(1),
                  snf: (sanghVals.snf - dairyVals.snf).toFixed(1),
                  rate: (sanghVals.rate - dairyVals.rate).toFixed(1),
                  amt: (sanghVals.amt - dairyVals.amt).toFixed(2),
                };

                const getDiffClass = (val) => {
                  const num = parseFloat(val);
                  if (num > 0) return "bg-green";
                  if (num < 0) return "bg-red";
                  return ""; // or same background if 0
                };

                const getDiffatClass = (val) => {
                  const num = parseFloat(val);
                  if (num < 0) return "bg-red";
                  return ""; // or same background if 0
                };

                return (
                  <div
                    key={key}
                    className="loss-gain-data-table-container w100 h50 d-flex-col a-center t-center bg my10 sb"
                  >
                    <div className="loss-gain-data-heading-container  w100 h25 d-flex a-center bg7 br-top t-center sb">
                      <span className="f-label-text w15">संकलन</span>
                      <span className="f-label-text w15">दिनांक</span>
                      <span className="f-label-text w10">सत्र</span>
                      <span className="f-label-text w10">लिटर</span>
                      <span className="f-label-text w10">फॅट</span>
                      <span className="f-label-text w10">SNF</span>
                      <span className="f-label-text w10">दर</span>
                      <span className="f-label-text w15">रक्कम</span>
                    </div>

                    <div className="loss-gain-data-container w100 h25 d-flex a-center bg5 sb">
                      <span className="info-text w15">डेअरी</span>
                      <span className="info-text w15">{date}</span>
                      <span className="info-text w10">
                        {shift === 0
                          ? "सकाळ"
                          : shift === 1
                          ? "साय"
                          : shift === 2
                          ? "स + साय"
                          : shift === 3
                          ? "का.सा+ आ.स"
                          : "एकत्रीत"}
                      </span>
                      <span className="info-text w10">{dairyVals.litres}</span>
                      <span className="info-text w10">
                        {dairyVals.fat.toFixed(1)}
                      </span>
                      <span className="info-text w10">
                        {dairyVals.snf.toFixed(1)}
                      </span>
                      <span className="info-text w10">
                        {dairyVals.rate.toFixed(1)}
                      </span>
                      <span className="info-text w15">{dairyVals.amt}</span>
                    </div>

                    <div className="loss-gain-data-container w100 h25 d-flex a-center bg6 sb">
                      <span className="info-text w15">संघ</span>
                      <span className="info-text w15">{date}</span>
                      <span className="info-text w10">
                        {shift === 0
                          ? "सकाळ"
                          : shift === 1
                          ? "साय"
                          : shift === 2
                          ? "स + साय"
                          : shift === 3
                          ? "का.सा+ आ.स"
                          : "एकत्रीत"}
                      </span>
                      <span className="info-text w10">{sanghVals.litres}</span>
                      <span className="info-text w10">{sanghVals.fat}</span>
                      <span className="info-text w10">{sanghVals.snf}</span>
                      <span className="info-text w10">{sanghVals.rate}</span>
                      <span className="info-text w15">{sanghVals.amt}</span>
                    </div>

                    <div className="loss-gain-data-footer-container w100 h25 d-flex a-center bg4 br-bottom sb ">
                      <span className="info-text w15">फरक</span>
                      <span
                        className={`info-text w15 ${getDiffClass(
                          diffVals.amt
                        )}`}
                      >
                        {getDiffClass(diffVals.amt) === "bg-red"
                          ? "घट"
                          : getDiffClass(diffVals.amt) === "bg-green"
                          ? "वाढ"
                          : ""}
                      </span>
                      <span className="info-text w10">-</span>
                      <span
                        className={`info-text w10 ${getDiffatClass(
                          diffVals.litres
                        )}`}
                      >
                        {diffVals.litres}
                      </span>
                      <span
                        className={`info-text w10 ${getDiffatClass(
                          diffVals.fat
                        )}`}
                      >
                        {diffVals.fat}
                      </span>
                      <span
                        className={`info-text w10 ${getDiffatClass(
                          diffVals.snf
                        )}`}
                      >
                        {diffVals.snf}
                      </span>
                      <span
                        className={`info-text w10 ${getDiffatClass(
                          diffVals.rate
                        )}`}
                      >
                        {diffVals.rate}
                      </span>
                      <span
                        className={`info-text w15 ${getDiffClass(
                          diffVals.amt
                        )}`}
                      >
                        {diffVals.amt}
                      </span>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        ) : (
          <div className="box d-flex center bg">
            घट / वाढ रिपोर्ट बघण्यासाठी योग्य तारिख आणि सेंटर निवडा.
          </div>
        )}
      </div>
    </div>
  );
};

export default LossGainInfo;
