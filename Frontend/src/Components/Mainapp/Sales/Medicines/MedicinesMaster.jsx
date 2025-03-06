// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import CattleFeedNavlinks from "./MedicinesNavlinks";
import { Route, Routes } from "react-router-dom";
import CattleSaleList from "./MedicinesSaleList";
import CreateCattleFeed from "./CreateMedicines";

const MedicinesMaster = () => {
  const [isselected, setIsSelected] = useState(0);

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
          <Route path="sale/list" element={<CattleSaleList />} />
          <Route path="add/sale" element={<CreateCattleFeed />} />
          <Route path="*" element={<CattleSaleList />} />
        </Routes>
      </div>
    </div>
  );
};

export default MedicinesMaster;
