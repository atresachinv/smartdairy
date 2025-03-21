import React from "react";
import CustomerMilkTransfer from "./CustomerMilkTransfer";
import DateMilkTransfer from "./DateMilkTransfer";
import ShiftMilkTransfer from "./ShiftMilkTransfer";
import MilkCopyPaste from "./MilkCopyPaste";
import DeleteCollection from "./DeleteCollection";
import { Route, Routes } from "react-router-dom";

const MilkTransferViews = ({ index }) => {
  switch (index) {
    case "to-customer":
      return <CustomerMilkTransfer />;
      break;
    case "to-date":
      return <DateMilkTransfer />;
      break;
    case "to-shift":
      return <ShiftMilkTransfer />;
      break;
    case "copy-paste":
      return <MilkCopyPaste />;
      break;
    case "delete-collection":
      return <DeleteCollection />;
      break;
    default:
      break;
  }
};

export default MilkTransferViews;
