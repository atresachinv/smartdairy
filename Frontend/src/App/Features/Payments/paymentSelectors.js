import { createSelector } from "@reduxjs/toolkit";

export const selectPaymasters = createSelector(
  (state) => state.payment.paymasters,
  (paymasters) => paymasters || []
);
