import { configureStore } from "@reduxjs/toolkit";
import dateReducer from "./Features/Customers/Date/dateSlice";
import milkReducer from "./Features/Customers/Milk/milkSlice";

export const store = configureStore({
  reducer: {
    date: dateReducer,
    milk: milkReducer,
  },
});
