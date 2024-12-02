import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import Sales from "./Appnavviews/Sales/Sales";
import MilkReports from "./Appnavviews/Reports/MilkReports";
import Payments from "./Appnavviews/Payments/Payments";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import UpdateMIlkCollection from "./Appnavviews/Milkcollection/UpdateMIlkCollection";
import PrivMilkCollection from "./Appnavviews/PrevCollection/PrivMilkCollection";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";

const AppNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <Milkcollection />;
      break;
    case 1:
      return <MilkSankalan />;
      break;
    // case 2:
    //   return <PrivMilkCollection />;
    //   break;
    case 2:
      return <CompleteMilkColl />;
      break;
    case 3:
      return <UpdateMIlkCollection />;
      break;
    case 4:
      return <SankalanReport />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
