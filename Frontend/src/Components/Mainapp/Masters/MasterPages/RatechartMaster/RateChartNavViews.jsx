import React from "react";
import SaveRateChart from "./SaveRateChart";
import UpdateRatechart from "./UpdateRatechart";
import ApplyRatechart from "./ApplyRatechart";
import AddType from "./AddType";

const RateChartNavViews = ({ index, isSet, ratechart }) => {
  switch (index) {
    case 0:
      return <AddType isSet={isSet} ratechart={ratechart} />;
      break;
    case 1:
      return <SaveRateChart />;
      break;
    case 2:
      return <UpdateRatechart isSet={isSet} ratechart={ratechart} />;
      break;
    case 3:
      return <ApplyRatechart isSet={isSet} ratechart={ratechart} />;
      break;

    default:
      break;
  }
};

export default RateChartNavViews;
