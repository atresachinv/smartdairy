import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import ReturnsNavlinks from "./ReturnsNavlinks";
import List from "./DealerReturns/List";
import CreateDealer from "./DealerReturns/Create";
import CreateCustomer from "./CustomerReturns/Create";
import CustList from "./CustomerReturns/List";

const Returns = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("productReturns")) || "deal-return-list"
  );
  useEffect(() => {
    localStorage.setItem("productReturns", isselected);
  }, [isselected]);
  return (
    <div className="product-return-container w100 h1 ">
      <div className="header-nav w100 h10 d-flex a-center nav-bg">
        <ReturnsNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="product-return-nav-views w100 h90 d-flex center p10">
        <Routes>
          <Route
            path="deal-return-list/add-deal-return"
            element={<CreateDealer />}
          />
          <Route
            path="cust-return-list/add-cust-return"
            element={<CreateCustomer />}
          />
          <Route path="deal-return-list" element={<List />} />
          <Route path="/" element={<List />} />
          <Route path="cust-return-list" element={<CustList />} />
        </Routes>
      </div>
    </div>
  );
};

export default Returns;
