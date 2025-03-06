import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CattleFeedNavlinks from "./GroceryNavlinks";
import CreateGrocery from "./CreateGrocery";
import GrocerySaleList from "./GrocerySaleList";

const GroceryMaster = () => {
  const [isselected, setIsSelected] = useState(0);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CattleFeedNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        {/* <CattleFeedNavViews index={isselected} /> */}
        <Routes>
          <Route path="sale/list" element={<GrocerySaleList />} />
          <Route path="add/sale" element={<CreateGrocery />} />
          <Route path="*" element={<GrocerySaleList />} />
        </Routes>
      </div>
    </div>
  );
};

export default GroceryMaster;
