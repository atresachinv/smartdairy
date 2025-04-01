import React, { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import sanscript from "@indic-transliteration/sanscript";
import "../../../Styles/DairyInitialInfo/DairyInitialInfo.css";

const anuswaraConsonants = [
  "द",
  "ध",
  "ग",
  "घ",
  "च",
  "छ",
  "ज",
  "झ",
  "ट",
  "ठ",
  "ड",
  "ढ",
  "ण",
  "त",
  "थ",
  "न",
  "प",
  "फ",
  "ब",
  "भ",
  "म",
  "य",
  "र",
  "ल",
  "व",
  "श",
  "ष",
  "स",
  "ह",
];

const anuswaraRegex = new RegExp(`न्(?=[${anuswaraConsonants.join("")}])`, "g");

const applyAnuswaraCorrections = (text) => {
  return text.replace(anuswaraRegex, "ं");
};

const DairyInitialInfo = () => {
  const [inputValue, setInputValue] = useState("");
  const [originalValue, setOriginalValue] = useState(""); // To store original input
  const [isTranslitEnabled, setIsTranslitEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debounced transliteration function
  const handleTransliteration = useCallback(
    debounce((value) => {
      if (!isTranslitEnabled || value.trim() === "") {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Transliterate from ITRANS to Devanagari
        let marathiText = sanscript.t(value, "itrans", "devanagari");

        // Apply Anuswara Corrections
        marathiText = applyAnuswaraCorrections(marathiText);

        setInputValue(marathiText);
      } catch (err) {
        console.error("Transliteration Error:", err);
        setError("An error occurred during transliteration.");
      } finally {
        setIsLoading(false);
      }
    }, 500), // 500 ms debounce
    [isTranslitEnabled]
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setOriginalValue(value);
    setInputValue(value); // Display original input immediately
    handleTransliteration(value);
  };

  const toggleTransliteration = () => {
    setIsTranslitEnabled(!isTranslitEnabled);
    if (!isTranslitEnabled) {
      // If disabling transliteration, revert to original input
      setInputValue(originalValue);
    } else {
      // If enabling transliteration, re-apply transliteration
      handleTransliteration(originalValue);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      maxWidth: "500px",
      margin: "0 auto",
      fontFamily: "Arial, sans-serif",
    },
    label: {
      marginBottom: "8px",
      fontSize: "16px",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      marginBottom: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
    },
    loading: {
      color: "blue",
      fontSize: "14px",
    },
    error: {
      color: "red",
      fontSize: "14px",
    },
    toggleContainer: {
      marginTop: "10px",
    },
  };

  return (
    <>
      <div className="Society-info-contianer w100 h1 d-flex-col bg">
        <span className="heading px10">Society In Detail</span>
        <div className="Society-info-div w100 h1 d-flex">
          <div className="first-half-society-info w70 h1 d-flex-col">
            <div className="Strtup-info-div w90  h10 d-flex a-center">
              <span className="label-text w30 px10">अधिकृत भागभांडवल</span>
              <input
                className="data w40 h70 "
                type="text"
                placeholder="0.000"
              />
            </div>
            <div className="cashamount-info-div w100  h25 d-flex-col ">
              <div className="in-hand-cash-and-closing-date w100 d-flex a-center ">
                <div className="remining-cost-colsing-date d-flex w50 a-center">
                  <span className="label-text w50 px10">
                    {" "}
                    रोख रक्कम शिल्लख हेड
                  </span>
                  <input
                    className="data w40 h70 "
                    type="text"
                    placeholder="0.000"
                  />
                </div>
                <div className="colsing-date-div w50 d-flex a-center">
                  <span className="label-text w40 px10">
                    {" "}
                    क्लोजिंग कॅश दिनांक
                  </span>
                  <input className="data  w40 h70 " type="date" />
                </div>
              </div>
              <div className="grocary-cash-div w100 h30  d-flex a-center ">
                <span className="label-text w40 px10">
                  {" "}
                  हातातील रोख शिल्लख किराणा
                </span>
                <input
                  className="data w50 h70"
                  placeholder="0.000"
                  type="text"
                />
              </div>
              <div className="cash-gl-no-div w90 d-flex sa   a-center">
                <span className="label-text w30 px10">कॅश खतवानी न</span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
            </div>
            <div className="profit-lossgl-div d-flex-col w90 h25">
              {/* <legend className="label-text ">नफा तोटा खतावणी संबंधित </legend> */}
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">चालू नफा तोटा ख न</span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">
                  मागील नफा तोटा ख न{" "}
                </span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex  sa a-center">
                <span className="label-text w30 px10 ">
                  व्यापारी नफा तोटा ख न
                </span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
            </div>
            <div className="profit-lossgl-div d-flex-col w90 h25">
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">खरेदी खर्च ख न</span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex sa a-center">
                <span className="label-text w30 px10 ">
                  विक्री उत्पन्न ख न{" "}
                </span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex  sa a-center">
                <span className="label-text w30 px10 ">खरेदी देणे ख न</span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
              <div className="profitloss-current-div w100 d-flex  sa a-center">
                <span className="label-text w30 px10 ">विक्री येणे ख न</span>
                <select className="data w20 h70" name="" id=""></select>
                <select className="data w60 h70" name="" id=""></select>
              </div>
            </div>
            
          </div>

          <div className="second-half-container w35 d-flex-col h1 bg ">
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">राऊंड रक्कम:</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">पशुखाद्य:</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">अनामत :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">ऍडव्हान्स :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40">किरकोळ दूध वि:</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">घट नाश GL:</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">आरंभी शिल्लख माल:</span>
              <input className="data w50 h70" type="text" />
            </div>
           
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">Ribbit उत्त्पन्न</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">Ribbit खर्च :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">दूध दर फरक:</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40 ">शितकार :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="round-amount-container w100 d-flex h5 ">
              <span className="label-text w40">वाहतूक खर्च :</span>
              <input className="data w50 h70" type="text" />
            </div>
            <div className="buttons-amount-container w100 sa d-flex h5 ">
              <button className="w-btn">Save</button>
              <button className="w-btn">Update</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DairyInitialInfo;
