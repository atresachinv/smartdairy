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

export const store = configureStore({
  reducer: {
    date: dateReducer,
    milk: milkReducer,
    mMilk: milkMasterReducer,
    dairy: dairyReducer,
    profile: profileReducer,
    master: masterdateReducer,
    masterdates: mastersReducer, // for master date list
    purchase: purchaseReducer,
    deduction: deductionReducer,
  },
});
