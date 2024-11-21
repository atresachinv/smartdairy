import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import Sales from "./Appnavviews/Sales/Sales";
import MilkReports from "./Appnavviews/Reports/MilkReports";
import Payments from "./Appnavviews/Payments/Payments";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import MilkCollOptions from "./Appnavviews/Milkcollection/MilkCollOptions";

const AppNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <MilkCollOptions />;
      break;
    case 1:
      return <MilkSankalan />;
      break;
    case 2:
      return <MilkReports />;
      break;
    case 3:
      return <Sales />;
      break;
    case 4:
      return <Payments />;
      break;
    case 5:
      return <SankalanReport />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
