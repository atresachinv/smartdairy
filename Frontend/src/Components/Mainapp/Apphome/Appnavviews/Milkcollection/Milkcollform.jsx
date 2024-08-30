import React from "react";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkColleform = () => {
  return (
    <>
      <form action="" className="milk-col-form w100 h1 d-flex-col bg p10">
        <div className="user-details w100 h20 d-flex ">
          <div className="form-div">
            <label htmlFor="" className="text">
              Enter User Code
            </label>
            <input
              className="form-inputs"
              type="number"
              required
              placeholder=""
            />
          </div>
          <div className="form-div">
            <label htmlFor="" className="text">
              Enter User Name
            </label>
            <input
              className="form-inputs"
              type="text"
              required
              placeholder=""
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex-col">
          <span className="heading">Milk Details : </span>
          <div className="milk-details w100 h90 d-flex">
            <div className="milk-info w50 h1 ">
              <div className="form-div">
                <label htmlFor="" className="text">
                  Litters
                </label>
                <input
                  className="form-inputs"
                  type="number"
                  required
                  placeholder="00.0"
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="text">
                  FAT-1
                </label>
                <input
                  className="form-inputs"
                  type="number"
                  required
                  placeholder="0.0"
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="text">
                  SNF-1
                </label>
                <input
                  className="form-inputs"
                  type="number"
                  required
                  placeholder="00.0"
                />
              </div>
            </div>
            <div className="milk-info w50 h1 d-flex-col">
              <div className="form-div">
                <label htmlFor="" className="text">
                  Degree
                </label>
                <input
                  className="form-inputs"
                  type="number"
                  required
                  disabled
                  placeholder="00.0"
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="text">
                  Rate
                </label>
                <input
                  className="form-inputs"
                  type="number"
                  required
                  disabled
                  placeholder="00.0"
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="text">
                  Ammount
                </label>
                <input
                  className="form-inputs"
                  type="number"
                  required
                  disabled
                  placeholder="00.0"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button className="form-btn" type="reset">
            Cancel
          </button>
          <button className="form-btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default MilkColleform;
