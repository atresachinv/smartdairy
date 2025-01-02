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
import MainLedger from "./Masters/MasterPages/MainLedger";
import SubLedger from "./Masters/MasterPages/SubLedger";
import MilkRateMaster from "./Masters/MasterPages/RatechartMaster/MilkRateMaster";
import EmployeeMaster from "./Masters/MasterPages/EmployeeMaster/EmployeeMaster";
import DairyInfo from "./DairyInfo/DairyInfo";
import DairyInitialInfo from "./DairyInfo/DairyInitialInfo";
import CustomersMaster from "./Masters/MasterPages/CustomerMaster/CustomersMaster";
import Centers from "./DairyInfo/Centers/Centers";
// import MilkReports from "./Reports/MilkReports/MilkReports";
// import MilkcollectionReports from "./Reports/MilkReports/MilkcollectionReports";

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
    // Master Submenus
    case 4.1:
      return <MainLedger />;
    case 4.2:
      return <SubLedger />;
    case 4.3:
      return <CustomersMaster />;
    case 4.4:
      return <EmployeeMaster />;
    case 4.5:
      return <MilkRateMaster />;
    //Sales Submenus
    case 5.1:
      return <MainLedger />;
    case 5.2:
      return <SubLedger />;
    case 5.3:
      return <CustomersMaster />;
    case 5.4:
      return <EmployeeMaster />;
    case 5.5:
      return <MilkRateMaster />;
    //Report Submenus
    case 6.1:
      return <MainLedger />;
    case 6.2:
      return <MilkCollectorsReports />;
    case 6.3:
      return <CustomersMaster />;
    case 6.4:
      return <EmployeeMaster />;
    case 6.5:
      return <MilkRateMaster />;
    //Payments Submenus
    case 7.1:
      return <MainLedger />;
    case 7.2:
      return <SubLedger />;
    case 7.3:
      return <CustomersMaster />;
    case 7.4:
      return <EmployeeMaster />;
    case 7.5:
      return <MilkRateMaster />;
    //Dairy Submenus
    case 8.1:
      return <DairyInfo />;
    case 8.2:
      return <DairyInitialInfo />;
    case 8.3:
      return <Centers />;
    // Settings Submenus
    case 9.1:
      return <DairySettings />;
    case 9.2:
      return <InventorySettings />;
    case 9.3:
      return <MachineSettings />;
    default:
      return <Dashboard />;
  }
};

export default Mainappviews;
