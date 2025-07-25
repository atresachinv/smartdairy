import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  centerDetails,
  centersLists,
  maxCenterId,
} from "../../App/Features/Dairy/Center/centerSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchDairyInfo } from "../../App/Features/Admin/Dairyinfo/dairySlice";
import { listCustomer } from "../../App/Features/Customers/customerSlice";
import Apphome from "./Apphome/Apphome";
import { Route, Routes, useNavigate } from "react-router-dom";
import CattleFeedMaster from "./Sales/CattleFeed/CattleFeedMaster";
import Dealers from "./Inventory/InventroyPages/Dealers/Dealers";
import MainLedger from "./Masters/MasterPages/MainLedger";
import SubLedger from "./Masters/MasterPages/SubLedger";
import CustomersMaster from "./Masters/MasterPages/CustomerMaster/CustomersMaster";
import EmployeeMaster from "./Masters/MasterPages/EmployeeMaster/EmployeeMaster";
import BankMaster from "./Masters/MasterPages/BankMaster/BankMaster";
import CustomerReports from "./Reports/CustomerReports/CustomerReports";
import MilkcollectionReports from "./Reports/MilkReports/MilkcollectionReports";
import PaymentReports from "./Reports/PaymentsReports/PaymentReports";
import Stocks from "./Inventory/InventroyPages/Stocks/Stocks";
import PurchaseMaster from "./Purchase/CattleFeed/PurchaseMaster";
import PurchaseMasters from "./Purchase/PurchaseMaster";
import PurchaseGroceryMaster from "./Purchase/Grocery/PurchaseGroceryMaster";
import PurchaseMedicinesMaster from "./Purchase/Medicines/PurchaseMedicinesMaster";
import OthersPurMaster from "./Purchase/Others/OthersPurMaster";
import GroceryMaster from "./Sales/Grocery/GroceryMaster";
import MedicinesMaster from "./Sales/Medicines/MedicinesMaster";
import OthersMaster from "./Sales/Others/OthersMaster";
import MilkCorrection from "./Payments/PaymentPages/MilkCorrection/MilkCorrection";
import MilkTransfer from "./Payments/PaymentPages/MilkTransfers/MilkTransfer";
import Payments from "./Payments/Payments";
import DairyInfo from "./DairyInfo/DairyInfo";
import DairyInitialInfo from "./DairyInfo/DairyInitialInfo";
import Centers from "./DairyInfo/Centers/Centers";
import DairySettings from "./Settings/DairySettings/DairySettings";
import InventorySettings from "./Settings/InventorySettings/InventorySettings";
import MachineSettings from "./Settings/MachineSettings/MachineSettings";
import Profile from "./Profile/Profile";
import Products from "./Inventory/InventroyPages/Products/Products";
import { checkCurrentSession } from "../../App/Features/Users/authSlice";
import { toast } from "react-toastify";
import "../../Styles/Mainapp/Mainapphome.css";
import InventoryRports from "./Reports/InventoryReports/InventoryRports";
import Returns from "./Inventory/InventroyPages/Returns/DealerReturns/Returns";
import SalesMaster from "./Sales/SalesMaster";
import Milksales from "./Apphome/Appnavviews/MilksalesPages/Milksales";
import MilksalesReport from "./Apphome/Appnavviews/MilksalesPages/MilksalesReport";
import AdminSalesReports from "./Apphome/Appnavviews/MilkSankalan/AdminSalesReports";
import MilkCollectorsReports from "./Apphome/Appnavviews/Milkcollection/MilkCollectorsReports";
import DeliveryStockMaster from "./Inventory/InventroyPages/Stocks/DeliveryStock/DeliveryStockMaster";
import CustReturns from "./Inventory/InventroyPages/Returns/CustomerReturns/CustReturns";
// import SellRateMaster from "./Inventory/InventroyPages/Stocks/SellRate/SellRateMaster";
import ExpiredProductsMaster from "./Inventory/InventroyPages/Stocks/ExpiredProduct/ExpiredProductsMaster";
import ComingSoon from "./ComingSoon";
import { getCenterSetting } from "../../App/Features/Mainapp/Settings/dairySettingSlice";
import DeductionMaster from "./Masters/MasterPages/DeductionMaster/DeductionMaster";
import BankReportMaster from "./Reports/BankReports/BankReportMaster";
import DedeutionName from "./Payments/PaymentPages/DedeutionName/DedeutionName";
import CashCredit from "./Accounts/Credit/CashCredit";
import TransferCredit from "./Accounts/Credit/TransferCredit";
import DayBook from "./Accounts/Credit/DayBook";
import Deductionlist from "./Reports/Deductionlist/Deductionlist";
import DoctorMaster from "./Masters/MasterPages/DoctorMaster";
import WhatsappSms from "./DairyInfo/Centers/WhatsappSms";
import Inventory from "./Inventory/Inventory";
import Maindashboard from "./Dashboard/Maindashboard";
import UploadAccount from "./Accounts/Credit/UploadAccount";
import DairySetup from "./Settings/DairySettings/DairySetup";
import LedgerList from "./Accounts/LedgerList/LedgerList";
import MilkColleform from "./Apphome/Appnavviews/Milkcollection/Milkcollform";
import AccountStatment from "./Accounts/AccountStatment/AccountStatment";
import TrnCheck from "./Inventory/InventroyPages/TrnCheck/TrnCheck";
import PaymentPages from "./Payments/PaymentPages";
import CustomerList from "./Masters/MasterPages/CustomerMaster/CustomerList";
import CreateCustomer from "./Masters/MasterPages/CustomerMaster/CreateCustomer";
import FatSnfCompromise from "./Payments/FatSnfCompromise";
import GeneralLedger from "./Accounts/GeneralLedger/GeneralLedger";
import AdvancesPosting from "./Accounts/AdvancesPosting/AdvancesPosting";
import SanghReport from "./MilkSales/SanghsalesPages/SanghReport";
import Sanghsales from "./MilkSales/SanghsalesPages/Sanghsales";
import CenterCollection from "./MilkSales/CenterCollection";
import CreateSangh from "./MilkSales/SanghsalesPages/CreateSangh";
import CenterReports from "./Reports/CenterReports/CenterReports";
import UploadMilkColl from "./Apphome/Appnavviews/Milkcollection/UploadMilkColl";
import Milkbill from "./Reports/milkBill/Milkbill";
import AnimalMaster from "./Masters/MasterPages/AnimalMaster";
import ReportProblem from "./DairyInfo/Centers/ReportProblem";
import SanghPayReport from "./MilkSales/SanghsalesPages/SanghPayReport";
import SanghMilkReport from "./Reports/MilkSanghReport/SanghMilkReport";
import TanckerMaster from "./Masters/MasterPages/TanckerMaster";
import TankerReport from "./Reports/TankerReport";
import Lossgainreport from "./Reports/LossGainReport/Lossgainreport";
import RatechartMaster from "./Masters/MasterPages/RatechartMaster/RatechartMaster";
import AddtypeRatechart from "./Masters/MasterPages/RatechartMaster/AddtypeRatechart";
import SaveRatecharts from "./Masters/MasterPages/RatechartMaster/SaveRatecharts";
import Updateratecharts from "./Masters/MasterPages/RatechartMaster/Updateratecharts";
import Applyratecharts from "./Masters/MasterPages/RatechartMaster/Applyratecharts";
import PreviousRatechart from "./Masters/MasterPages/RatechartMaster/PreviousRatechart";
import MilkBuySale from "./Reports/MilkBuySale/MilkBuySale";
import UpdateSaleRate from "./Inventory/InventroyPages/Stocks/SellRate/UpdateSaleRate";
import StartingStock from "./Inventory/InventroyPages/Stocks/StartingStock/StartingStock";
import Dashboard from "./Dashboard/Dashboard";
import LossGainInfo from "./Dashboard/DashboardTabs/LossGainInfo";

