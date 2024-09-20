import React, { useEffect } from "react";
import "../../../Styles/Customer/CustNavViews/CustProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { getProfileInfo } from "../../../App/Features/Customers/Profile/profileSlice";
import {
  selectProfileError,
  selectProfileInfo,
  selectProfileStatus,
} from "../../../App/Features/Customers/Profile/ProfileSelector";
import Spinner from "../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";

const CustProfile = () => {
  const { t } = useTranslation();

  //  const handleLanguageChange = (lng) => {
  //    i18n.changeLanguage(lng); // Change language
  //  };

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
    srno,
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
      <div className="profile-title-div w100 h10 d-flex p10">
        <h2 className="f-heading mx10">{t("pp-title")}</h2>
      </div>
      <div className="user-info-container w70 mx-15 h90 d-flex-col p10">
        <div className="user-details p10">
          <h2 className="label-text">
            {t("p-code")} :
            <span className="info-text px10">{srno || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-name")} :
            <span className="info-text px10">{cname || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-backname")} :
            <span className="info-text px10">{cust_bankname || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-bank-acno")} :
            <span className="info-text px10">{cust_accno || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-bank-ifsc")} :
            <span className="info-text px10">{cust_ifsc || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-farmer-id")} :
            <span className="info-text px10">{farmerId || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-mobile")} :
            <span className="info-text px10">{mobileNumber || "N/A"}</span>
          </h2>
          <h2 className="label-text">
            {t("p-adhhar-no")} :
            <span className="info-text px10">{adhaarNumber || "N/A"}</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default CustProfile;
