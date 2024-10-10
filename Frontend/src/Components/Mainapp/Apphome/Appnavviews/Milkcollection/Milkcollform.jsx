import React, { useCallback, useEffect, useState } from "react";
import { BsGearFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustInfo,
  getMilkRate,
} from "../../../../../App/Features/Mainapp/Dairyinfo/milkCollectionSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";

const MilkColleform = ({ switchToSettings }) => {
  const dispatch = useDispatch();

  const custdata = useSelector((state) => state.custinfo.customerInfo);
  const milkRateAmt = useSelector((state) => state.custinfo.milkRate);
  const tDate = useSelector((state) => state.date.toDate);

  const date= tDate
  const [values, setValues] = useState({
    companyid: "",
    DMEId: "",
    date: date ,
    code: "",
    time: "",
    animal: "",
    liters: "",
    fat: "",
    snf: "",
    amt: "",
    degree: "",
    rate: "",
    cname: "",
    rno: "",
  });

  console.log("abc",milkRateAmt);
  

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    if (values.code) {
      dispatch(getCustInfo({ user_code: values.code }));
    }
  }, [values.code]);

  useEffect(() => {
    console.log("clicked getCustInfo");

    if (values.snf) {
      dispatch(
        getCustInfo({
          rcdate: values.date,
          liters: values.liters,
          fat: values.fat,
          snf: values.snf,
        })
      );
    }
  }, [values.snf]);

  // const getRateAmount = (e) => {
  //   dispatch(getMilkRate({ rccode, rcdate, fat, snf, liters }));
  // };

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
          <div className="form-div px10">
            <label htmlFor="" className="info-text">
              Enter User Code
            </label>
            <input
              className="data"
              type="number"
              required
              placeholder="0000"
              name="code"
              onChange={handleInputs}
            />
          </div>
          <div className="form-div px10">
            <label htmlFor="" className="info-text">
              Enter User Name
            </label>
            <input
              className="data"
              type="text"
              required
              placeholder="smartdairy user "
              name="username"
              onChange={handleInputs}
              value={custdata.cname}
            />
          </div>
        </div>
        <div className="milk-details-div w100 h70 d-flex-col">
          <span className="heading">Milk Details : </span>
          <div className="milk-details w100 h90 d-flex">
            <div className="milk-info w50 h1 ">
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Litters
                </label>
                <input
                  className="data"
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="liters"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div  px10">
                <label htmlFor="" className="info-text">
                  FAT-1
                </label>
                <input
                  className="data"
                  type="decimalr"
                  required
                  placeholder="0.0"
                  name="fat"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  SNF-1
                </label>
                <input
                  className="data"
                  type="decimal"
                  required
                  placeholder="00.0"
                  name="snf"
                  onChange={handleInputs}
                />
              </div>
            </div>
            <div className="milk-info w50 h1 d-flex-col">
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Degree
                </label>
                <input
                  className="data"
                  type="decimal"
                  required
                  disabled
                  placeholder="00.0"
                  name="degree"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Rate
                </label>
                <input
                  className="data"
                  type="decimal"
                  required
                  disabled
                  placeholder="00.0"
                  name="rate"
                  onChange={handleInputs}
                />
              </div>
              <div className="form-div px10">
                <label htmlFor="" className="info-text">
                  Ammount
                </label>
                <input
                  className="data"
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
