import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as xlsx from "xlsx";
import {
  fetchMaxRcCode,
  listRateCharts,
  fetchRateChart,
  setData,
  deleteRatechart,
  fetchMaxRctype,
} from "../../../../../App/Features/Mainapp/Masters/rateChartSlice";
import { toast } from "react-toastify";
import "../../../../../Styles/Mainapp/Masters/MilkRateMaster.css";
import { useTranslation } from "react-i18next";

const PreviousRatechart = () => {
  const { t } = useTranslation("ratechart");
  const dispatch = useDispatch();
  const { status, progress } = useSelector((state) => state.ratechart);
  const deletercstatus = useSelector((state) => state.ratechart.deletercstatus);
  const ratechartlist = useSelector(
    (state) => state.ratechart.ratechartList || []
  );
  const Selectedrc = useSelector((state) => state.ratechart.selectedRateChart);

  const [selectedRateChart, setSelectedRateChart] = useState(null);
  const [rate, setRate] = useState([]);

  const [fileName, setFileName] = useState("");

  useEffect(() => {
    dispatch(fetchMaxRcCode());
    dispatch(fetchMaxRctype());
    dispatch(listRateCharts());
    if (!fileName) {
      dispatch(setData([]));
      return;
    }
  }, [dispatch]);

  // Function to handle row click
  const handleRowClick = (ratechart) => {
    // If the clicked rate chart is already selected, deselect it
    if (selectedRateChart === ratechart) {
      setSelectedRateChart(null);
    } else {
      setSelectedRateChart(ratechart);
      dispatch(
        fetchRateChart({
          rccode: ratechart.rccode,
          rcdate: ratechart.rcdate,
          rctype: ratechart.rctypename,
        })
      );
    }
  };

  // Handle show Ratechart button
  const ShowRatechart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to Show.");
      return;
    } else {
      await setRate(Selectedrc);
    }
  };

  const deleteSelectedRateChart = async (e) => {
    e.preventDefault();
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to delete.");
      return;
    }
    const ratechartDate = selectedRateChart.rcdate.slice(0, 10);
    const result = await dispatch(
      deleteRatechart({
        rccode: selectedRateChart.rccode,
        rcdate: ratechartDate,
      })
    ).unwrap();
    if (result.status === 200) {
      toast.success(result.message);
      dispatch(fetchMaxRcCode());
      dispatch(listRateCharts());
      setSelectedRateChart(null);
    } else {
      toast.error(result.message);
    }
  };

  const downloadRateChart = async () => {
    if (!selectedRateChart) {
      toast.error("Please select a rate chart to download.");
      return;
    } else {
      // Convert data to worksheet
      const worksheet = xlsx.utils.json_to_sheet(Selectedrc);

      // Create a new workbook and append the worksheet
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Rate Chart");

      // Generate a Blob for the Excel file
      const excelBuffer = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      // Trigger the download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "rate_chart.xlsx"; // Specify the file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="previous-rate-chart-outer-container w100 h1 d-flex sb p10">
      <div className="previous-ratechart-container w40 h1 d-flex-col bg-light-green br9">
        <span className="heading mt-10">{t("rc-prev-rc")} : </span>
        <span className="tip-text">
          ( दरपत्रक निवडण्यासाठी खाली दिलेल्या योग्य दरपत्रकावर क्लिक करा )
        </span>{" "}
        <div className="previous-rate-chart-container w100 h70 d-flex-col mh100 hidescrollbar">
          <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 bg1 sticky-top">
            <span className="f-info-text w10">{t("rc-no")}</span>
            <span className="f-info-text w20">{t("rc-date")}</span>
            <span className="f-info-text w25">{t("rc-type")}</span>
          </div>
          {ratechartlist.length > 0 ? (
            ratechartlist
              .slice()
              .sort((a, b) => a.rccode - b.rccode)
              .map((ratechart, index) => (
                <div
                  onClick={() => handleRowClick(ratechart)}
                  key={index}
                  className="rate-chart-row-value w100 d-flex a-center t-center py10 sa"
                  style={{
                    backgroundColor:
                      selectedRateChart === ratechart
                        ? "#d1e7dd"
                        : index % 2 === 0
                        ? "#faefe3"
                        : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <span className="info-text w10">{ratechart.rccode}</span>
                  <span className="info-text w20">
                    {new Date(ratechart.rcdate).toLocaleDateString("en-GB", {
                      year: "2-digit",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="info-text w25">{ratechart.rctypename}</span>
                </div>
              ))
          ) : (
            <div className="box d-flex center">
              <span className="label-text">No Record Found!</span>
            </div>
          )}
        </div>
        <div className="button-div w100 h10 d-flex a-center j-start my10 sa">
          <button
            type="button"
            className="w-btn"
            disabled={deletercstatus === "loading"}
            onClick={deleteSelectedRateChart}
          >
            {deletercstatus === "loading"
              ? `${t("rc-deleting-btn")}`
              : `${t("rc-del-btn")}`}
          </button>
          <button
            type="button"
            className="w-btn"
            disabled={status === "loading"}
            onClick={downloadRateChart}
          >
            {t("rc-download-btn")}
          </button>
          <button
            type="button"
            className="w-btn"
            disabled={status === "loading"}
            onClick={ShowRatechart}
          >
            {t("rc-show-btn")}
          </button>
        </div>
      </div>
      <div className="rate-chart-container w45 h1 d-flex-col bg">
        <span className="heading p10">{t("दरपत्रक ")} : </span>
        <div className="rate-chart-div w100 h1 mh100 d-flex-col hidescrollbar">
          <div className="rate-chart-col-title w100 d-flex a-center t-center sa py10 sticky-top bg7">
            <span className="f-info-text w15">{t("rc-fat")}</span>
            <span className="f-info-text w10">{t("rc-snf")}</span>
            <span className="f-info-text w15">{t("rc-rate")}</span>
          </div>
          {rate.length > 0 ? (
            rate.map((item, index) => (
              <div
                key={`${item.fat}-${item.snf}-${index}`}
                className={`rate-chart-row-value w100 h10 d-flex a-center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                {/* <span className="info-text w5">{index + 1}</span> */}
                <span className="info-text w15">
                  {item.fat !== undefined ? item.fat.toFixed(1) : "N/A"}
                </span>
                <span className="info-text w10">
                  {item.snf !== undefined ? item.snf.toFixed(1) : "N/A"}
                </span>
                <span className="info-text w15">
                  {item.rate !== undefined ? item.rate.toFixed(2) : "N/A"}
                </span>
              </div>
            ))
          ) : fileName === "" || null ? (
            <div className="box d-flex center label-text">
              {t("rc-rc-msg1")}
            </div>
          ) : rate.length === 0 ? (
            <div className="box d-flex center label-text">
              {t("rc-rc-msg2")}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviousRatechart;
