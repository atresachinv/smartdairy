import "../../../../../Styles/Mainapp/Apphome/Appnavview/collsetting.css";

const CollSettings = ({ switchToColl }) => {
  return (
    <div className="milk-col-form w100 h1 d-flex-col bg p10">
      <div className="setting-btn-switch w100 h10 d-flex a-center sb">
        <span className="heading "> MIlk Collection Settings : </span>
      </div>
      <form className="collection-settings-form-div w100 h90 d-flex-col sa">
        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading h50">Select Milk Collection Period</span>
          <div className="col-inputs-div w50 h50 d-flex sb">
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input className="w20" type="radio" name="m" id="0" />
              <span className="info-text w70">Cow</span>
            </div>
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input className="w20" type="radio" name="m" id="" />
              <span className="info-text w70">Buffelow</span>
            </div>
          </div>
        </div>
        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading">Use Previous Information</span>
          <div className="col-inputs-div w60 h50 d-flex sb">
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="0" id="" />
              <span className="info-text w70 a-center">FAT</span>
            </div>
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="1" id="" />
              <span className="info-text w70 a-center">SNF</span>
            </div>
            <div className="input-radio-btn w30 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="1" id="" />
              <span className="info-text w70 a-center">Degree</span>
            </div>
          </div>
        </div>
        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading">Fill Information Manually</span>
          <div className="col-inputs-div w60 h50 d-flex sb">
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="1" id="" />
              <span className="info-text w70">Liters</span>
            </div>
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="0" id="" />
              <span className="info-text w70">FAT</span>
            </div>
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="1" id="" />
              <span className="info-text w70">SNF</span>
            </div>
            <div className="input-radio-btn w25 h1 d-flex a-center sa">
              <input className="w20 " type="checkbox" name="1" id="" />
              <span className="info-text w70">Degree</span>
            </div>
          </div>
        </div>
        <div className="coll-inputs-div w100 h20 d-flex-col">
          <span className="heading h50">SMS and Print Setting :</span>
          <div className="col-inputs-div w50 h50 d-flex sb">
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input className="w20" type="radio" name="" id="" />
              <span className="info-text w70">SMS</span>
            </div>
            <div className="input-radio-btn w50 h1 d-flex a-center sa">
              <input className="w20" type="radio" name="" id="" />
              <span className="info-text w70">Print</span>
            </div>
          </div>
        </div>
        <div className="button-container w100 h20 d-flex j-end">
          <button className="f-btn btn info-text">save Settings</button>
          <button onClick={switchToColl} className="btn f-btn info-text mx10">
            Start Collection
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollSettings;
