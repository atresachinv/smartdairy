import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";
import UpdateCollection from "./Appnavviews/Milkcollection/UpdateCollection";
import MilkCollectorsReports from "./Appnavviews/Milkcollection/MilkCollectorsReports";

const AppNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <Milkcollection />;
      break;
    case 1:
      return <MilkSankalan />;
      break;
    case 2:
      return <CompleteMilkColl />;
      break;
    case 3:
      return <UpdateCollection />;
      break;
    case 4:
      return <SankalanReport />;
      break;
    case 5:
      return <MilkCollectorsReports />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
