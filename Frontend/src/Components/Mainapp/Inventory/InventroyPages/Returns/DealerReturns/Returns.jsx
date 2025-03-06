import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ReturnsNavlinks from "./ReturnsNavlinks";
import CreateDealer from "./cattleFeed/Create";
import List from "./cattleFeed/List";
import GroList from "./grocery/List";
import MedList from "./medicines/List";
import OthList from "./others/List";
import CreateDealerOth from "./others/Create";
import CreateDealerMedi from "./medicines/Create";
import CreateDealerGro from "./grocery/Create";

const Returns = () => {
  const [isselected, setIsSelected] = useState(0);

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
          <Route path="add-deal-return" element={<CreateDealer />} />
          <Route path="cattlefeed/add-deal-return" element={<CreateDealer />} />
          <Route path="cattlefeed" element={<List />} />
          <Route path="grocery" element={<GroList />} />
          <Route path="grocery/add-deal-return" element={<CreateDealerGro />} />
          <Route path="medicines" element={<MedList />} />
          <Route
            path="medicines/add-deal-return"
            element={<CreateDealerMedi />}
          />
          <Route path="other-products" element={<OthList />} />
          <Route
            path="other-products/add-deal-return"
            element={<CreateDealerOth />}
          />
          <Route path="*" element={<List />} />
        </Routes>
      </div>
    </div>
  );
};

export default Returns;
