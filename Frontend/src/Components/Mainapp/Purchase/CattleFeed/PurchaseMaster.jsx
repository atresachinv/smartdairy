import React, { useEffect, useState } from "react";
import CattleFeedPurNavlinks from "./CattleFeedNavlinks";
import CattleFeedPurNavViews from "./CattleFeedPurNavViews";

const PurchaseMaster = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedCattleFeedPurIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedCattleFeedPurIndex", isselected);
  }, [isselected]);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CattleFeedPurNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center p10">
        <CattleFeedPurNavViews index={isselected} />
      </div>
    </div>
  );
};

export default PurchaseMaster;
