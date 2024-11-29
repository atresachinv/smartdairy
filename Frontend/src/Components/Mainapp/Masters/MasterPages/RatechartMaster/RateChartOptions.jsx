import React, { useEffect, useState } from "react";
import RateChartNavViews from "./RateChartNavViews";
import RateChartNavlinks from "./RateChartNavlinks";

const RateChartOptions = ({ isSet }) => {
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedRCTab")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedRCTab", isselected);
  }, [isselected]);

  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav  w100 d-flex a-center">
        <RateChartNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center">
        <RateChartNavViews index={isselected} isSet={isSet} />
      </div>
    </div>
  );
};

export default RateChartOptions;
