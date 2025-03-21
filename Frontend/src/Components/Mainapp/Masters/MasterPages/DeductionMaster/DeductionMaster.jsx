import React, { useEffect, useState } from "react";
import DeductionNavlink from "./DeductionNavlink";
import DeductionRateDetails from "./DeductionRateDetails";
import DeductionHead from "./Deductionhead";
import { Route, Routes } from "react-router-dom";

const DeductionMaster = () => {
  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("DeductionNavIndex")) || "deduction/head"
  );

  // Update localStorage whenever isselected changes ------------------------------------>
  useEffect(() => {
    localStorage.setItem("DeductionNavIndex", isselected);
  }, [isselected]);
  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center">
        <DeductionNavlink
          isselected={isselected}
          setIsSelected={setIsselected}
        />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center p10">
        {/* <AppNavviews index={isselected} /> */}
        <Routes>
          <Route path="deduction/head" element={<DeductionHead />} />
          <Route path="deduction/details" element={<DeductionRateDetails />} />
        </Routes>
      </div>
    </div>
  );
};

export default DeductionMaster;
