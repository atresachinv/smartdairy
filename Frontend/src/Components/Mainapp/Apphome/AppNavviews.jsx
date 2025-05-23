import React from "react";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";
import MilkCollectorsReports from "./Appnavviews/Milkcollection/MilkCollectorsReports";
import CreateCattleFeed from "../Sales/CattleFeed/CreateCattleFeed";
import MilksalesReport from "./Appnavviews/MilksalesPages/MilksalesReport";
import Milksales from "./Appnavviews/MilksalesPages/Milksales";
import AdminSalesReports from "./Appnavviews/MilkSankalan/AdminSalesReports";
import SalesReports from "./Appnavviews/MilkSankalan/SalesReports";
import StockReport from "./Appnavviews/Sales/StockReport";
import MilkColleform from "./Appnavviews/Milkcollection/Milkcollform";

const AppNavViews = ({ index }) => {
  switch (index) {
    case "collection/morning":
      return <MilkColleform times={"morning"} />;
      break;
    case "collection/evening":
      return <MilkColleform times={"evening"} />;
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
    case "vehicle/stock/report":
      return <StockReport />;
      break;

    default:
      break;
  }
};

export default AppNavViews;
