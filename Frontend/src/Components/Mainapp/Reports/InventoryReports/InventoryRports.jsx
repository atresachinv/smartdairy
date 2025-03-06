import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Purchesreportr from "./IRreportpages/Purchesreportr";
import InventoryNavlinks from "./InventoryNavlinks";
import SalesReport from "./IRreportpages/SalesReport";
import Stocksreport from "./IRreportpages/Stocksreport";

const InventoryRports = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("MilkCollTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("MilkCollTabIndex", isselected);
  }, [isselected]);
  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center">
        <InventoryNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center p10">
        {/* <AppNavviews index={isselected} /> */}
        <Routes>
          <Route path="purchase/reports" element={<Purchesreportr />} />
          <Route path="sales/reports" element={<SalesReport />} />
          <Route path="stocks/reports" element={<Stocksreport/>} />
          <Route path="*" element={<Purchesreportr />} />
        </Routes>
      </div>
    </div>
  );
};

export default InventoryRports;
