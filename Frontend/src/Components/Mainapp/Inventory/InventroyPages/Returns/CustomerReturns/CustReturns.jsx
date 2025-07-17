import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ReturnsNavlinks from "./ReturnsNavlinks";
import Create from "./cattleFeed/Create";
import List from "./cattleFeed/List";
import MedList from "./medicines/List";
import MedCreate from "./medicines/Create";
import OthList from "./others/List";
import OthCreate from "./others/Create";
import GroList from "./grocery/List";
import GroCreate from "./grocery/Create";

const CustReturns = () => {
  const [isselected, setIsSelected] = useState(0);

  return (
    <div className="product-return-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center nav-bg">
        <ReturnsNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="product-return-nav-views w100 h90 d-flex center p10">
        <Routes>
          <Route path="cattlefeed/add-cust-return" element={<Create />} />
          <Route path="add-cust-return" element={<Create />} />
          <Route path="cattlefeed" element={<List />} />
          <Route path="grocery" element={<GroList />} />
          <Route path="grocery/add-cust-return" element={<GroCreate />} />
          <Route path="medicines" element={<MedList />} />
          <Route path="medicines/add-cust-return" element={<MedCreate />} />
          <Route path="other-products" element={<OthList />} />
          <Route
            path="other-products/add-cust-return"
            element={<OthCreate />}
          />
          <Route path="*" element={<List />} />
        </Routes>
      </div>
    </div>
  );
};

export default CustReturns;
