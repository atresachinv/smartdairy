import React from "react";
import { BsGearFill } from "react-icons/bs";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkColleform = ({ switchToSettings }) => {
  const [values, setValues] = useState({
    dairyname: "",
    user_name: "",
    user_phone: "",
    user_city: "",
    user_pincode: "",
    user_password: "",
    confirm_password: "",
    terms: false,
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };



  return (
    <>
      <form className="milk-col-form w100 h1 d-flex-col bg p10">
        <div className="setting-btn-switch w100 h10 d-flex a-center sb">
          <span className="heading "> User Details : </span>
          <buttton onClick={switchToSettings}>
            <BsGearFill className="color-icon mx10" />
          </buttton>
        </div>
        <div className="user-details w100 h20 d-flex ">
          <div className="form-div">
            <label htmlFor="" className="info-text">
              Enter User Code
            </label>
            <input
              className="form-inputs"
              type="number"
              required
              placeholder="0000"
              name="code"
              onChange={handleInputs}
            />
          </div>
          <div className="form-div h10">
            <label htmlFor="" className="info-text">
              Enter User Name
            </label>
            <input
              className="form-inputs"
              type="text"
              required
              placeholder="smartdairy user"
              name="username"
              onChange={handleInputs}
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex-col">
          <span className="heading">Milk Details : </span>
          <div className="milk-details w100 h90 d-flex">
            <div className="milk-info w50 h1 ">
              <div className="form-div">
                <label htmlFor="" className="info-text">
                  Litters
                </label>
                <input
                  className="form-inputs"
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="liter"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="info-text">
                  FAT-1
                </label>
                <input
                  className="form-inputs"
                  type="decimalr"
                  required
                  placeholder="0.0"
                  name="fat"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="info-text">
                  SNF-1
                </label>
                <input
                  className="form-inputs"
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="snf"
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="milk-info w50 h1 d-flex-col">
              <div className="form-div">
                <label htmlFor="" className="info-text">
                  Degree
                </label>
                <input
                  className="form-inputs"
                  type="decimal"
                  required
                  disabled
                  placeholder="00.0"
                  name="degree"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="info-text">
                  Rate
                </label>
                <input
                  className="form-inputs"
                  type="decimal"
                  required
                  disabled
                  placeholder="00.0"
                  name="rate"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div">
                <label htmlFor="" className="info-text">
                  Ammount
                </label>
                <input
                  className="form-inputs"
                  type="decimal"
                  required
                  disabled
                  placeholder="00.0"
                  name="amt"
                  onChange={handleInputs}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-btns w100 h10 d-flex a-center j-end">
          <button className="w-btn f-btn mx10" type="reset">
            List
          </button>
          <button className="w-btn f-btn" type="reset">
            Cancel
          </button>
          <button className="w-btn f-btn mx10" type="submit">
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default MilkColleform;
