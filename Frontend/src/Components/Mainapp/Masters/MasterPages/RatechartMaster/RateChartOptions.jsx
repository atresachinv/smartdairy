import React, { useEffect, useState } from "react";
import RateChartNavViews from "./RateChartNavViews";
import RateChartNavlinks from "./RateChartNavlinks";
import { Route, Routes } from "react-router-dom";
import SaveRateChart from "./SaveRateChart";
import UpdateRatechart from "./UpdateRatechart";
import ApplyRatechart from "./ApplyRatechart";
import AddType from "./AddType";

const RateChartOptions = ({ isSet, ratechart }) => {
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
      <div className="ratechart-nav-views w100 h90 d-flex center">
        <Routes>
          <Route
            path="add/new-type"
            element={<AddType isSet={isSet} ratechart={ratechart} />}
          />
          <Route path="save-new" element={<SaveRateChart />} />
          <Route
            path="update-save"
            element={<UpdateRatechart isSet={isSet} ratechart={ratechart} />}
          />
          <Route
            path="apply"
            element={<ApplyRatechart isSet={isSet} ratechart={ratechart} />}
          />
          <Route path="*" element={<AddType />} />
        </Routes>
      </div>
    </div>
  );
};

export default RateChartOptions;
