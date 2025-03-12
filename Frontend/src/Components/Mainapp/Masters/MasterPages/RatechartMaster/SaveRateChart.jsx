import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchMaxRcCode,
  listRateCharts,
  listRcType,
  saveRateChart,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import Spinner from "../../../../Home/Spinner/Spinner";

const SaveRateChart = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const status = useSelector((state) => state.ratechart.savercstatus);
  const maxRcCode = useSelector((state) => state.ratechart.maxRcCode);
  const ratechart = useSelector((state) => state.ratechart.excelRatechart);
  const rcTypes = useSelector((state) => state.ratechart.RCTypeList);
  const rcStatus = useSelector((state) => state.ratechart.RCTliststatus);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    rccode: "",
    rctype: "",
    rcdate: "",
  });

  useEffect(() => {
    dispatch(listRcType());
  }, [dispatch]);

  // Update rccode when maxRcCode changes
  useEffect(() => {
    if (maxRcCode) {
      setFormData((prevData) => ({ ...prevData, rccode: maxRcCode }));
    }
  }, [maxRcCode]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "rccode":
        if (!/^\d$/.test(value.toString())) {
          errors[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;
      case "rcdate":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          errors[name] = `Invalid value of ${name}`;
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["rccode", "rcdate"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ratechart) {
      toast.error("Ratechart not Available!");
      return;
    }

    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(
      saveRateChart({
        rccode: parseInt(formData.rccode, 10),
        rctype: formData.rctype,
        rcdate: formData.rcdate,
        ratechart,
      })
    ).unwrap(); 
    // Show success message
    if (result.status === 200) {
      toast.success(result.message);

      // Fetch updated data
      dispatch(fetchMaxRcCode());
      dispatch(listRateCharts());

      // Reset form
      setFormData({
        rccode: maxRcCode,
        rctype: "",
        time: "",
        animalType: "",
        rcdate: "",
      });
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
      <form
        className="rate-chart-setting-div w100 h1 d-flex-col sa my10"
        onSubmit={handleSubmit}
      >
        <span className="heading">Save Selected Ratechart</span>
        {status === "loading" ? (
          <div className="loading-ToastContainer w100 h25 d-flex center">
            <Spinner />
          </div>
        ) : (
          <div className="save-ratechart-contaner w100 h60 d-flex-col">
            <div className="select-time-animal-type w100 h30 d-flex sb">
              <div className="select-time w25 h1 a-center d-flex ">
                <label htmlFor="rccode" className="info-text w100">
                  No :
                </label>
                <input
                  className="data w100 t-center"
                  type="number"
                  name="rccode"
                  id="rccode"
                  value={formData.rccode}
                  onChange={handleInput}
                  readOnly
                />
              </div>
              <div className="select-animal-type w70 h1 a-center d-flex">
                <label htmlFor="rctype" className="info-text w30">
                  Type :
                </label>
                <select
                  id="rctype"
                  className={`data w100`}
                  name="rctype"
                  onChange={handleInput}
                >
                  <option value="">-- Select Type --</option>
                  {rcStatus === "loading" ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      {rcTypes.length > 0 ? (
                        rcTypes.map((types) => (
                          <option key={types.id} value={types.rctypename}>
                            {types.rctypename}
                          </option>
                        ))
                      ) : (
                        <option value="">No types available!</option>
                      )}
                    </>
                  )}
                </select>
              </div>
            </div>
            <div className="select-time-animal-type w100 my10 d-flex a-center sb">
              <label htmlFor="rcdate" className="info-text w50">
                Ratechart date :{" "}
              </label>
              <input
                className={`data w40 ${errors.rcdate ? "input-error" : ""}`}
                type="date"
                name="rcdate"
                id="rcdate"
                max={tDate}
                value={formData.rcdate}
                onChange={handleInput}
              />
            </div>
          </div>
        )}
        <div className="button-div w100 h20 d-flex j-end">
          <button
            type="submit"
            className="btn mx10"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Saving..." : "Save Ratechart"}
          </button>
        </div>
      </form>
    </>
  );
};

export default SaveRateChart;
