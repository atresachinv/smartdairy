// import React from "react";
// import Dashboard from "./Dashboard/Dashboard";
// import Apphome from "./Apphome/Apphome";
// import Accounts from "./Accounts/Accounts";
// import Settings from "./Settings/Settings";
// import Inventory from "./Inventory/Inventory";
//
//
// const Mainappviews = ({ index, logout }) => {
//   switch (index) {
//     case 0:
//       return <Dashboard />;
//       break;
//     case 1:
//       return <Apphome />;
//       break;
//     case 2:
//       return <Inventory />;
//       break;
//     case 3:
//       return <Accounts />;
//       break;
//     case 4:
//       return <Settings />;
//       break;
//
//     default:
//       break;
//   }
// };
//
// export default Mainappviews;

// Mainappviews.js
import React from "react";
import Dashboard from "./Dashboard/Dashboard";
import Apphome from "./Apphome/Apphome";
import Accounts from "./Accounts/Accounts";
import Settings from "./Settings/Settings";
import Inventory from "./Inventory/Inventory";
// Import Submenu Components for Inventory
import ProductList from "./Inventory/InventroyPages/ProductList";
import ProductPurchase from "./Inventory/InventroyPages/ProductPurchase";
import ProductSale from "./Inventory/InventroyPages/ProductSale";
import StartingStockInfo from "./Inventory/InventroyPages/StartingStockInfo";
// Import Submenu Components for Settings
import DairySettings from "./Settings/DairySettings/DairySettings";
import InventorySettings from "./Settings/InventorySettings/InventorySettings";
import MachineSettings from "./Settings/MachineSettings/MachineSettings";
import Masters from "./Masters/Masters";
import MainLedger from "./Masters/MasterPages/MainLedger";
import SubLedger from "./Masters/MasterPages/SubLedger";
import CustomerMaster from "./Masters/MasterPages/CustomerMaster";
import MilkRateMaster from "./Masters/MasterPages/MilkRateMaster";
import EmployeeMaster from "./Masters/MasterPages/EmployeeMaster";
import DairyInfo from "./DairyInfo/DairyInfo";
import DairyInitialInfo from "./DairyInfo/DairyInitialInfo";

const Mainappviews = ({ index }) => {
  switch (index) {
    case 0:
      return <Dashboard />;
    case 1:
      return <Apphome />;
    case 2:
      return <Inventory />;
    // Inventory Submenus
    case 2.1:
      return <ProductList />;
    case 2.2:
      return <ProductPurchase />;
    case 2.3:
      return <ProductSale />;
    case 2.4:
      return <StartingStockInfo />;
    case 3:
      return <Accounts />;
    // case 4:
    //   return <Masters />;
    // Master Submenus
    case 4.1:
      return <MainLedger />;
    case 4.2:
      return <SubLedger />;
    case 4.3:
      return <CustomerMaster />;
    case 4.4:
      return <EmployeeMaster />;
    case 4.5:
      return <MilkRateMaster />;

    // case 5:
    //   return <DairyInfo />;
      //Dairy Submenus
    case 5.1:
      return <DairyInfo />;
    case 5.2:
      return <DairyInitialInfo />;
    // case 6:
    //   return <Settings />;
    // Settings Submenus
    case 6.1:
      return <DairySettings />;
    case 6.2:
      return <InventorySettings />;
    case 6.3:
      return <MachineSettings />;
    default:
      return <Dashboard />; // Fallback to Dashboard or any default component
  }
};

export default Mainappviews;
