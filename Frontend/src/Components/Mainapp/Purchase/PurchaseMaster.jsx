import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import PurchaseNavlinks from "./PurchaseNavlinks";
import Createfeed from "./CattleFeed/Create";
import Creategro from "./Grocery/Create";
import Createmedi from "./Medicines/Create";
import Createother from "./Others/Create";
import Listfeed from "./CattleFeed/List";
import Listgro from "./Grocery/List";
import Listmedi from "./Medicines/List";
import Listother from "./Others/List";

const PurchaseMaster = () => {
  const [isselected, setIsSelected] = useState(1);

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedPurchaseMasterIndex", isselected);
  }, [isselected]);

  return (
    <>
      <div className="customer-master-container w100 h1 d-flex-col">
        <div className="customer-master-navigation w100 h10 d-flex bg3">
          <PurchaseNavlinks
            isselected={isselected}
            setIsSelected={setIsSelected}
          />
        </div>
        <div className="customer-views w100 h90 d-flex center">
          <Routes>
            <Route path="cattlefeed/list" element={<Listfeed />} />
            <Route path="cattlefeed/add-new" element={<Createfeed />} />
            <Route path="grocery/list" element={<Listgro />} />
            <Route path="grocery/add-new" element={<Creategro />} />
            <Route path="medicines/list" element={<Listmedi />} />
            <Route path="medicines/add-new" element={<Createmedi />} />
            <Route path="other-products/list" element={<Listother />} />
            <Route path="other-products/add-new" element={<Createother />} />
            <Route path="*" element={<Listfeed />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default PurchaseMaster;
