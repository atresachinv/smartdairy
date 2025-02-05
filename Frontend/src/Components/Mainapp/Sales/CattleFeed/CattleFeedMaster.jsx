import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import CattleFeedNavlinks from "./CattleFeedNavlinks";
import CattleFeedNavViews from "./CattleFeedNavViews";
import CattleSaleList from "./CattleSaleList";
import CreateCattleFeed from "./CreateCattleFeed";

const CattleFeedMaster = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedCattleFeedSaleIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedCattleFeedSaleIndex", isselected);
  }, [isselected]);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CattleFeedNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        {/* <CattleFeedNavViews index={isselected} /> */}
        <Routes>
          <Route path="list" element={<CattleSaleList />} />
          <Route path="add/feeds" element={<CreateCattleFeed />} />
          <Route path="*" element={<CattleSaleList />} />
        </Routes>
      </div>
    </div>
  );
};

export default CattleFeedMaster;
