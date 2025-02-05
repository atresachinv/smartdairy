import React, { useEffect, useState } from "react";
import DealersNavlinks from "./DealersNavlinks";
import DealersNavViews from "./DealersNavViews";
import DealersList from "./DealersList";
import CreateDealers from "./CreateDealers";
import { Route, Routes } from "react-router-dom";

const Dealers = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedDealersIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedDealersIndex", isselected);
  }, [isselected]);

  return (
    <>
      <div className="customer-master-container w100 h1 d-flex-col">
        <div className="customer-master-navigation w100 h10 d-flex bg3">
          <DealersNavlinks
            isselected={isselected}
            setIsSelected={setIsSelected}
          />
        </div>
        <div className="customer-views w100 h90 d-flex center">
          {/* <DealersNavViews index={isselected} /> */}
          <Routes>
            <Route path="list" element={<DealersList />} />
            <Route path="add-dealer" element={<CreateDealers />} />
            <Route path="*" element={<DealersList />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Dealers;
