import React from "react";

const MilkCopyPaste = () => {
  return (
    <form className="shift-wise-milk-transfer-container w100 h1 d-flex-col a-center ">
      <span className="heading p10">Copy And Transfer Milk Collection</span>
      <div className="milk-date-transfer-container w50 h90 d-flex-col sa bg p10">
        <span className="sub-heading t-center">Copy From</span>
        <div className="transfer-dates-container w100 h40 d-flex-col sa bg3 br6 p10">
          <input type="date" className="data w45" id="" />
          <div className="customer-codes-container w100  d-flex  a-center sb">
            <span className="w20 label-text px10">Time</span>
            <input className="w20 h1" type="radio" name="time" id="all" />
            <span className="info-text px10">All</span>
            <input className="w20 h1" type="radio" name="time" id="mrg" />
            <span className="info-text px10">Morning</span>
            <input className="w20 h1" type="radio" name="time" id="eve" />
            <span className="info-text px10">Evening</span>
          </div>
        </div>
        <span className="sub-heading t-center">Copy To</span>
        <div className="transfer-dates-container w100 h40 d-flex-col sa bg3 br6 p10">
          <input type="date" className="data w45" id="" />
          <div className="customer-codes-container w100  d-flex  a-center sb">
            <span className="label-text">Code</span>
            <span className="label-text px10">From</span>
            <input className="data w20" type="number" name="" id="" />
            <span className="label-text">TO</span>
            <input className="data w20" type="number" name="" id="" />
          </div>
          <div className="customer-codes-container w100  d-flex  a-center sb">
            <span className="w20 label-text px10">Time</span>
            <input className="w20 h1" type="radio" name="time" id="all" />
            <span className="info-text px10">All</span>
            <input className="w20 h1" type="radio" name="time" id="mrg" />
            <span className="info-text px10">Morning</span>
            <input className="w20 h1" type="radio" name="time" id="eve" />
            <span className="info-text px10">Evening</span>
          </div>
        </div>
        <div className="btn-container w100 h10 d-flex j-end">
          <button type="button" className="w-btn m10">
            Cancel
          </button>
          <button type="submit" className="w-btn m10">
            Transfer
          </button>
        </div>
      </div>
    </form>
  );
};

export default MilkCopyPaste;
