import React from "react";
import DeductionReports from "./PaymentPages.jsx/DeductionReports";

const PaymentViews = ({ index }) => {
  switch (index) {
    case 0:
      return <DeductionReports />;
      break;
    default:
      break;
  }
};

export default PaymentViews;
