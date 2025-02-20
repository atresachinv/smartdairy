import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import StocksNavlinks from "./StocksNavlinks";
import ExpiredProducts from "./ExpiredProducts";
import UpdateSaleRate from "./SellRate/UpdateSaleRate";
import "../../../../../Styles/Mainapp/Inventory/InventoryPages/Stock.css";
import CreateStock from "./StartingStock/CreateStock";
import StockList from "./StartingStock/StockList";
import ListDeliveryStock from "./DeliveryStock/ListDeliveryStock";
import AddDeliveryStock from "./DeliveryStock/AddDeliveryStock";
import AddDeliveryReturns from "./DeliveryStock/AddDeliveryReturns";

const Stocks = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("productReturns")) || 0
  );
  useEffect(() => {
    localStorage.setItem("productReturns", isselected);
  }, [isselected]);
  return (
    <div className="stock-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center nav-bg">
        <StocksNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
          userRole={userRole}
        />
      </div>
      <div className="stock-nav-views w100 h90 d-flex center p10">
        <Routes>
          <Route path="add-stock" element={<CreateStock />} />
          <Route path="list" element={<StockList />} />
          <Route path="expired/product" element={<ExpiredProducts />} />
          <Route path="update/sale/rate" element={<UpdateSaleRate />} />
          <Route path="delivery/add-stock" element={<AddDeliveryStock />} />
          <Route path="delivery/list" element={<ListDeliveryStock />} />
          <Route path="delivery/returns" element={<AddDeliveryReturns />} />
          <Route path="*" element={<CreateStock />} />
        </Routes>
      </div>
    </div>
  );
};

export default Stocks;