const Mainapp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dairy_id = useSelector((state) => state.dairy.dairyData.SocietyCode);
  const [openSidebar, setOpenSidebar] = useState(false); //fuctional sidebar
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);

  const allowedRoutes = {
    super_admin: [
      "dashboard",
      "milk/collection/*",
      "inventory/*",
      "reports/*",
      "settings/*",
    ],
    admin: ["dashboard", "milk/collection/*", "inventory/*"],
    milkcollector: ["milk/collection/*", "milk/customer/master/*"],
    mobilecollector: ["vehicle/milk/collection/*"],
    salesman: ["milk/retail/sales", "milk/retail/sales-report"],
  };

  const userRoutes = allowedRoutes[userRole] || [];
  // handle open close sidebar ---------------------------------------------------------->
  const handleSidebar = () => {
    setOpenSidebar(!openSidebar);
  };

  // Retrieve isselected from localStorage, defaulting to 0 if not set ------------------>
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedNavIndex")) || 0
  );

  // Update localStorage whenever isselected changes ------------------------------------>
  useEffect(() => {
    localStorage.setItem("selectedNavIndex", isselected);
  }, [isselected]);

  // dispatch function to fetch required data ------------------------------------------->
  useEffect(() => {
    dispatch(centerDetails());
    dispatch(centersLists());
    dispatch(listCustomer());
    dispatch(getCenterSetting());
    dispatch(fetchDairyInfo());
    dispatch(maxCenterId(dairy_id));
  }, []);

  // checking user session token after each minute -------------------------------------->
  useEffect(() => {
    const checkSession = async () => {
      const sessionToken = localStorage.getItem("sessionToken");

      if (!sessionToken) {
        handleLogout();
        return;
      }

      try {
        const res = await dispatch(checkCurrentSession(sessionToken)).unwrap();
        if (!res.valid) {
          handleLogout();
        }
      } catch (error) {
        console.log("Error in session verification:", error);
        handleLogout();
      }
    };

    const handleLogout = () => {
      localStorage.removeItem("customerlist");
      localStorage.removeItem("milkentries");
      localStorage.removeItem("milkcollrcharts");
      localStorage.removeItem("token");
      localStorage.removeItem("sessionToken");
      toast.error("Session expired, please log in again.");
      navigate("/");
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every 1 min
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-home-container wh100 d-flex">
      <div
        className={`sidebar-container ${
          openSidebar ? "open-sidebar " : "close-sidebar"
        }`}
      >
        <Sidebar setselected={setIsselected} handleSidebar={handleSidebar} />
      </div>
      <div className="nav-main-view-container w80 h1 d-flex-col">
        <Header handleSidebar={handleSidebar} />
        <div className="main-view-container w100 h90 d-flex center">
          <Routes>
            {/* dashboard route */}
            {userRoutes.includes("dashboard") && (
              <Route path="dashboard/*" element={<Maindashboard />}>
                <Route path="milk-dashboard" element={<Dashboard />} />
                <Route path="invertory-dashboard" element={<Inventory />} />
                <Route path="loss-gain" element={<LossGainInfo />} />
              </Route>
            )}
            {/* <Route path="dashboard/*" element={<Dashboard />} /> */}
            {/* milk purchase routes */}
            {userRoutes.includes("vehicle/milk/collection/*") && (
              <Route path="vehicle/milk/collection/*" element={<Apphome />} />
            )}
            <Route path="milk/collection/*" element={<Apphome />} />
            <Route path="milk/collection/:time" element={<MilkColleform />} />
            <Route path="milk/collection/:time" element={<MilkColleform />} />
            {/* <Route path="milk/customer/master" element={<CustomersMaster />}>
              <Route path="list" element={<CustomerList />} />
              <Route path="add-new" element={<CreateCustomer />} />
              <Route path="add-new/:cust_code" element={<CreateCustomer />} />
            </Route> */}
            {/* <Route path="milk/rate/master/*" element={<MilkRateMaster />} /> */}
            <Route path="milk/payment/master/*" element={<Payments />} />
            <Route
              path="milk/vehicle/milk-report"
              element={<MilkCollectorsReports />}
            />
            <Route
              path="milk/vehicle/sales-report"
              element={<AdminSalesReports />}
            />
            <Route
              path="milk/retail/sales-report"
              element={<MilksalesReport />}
            />
            <Route path="upload/milk/collection" element={<UploadMilkColl />} />
            {/* milk sales routes */}
            <Route path="create/sangha" element={<CreateSangh />} />
            <Route path="milk/retail/sales" element={<Milksales />} />
            <Route path="sangha/sales" element={<Sanghsales />} />
            <Route
              path="center/milk/collection"
              element={<CenterCollection />}
            />
            <Route path="sangha/milk/payment" element={<SanghReport />} />
            <Route path="sangha/payment/report" element={<SanghPayReport />} />
            {/* inventory routes */}
            <Route path="inventory" element={<Inventory />} />
            <Route path="inventory/dealer/*" element={<Dealers />} />
            <Route path="inventory/product/*" element={<Products />} />
            <Route
              path="inventory/product/purchase/*"
              element={<PurchaseMasters />}
            />
            <Route path="inventory/product/sales/*" element={<SalesMaster />} />
            <Route
              path="inventory/product/stock/*"
              element={<StartingStock />}
            />
            <Route path="inventory/returns/*" element={<Returns />} />
            <Route
              path="inventory/returns/cust-return-list/*"
              element={<CustReturns />}
            />
            <Route
              path="inventory/stock-keeper/*"
              element={<DeliveryStockMaster />}
            />{" "}
            <Route
              path="inventory/update-sell-rate/*"
              element={<UpdateSaleRate />}
            />{" "}
            <Route
              path="inventory/expired-product/*"
              element={<ExpiredProductsMaster />}
            />
            <Route path="inventory/trncheck/*" element={<TrnCheck />} />
            {/* accounts routes */}
            <Route path="accounts" element={<ComingSoon />} />
            <Route path="accounts/cash" element={<CashCredit />} />
            <Route path="accounts/transfer" element={<TransferCredit />} />
            <Route path="accounts/daybook" element={<DayBook />} />
            <Route path="accounts/statments" element={<AccountStatment />} />
            <Route path="accounts/upload" element={<UploadAccount />} />
            <Route path="accounts/ledger-list" element={<LedgerList />} />
            <Route path="accounts/general-ledger" element={<GeneralLedger />} />
            <Route path="accounts/advances" element={<AdvancesPosting />} />
            {/* master routes */}
            <Route path="master/main-ledger/*" element={<MainLedger />} />
            <Route path="master/sub-ledger/*" element={<SubLedger />} />
            {/* <Route path="master/customer/*" element={<CustomersMaster />} /> */}
            <Route path="master/customer/" element={<CustomersMaster />}>
              <Route path="list" element={<CustomerList />} />
              <Route path="add-new" element={<CreateCustomer />} />
              <Route path="add-new/:cust_code" element={<CreateCustomer />} />
            </Route>
            <Route path="master/ratechart/*" element={<RatechartMaster />}>
              <Route path="previous/list" element={<PreviousRatechart />} />
              <Route path="add/new-type" element={<AddtypeRatechart />} />
              <Route path="save" element={<SaveRatecharts />} />
              <Route path="update" element={<Updateratecharts />} />
              <Route path="apply" element={<Applyratecharts />} />
              <Route path="*" element={<PreviousRatechart />} />
            </Route>
            <Route path="master/employee/*" element={<EmployeeMaster />} />
            <Route path="master/bank/*" element={<BankMaster />} />
            <Route path="master/deductions/*" element={<DeductionMaster />} />
            <Route path="master/doctor/*" element={<DoctorMaster />} />
            <Route path="master/animal" element={<AnimalMaster />} />
            <Route path="master/tancker" element={<TanckerMaster />} />
            {/* purchase routes */}
            <Route path="purchase/cattlefeed/*" element={<PurchaseMaster />} />
            <Route
              path="purchase/grocery/*"
              element={<PurchaseGroceryMaster />}
            />
            <Route
              path="purchase/medicines/*"
              element={<PurchaseMedicinesMaster />}
            />
            <Route path="purchase/other/*" element={<OthersPurMaster />} />
            {/* sales routes */}
            <Route path="sales/cattlefeed/*" element={<CattleFeedMaster />} />
            <Route path="sales/grocery/*" element={<GroceryMaster />} />
            <Route path="sales/medicines/*" element={<MedicinesMaster />} />
            <Route path="sales/other-items/*" element={<OthersMaster />} />
            {/* reports routes */}
            <Route path="reports/center/*" element={<CenterReports />} />
            <Route path="reports/milk/*" element={<MilkcollectionReports />} />
            <Route path="reports/customer/*" element={<CustomerReports />} />
            <Route path="reports/employee/*" element={<ComingSoon />} />
            <Route path="reports/inventory/*" element={<InventoryRports />} />
            <Route path="reports/sales/*" element={<ComingSoon />} />
            <Route path="reports/payment/*" element={<PaymentReports />} />
            <Route path="reports/bank/*" element={<BankReportMaster />} />
            <Route path="reports/deduction/*" element={<Deductionlist />} />
            <Route path="reports/Milkbill/*" element={<Milkbill />} />
            <Route
              path="reports/SanghMilkReport/*"
              element={<SanghMilkReport />}
            />
            <Route path="reports/lossgain/*" element={<Lossgainreport />} />
            <Route path="reports/tanker" element={<TankerReport />} />
            <Route path="reports/milkBuySale" element={<MilkBuySale />} />
            {/* payment routes */}
            <Route
              path="payment/milk-correction/*"
              element={<MilkCorrection />}
            />
            <Route path="payment/milk-transfer/*" element={<MilkTransfer />} />{" "}
            <Route path="payment/fill-name/*" element={<DedeutionName />} />
            {/* <Route
              path="payment/add-deductions/*"
              element={<PayDeductions />}
            /> */}
            <Route path="payment/generate/*" element={<PaymentPages />} />
            <Route path="payment/fatsnf" element={<FatSnfCompromise />} />
            {/* dairy routes */}
            <Route path="dairy/information" element={<DairyInfo />} />
            <Route path="dairy/initial-info" element={<DairyInitialInfo />} />
            <Route path="dairy/setup" element={<DairySetup />} />
            <Route path="dairy/create/center" element={<Centers />} />
            <Route path="dairy/whatsapp-sms" element={<WhatsappSms />} />
            {/* settings routes */}
            <Route path="settings/dairy/*" element={<DairySetup />} />
            <Route path="settings/inventory" element={<InventorySettings />} />
            <Route path="report/problem" element={<ReportProblem />} />
            {/* Profile route */}
            <Route path="profile-info" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Mainapp;
