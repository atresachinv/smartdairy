import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import AppNavviews from "./AppNavviews";
import "../../../Styles/Mainapp/Apphome/Apphome.css";
import AppNavlinks from "./AppNavlinks";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../App/Features/Customers/customerSlice";
import { getRateCharts } from "../../../App/Features/Mainapp/Masters/rateChartSlice";
import { getMasterDates } from "../../../App/Features/Customers/Date/masterSlice";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import { getProfileInfo } from "../../../App/Features/Mainapp/Profile/ProfileSlice";
import Milkcollection from "./Appnavviews/Milkcollection/Milkcollection";
import MilkSankalan from "./Appnavviews/MilkSankalan/MilkSankalan";
import CompleteMilkColl from "./Appnavviews/Milkcollection/CompleteMilkColl";
import SankalanReport from "./Appnavviews/MilkSankalan/SankalanReport";
import MilkCollectorsReports from "./Appnavviews/Milkcollection/MilkCollectorsReports";
import CreateCattleFeed from "../Sales/CattleFeed/CreateCattleFeed";
import SalesReports from "./Appnavviews/MilkSankalan/SalesReports";
import AdminSalesReports from "./Appnavviews/MilkSankalan/AdminSalesReports";
import Milksales from "./Appnavviews/MilksalesPages/Milksales";
import MilksalesReport from "./Appnavviews/MilksalesPages/MilksalesReport";
import { getretailCustomer } from "../../../App/Features/Mainapp/Milksales/milkSalesSlice";
import StockReport from "./Appnavviews/Sales/StockReport";
import AppNavViews from "./AppNavviews";

const Apphome = () => {
  const dispatch = useDispatch();
  const customerlist = useSelector((state) => state.customers.customerlist);
  const center_id = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );
  const date = useSelector((state) => state.date.toDate);
  const yearStart = useSelector((state) => state.date.yearStart);
  const yearEnd = useSelector((state) => state.date.yearEnd);
  const [isselected, setIsselected] = useState(
    localStorage.getItem("apphomepath") || "collection/:time"
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("apphomepath", isselected);
  }, [isselected]);

  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  //  save only lgoin center customer list in local storage --------------------------------------->
  useEffect(() => {
    // Filter customers with centerid === 0
    const filteredCustomers = customerlist.filter(
      (customer) => customer.centerid === center_id
    );
    // Save only if there are customers with centerid === 0
    if (filteredCustomers.length > 0) {
      localStorage.setItem("customerlist", JSON.stringify(filteredCustomers));
    }
  }, [customerlist]);

  //save customer list in local storage
  useEffect(() => {
    dispatch(listCustomer());
    if (userRole === "mobilecollector") {
      dispatch(getProfileInfo());
    }
    dispatch(generateMaster(date));
    dispatch(getretailCustomer());
    if (yearStart && yearEnd) {
      dispatch(getMasterDates({ yearStart, yearEnd }));
    }
  }, [dispatch]);

  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center">
        <AppNavlinks isselected={isselected} setIsSelected={setIsselected} />
      </div>
      <div className="apphome-nav-views w100 h90 d-flex center">
        <AppNavViews index={isselected} />
        {/* <Routes>
          <Route
            path="collection/morning"
            element={<Milkcollection time={"morning"} />}
          />
          <Route
            path="collection/evening"
            element={<Milkcollection time={"evening"} />}
          />
          <Route path="vehicle/collection" element={<MilkSankalan />} />
          <Route path="complete/collection" element={<CompleteMilkColl />} />
          <Route path="collection/reports" element={<SankalanReport />} />
          <Route
            path="vehicle/collection/reports"
            element={<MilkCollectorsReports />}
          />
          <Route path="vehicle/sales" element={<CreateCattleFeed />} />
          <Route path="vehicle/sales/report" element={<SalesReports />} />
          <Route path="vehicle/stock/report" element={<StockReport />} />
          <Route path="admin/sales/report" element={<AdminSalesReports />} />
          <Route path="retail/milk-sales" element={<Milksales />} />
          <Route path="retail/sale-report" element={<MilksalesReport />} />
        </Routes> */}
      </div>
    </div>
  );
};

export default Apphome;
