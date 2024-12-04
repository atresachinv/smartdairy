import React, { useEffect, useState } from "react";
import ReportNavlinks from "./ReportNavlinks";
import ReportsViews from "./ReportsViews";

const MilkCollectionReport = () => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("MReportsTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("MReportsTabIndex", isselected);
  }, [isselected]);
  return (
    <div className="collection-reports-conatiner w100 h1 d-flex-col">
      {/* <span className="heading">Todays Milk Collection Report</span> */}
      <div className="report-tabs-conatiner w100 h90 d-flex">
        <div className="report-container w80 h1 d-flex">
          <ReportsViews index={isselected} />
        </div>
        <div className="report-tabs-container w20 h1 d-flex-col bg4">
          <ReportNavlinks
            isselected={isselected}
            setIsSelected={setIsSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default MilkCollectionReport;
