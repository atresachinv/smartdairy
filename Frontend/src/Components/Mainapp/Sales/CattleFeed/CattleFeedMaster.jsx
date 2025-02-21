import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import CattleFeedNavlinks from "./CattleFeedNavlinks";
import CattleSaleList from "./CattleSaleList";
import CreateCattleFeed from "./CreateCattleFeed";

const CattleFeedMaster = () => {
  const [isselected, setIsSelected] = useState(0);

  return (
    <div className="cattle-feed-master-container w100 h1 d-flex-col">
      <div className="cattle-feed-master-navigation w100 h10 d-flex bg3">
        <CattleFeedNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="cattle-feed-views w100 h90 d-flex center">
        {/* <CattleFeedNavViews index={isselected} /> */}
        <Routes>
          <Route path="list" element={<CattleSaleList />} />
          <Route path="add/feeds" element={<CreateCattleFeed />} />
          <Route path="*" element={<CattleSaleList />} />
        </Routes>
      </div>
    </div>
  );
};

export default CattleFeedMaster;
