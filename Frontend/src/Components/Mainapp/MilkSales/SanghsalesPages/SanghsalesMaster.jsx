/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SanghsalesNavlinks from "./SanghsalesNavlinks";
import CreateSangh from "./CreateSangh";
import Sanghsales from "./Sanghsales";
import SanghReport from "./SanghReport";

const SanghsalesMaster = () => {
  const dispatch = useDispatch();
  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(0);

  // // Update localStorage whenever isselected changes ------------------------------------>
  // useEffect(() => {
  //   localStorage.setItem("selectedsaleNavIndex", isselected);
  // }, [isselected]);

  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center">
        <SanghsalesNavlinks
          isselected={isselected}
          setIsSelected={setIsselected}
        />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center p10">
        {/* <AppNavviews index={isselected} /> */}
        <Routes>
          <Route path="add/new-sangha" element={<CreateSangh />} />
          <Route path="sangha/sales" element={<Sanghsales />} />
          <Route path="sangha/report" element={<SanghReport />} />
          <Route path="*" element={<CreateSangh />} />
        </Routes>
      </div>
    </div>
  );
};

export default SanghsalesMaster;
