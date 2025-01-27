import React from "react";

const DeleteCollection = () => {
  return (
    <form className="delete-milk-collection-container w100 h1 d-flex-col a-center ">
      <span className="heading p10">Delete Milk Collection</span>
      <div className="milk-date-delete-container w50 h50 d-flex-col bg p10">
        {/* <span className="sub-heading t-center">From This Date</span> */}
        <div className="delete-dates-container w100 h80 d-flex-col sa bg3 br6 p10">
          <div className="date-container w100 d-flex a-center sa">
            <span className="label-text">Dates</span>
            <input type="date" className="data w30" id="" />
            <span className="label-text">To</span>
            <input type="date" className="data w30" id="" />
          </div>
          <div className="customer-codes-container w100  d-flex  a-center sa">
            <span className="label-text">Code</span>
            <span className="label-text px10">From</span>
            <input className="data w20" type="number" name="" id="" />
            <span className="label-text">TO</span>
            <input className="data w20" type="number" name="" id="" />
          </div>
          <div className="customer-codes-container w100  d-flex  a-center sa">
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
            Delete
          </button>
        </div>
      </div>
    </form>
  );
};

export default DeleteCollection;
