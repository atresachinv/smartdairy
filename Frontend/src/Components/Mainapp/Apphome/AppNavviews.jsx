import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import Sales from "./Appnavviews/Sales/Sales";
import MilkReports from "./Appnavviews/Reports/MilkReports";
import Payments from "./Appnavviews/Payments/Payments";

const AppNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <Milkcollection />;
      break;
    case 1:
      return <Sales />;
      break;
    case 2:
      return <MilkReports />;
      break;
    case 3:
      return <Payments />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
