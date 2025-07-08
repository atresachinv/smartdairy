import { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCenterList } from "../../../../App/Features/Admin/SuperAdmin/accessSlice";
import "../../../../Styles/AdminPannel/WhatsapSms.css";

const WhRechargeHistory = () => {
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const centerList = useSelector((state) => state.access.centerList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCenterList());
  }, [dispatch]);

  useEffect(() => {
    setLoading(true);
    try {
      axiosInstance.get("/admin-whsms-recharge").then((res) => {
        setRechargeHistory(res.data?.data || []);
        setLoading(false);
      });
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  return (
    <div className="whatsapp-recharge-history-container w100 h1 d-flex-col">
      <div className="page-title-container w100 d-flex a-center sb">
        <span className="heading">Whatsapp Recharge History</span>
        <NavLink to="/adminpanel/whatsapp-sms/add" className="w30 btn d-none">
          Recharge
        </NavLink>
      </div>
      <div className="recharge-history-table-container w100 h90 mh90 hidescrollbar d-flex-col j-center my10 bg">
        <div className="whatsapp-rechager-history-table-headings w100 p10 d-flex a-center t-center sb sticky-top bg7">
          <span className="f-label-text w5">SrNo</span>
          <span className="f-label-text w15">Date</span>
          <span className="f-label-text w60">Center Name</span>
          <span className="f-label-text w10">Re. Amt</span>
          <span className="f-label-text w10">Re. By</span>
        </div>
        {loading ? (
          <div className="d-flex j-center a-center">Loading...</div>
        ) : rechargeHistory.length > 0 ? (
          rechargeHistory.map((item, index) => (
            <div
              className="recharge-history-table-data-container w100 p10 d-flex sb"
              key={index}
              style={{ backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff" }}
            >
              <span className="info-text w5 t-center">{index + 1}</span>
              <span className="info-text w15">
                {item.bal_date?.slice(0, 10)}
              </span>
              <span className="info-text w60" style={{ textAlign: "left" }}>
                {centerList &&
                  centerList.find(
                    (center) =>
                      center.orgid === item.dairy_id &&
                      center.center_id === item.center_id
                  )?.center_name}
              </span>
              <span className="info-text w10 t-end">{item.balance}</span>
              <span className="info-text w10 t-end">{item.createdby}</span>
            </div>
          ))
        ) : (
          <div className="box d-flex center">
            <span className="label-text">No data available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhRechargeHistory;
