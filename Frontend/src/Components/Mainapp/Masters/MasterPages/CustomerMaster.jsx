import React from 'react'
import Toggle from '../../../AssetsComponents/Toggle';

const CustomerMaster = () => {
  return (
    <div className="create-customer-container w100 h1 d-flex-col">
      <span className="heading p10">Create New Customer :</span>
      <div className="cust-details-setting-div w100 h90 d-flex sa ">
        <div className="customer-details-container w70 h1 d-flex-col bg">
          <span className="sub-heading p10">Customer Details :</span>
          <div className="cust-details-div w100 h15 d-flex sb">
            <div className="details-div w30 d-flex-col a-center px10">
              <span className="label-text w100">Cust No. :</span>
              <input className="data w100" type="number" name="" id="" />
            </div>
            <div className="details-div w30 d-flex a-center px10">
              <input className="data w10" type="checkbox" name="" id="" />
              <span className="label-text w90">According to Requirment </span>
            </div>
            <div className="details-div w30 d-flex a-center px10">
              {/* <input className="data w10" type="checkbox" name="" id="" /> */}
              <Toggle/>
              <span className="label-text w80 px10">Customer Name </span>
            </div>
          </div>
          <div className="cust-details-div w100 h15 d-flex sb">
            <div className="details-div w50 d-flex-col a-center px10">
              <span className="label-text w100">Customer Marathi Name :</span>
              <input className="data w100" type="text" name="" id="" />
            </div>
            <div className="details-div w50 d-flex-col a-center px10">
              <span className="label-text w100">Customer English Name :</span>
              <input className="data w100" type="text" name="" id="" />
            </div>
          </div>
          <div className="cust-details-div w100 h15 d-flex sb">
            <div className="details-div w30 d-flex-col a-center px10">
              <span className="label-text w100 ">Mobile :</span>
              <input className="data w100" type="text" name="" id="" />
            </div>
            <div className="details-div w40 d-flex-col a-center px10">
              <span className="label-text w100">Addhar No. :</span>
              <input className="data w100" type="text" name="" id="" />
            </div>
            <div className="details-div w30 d-flex-col a-center px10">
              <span className="label-text w100">Cast :</span>
              <input className="data w100" type="text" name="" id="" />
              
            </div>
          </div>
          <div className="cust-details-div w100 h15 d-flex-col sb">
            <span className="label-text px10">Address Details :</span>
            <div className="address-details w100 h1 d-flex sb">
              <div className="details-div w30 d-flex a-center px10">
                <span className="label-text w40">City :</span>
                <input className="data w60" type="text" name="" id="" />
              </div>
              <div className="details-div w30 d-flex a-center px10">
                <span className="label-text w40">Tehsil :</span>
                <input className="data w60" type="text" name="" id="" />
              </div>
              <div className="details-div w30 d-flex a-center px10">
                <span className="label-text w40">District :</span>
                <input className="data w60" type="text" name="" id="" />
              </div>
            </div>
          </div>
        </div>
        <div className="cust-data-settings w20 h1 d-flex-col sa p10 bg"></div>
      </div>
    </div>
  );
};



export default CustomerMaster
