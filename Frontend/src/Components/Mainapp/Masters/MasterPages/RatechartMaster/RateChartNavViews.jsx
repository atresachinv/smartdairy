import React from "react";
import SaveRateChart from "./SaveRateChart";
import UpdateRatechart from "./UpdateRatechart";
import ApplyRatechart from "./ApplyRatechart";

const RateChartNavViews = ({ index, isSet }) => {
  switch (index) {
    case 0:
      return <SaveRateChart />;
      break;
    case 1:
      return <UpdateRatechart isSet={isSet} />;
      break;
    case 2:
      return <ApplyRatechart />;
      break;

    default:
      break;
  }
};

export default RateChartNavViews;
