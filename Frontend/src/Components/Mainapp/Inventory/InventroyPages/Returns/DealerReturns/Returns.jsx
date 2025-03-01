import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import ReturnsNavlinks from "./ReturnsNavlinks";
import List from "./List";
import CreateDealer from "./Create";

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
          <Route path="*" element={<List />} />
        </Routes>
      </div>
    </div>
  );
};

export default Returns;
