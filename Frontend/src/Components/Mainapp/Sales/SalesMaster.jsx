import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Createfeed from "./CattleFeed/CreateCattleFeed";
import Creategro from "./Grocery/CreateGrocery";
import Createmedi from "./Medicines/CreateMedicines";
import Createother from "./Others/CreateOthers";
import Listfeed from "./CattleFeed/CattleSaleList";
import Listgro from "./Grocery/GrocerySaleList";
import Listmedi from "./Medicines/MedicinesSaleList";
import Listother from "./Others/OthersSaleList";
import SaleMasterNavlink from "./SaleMasterNavlink";

const SalesMaster = () => {
  const [isselected, setIsSelected] = useState(0);

  useEffect(() => {
    localStorage.setItem("selectedSalesMasterIndex", isselected);
  }, [isselected]);

  return (
    <>
      <div className="customer-master-container w100 h1 d-flex-col">
        <div className="customer-master-navigation w100 h10 d-flex bg3">
          <SaleMasterNavlink
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

export default SalesMaster;
