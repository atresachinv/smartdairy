import { useState } from "react";
import OthersNavlinks from "./OthersNavlinks";
import { Route, Routes } from "react-router-dom";
import OthersSaleList from "./OthersSaleList";
import CreateOthers from "./CreateOthers";

const OthersMaster = () => {
  const [isselected, setIsSelected] = useState(0);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <OthersNavlinks isselected={isselected} setIsSelected={setIsSelected} />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        {/* <OthersNavViews index={isselected} /> */}
        <Routes>
          <Route path="sale/list" element={<OthersSaleList />} />
          <Route path="add/sale" element={<CreateOthers />} />
          <Route path="*" element={<OthersSaleList />} />
        </Routes>
      </div>
    </div>
  );
};

export default OthersMaster;
