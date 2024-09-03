import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toDate: "",
  formDate: "",
};

const dateSlice = createSlice({
  name: "date",
  initialState,
  reducers: {
    setToDate(state) {
      const date = new Date();
      const formattedDate = date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      state.toDate = formattedDate;
    },
    setFormDate(state) {
      const day = state.toDate.slice(8, 10);
      const date = state.toDate.slice(0, 8);
      let startDay = "0";
      if (day <= 10) {
        startDay = "01" ;
      } else if (day <= 20) {
        startDay = "11";
      } else {
        startDay = '21';
      }
      state.formDate = date + startDay;
    },
  },
});

export const { setToDate, setFormDate } = dateSlice.actions;
export default dateSlice.reducer;
