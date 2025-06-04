import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Features/Users/authSlice";
import dateReducer from "./Features/Customers/Date/dateSlice";
import milkReducer from "./Features/Customers/Milk/milkSlice";
import notificationReducer from "./Features/Notifications/notificationSlice";
import milkMasterReducer from "./Features/Customers/Milk/milkMasterSlice";
import dairyReducer from "./Features/Admin/Dairyinfo/dairySlice";
import dairyInfoReducer from "./Features/Mainapp/Dairyinfo/dairyDetailsSlice";
import customerReducer from "./Features/Customers/customerSlice";
import customersReducer from "./Features/Mainapp/Masters/custMasterSlice";
import centerReducer from "./Features/Dairy/Center/centerSlice";
import empReducer from "./Features/Mainapp/Masters/empMasterSlice";
import bankReducer from "./Features/Mainapp/Masters/bankSlice";
import doctorReducer from "./Features/Mainapp/Masters/doctorSlice";
import profileReducer from "./Features/Customers/Profile/profileSlice";
import mastersReducer from "./Features/Customers/Date/masterSlice";
import purchaseReducer from "./Features/Purchase/purchaseSlice";
import salesReducer from "./Features/Sales/salesSlice";
import milksalesReducer from "./Features/Mainapp/Milksales/milkSalesSlice";
import deductionReducer from "./Features/Deduction/deductionSlice";
import paymentReducer from "./Features/Payments/paymentSlice";
import dashboardReducer from "./Features/Customers/Dashboard/dashboardSlice";
import admindashReducer from "./Features/Mainapp/Dashboard/dashboardSlice";
import manualMasterReducer from "./Features/Customers/Date/masterdateSlice";
//Milk Collection
import custInfoReducer from "./Features/Mainapp/Dairyinfo/milkCollectionSlice";
import milkcolleReducer from "./Features/Mainapp/Milk/MilkCollectionSlice";
import milkUploadReducer from "./Features/Mainapp/Milk/UploadMilkSlice";
import dairyMilkSReducer from "./Features/Mainapp/Milk/DairyMilkSalesSlice";
//ratechart
import ratchartReducer from "./Features/Mainapp/Masters/rateChartSlice";
import registerReducer from "./Features/Dairy/registerSlice";
//user profile
import userDataReducer from "./Features/Mainapp/Profile/ProfileSlice";
// Inventory
import inventoryReducer from "./Features/Mainapp/Inventory/inventorySlice";
// super-admin
import accessReducer from "./Features/Admin/SuperAdmin/accessSlice"; //super-admin
import settingsReducer from "./Features/Mainapp/Settings/dairySettingSlice"; //super-admin
import sanghaReducer from "./Features/Mainapp/Sangha/sanghaSlice"; //super-admin
import ledgerReducer from "./Features/Mainapp/Masters/ledgerSlice"; //super-admin

import smsReducer from "./Features/Mainapp/Dairyinfo/smsSlice";
import voucherReducer from "./Features/Mainapp/Account/voucherSlice";

export const store = configureStore({
  reducer: {
    users: userReducer,
    userinfo: userDataReducer, //user profile info
    date: dateReducer,
    milk: milkReducer,
    milkUpload: milkUploadReducer, // milk collection upload
    notify: notificationReducer,
    mMilk: milkMasterReducer,
    dairy: dairyReducer,
    dairyInfo: dairyInfoReducer,
    customer: customerReducer,
    customers: customersReducer, // mainapp
    center: centerReducer,
    emp: empReducer, //mainapp
    bank: bankReducer, //mainapp
    doctor: doctorReducer, //mainapp
    sangha: sanghaReducer, //mainapp
    // register new dairy
    register: registerReducer,
    profile: profileReducer, //for profile info
    // master: masterdateReducer,
    masterdates: mastersReducer, // for master date list from db
    purchase: purchaseReducer,
    sales: salesReducer,
    milksales: milksalesReducer,
    dMilkSales: dairyMilkSReducer, // center milk sales
    deduction: deductionReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
    admindashboard: admindashReducer,
    manualMasters: manualMasterReducer,
    //Milk Collection
    custinfo: custInfoReducer,
    ratechart: ratchartReducer,
    milkCollection: milkcolleReducer,
    // Inventory
    inventory: inventoryReducer,
    access: accessReducer,
    dairySetting: settingsReducer,
    smsHistory: smsReducer,
    ledger: ledgerReducer,
    voucher: voucherReducer,
  },
});
