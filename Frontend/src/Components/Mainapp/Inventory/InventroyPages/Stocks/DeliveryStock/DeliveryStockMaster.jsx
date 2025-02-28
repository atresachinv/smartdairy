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
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("deliverystock")) || "delivery/add-stock"
  );
  useEffect(() => {
    localStorage.setItem("deliverystock", isselected);
  }, [isselected]);

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
          <Route path="delivery/add-stock" element={<AddDeliveryStock />} />
          <Route path="delivery/list" element={<ListDeliveryStock />} />
          <Route path="delivery/returns" element={<DeliveryReturns />} />
          <Route
            path="delivery/return-list"
            element={<ReturnListDeliveryStock />}
          />
          <Route path="*" element={<AddDeliveryStock />} />
        </Routes>
      </div>
    </div>
  );
};

export default DeliveryStockMaster;
