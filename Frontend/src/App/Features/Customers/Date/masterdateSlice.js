import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  masterlist: [],
};

const manualMasterSlice = createSlice({
  name: "manualmaster",
  initialState,
  reducers: {
    generateMaster(state, action) {
      const currentDate = action.payload; // Get the current date from the payload
      const [currentYear, currentMonth, currentDay] = currentDate
        .split("-")
        .map(Number);

      // Determine the start year of the financial year
      const startYear = currentMonth >= 4 ? currentYear : currentYear - 1;

      const masterlists = [];

      for (let year = startYear; year <= currentYear; year++) {
        const startMonth = year === startYear ? 4 : 1; // Start from April in startYear, January otherwise
        const endMonth = year === currentYear ? currentMonth : 12; // End at currentMonth in currentYear, December otherwise

        for (let month = startMonth; month <= endMonth; month++) {
          const daysInMonth = new Date(year, month, 0).getDate();
          const isCurrentMonth = year === currentYear && month === currentMonth;

          // First slot: 1-10
          masterlists.push({
            start: `${year}-${String(month).padStart(2, "0")}-01`,
            end: `${year}-${String(month).padStart(2, "0")}-10T00:00:00.000`,
          });

          // Add second slot only if the date is not between 1-10 of the current month
          if (!(isCurrentMonth && currentDay <= 10)) {
            masterlists.push({
              start: `${year}-${String(month).padStart(2, "0")}-11`,
              end: `${year}-${String(month).padStart(2, "0")}-20T00:00:00.000`,
            });
          }

          // Add third slot only if the date is not between 1-20 of the current month
          if (!(isCurrentMonth && currentDay <= 20)) {
            masterlists.push({
              start: `${year}-${String(month).padStart(2, "0")}-21`,
              end: `${year}-${String(month).padStart(2, "0")}-${
                isCurrentMonth
                  ? String(currentDay).padStart(2, "0")
                  : daysInMonth
              }T00:00:00.000`,
            });
          }
        }
      }

      // Sort the masterlists array by the start date in descending order
      masterlists.sort((a, b) => new Date(b.start) - new Date(a.start));

      state.masterlist = masterlists; // Update the state with the sorted masterlist
    },
  },
});

export const { generateMaster } = manualMasterSlice.actions;

export default manualMasterSlice.reducer;
