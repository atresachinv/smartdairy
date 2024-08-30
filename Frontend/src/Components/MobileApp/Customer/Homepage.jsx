import React, { useEffect, useState } from "react";
import { BsPersonCircle, BsEscape, BsArrowLeft } from "react-icons/bs";
import "../../../Styles/MobileApp/Customer/Homepage.css";
import MenuViews from "./MenuViews";

const Homepage = () => {
  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("menusIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("menusIndex", isselected);
  }, [isselected]);

  // Handle back button click to reset the index to 0
  const handleBackButton = () => {
    setIsselected(0); // Set isselected to 0
  };

  useEffect(() => {
    // Function to extract query parameters from the URL
    const extractParams = () => {
      const queryParams = new URLSearchParams(window.location.search);
      const SocietyCode = queryParams.get("SocietyCode");
      const AccCode = queryParams.get("AccCode");
      // const SocietyCode = "34";
      // const AccCode = "1113410";

      if (SocietyCode && AccCode) {
        // Store the parameters in localStorage
        localStorage.setItem("SocietyCode", SocietyCode);
        localStorage.setItem("AccCode", AccCode);
      }
    };
    extractParams();
  }, []);

  return (
    <div className="m-home-menu-container wh100 d-flex-col ">
      <div className="page-navbar-container w100 h10 d-flex sb a-center px10">
        <div className="logo-div w30 d-flex a-center">
          <h2 className="logo-text">SmartDairy</h2>
        </div>
        <div className="userinfo-logout-btn-div w20 d-flex a-center sa">
          <BsPersonCircle className="icons" />
          <BsEscape className="icons" />
        </div>
      </div>
      <div className="menu-view-container w100 h90 d-flex-col p10">
        <div className="w100 h10">
          <BsArrowLeft onClick={handleBackButton} />
        </div>
        <MenuViews setselected={setIsselected} index={isselected} />
      </div>
    </div>
  );
};

export default Homepage;
