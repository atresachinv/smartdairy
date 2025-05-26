import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDairyList } from "../../../../App/Features/Admin/SuperAdmin/accessSlice";

const DairyList = () => {
  const dispatch = useDispatch();
  const { dairyList } = useSelector((state) => state.access);
  useEffect(() => {
    dispatch(getDairyList());
  }, [dispatch]);
  return (
    <div className="dairy-activation-list-container w100 h1 d-flex-col ">
      <span className="heading py10">Dairy Activate / Deactivate</span>

      <div className="dairy-list-container w100 h90 d-flex-col mh90 hidescrollbar bg">
        <div className="dairy-info-heading-container w100 p10 d-flex a-center sb sticky-top bg7 br9">
          <span className="f-label-text w5">Code</span>
          <span className="f-label-text w30">Name</span>
          <span className="f-label-text w15">Contact</span>
          <span className="f-label-text w10">Created On</span>
          <span className="f-label-text w10">Last Act.</span>
          <span className="f-label-text w10">AMC</span>
          <span className="f-label-text w10">Activate</span>
        </div>

        {dairyList.length > 0 ? (
          dairyList.map((item, index) => (
            <div
              key={index}
              className="dairy-info-container w100 p10 d-flex a-center sb"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="text w5 t-center">{item.SocietyCode}</span>
              <span className="text w30">{item.SocietyName}</span>
              <span className="text w15">{item.PhoneNo}</span>
              <span className="text w10">
                {item.startdate.slice(0, 10) || "-"}
              </span>
              <span className="text w10 t-center">
                {item.act_date || "N/A"}
              </span>
              <span className="text w10">{item.amc || "00"}</span>
              <span className="text w10 t-center">
                <input type="checkbox" name="" id="" />
              </span>
            </div>
          ))
        ) : (
          <div className="no-data-container w100 h100 d-flex center">
            No Data Found
          </div>
        )}
      </div>
    </div>
  );
};

export default DairyList;
