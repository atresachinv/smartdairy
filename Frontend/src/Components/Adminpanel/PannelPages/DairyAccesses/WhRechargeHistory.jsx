import { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../Home/Spinner/Spinner";
import { getCenterList } from "../../../../App/Features/Admin/SuperAdmin/accessSlice";
import "../../../../Styles/AdminPannel/AccessControls/WhatsapSms.css";

const WhRechargeHistory = () => {
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const centerList = useSelector((state) => state.access.centerList);
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

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
    <div className="Whatsapp-recharge-history-outer-container d-flex-col w100 h1 sb">
      <div className="page-title-container w100 d-flex sb">
        <span className="heading">Whatsapp Recharge History</span>
        <NavLink to="/adminpanel/whatsapp-sms/add" className="btn d-none">
          Recharge
        </NavLink>
      </div>
      <div className="Whatsapp-recharge-history-container w100 h90 mh90 hidescrollbar bg">
        <div className="whatsapp-hisory-heading-container w100 p10 d-flex a-center sticky-top bg7 sb">
          {/* <span className="f-label-text w10">SrNo</span> */}
          <span className="f-label-text w15">Date</span>
          <span className="f-label-text w60">Center Name</span>
          <span className="f-label-text w10">Re. Amt</span>
          <span className="f-label-text w10">Re. By</span>
        </div>

        {loading ? (
          <div className="d-flex j-center a-center">
            <Spinner />
          </div>
        ) : rechargeHistory.length > 0 ? (
          rechargeHistory.map((item, index) => (
            <div
              className="whatsapp-hisory-data-container w100 p10 d-flex sb"
              key={index}
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              {/* <span className="info-text w10">{index + 1}</span> */}
              <span className="info-text w15">
                {item.bal_date?.slice(0, 10)}
              </span>
              <span className="info-text w60">
                {centerList &&
                  centerList.find(
                    (center) =>
                      center.orgid === item.dairy_id &&
                      center.center_id === item.center_id
                  )?.center_name}
              </span>
              <span className="info-text w10 t-end">{item.balance}</span>
              <span className="info-text w10 t-center">{item.createdby}</span>
            </div>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              No data available
            </td>
          </tr>
        )}
      </div>
    </div>
  );
};

export default WhRechargeHistory;
