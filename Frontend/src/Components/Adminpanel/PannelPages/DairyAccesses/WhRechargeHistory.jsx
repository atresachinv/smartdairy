import { useEffect, useState } from "react";
import axiosInstance from "../../../../App/axiosInstance";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCenterList } from "../../../../App/Features/Admin/SuperAdmin/accessSlice";

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
    <div className="d-flex-col w100 h1">
      <div className="w100 d-flex sb">
        <span className="heading">Whatsapp Recharge History</span>
        <NavLink to="/adminpanel/whatsapp-sms/add" className="w-btn">
          Recharge
        </NavLink>
      </div>
      <div className="w100 d-flex j-center my10">
        <table>
          <thead>
            <tr>
              <th>SrNo</th>
              <th>Date</th>
              <th>Center Name</th>
              <th>Recharge Amount</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <div className="d-flex j-center a-center">Loading...</div>
            ) : rechargeHistory.length > 0 ? (
              rechargeHistory.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{formatDate(item.bal_date)}</td>
                  <td>
                    {centerList &&
                      centerList.find(
                        (center) =>
                          center.orgid === item.dairy_id &&
                          center.center_id === item.center_id
                      )?.center_name}
                  </td>
                  <td>{item.balance}</td>
                  <td>{item.createdby}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WhRechargeHistory;
