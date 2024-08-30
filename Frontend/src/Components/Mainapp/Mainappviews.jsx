import React from "react";
import Dashboard from "./Dashboard/Dashboard";
import Apphome from "./Apphome/Apphome";
import Accounts from "./Accounts/Accounts";
import Settings from "./Settings/Settings";
import Inventory from "./Inventory/Inventory";


const Mainappviews = ({ index, logout }) => {
  switch (index) {
    case 0:
      return <Dashboard />;
      break;
    case 1:
      return <Apphome />;
      break;
    case 2:
      return <Inventory />;
      break;
    case 3:
      return <Accounts />;
      break;
    case 4:
      return <Settings />;
      break;

    default:
      break;
  }
};

export default Mainappviews;
