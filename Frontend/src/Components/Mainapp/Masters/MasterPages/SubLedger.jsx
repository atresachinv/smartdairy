import React from "react";
// import "../../../../Styles/Mainapp/Masters/Subledger.css";
const SubLedger = () => {
  return (
    <div className="khatavni-master-container w100 h1">
      <div className="khmaster-outer-div w100 h1">
        <span className="heading">Khatavni Master</span>
        <div className="kh-inside-div w100 h40 d-flex ">
          <div className="kh-first-div  d-flex-col h70 sa w70 bg ">
            <div className="khnumber-span-div w100  d-flex ">
              <div className="khnumber-div w40 d-flex-col">
                <span className=" w50 label-text">GL-Number:</span>
                <input className="data w60" type="text" />
              </div>
              <div className="div-user-define w30 d-flex center">
                <input className="w20" type="checkbox" />
                <span className="label-text w80">User Define </span>
              </div>
              <div className="main-khtavni-number  w100 d-flex ">
                <div className="gl-number w50 d-flex-col center ">
                  <span className=" w50 label-text">MGlNumber:</span>
                  <input className="data w70" type="text" />
                </div>
                <div className="div-drop w60 d-flex-col center my10">
                  <select className="data w60" name="drop" id="1">
                    <option value="option1"></option>
                  </select>
                </div>
              </div>
            </div>
            <div className="gl-name-eng-marathi-div d-flex w100 ">
              <div className="kh-name-div w50 d-flex-col">
                <span className=" w30 label-text ">Gl Name:</span>
                <input className="data w80" type="text" placeholder=" मराठी " />
              </div>
              <div className="uniocode-div w50 d-flex-col ">
                <span className="w30 label-text">Gl Name:</span>
                <input
                  className="data w80"
                  type="text"
                  placeholder=" English "
                />
              </div>
            </div>
            <div className="Gl-and-bank-div w100 d-flex  bg ">
              <div className="gl-type  d-flex w40 d-flex-col ">
                <span className="label-text">GL_Type</span>
                <div className="dropdown-gltype-section w100">
                  <select className="data w80" name="gl-type" id="21">
                    <option value="gl-type label-text">
                      Sub Account Activate
                    </option>
                    <option value="gl-type label-text">
                      Sub Account not Activate
                    </option>
                  </select>
                </div>
              </div>
              <div className="check-bank-div d-flex-col w40">
                <span className="label-text"> Dairy Bank check </span>
                <div className="Milk-sealing-div d-flex w100 ">
                  <select className="w100 data" name="1" id="e">
                    <option value="f">N/A</option>
                    <option value="f">Milk Saling</option>
                    <option value="f">Dairy Milk Saling Check</option>
                  </select>
                  <div className="singal-dropdown d-flex w50">
                    <select className=" w100 data" name="1" id="11">
                      <option value="we"></option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="khh-second-div w30 h50 bg ">
            <div className="gl-side-Accound-id w100 d-flex-col">
              <span className="label-text">GL- SIDE:</span>
              <div className="div-GlSide-div w100 sa d-flex ">
                <select className="data  w90" name="gltypr" id="1">
                  <option value="">Shtaver</option>
                  <option value="">Deni</option>
                  <option value="">Income</option>
                  <option value="">Expence</option>
                </select>
              </div>
              <span className="label-text">Accound-Id</span>
              <div className="div-GlSide-div d-flex w100 my10 sa">
                <select className="data w90" name="Accound id" id="1">
                  <option value="AQcc">Other</option>
                  <option value="AQcc">Purches</option>
                  <option value="AQcc"> Saling</option>
                  <option value="AQcc"> Shares</option>
                </select>
              </div>
            </div>
            <div className="bank-new-customer-div w100 d-flex-col">
              <div className="Bank-Multistate-div d-flex-col sb w100 ">
                <span className="label-text">Bank Multistate</span>
                <div className="span-bank d-flex w100 sa">
                  <select className="data w90" name="Bank" id="1">
                    <option value="BAnk"> Bank </option>
                    <option value="BAnk"> Multistate </option>
                  </select>
                </div>
              </div>
              <span className="label-text one-man">New -Customer:</span>
              <div className="div-GlSide-div d-flex w100 sa my10">
                <select className="data w90" name="Accound id" id="1">
                  <option value="AQcc">Manufacturer</option>
                  <option value="AQcc">Supplyer</option>
                  <option value="AQcc">Dairy</option>
                  <option value="AQcc"> Employee</option>
                  <option value="AQcc">Other</option>
                </select>
              </div>
            </div>

            <div className="Bank-Multistate-div d-flex-col sb w100 bg ">
              <div className="span-bank d-flex w90 sa ">
                <span className="w60 label-text">Sms Voucher Sms</span>
                <select className="data w40" name="vovucher" id="1">
                  <option value="Yes">Yes</option>
                  <option value="No"> No</option>
                </select>
              </div>
            </div>
            <div className="Bank-Multistate-div d-flex-col sb w100 ">
              <span className="label-text">Deparmernt wise Profit Loss</span>
              <div className="span-bank d-flex w90 sa ">
                <span className="w60 label-text">Section:</span>
                <select className="data w40" name="vovucher" id="1">
                  <option value="Yes">Yes</option>
                  <option value="No"> No</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="buttons-divv d-flex w70 h15 bg ">
          <div className="inside-buttons-div d-flex w100 h10 sa">
            <button className="btn">SAVE </button>
            <button className="btn">UPDATE </button>
            <button className="btn">DELETE </button>
            <button className="btn"> CLEAR </button>
            <button className="btn">CLOSE </button>{" "}
            <button className="btn ">Bs Check</button>
          </div>
        </div>
        <div className="tables-section-continer w100  br h30 d-flex-col bg ">
          <div className="tables-heading-div d-flex w100 h10">
            <span className="w20">Ledger No</span>
            <span className="w20">Ledger Name</span>
            <span className="w20">Income-Expencive</span>
            <span className="w20">Active-Deactive</span>
            <span className="w20">Income-Expencive</span>
            <span className="w20">Group</span>
            <span className="w20">Group Code</span>
          </div>
          <div className="table-data-section-in-subledger w100 sa d-flex h90 mh90 hidescrollbar">
            <div className="tables-data-section-div w100 h10 sa d-flex">
              <span className="w20">01</span>
              <span className="w20">Ledger Name</span>
              <span className="w20">Income-Expencive</span>
              <span className="w20">Active-Deactive</span>
              <span className="w20">Income-Expencive</span>
              <span className="w20">Group</span>
              <span className="w20">Group Code</span>
            </div>
          </div>
        </div>

        <div className="ending-side-span-inputt w100 h10 d-flex bg">
          <div className=" serach-group-div d-flex  h20 w40">
            <span className="w40 label-text">Search Group:</span>
            <select className="data w20" name="1" id="01">
              <option value=""></option>
              <option value=""></option>
            </select>
          </div>
          <div className=" serach-group-div d-flex h30 w40">
            <span className="w40 label-text">Search:</span>
            <select className="data w20" name="1" id="01">
              <option value=""></option>
              <option value=""></option>
            </select>
          </div>
          <div className="buttons-div-section w30 h10">
            <button className="btn">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubLedger;
