import React, { useEffect } from "react";
import { BsPencilSquare } from "react-icons/bs";
import "../../../Styles/Customer/CustNavViews/CustProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../../../App/Features/Customers/Profile/profileSlice";
import {
  selectProfileError,
  selectProfileInfo,
  selectProfileStatus,
} from "../../../App/Features/Customers/Profile/ProfileSelector";
import Spinner from "../../Home/Spinner/Spinner";

const CustProfile = () => {
  const dispatch = useDispatch();
  const profileInfo = useSelector(selectProfileInfo);
  const status = useSelector(selectProfileStatus);
  const error = useSelector(selectProfileError);

  useEffect(() => {
    dispatch(getProfileInfo());
  }, [dispatch]);

  if (status === "loading") {
    return <Spinner />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  // Access the nested data correctly
  const {
    getprofileInfo = {}, // default to an empty object if undefined
  } = profileInfo;

  const {
    code,
    cname,
    cust_bankname,
    cust_accno,
    cust_ifsc,
    farmerId,
    mobileNumber,
    adhaarNumber,
  } = getprofileInfo;

  return (
    <div className="cust-profile-container w100 h1 d-flex-col">
      <div className="menu-title-div w70 mx-15 h10 d-flex p10">
        <h2 className="heading">Customer Profile</h2>
      </div>
      <div className="user-info-container w70 mx-15 h90 d-flex-col p10">
        <div className="buttons-div w100 h10 d-flex a-center sb bg p10">
          <span className="heading">User Details</span>
          <BsPencilSquare />
        </div>
        <div className="user-details bg p10">
          <h2 className="info-txt">
            Code: <span className="heading px10">{code || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Name: <span className="heading px10">{cname || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Bank Name:
            <span className="heading px10">{cust_bankname || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Bank Account Number:
            <span className="heading px10">{cust_accno || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Bank IFSC Code:
            <span className="heading px10">{cust_ifsc || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Farmer Id:
            <span className="heading px10">{farmerId || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Mobile Number:
            <span className="heading px10">{mobileNumber || "N/A"}</span>
          </h2>
          <h2 className="info-txt">
            Adhaar Number:
            <span className="heading px10">{adhaarNumber || "N/A"}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CustProfile;
