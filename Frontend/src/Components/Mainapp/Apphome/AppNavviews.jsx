import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";
import UpdateCollection from "./Appnavviews/Milkcollection/UpdateCollection";
import MilkCollectorsReports from "./Appnavviews/Milkcollection/MilkCollectorsReports";
import CreateCattleFeed from "../Sales/CattleFeed/CreateCattleFeed";

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
    case 6:
      return <CreateCattleFeed />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
