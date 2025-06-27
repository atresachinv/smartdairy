import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../../../Styles/Mainapp/Payments//FatSnfCompromise.css";
import { useDispatch, useSelector } from "react-redux";
import {
  convertKgLiters,
  updateDiffFat,
  updateDiffSnf,
  updateGeneralFat,
  updateGeneralSnf,
  updatePreviousFat,
  updatePreviousSnf,
} from "../../../App/Features/Mainapp/Milk/FatSnfSlice";
import { getMaxCustNo } from "../../../App/Features/Mainapp/Masters/custMasterSlice";
const FatSnfCompromise = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date?.toDate);
  const custno = useSelector((state) => state.customer?.maxCustNo);
  const fatstatus = useSelector((state) => state.fatsnf?.fatstatus);
  const snfstatus = useSelector((state) => state.fatsnf?.snfstatus);
  const convertKLstatus = useSelector((state) => state.fatsnf?.convertKLstatus);

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
    if (type === "radio") {
      setValues((prevData) => ({
        ...prevData,
        [name]: Number(value),
      }));
    } else {
      setValues((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    if (!custno) {
      dispatch(getMaxCustNo());
    }
  }, []);

  useEffect(() => {
    setValues((prevFormData) => ({
      ...prevFormData,
      custFrom: 1,
      custTo: `${Math.abs(custno - 1)}`,
      fromDate: tDate,
      toDate: tDate,
    }));
  }, [custno, tDate]);

  const handleResetFatData = () => {
    setValues((prevFormData) => ({
      ...prevFormData,
      fatOption: "",
      fatAmt: "",
    }));
  };
  const handleResetSnfData = () => {
    setValues((prevFormData) => ({
      ...prevFormData,
      snfOption: "",
      snfAmt: "",
    }));
  };

  // handling fat updates ------------------------------------------------------->
  const handleFatUpdates = async () => {
    if (!values.shift) {
      return toast.error("Please select shift to update Records!");
    }

    if (values.fatOption === 0) {
      const responce = await dispatch(
        updateGeneralFat({
          fromDate: values.fromDate,
          toDate: values.toDate,
          shift: values.shift,
          custFrom: values.custFrom,
          custTo: values.custTo,
          fat: values.fatAmt,
        })
      ).unwrap();
      if (responce.status === 200) {
        handleResetFatData();
        toast.success("General fat and Rates is updated successfully!");
      } else if (responce.status === 204) {
        toast.error("Milk Collection not found to update general fat.");
      } else {
        toast.error("Failed to update general fat.");
      }
    } else if (values.fatOption === 1) {
      const responce = await dispatch(
        updatePreviousFat({
          fromDate: values.fromDate,
          toDate: values.toDate,
          shift: values.shift,
          custFrom: values.custFrom,
          custTo: values.custTo,
          days: values.fatAmt,
        })
      ).unwrap();
      if (responce.status === 200) {
        handleResetFatData();
        toast.success("Previous fat and Rates is updated successfully!");
      } else if (responce.status === 204) {
        toast.error("Milk Collection not found to update previous fat.");
      } else {
        toast.error("Failed to update previous fat.");
      }
    } else if (values.fatOption === 2) {
      const responce = await dispatch(
        updateDiffFat({
          fromDate: values.fromDate,
          toDate: values.toDate,
          shift: values.shift,
          custFrom: values.custFrom,
          custTo: values.custTo,
          fatDiff: values.fatAmt,
        })
      ).unwrap();
      if (responce.status === 200) {
        handleResetFatData();
        toast.success("Difference fat and Rates is updated successfully!");
      } else if (responce.status === 204) {
        toast.error("Milk Collection not found to update difference fat.");
      } else {
        toast.error("Failed to update defference fat.");
      }
    } else {
      toast.error("फॅट बदलण्यासाठी कुठलाही पर्याय निवडलेला नाही!");
    }
  };

  // handling snf updates ------------------------------------------------------->
  const handleSnfUpdates = async () => {
    if (!values.shift) {
      return toast.error("Please select shift to update Records!");
    }
    if (values.snfOption === 0) {
      const responce = await dispatch(
        updateGeneralSnf({
          fromDate: values.fromDate,
          toDate: values.toDate,
          shift: values.shift,
          custFrom: values.custFrom,
          custTo: values.custTo,
          snf: values.snfAmt,
        })
      ).unwrap();
      if (responce.status === 200) {
        handleResetSnfData();
        toast.success("General snf and Rates is updated successfully!");
      } else if (responce.status === 204) {
        toast.error("Milk Collection not found to update general snf.");
      } else {
        toast.error("Failed to update general snf.");
      }
    } else if (values.snfOption === 1) {
      const responce = await dispatch(
        updatePreviousSnf({
          fromDate: values.fromDate,
          toDate: values.toDate,
          shift: values.shift,
          custFrom: values.custFrom,
          custTo: values.custTo,
          days: values.snfAmt,
        })
      ).unwrap();
      if (responce.status === 200) {
        handleResetSnfData();
        toast.success("Previous snf and Rates is updated successfully!");
      } else if (responce.status === 204) {
        toast.error("Milk Collection not found to update previous snf.");
      } else {
        toast.error("Failed to update previous snf.");
      }
    } else if (values.snfOption === 2) {
      const responce = await dispatch(
        updateDiffSnf({
          fromDate: values.fromDate,
          toDate: values.toDate,
          shift: values.shift,
          custFrom: values.custFrom,
          custTo: values.custTo,
          snfDiff: values.snfAmt,
        })
      ).unwrap();
      if (responce.status === 200) {
        handleResetSnfData();
        toast.success("Difference snf and Rates is updated successfully!");
      } else if (responce.status === 204) {
        toast.error("Milk Collection not found to update difference snf.");
      } else {
        toast.error("Failed to update defference snf.");
      }
    } else {
      toast.error("एस.एन.एफ बदलण्यासाठी कुठलाही पर्याय निवडलेला नाही!");
    }
  };

  const handleResetBtn = (e) => {
    e.preventDefault();
    setValues((prevFormData) => ({
      ...prevFormData,
      shift: "",
      fatOption: "",
      fatAmt: "",
      snfOption: "",
      snfAmt: "",
      literOption: "",
      ltrAmt: "",
      milkIn: "",
      milkAmt: "",
    }));
  };

  const handleConvertKL = async (e) => {
    if (!values.shift) {
      return toast.error("Please select shift to update Records!");
    }
    e.preventDefault();
    const responce = await dispatch(
      convertKgLiters({
        fromDate: values.fromDate,
        toDate: values.toDate,
        shift: values.shift,
        custFrom: values.custFrom,
        custTo: values.custTo,
        milkIn: values.milkIn,
        amount: values.milkAmt,
      })
    ).unwrap();
    const unit = values.milkIn === 0 ? "KG" : "Liter";
    const unit2 = values.milkIn === 0 ? "Liter" : "KG";
    if (responce.status === 200) {
      handleResetSnfData();
      toast.success(
        `Milk collection from ${unit} to ${unit2} converted successfully!`
      );
    } else if (responce.status === 204) {
      toast.error("Milk Collection not found for conversion!");
    } else {
      toast.error("Failed to convert milk collection!");
    }
  };

  return (
    <div className="fatsnf-container w100 h1 d-flex-col sb p10">
      <span className="px10 heading">फॅट-एस.एन.एफ तडजोड :</span>
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
              max={values.toDate}
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
              max={tDate}
              value={values.toDate}
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="fat-snf-update-details-div w100 h50 d-flex a-center sb">
          <div className="radio-button-mrg-eve w40 d-flex sb">
            <div className="morning-snf-div w30 d-flex a-center sa">
              <input
                id="mrg"
                className="w20 h1"
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
                className="w20 h1"
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
                className="w20 h1"
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
          <div className="codeno-fat-snf-div w40 d-flex sa">
            <div className="from-code-snf-fat w60 d-flex a-center">
              <label htmlFor="cfrom" className="px10 label-text">
                कोड नं. पासून:
              </label>
              <input
                id="cfrom"
                className="data w30"
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
                className="data w45"
                type="number"
                name="custTo"
                value={values.custTo}
                onChange={handleInputs}
              />
            </div>
          </div>
          <button type="button" className="w-btn" onClick={handleResetBtn}>
            रद्द करा
          </button>
        </div>
      </div>
      <div className="second-half-clr-snf-fat w100 h70 d-flex-col sa">
        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">FAT :</label>
          <div className="radio-button1-div w60 d-flex">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input
                id="fgen"
                className="w15 h1"
                type="radio"
                name="fatOption"
                value={0}
                checked={values.fatOption === 0}
                onChange={handleInputs}
              />
              <label htmlFor="fgen" className="f-label-text w80">
                जरनल
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input
                id="flast"
                className="w15 h80"
                type="radio"
                name="fatOption"
                value={1}
                checked={values.fatOption === 1}
                onChange={handleInputs}
              />
              <label htmlFor="flast" className="f-label-text w80">
                मागील दिवसाची FAT
              </label>
            </div>
            <div className="differance-radio-button w25 d-flex px10 a-center sb">
              <input
                id="fdiff"
                className="w15 h1"
                type="radio"
                name="fatOption"
                value={2}
                checked={values.fatOption === 2}
                onChange={handleInputs}
              />
              <label htmlFor="fdiff" className="f-label-text w80">
                फरक{" "}
              </label>
            </div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex a-center sb">
            <input
              className="data w40 t-center"
              type="text"
              name="fatAmt"
              placeholder="0.0"
              onChange={handleInputs}
            />
            <button
              className="w40 btn"
              type="button"
              disabled={fatstatus === "loading"}
              onClick={handleFatUpdates}
            >
              {fatstatus === "loading" ? "बदल करत आहोत..." : "बदला"}
            </button>
          </div>
        </div>
        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">SNF :</label>
          <div className="radio-button1-div w60 d-flex ">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input
                id="sgen"
                className="w15 h1"
                type="radio"
                name="snfOption"
                value={0}
                checked={values.snfOption === 0}
                onChange={handleInputs}
              />
              <label htmlFor="sgen" className="f-label-text w80">
                जरनल
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input
                id="slast"
                className="w15 h80"
                type="radio"
                name="snfOption"
                value={1}
                checked={values.snfOption === 1}
                onChange={handleInputs}
              />
              <label htmlFor="slast" className="f-label-text w80">
                मागील दिवसाची SNF
              </label>
            </div>
            <div className="differance-radio-button w25 d-flex px10 a-center sb">
              <input
                id="sdiff"
                className="w15 h1"
                type="radio"
                name="snfOption"
                value={2}
                checked={values.snfOption === 2}
                onChange={handleInputs}
              />
              <label htmlFor="sdiff" className="f-label-text w80">
                फरक
              </label>
            </div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex a-center sb">
            <input
              className="data w40 t-center"
              type="text"
              name="snfAmt"
              placeholder="0.0"
              onChange={handleInputs}
            />
            <button
              className="w40 btn"
              type="button"
              disabled={snfstatus === "loading"}
              onClick={handleSnfUpdates}
            >
              {snfstatus === "loading" ? "बदल करत आहोत..." : "बदला"}
            </button>
          </div>
        </div>

        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">लिटर :</label>
          <div className="radio-button1-div w60 d-flex">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input
                id="lperltr"
                className="w15 h1"
                type="radio"
                name="literOption"
                value={0}
                checked={values.literOption === 0}
                onChange={handleInputs}
              />
              <label htmlFor="lperltr" className="f-label-text w80">
                प्रती लिटर
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input
                id="lsame"
                className="w15 h80"
                type="radio"
                name="literOption"
                value={1}
                checked={values.literOption === 1}
                onChange={handleInputs}
              />
              <label htmlFor="lsame" className="f-label-text w80">
                एकसारखे
              </label>
            </div>
            <div className="differance-radio-button w25 d-flex px10 a-center sb">
              <input
                id="lrate"
                className="w15 h1"
                type="radio"
                name="literOption"
                value={2}
                checked={values.literOption === 2}
                onChange={handleInputs}
              />
              <label htmlFor="lrate" className="f-label-text w80">
                दर
              </label>
            </div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex a-center sb">
            <input
              id=""
              className="data w40 t-center"
              type="text"
              name="ltrAmt"
              placeholder="0.0"
              onChange={handleInputs}
            />
            <button className="w40 btn">बदला</button>
          </div>
        </div>
        <div className="update-option-details w100 d-flex p10 a-center bg8">
          <label className="f-label-text w10">बदला :</label>
          <div className="radio-button1-div w60 d-flex ">
            <div className="jounral-radio-button w25 d-flex px10 a-center sb">
              <input
                id="ckg"
                className="w15 h1"
                type="radio"
                name="milkIn"
                value={0}
                checked={values.milkIn === 0}
                onChange={handleInputs}
              />
              <label htmlFor="ckg" className="f-label-text w80">
                किलो - लिटर
              </label>
            </div>
            <div className="Back-day-radio-button w40 d-flex px10 a-center sb">
              <input
                id="cliters"
                className="w15 h80"
                type="radio"
                name="milkIn"
                value={1}
                checked={values.milkIn === 1}
                onChange={handleInputs}
              />
              <label htmlFor="cliters" className="f-label-text w80">
                लिटर - किलो
              </label>
            </div>
            <div className="differance-radio-button w25"></div>
          </div>
          <div className="input-filed-updated-button-div w30 d-flex a-center sb">
            <input
              className="data w40 t-center"
              type="text"
              name="milkAmt"
              placeholder="0.0"
              disabled={convertKLstatus === "loading"}
              onChange={handleInputs}
            />
            <button type="button" className="w40 btn" onClick={handleConvertKL}>
              {convertKLstatus === "loading" ? "बदल करत आहोत..." : "बदला"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FatSnfCompromise;
