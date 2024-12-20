import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaDownload } from "react-icons/fa6";
import * as XLSX from "xlsx";
import { mobileMilkCollReport } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";
import { useTranslation } from "react-i18next";

const MilkCollectorsReports = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const tDate = useSelector((state) => state.date.toDate);
  const mobileMilkReport = useSelector(
    (state) => state.milkCollection.mobileColl
  );

  useEffect(() => {
    dispatch(mobileMilkCollReport());
  }, [dispatch]);

  const calculateTotalLiters = (data) => {
    return data.reduce((total, item) => total + parseFloat(item.Litres), 0);
  };

  const records = mobileMilkReport.length;
  const totalLiters = calculateTotalLiters(mobileMilkReport);

  // Function to download Excel file
  const downloadExcel = () => {
    if (mobileMilkReport.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel (excluding automatic headers)
    const excelData = mobileMilkReport.map((collection) => [
      collection.rno,
      collection.cname,
      collection.Litres,
      collection.SampleNo,
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      ["Code", "Customer Name", "Liters", "Sample No."],
      ...excelData,
      [],
      ["Total Liters", "=", totalLiters.toFixed(2)],
    ]);

    // Get current date and time for the file name
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const fileName = `Mobile_Milk_Collection_${formattedDate}.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, fileName);
  };
  return (
    <>
       <div className="mobile-milk-collection-report w100 h1 d-flex-col center sa">
            <div className="page-title-button-div w70 h10 d-flex a-center sb">
              <label className="heading w80">
                {t("milkcollection:m-milk-coll-report")}
                <span className="label-text px10">{tDate}</span>
              </label>
              <button className="btn" onClick={downloadExcel}>
                <span className="f-heading px10">
                  {t("milkcollection:m-d-excel")}
                </span>
                <FaDownload />
              </button>
            </div>
            <div className="milk-collection-info-div w70 h80 d-flex-col sa bg">
              <div className="collection-info-heading w100 h10 d-flex a-center t-center sa bg1">
                <span className="f-label-text w10">
                  {t("milkcollection:m-cust-code")}
                </span>
                <span className="f-label-text w40">
                  {t("milkcollection:m-cust-name")}
                </span>
                <span className="f-label-text w10">{t("c-liters")}</span>
                <span className="f-label-text w20">
                  {" "}
                  {t("milkcollection:m-sample-no")}
                </span>
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
                      <span className="text w10">{collection.rno}</span>
                      <span className="text w40 t-center">{collection.cname}</span>
                      <span className="text w10">{collection.Litres}</span>
                      <span className="text w20">{collection.SampleNo}</span>
                    </div>
                  ))
                ) : (
                  <div className="w100 h1 d-flex center">
                    <span className="label-text">{t("c-no-data-avai")}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mobile-milk-btns w100 h10 d-flex a-center j-center sa">
              <span className="heading py10">
                {t("milkcollection:m-count")} : {records}
              </span>
              <span className="heading py10">
                {t("milkcollection:m-t-liters")} : {totalLiters.toFixed(2)}
              </span>
            </div>
          </div>
    </>
  );
};

export default MilkCollectorsReports;
