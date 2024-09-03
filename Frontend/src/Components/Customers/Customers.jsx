import React, { useEffect, useState } from "react";
import CustNavbar from "./CustNavbar";
import Custnavviews from "./Custnavviews";
import Footer from "../Mainapp/Footer";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";
import { useDispatch } from "react-redux";
import '../../Styles/Customer/Customer.css'

const Customers = () => {
  const dispatch = useDispatch();

  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectednavIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectednavIndex", isselected);
  }, [isselected]);

  // Handle back button click to reset the index to 0
  const handleBackButton = () => {
    setIsselected(0); // Set isselected to 0
  };

  useEffect(() => {
    dispatch(fetchDairyInfo());
  }, []);

  //   // ...............................
  //
  //   const [toDate, setCurrentDate] = useState("");
  //
  //   const getToDate = () => {
  //     const date = new Date();
  //     const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  //     setCurrentDate(formattedDate);
  //   };
  //
  //   const getFromDate = () => {
  //     const day = toDate.slice(8, 10);
  //     const date = toDate.slice(0, 8);
  //     let startday = 0;
  //     if (day <= 10) {
  //       startday = 1;
  //     } else if (day <= 20) {
  //       startday = 11;
  //     } else {
  //       startday = 21;
  //     }
  //     const formDate = date + startday;
  //   };

  return (
    <div className="customer-container w100 h100 d-flex-col">
      <CustNavbar
        handleBackButton={handleBackButton}
        setselected={setIsselected}
      />
      <div className="customer-nav-view-container w100 h90 d-flex">
        <Custnavviews setselected={setIsselected} index={isselected} />
      </div>
      <Footer />
    </div>
  );
};

export default Customers;
