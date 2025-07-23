import { useState } from "react";
import Dashnavlinks from "./Dashnavlinks";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Inventory from "../Inventory/Inventory";
import LossGainInfo from "./DashboardTabs/LossGainInfo";

const Maindashboard = () => {
  const [isselected, setIsSelected] = useState(0);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <Dashnavlinks isselected={isselected} setIsSelected={setIsSelected} />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        <Routes>
          <Route
            path="milk-dashboard"
            element={<Dashboard setIsSelected={setIsSelected} />}
          />
          <Route
            path="invertory-dashboard"
            element={<Inventory setIsSelected={setIsSelected} />}
          />
          <Route
            path="loss-gain"
            element={<LossGainInfo setIsSelected={setIsSelected} />}
          />
          <Route
            path="*"
            element={<Dashboard setIsSelected={setIsSelected} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Maindashboard;
