import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./Features/Customers/Date/dateSlice";
import milkReducer from "./Features/Customers/Milk/milkSlice";
import milkMasterReducer from "./Features/Customers/Milk/milkMasterSlice";
import dairyReducer from "./Features/Admin/Dairyinfo/dairySlice";
import profileReducer from "./Features/Customers/Profile/profileSlice";
import masterdateReducer from "./Features/Customers/Date/masterdateSlice";
import mastersReducer from "./Features/Customers/Date/masterSlice";
import purchaseReducer from "./Features/Purchase/purchaseSlice";
import deductionReducer from "./Features/Deduction/deductionSlice";
import paymentReducer from "./Features/Payments/paymentSlice";
import dashboardReducer from "./Features/Customers/Dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    milk: milkReducer,
    mMilk: milkMasterReducer,
    dairy: dairyReducer,
    profile: profileReducer, //for profile info
    master: masterdateReducer,
    masterdates: mastersReducer, // for master date list from db
    purchase: purchaseReducer,
    deduction: deductionReducer,
    payment: paymentReducer,
    dashboard: dashboardReducer,
  },
});
