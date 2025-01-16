import React from "react";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";

const MilkCorrection = () => {
  return (
    <div className="milk-correction-container w100 h1 d-flex-col ">
      <span className="heading p10">Milk Correction</span>
      <div className="milk-collection-date-fillter-container w100 h20 d-flex sa">
        <div className="form-customer-details-container w60 h1 d-flex-col sb">
          <form
            action=""
            className="form-date-container w100 h50 d-flex a-center sb">
            <span className="label-text">Select Dates : </span>
            <input className="data " type="date" name="" id="" />
            <span className="label-text">TO : </span>{" "}
            <input className="data " type="date" name="" id="" />
            <button className="w-btn" type="submit">
              Show
            </button>
          </form>
          <div className="customer-details-container w100 h50 d-flex a-center">
            <div className="btn-code-container w30 h1 d-flex a-center sa">
              <button className="btn ">
                <BsChevronDoubleLeft className="icon " />
              </button>
              <input
                className="data w30 t-center"
                type="text"
                name=""
                id=""
                placeholder="0"
              />
              <button className="btn">
                <BsChevronDoubleRight className="icon" />
              </button>
            </div>
            <input
              className="data w50"
              type="text"
              name=""
              id=""
              placeholder="Customer Name"
            />
          </div>
        </div>
        <div className="data-fillter-container w30 h1 d-flex-col">
          <div className="fillter-selection-container w100 h25 d-flex a-center sb">
            <input className="data w10 h70" type="checkbox" name="" id="" />
            <span className="info-text w80">Misplaced Milk Collection</span>
          </div>
          <div className="fillter-selection-container w100 h25 d-flex a-center sb">
            <input className="data w10 h70" type="checkbox" name="" id="" />
            <span className="info-text w80">
              Misplaced Milk To Inactive Customer
            </span>
          </div>
        </div>
      </div>
      <div className="milk-collection-data-container w100 h80 d-flex sa">
        <div className="morning-milk-collection-data w40 h1 mh100 hidescrollbar d-flex-col bg">
          <div className="collection-heading-container w100 h10 d-flex a-center bg1 sticky-top sa">
            <span className="f-info-text">Edit</span>
            <span className="f-info-text">Date</span>
            <span className="f-info-text">Liters</span>
            <span className="f-info-text">Fat</span>
            <span className="f-info-text">Deg</span>
            <span className="f-info-text">Snf</span>
            <span className="f-info-text">Rate</span>
            <span className="f-info-text">Amount</span>
          </div>
          <div className="collection-heading-container w100 h10 d-flex a-center sa">
            <span className="info-text">Edit</span>
            <span className="info-text">Date</span>
            <span className="info-text">Liters</span>
            <span className="info-text">Fat</span>
            <span className="info-text">Deg</span>
            <span className="info-text">Snf</span>
            <span className="info-text">Rate</span>
            <span className="info-text">Amount</span>
          </div>
        </div>
        <div className="evening-milk-collection-data w40 h1 mh100 hidescrollbar d-flex-col bg">
          <div className="collection-heading-container w100 h10 d-flex a-center bg1 sticky-top  sa">
            <span className="f-info-text">Edit</span>
            <span className="f-info-text">Date</span>
            <span className="f-info-text">Liters</span>
            <span className="f-info-text">Fat</span>
            <span className="f-info-text">Deg</span>
            <span className="f-info-text">Snf</span>
            <span className="f-info-text">Rate</span>
            <span className="f-info-text">Amount</span>
          </div>
          <div className="collection-heading-container w100 h10 d-flex a-center sa">
            <span className="info-text">Edit</span>
            <span className="info-text">Date</span>
            <span className="info-text">Liters</span>
            <span className="info-text">Fat</span>
            <span className="info-text">Deg</span>
            <span className="info-text">Snf</span>
            <span className="info-text">Rate</span>
            <span className="info-text">Amount</span>
          </div>
        </div>
        <div className="action-btn-container w10 h1 d-flex-col">
          <button className="btn">Transfer To Morning</button>
          <button className="btn my10">Transfer To Evening</button>
          <button className="danger-btn">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default MilkCorrection;
