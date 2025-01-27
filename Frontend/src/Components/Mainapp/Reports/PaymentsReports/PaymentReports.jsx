import React, { useEffect, useState } from "react";
import PaymentNavlinks from "./PaymentNavlinks";
import PaymentViews from "./PaymentViews";

const PaymentReports = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("PayReportTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("PayReportTabIndex", isselected);
  }, [isselected]);

  return (
    <div className="payment-report-container w100 h1 d-flex-col">
      <div className="payment-report-navlinks-conatainer w100 h10 d-flex nav-bg">
        <PaymentNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="payment-report-nav-views-conatainer w100 h90 d-flex-col center p10">
        <PaymentViews index={isselected} />
      </div>
    </div>
  );
};

export default PaymentReports;
