import React, { useState } from "react";
import PayDeductions from "./PaymentPages/PayDeductions/PayDeductions";
import Payments from "./Payments";
import LockPayments from "./PaymentPages/LockPayments";
import MilkCorrection from "./PaymentPages/MilkCorrection/MilkCorrection";
import PaymentRegister from "../Reports/PaymentsReports/PaymentPages/PaymentRegister";
import PaymentSummary from "../Reports/PaymentsReports/PaymentPages/PaymentSummary";

const PaymentPages = () => {
  const [currentPage, setCurrentPage] = useState("main");

  const renderPage = () => {
    switch (currentPage) {
      case "deductions":
        return <PayDeductions setCurrentPage={setCurrentPage} showbtn={true} />;
      case "lockbill":
        return <LockPayments setCurrentPage={setCurrentPage} showbtn={true} />;
      case "milkcorrection":
        return (
          <MilkCorrection setCurrentPage={setCurrentPage} showbtn={true} />
        );
      case "payregister":
        return (
          <PaymentRegister setCurrentPage={setCurrentPage} showbtn={true} />
        );
      case "paysummary":
        return (
          <PaymentSummary setCurrentPage={setCurrentPage} showbtn={true} />
        );
      case "main":
      default:
        return <Payments setCurrentPage={setCurrentPage} />;
    }
  };

  return <>{renderPage()}</>;
};

export default PaymentPages;
