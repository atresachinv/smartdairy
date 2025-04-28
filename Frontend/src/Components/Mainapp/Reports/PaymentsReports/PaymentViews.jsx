import React from "react";
import DeductionReports from "./PaymentPages.jsx/DeductionReports";
import PaymentRegister from "./PaymentPages.jsx/PaymentRegister";
import PaymentSummary from "./PaymentPages.jsx/PaymentSummary";

const PaymentViews = ({ index }) => {
  switch (index) {
    case 0:
      return <DeductionReports />;
      break;
    case 1:
      return <PaymentRegister />;
      break;
    case 2:
      return <PaymentSummary />;
      break;
    default:
      break;
  }
};

export default PaymentViews;
