import React, { useEffect, useState } from "react";
import MilkTransferNavlinks from "./MilkTransferNavlinks";
import MilkTransferViews from "./MilkTransferViews";
import "../../../../../Styles/Mainapp/Payments/MilkCorrection.css";

const MilkTransfer = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("milktransferTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("milktransferTabIndex", isselected);
  }, [isselected]);

  return (
    <div className="milk-correction-container w100 h1 d-flex-col">
      <div className="milk-correction-navlinks-conatainer w100 h10 d-flex nav-bg">
        <MilkTransferNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="milk-correction-nav-views-conatainer w100 h90 d-flex-col center">
        <MilkTransferViews index={isselected} />
      </div>
    </div>
  );
};

export default MilkTransfer;
