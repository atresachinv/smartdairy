import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { mobileMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Milkcollection.css";
import { toast } from "react-toastify";

const SankalanReport = () => {
  const dispatch = useDispatch();
  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );

  useEffect(() => {
    dispatch(mobileMilkCollReport());
  }, []);

  // Function to download Excel file
  const downloadExcel = () => {
    if (mobileMilkReport.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel (excluding automatic headers)
    const excelData = mobileMilkReport.map((collection, index) => [
      index + 1, // NO
      collection.rno, // Code
      collection.cname, // Customer Name
      collection.Litres, // Liters
      collection.SampleNo, // Sample No
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["NO.", "Code", "Customer Name", "Liters", "Sample No."], // Headings
      ...excelData, // Data rows
    ]);

    // Get current date and time for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const formattedTime = `${String(now.getHours()).padStart(2, "0")}-${String(
      now.getMinutes()
    ).padStart(2, "0")}-${String(now.getSeconds()).padStart(2, "0")}`;
    const fileName = `Mobile_Milk_Collection_${formattedDate}_${formattedTime}.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };


  return (
    <div className="mobile-milk-collection-report w100 h1 d-flex-col center sa">
      <div className="page-title-button-div w100 h10 d-flex sb">
        <span className="heading h10 py10">Milk Collection Report</span>
        <button className="btn" onClick={downloadExcel}>
          Download Excel
        </button>
      </div>
      <div className="milk-collection-info-div w80 h90 d-flex-col sa p12 bg">
        <div className="collection-info-heading w100 h10 d-flex a-center t-center sa bg1">
          <span className="label-text w10">NO.</span>
          <span className="label-text w10">Code</span>
          <span className="label-text w30">Customer Name</span>
          <span className="label-text w15">Liters</span>
          <span className="label-text w20">Sample No.</span>
        </div>
        <div className="milk-collection-data-div w100 d-flex-col h90 mh90 hidescrollbar">
          {mobileMilkReport.length > 0 ? (
            mobileMilkReport.map((collection, index) => (
              <div
                key={index}
                className={`collection-info-heading w100 h10 d-flex a-center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}>
                <span className="text w10">{index + 1}</span>
                <span className="text w10">{collection.rno}</span>
                <span className="text w30">{collection.cname}</span>
                <span className="text w15">{collection.Litres}</span>
                <span className="text w20">{collection.SampleNo}</span>
              </div>
            ))
          ) : (
            <div className="wh100 d-flex center">
              <span>No Records Found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SankalanReport;
