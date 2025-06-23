import { useState } from "react";
import "../../../Styles/Mainapp/Payments//FatSnfCompromise.css";
const FatSnfCompromise = () => {
  const initialValues = {
    fromDate: "",
    toDate: "",
    shift: "",
    custFrom: "",
    custTo: "",
    fatOption: "",
    fatAmt: "",
    snfOption: "",
    snfAmt: "",
    literOption: "",
    ltrAmt: "",
    milkIn: "",
    milkAmt: "",
  };
  const [values, setValues] = useState(initialValues);

  const handleInputs = (e) => {
    const { name, value, type } = e.target;
    setValues((prevData) => ({
      ...prevData,
      [name]: type === "radio" ? Number(value) : value,
    }));
  };

  const handleFatUpdates = () => {
    console.log("values", values);
  };
  return (
    <div className="fatsnf-container w100 h1 d-flex-col sb p10">
      <span className="px10 heading">FAT-SNF तडजोड :</span>
      <div className="first-half-snf-fat-container w100 h25 d-flex-col sa p10 bg">
        <div className="fat-snf-update-details-div w70 h50 d-flex a-center sb">
          <div className="from-date-snf-fat w45 d-flex a-center sb">
            <label htmlFor="fdate" className="w40 label-text">
              संकलन पासून:
            </label>
            <input
              id="fdate"
              className="data w60"
              type="date"
              name="fromDate"
              value={values.fromDate}
              onChange={handleInputs}
            />
          </div>
          <div className="to-date-snf-fat w45  d-flex a-center sb">
            <label htmlFor="tdate" className="w40 label-text">
              पर्यत:
            </label>
            <input
              id="tdate"
              className="data w60"
              type="date"
              name="toDate"
              value={values.toDate}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="fat-snf-update-details-div w100 h50 d-flex a-center">
          <div className="radio-button-mrg-eve w50 d-flex">
            <div className="morning-snf-div w30 d-flex a-center sa">
              <input
                id="mrg"
                type="radio"
                name="shift"
                value={0}
                checked={values.shift === 0}
                onChange={handleInputs}
              />
              <label htmlFor="mrg" className="label-text w60 ">
                सकाळ
              </label>
            </div>
            <div className="morning-snf-div w30 d-flex a-center sa">
              <input
                id="eve"
                type="radio"
                name="shift"
                value={1}
                checked={values.shift === 1}
                onChange={handleInputs}
              />
              <label htmlFor="eve" className="label-text w60 ">
                सायंकाळ
              </label>
            </div>
            <div className="morning-snf-div w30 d-flex a-center sa">
              <input
                id="both"
                type="radio"
                name="shift"
                value={2}
                checked={values.shift === 2}
                onChange={handleInputs}
              />
              <label htmlFor="both" className="label-text w60 ">
                दोन्ही
              </label>
            </div>
          </div>
          <div className="codeno-fat-snf-div w50 d-flex sa">
            <div className="from-code-snf-fat w40 d-flex a-center">
              <label htmlFor="cfrom" className="px10 label-text">
                कोड नं. पासून:
              </label>
              <input
                id="cfrom"
                className="data w35"
                type="number"
                name="custFrom"
                value={values.custFrom}
                onChange={handleInputs}
              />
            </div>
            <div className="to-code-snf-fat w40  d-flex a-center">
              <label htmlFor="cto" className="px10 label-text">
                पर्यत:
              </label>
              <input
                id="cto"
                className="data w35"
                type="number"
                name="custTo"
                value={values.custTo}
                onChange={handleInputs}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="second-half-clr-snf-fat w100 h70 d-flex-col sa">
        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">FAT :</label>
          <div className="radio-button1-div w60 d-flex">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input id="fgen" className="w15 h1" type="radio" />
              <label
                htmlFor="fgen"
                className="f-label-text w80"
                name="fatOption"
                value={0}
                checked={values.fatOption === 0}
                onChange={handleInputs}
              >
                जरनल
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input id="flast" className="w15 h80" type="radio" />
              <label
                htmlFor="flast"
                className="f-label-text w80"
                name="fatOption"
                value={1}
                checked={values.fatOption === 1}
                onChange={handleInputs}
              >
                मागील दिवसाची FAT
              </label>
            </div>
            <div className="differance-radio-button w25 d-flex px10 a-center sb">
              <input id="fdiff" className="w15 h1" type="radio" />
              <label
                htmlFor="fdiff"
                className="f-label-text w80"
                name="fatOption"
                value={2}
                checked={values.fatOption === 2}
                onChange={handleInputs}
              >
                फरक{" "}
              </label>
            </div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex sb">
            <input className="data w40" type="text" />
            <button className="w-btn">बदला</button>
          </div>
        </div>
        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">SNF :</label>
          <div className="radio-button1-div w60 d-flex ">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input id="sgen" className="w15 h1" type="radio" />
              <label
                htmlFor="sgen"
                className="f-label-text w80"
                name="snfOption"
                checked={values.snfOption === "0"}
                onChange={handleInputs}
              >
                जरनल
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input id="slast" className="w15 h80" type="radio" />
              <label
                htmlFor="slast"
                className="f-label-text w80"
                name="snfOption"
                checked={values.snfOption === "1"}
                onChange={handleInputs}
              >
                मागील दिवसाची SNF
              </label>
            </div>
            <div className="differance-radio-button w25 d-flex px10 a-center sb">
              <input id="sdiff" className="w15 h1" type="radio" />
              <label
                htmlFor="sdiff"
                className="f-label-text w80"
                name="snfOption"
                checked={values.snfOption === "2"}
                onChange={handleInputs}
              >
                फरक
              </label>
            </div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex sb">
            <input className="data w40" type="text" />
            <button className="w-btn">बदला</button>
          </div>
        </div>

        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">लिटर :</label>
          <div className="radio-button1-div w60 d-flex">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input id="lperltr" className="w15 h1" type="radio" />
              <label
                htmlFor="lperltr"
                className="f-label-text w80"
                name="literOption"
                checked={values.literOption}
                onChange={handleInputs}
              >
                प्रती लिटर
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input id="lsame" className="w15 h80" type="radio" />
              <label
                htmlFor="lsame"
                className="f-label-text w80"
                name="literOption"
                checked={values.literOption}
                onChange={handleInputs}
              >
                एकसारखे
              </label>
            </div>
            <div className="differance-radio-button w25 d-flex px10 a-center sb">
              <input id="lrate" className="w15 h1" type="radio" />
              <label
                htmlFor="lrate"
                className="f-label-text w80"
                name="literOption"
                checked={values.literOption}
                onChange={handleInputs}
              >
                दर
              </label>
            </div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex sb">
            <input id="" className="data w40" type="text" />
            <button className="w-btn">बदला</button>
          </div>
        </div>
        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">बदला :</label>
          <div className="radio-button1-div w60 d-flex ">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input id="ckg" className="w15 h1" type="radio" />
              <label
                htmlFor="ckg"
                className="f-label-text w80"
                name="milkIn"
                checked={values.milkIn === "kg"}
                onChange={handleInputs}
              >
                किलो - लिटर
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input id="cliters" className="w15 h80" type="radio" />
              <label
                htmlFor="cliters"
                className="f-label-text w80"
                name="milkIn"
                checked={values.milkIn === "ltr"}
                onChange={handleInputs}
              >
                लिटर - किलो
              </label>
            </div>
            <div className="differance-radio-button w25"></div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex sb">
            <input className="data w40" type="text" />
            <button className="w-btn" onClick={handleFatUpdates}>
              बदला
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatSnfCompromise;
