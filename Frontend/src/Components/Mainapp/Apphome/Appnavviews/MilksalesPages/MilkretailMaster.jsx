import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MIlkretailNavlinks from "./MIlkretailNavlinks";
import Milksales from "./Milksales";
import MilksalesReport from "./MilksalesReport";
const MilkretailMaster = () => {
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
        <MIlkretailNavlinks
          isselected={isselected}
          setIsSelected={setIsselected}
        />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center p10">
        {/* <AppNavviews index={isselected} /> */}
        <Routes>
          <Route path="sales" element={<Milksales />} />
          <Route path="sales-report" element={<MilksalesReport />} />
          <Route path="*" element={<Milksales />} />
        </Routes>
      </div>
    </div>
  );
};

export default MilkretailMaster;
