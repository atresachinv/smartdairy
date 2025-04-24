import React, { useState } from "react";
import PayDeductions from "./PaymentPages/PayDeductions/PayDeductions";
import Payments from "./Payments";
import LockPayments from "./PaymentPages/LockPayments";

const PaymentPages = () => {
   const [currentPage, setCurrentPage] = useState("main");

   const renderPage = () => {
     switch (currentPage) {
       case "deductions":
         return <PayDeductions setCurrentPage={setCurrentPage} />;
       case "lockbill":
         return <LockPayments setCurrentPage={setCurrentPage} />;
       case "main":
       default:
         return <Payments setCurrentPage={setCurrentPage} />;
     }
   };

   return <>{renderPage()}</>;
};

export default PaymentPages;
