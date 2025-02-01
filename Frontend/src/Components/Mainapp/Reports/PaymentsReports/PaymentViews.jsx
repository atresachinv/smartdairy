import React from "react";
import DeductionReports from "./PaymentPages.jsx/DeductionReports";
import PaymentRegister from "./PaymentPages.jsx/PaymentRegister";

const PaymentViews = ({ index }) => {
  switch (index) {
    case 0:
      return <DeductionReports />;
      break;
    case 1:
      return <PaymentRegister />;
      break;
    default:
      break;
  }
};

export default PaymentViews;
