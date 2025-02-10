import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ReturnsNavlinks from "./ReturnsNavlinks";
import DealerReturns from "./DealerReturns";
import CustomerReturns from "./CustomerReturns";

const Returns = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("productReturns")) || 0
  );
  useEffect(() => {
    localStorage.setItem("productReturns", isselected);
  }, [isselected]);
  return (
    <div className="product-return-container w100 h1 ">
      <div className="header-nav w100 h10 d-flex a-center nav-bg">
        <ReturnsNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="product-return-nav-views w100 h90 d-flex center p10">
        <Routes>
          <Route path="dealer/returns" element={<DealerReturns />} />
          <Route path="customer/returns" element={<CustomerReturns />} />
        </Routes>
      </div>
    </div>
  );
};

export default Returns;
