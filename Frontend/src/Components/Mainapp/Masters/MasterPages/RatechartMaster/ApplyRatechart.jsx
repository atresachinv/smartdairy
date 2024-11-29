import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const ApplyRatechart = () => {
  const tDate = useSelector((state) => state.date.toDate);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    rccode: "",
    rctype: "",
    time: "",
    animalType: "",
    rcdate: "",
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
  };

  return (
    <>
      <form
        className="rate-chart-setting-div w100 h1 d-flex-col sa my10"
        onSubmit={handleSubmit}>
        <span className="heading">Apply Selected Ratechart</span>
        <div className="select-time-animal-type w100 h25 d-flex sb">
          <div className="select-time w100 h1 a-center d-flex a-center sb">
            <label htmlFor="implementationDate" className="info-text w50">
              Rate Chart Implementation Date :
            </label>
            <input
              className="data w35"
              type="date"
              name="rcdate"
              id="implementationDate"
              required
              value={formData.date}
              onChange={handleInput}
              max={tDate}
            />
          </div>
        </div>
        <span className="label-text">Select Customers</span>
        <div className="select-time-animal-type w100 h25 d-flex">
          <div className="select-animal-type w30 h1 a-center d-flex">
            <label htmlFor="time" className="info-text w40">
              From :
            </label>
            <input
              type="number"
              className={`data w60 ${errors.time ? "input-error" : ""}`}
              name="time"
              id="time"
              required
              value={formData.time}
              onChange={handleInput}
            />
          </div>
          <div className="select-animal-type w30 h1 a-center d-flex mx10">
            <label htmlFor="animalType" className="info-text w40">
              To :
            </label>
            <input
              type="number"
              className="data w60 "
              name="animalType"
              id="animalType"
              required
              value={formData.animalType}
              onChange={handleInput}
            />
          </div>
        </div>
        <div className="button-div w100 h25 d-flex j-end">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}>
            Apply Ratechart
          </button>
        </div>
      </form>
    </>
  );
};

export default ApplyRatechart;
