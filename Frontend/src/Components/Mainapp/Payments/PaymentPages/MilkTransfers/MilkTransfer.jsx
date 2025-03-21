import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import MilkTransferNavlinks from "./MilkTransferNavlinks";
import CustomerMilkTransfer from "./CustomerMilkTransfer";
import DeleteCollection from "./DeleteCollection";
import MilkCopyPaste from "./MilkCopyPaste";
import ShiftMilkTransfer from "./ShiftMilkTransfer";
import DateMilkTransfer from "./DateMilkTransfer";
import "../../../../../Styles/Mainapp/Payments/MilkCorrection.css";
import MilkTransferViews from "./MilkTransferViews";

const MilkTransfer = () => {
  const [isselected, setIsSelected] = useState(
    localStorage.getItem("milktransferLastPath") || "to-customer"
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("milktransferLastPath", isselected);
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
        {/* <Routes>
          <Route path="to-customer" element={<CustomerMilkTransfer />} />
          <Route path="to-date" element={<DateMilkTransfer />} />
          <Route path="to-shift" element={<ShiftMilkTransfer />} />
          <Route path="copy-paste" element={<MilkCopyPaste />} />
          <Route path="delete-collection" element={<DeleteCollection />} />
        </Routes> */}
      </div>
    </div>
  );
};

export default MilkTransfer;
