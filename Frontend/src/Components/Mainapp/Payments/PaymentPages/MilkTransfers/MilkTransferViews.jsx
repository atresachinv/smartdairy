import React from "react";
import CustomerMilkTransfer from "./CustomerMilkTransfer";
import DateMilkTransfer from "./DateMilkTransfer";
import ShiftMilkTransfer from "./ShiftMilkTransfer";
import MilkCopyPaste from "./MilkCopyPaste";
import DeleteCollection from "./DeleteCollection";

const MilkTransferViews = ({ index }) => {
  switch (index) {
    case 0:
      return <CustomerMilkTransfer />;
      break;
    case 1:
      return <DateMilkTransfer />;
      break;
    case 2:
      return <ShiftMilkTransfer />;
      break;
    case 3:
      return <MilkCopyPaste />;
      break;
    case 4:
      return <DeleteCollection />;
      break;
    default:
      break;
  }
};

export default MilkTransferViews;
