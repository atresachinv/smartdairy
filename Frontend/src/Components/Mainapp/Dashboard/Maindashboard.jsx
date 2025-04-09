import { useState } from "react";
import Dashnavlinks from "./Dashnavlinks";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Inventory from "../Inventory/Inventory";

const Maindashboard = () => {
  const [isselected, setIsSelected] = useState(0);

  return (
    <>
      <div className="customer-master-container w100 h1 d-flex-col">
        <div className="customer-master-navigation w100 h10 d-flex bg3">
          <Dashnavlinks isselected={isselected} setIsSelected={setIsSelected} />
        </div>
        <div className="customer-views w100 h90 d-flex center">
          {/* <DealersNavViews index={isselected} /> */}
          <Routes>
            <Route path="milk-dashboard" element={<Dashboard />} />
            <Route path="invertory-dashboard" element={<Inventory />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

export default Maindashboard;
