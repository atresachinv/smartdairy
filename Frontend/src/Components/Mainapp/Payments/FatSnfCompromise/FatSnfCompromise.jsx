import React from 'react'
 import "../../../../Styles/FatSnfCompromise/FatSnfCompromise.css";
const FatSnfCompromise = () => {
  return (
    <div className="fatsnf-container w100 h1 d-flex-col">
      <span className="px10 heading">FAT-SNF-तडजोड</span>
      <div className="first-half-snf-fat-container w100 h30 d-flex-col sa">
        <div className="from-to-date-fat-snf-div w100 h20 d-flex">
          <div className="from-date-snf-fat w40 d-flex a-center">
            <span className="px10 label-text">पासून:</span>
            <input className="data w60" type="date" />
          </div>
          <div className="to-date-snf-fat w40  d-flex a-center">
            <span className="px10 label-text">पर्येंत:</span>
            <input className="data w60" type="date" />
          </div>
        </div>
        <div className="radio-button-mrg-eve w100 d-flex h20">
          <div className="morning-snf-div w30 d-flex a-center">
            <input className="data w10 px10" type="radio" />
            <span className="label-text w20 ">सकाळ</span>
          </div>
          <div className="morning-snf-div w30 d-flex a-center">
            <input className="data w10 px10" type="radio" />
            <span className="label-text w20 ">संदयाकली</span>
          </div>
          <div className="morning-snf-div w30 d-flex a-center">
            <input className="data w10 px10" type="radio" />
            <span className="label-text w20 ">दोन्ही</span>
          </div>
        </div>
        <div className="codeno-fat-snf-div w100 h20 d-flex">
          <div className="from-code-snf-fat w40 d-flex a-center">
            <span className="px10 label-text"> कोड न पासून:</span>
            <input className="data w30" type="text" />
          </div>
          <div className="to-code-snf-fat w40  d-flex a-center">
            <span className="px10 label-text"> कोड न पर्येंत:</span>
            <input className="data w30" type="text" />
          </div>
        </div>
      </div>
      <div className="second-half-clr-snf-fat w100 h60 d-flex-col sa ">
        <div className="fat-info-div w100 bg3 ">
          <fieldset className=" filedsetfat w100 d-flex">
            <legend className="label-text ">FAT</legend>
            <div className="radio-button1-div w80 d-flex ">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनी FAT</span>
              </div>

              <div className="differance-radio-button w20 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20 d-flex">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="fat-info-div w100 bg3 ">
          <fieldset className=" filedsetfat w100 d-flex">
            <legend className="label-text ">CLB</legend>
            <div className="radio-button1-div w80 d-flex ">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनी FAT</span>
              </div>

              <div className="differance-radio-button w20 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20 d-flex">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="fat-info-div w100 bg3 ">
          <fieldset className=" filedsetfat w100 d-flex">
            <legend className="label-text ">SNF</legend>
            <div className="radio-button1-div w80 d-flex ">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनी FAT</span>
              </div>

              <div className="differance-radio-button w20 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20 d-flex">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="fat-info-div w100 bg3 ">
          <fieldset className=" filedsetfat w100 d-flex">
            <legend className="label-text ">LITER</legend>
            <div className="radio-button1-div w80 d-flex ">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनी FAT</span>
              </div>

              <div className="differance-radio-button w20 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20 d-flex">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div>
        {/* <div className="fat-info-div w100 bg3 ">
          <fieldset className="w100 d-flex">
            <legend className="label-text ">CLB</legend>
            <div className="radio-button2-div w80 d-flex">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनी FAT</span>
              </div>
              <div className="differance-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="fat-info-div w100 bg3 ">
          <fieldset className="w100 d-flex">
            <legend className="label-text ">SNF</legend>
            <div className="radio-button3-div w80 d-flex">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनी FAT</span>
              </div>
              <div className="differance-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div>
        <div className="fat-info-div w100 bg3 ">
          <fieldset className="w100 d-flex">
            <legend className="label-text ">Liter</legend>
            <div className="radio-button4 w80 d-flex">
              <div className="jounral-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w30">जरनल</span>
              </div>
              <div className="Back-day-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">जुनीFAT</span>
              </div>
              <div className="differance-radio-button w30 d-flex px10 a-center">
                <input className="w10" type="radio" />
                <span className="label-text w50">फरक </span>
              </div>
            </div>
            <div className="input-filed-updated-button-div w20">
              <div className="updated-button w100 d-flex sa a-center">
                <input className="data w40" type="text" />
                <button className="w-btn">Updated</button>
              </div>
            </div>
          </fieldset>
        </div> */}
      </div>
    </div>
  );
}

export default FatSnfCompromise
