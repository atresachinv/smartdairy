import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import StocksNavlinks from "./StocksNavlinks";
import "../../../../../Styles/Mainapp/Inventory/InventoryPages/Stock.css";
import CreateStock from "./StartingStock/CreateStock";
import StockList from "./StartingStock/StartingStock";
import "./Stock.css";
const Stocks = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);
  const [isselected, setIsSelected] = useState("starting/stock");

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
          <Route path="list" element={<StockList />} />{" "}
          <Route path="*" element={<StockList />} />
        </Routes>
      </div>
    </div>
  );
};

export default Stocks;
