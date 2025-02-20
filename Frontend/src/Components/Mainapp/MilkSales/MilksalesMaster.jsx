/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MilksalesNavlinks from "./MilksalesNavlinks";
import Milksales from "../Apphome/Appnavviews/MilksalesPages/Milksales";
import MilksalesReport from "../Apphome/Appnavviews/MilksalesPages/MilksalesReport";
import CreateSangh from "./SanghsalesPages/CreateSangh";
import SanghReport from "./SanghsalesPages/SanghReport";
import Sanghsales from "./SanghsalesPages/Sanghsales";
import SanghsalesMaster from "./SanghsalesPages/SanghsalesMaster";
import MilkretailMaster from "../Apphome/Appnavviews/MilksalesPages/MilkretailMaster";

const MilksalesMaster = () => {
  const dispatch = useDispatch();
  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedsaleNavIndex")) || 0
  );

  // Update localStorage whenever isselected changes ------------------------------------>
  useEffect(() => {
    localStorage.setItem("selectedsaleNavIndex", isselected);
  }, [isselected]);

  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center">
        <MilksalesNavlinks
          isselected={isselected}
          setIsSelected={setIsselected}
        />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center p10">
        {/* <AppNavviews index={isselected} /> */}
        <Routes>
          <Route path="retail" element={<MilkretailMaster />} />
          <Route path="sangha" element={<SanghsalesMaster />} />
          <Route path="*" element={<MilkretailMaster />} />
        </Routes>
      </div>
    </div>
  );
};

export default MilksalesMaster;
