import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AddDeliveryStock from "./AddDeliveryStock";
import ReturnListDeliveryStock from "./ReturnListDeliveryStock";
import ListDeliveryStock from "./ListDeliveryStock";
import DeliveryReturns from "./DeliveryReturns";
import DeliveryStockLinks from "./DeliveryStockLinks";
import "../../../../../../Styles/Mainapp/Inventory/InventoryPages/Stock.css";

const DeliveryStockMaster = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);
  const [isselected, setIsSelected] = useState("list");

  return (
    <div className="stock-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center nav-bg">
        <DeliveryStockLinks
          isselected={isselected}
          setIsSelected={setIsSelected}
          userRole={userRole}
        />
      </div>
      <div className="stock-nav-views w100 h90 d-flex center p10">
        <Routes>
          <Route path="list/add-stock" element={<AddDeliveryStock />} />
          <Route path="list" element={<ListDeliveryStock />} />
          <Route path="return-list/add-new" element={<DeliveryReturns />} />
          <Route path="return-list" element={<ReturnListDeliveryStock />} />
          <Route path="*" element={<ListDeliveryStock />} />
        </Routes>
      </div>
    </div>
  );
};

export default DeliveryStockMaster;
