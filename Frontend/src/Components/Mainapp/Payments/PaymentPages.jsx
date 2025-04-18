import React, { useState } from "react";
import PayDeductions from "./PaymentPages/PayDeductions/PayDeductions";
import Payments from "./Payments";

const PaymentPages = () => {
  const [showDeduPage, setShowDeduPage] = useState(false);
  return (
    <>
      {!showDeduPage ? (
        <Payments setShowDeduPage={setShowDeduPage} />
      ) : (
        <PayDeductions setShowDeduPage={setShowDeduPage} />
      )}
    </>
  );
};

export default PaymentPages;
