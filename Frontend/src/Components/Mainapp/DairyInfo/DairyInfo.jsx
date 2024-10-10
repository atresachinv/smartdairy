import React from "react";
import "../../../Styles/Mainapp/Dairy/Dairy.css"

const DairyInfo = () => {
  return (
    <div className="dairy-main-container w100 h1 d-flex center">
      <form className="dairy-information-div w70 h70 d-flex-col sa bg p10">
        <span className="heading h10">Dairy Information</span>
        <div className="dairy-name-div w100 h10 d-flex sa">
          <span className="label-text w20 ">Marathi Name : </span>
          <input
            className="data w80 "
            type="text"
            name=""
            id=""
            placeholder="डेरीचे नाव"
          />
        </div>
        <div className="dairy-name-div w100 h10 d-flex sa">
          <span className="label-text w20 ">English Name :</span>
          <input className="data w80 " type="text" name="" id="" placeholder="Dairy Name"/>
        </div>
        <div className="register-date-no-div w100 h10 d-flex sb">
          <div className="regi-no-div w40  d-flex sa">
            <span className="label-text w80 ">Register Number :</span>
            <input className="data w80" type="text" name="" id="" />
          </div>
          <div className="regi-no-div w50  d-flex sb">
            <span className="label-text w30 ">Register Date :</span>
            <input className="data w50 " type="date" name="" id="" />
          </div>
        </div>
        <div className="gst-mobile-div w100 h10 d-flex sb">
          <div className="gst-div w40  d-flex sa">
            <span className="label-text w80 ">GST Number :</span>
            <input className="data w80" type="text" name="" id="" />
          </div>
          <div className="gst-div w50  d-flex sb">
            <span className="label-text w30 ">Mobile Number :</span>
            <input className="data w50 " type="text" name="" id="" />
          </div>
        </div>
        <div className="address-div w100 h10 d-flex sb">
          <div className="add-div w40  d-flex sb ">
            <span className="label-text w80 ">City :</span>
            <input className="data w80" type="text" name="" id="" />
          </div>
          <div className="add-div w50  d-flex sb">
            <span className="label-text w30 ">Tehsil :</span>
            <input className="data w50 " type="text" name="" id="" />
          </div>
        </div>
        <div className="address-div w100 h10 d-flex sb">
          <div className="add-div w40  d-flex sa">
            <span className="label-text w80 ">District :</span>
            <input className="data w80" type="text" name="" id="" />
          </div>
          <div className="add-div w50  d-flex sb">
            <span className="label-text w30 ">Pincode :</span>
            <input className="data w50 " type="text" name="" id="" />
          </div>
        </div>

        <div className="btn-div w100 h10 d-flex j-end px10 my5">
          <button className="w-btn mx10">Update</button>
          <button className="w-btn ">Save</button>
        </div>
      </form>
    </div>
  );
};

export default DairyInfo;
