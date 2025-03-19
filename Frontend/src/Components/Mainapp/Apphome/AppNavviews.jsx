import React from "react";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";
import UpdateCollection from "./Appnavviews/Milkcollection/UpdateCollection";
import MilkCollectorsReports from "./Appnavviews/Milkcollection/MilkCollectorsReports";
import CreateCattleFeed from "../Sales/CattleFeed/CreateCattleFeed";
import MilksalesReport from "./Appnavviews/MilksalesPages/MilksalesReport";
import Milksales from "./Appnavviews/MilksalesPages/Milksales";
import AdminSalesReports from "./Appnavviews/MilkSankalan/AdminSalesReports";
import SalesReports from "./Appnavviews/MilkSankalan/SalesReports";

const AppNavViews = ({ index }) => {
  console.log(index);
  switch (index) {
    case `collection/:time`:
      return <Milkcollection />;
      break;
    case "collection/:time":
      return <Milkcollection />;
      break;
    case "vehicle/collection":
      return <MilkSankalan />;
      break;
    case "complete/collection":
      return <CompleteMilkColl />;
      break;
    case "collection/reports":
      return <SankalanReport />;
      break;
    case "vehicle/collection/reports":
      return <MilkCollectorsReports />;
      break;
    case "vehicle/sales":
      return <CreateCattleFeed />;
      break;
    case "vehicle/sales/report":
      return <SalesReports />;
      break;
    case "admin/sales/report":
      return <AdminSalesReports />;
      break;
    case "retail/milk-sales":
      return <Milksales />;
      break;
    case "retail/sale-report":
      return <MilksalesReport />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
