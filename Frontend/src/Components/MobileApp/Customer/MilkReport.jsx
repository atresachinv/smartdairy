import axios from "axios";
import React, { useEffect, useState } from "react";
import Spinner from "../../Home/Spinner/Spinner";

const MilkReport = () => {
  const currentDate = new Date();
  const toDate = currentDate.toISOString().split("T")[0];

  const day = toDate.slice(8, 10);
  const date = toDate.slice(0, 8);
  let startDay = 0;
  if (day <= 10) {
    startDay = 1;
  } else if (day <= 20) {
    startDay = 11;
  } else {
    startDay = 21;
  }
  const fromDate = date + startDay;

  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Retrieve values from localStorage
    const SocietyCode = localStorage.getItem("SocietyCode");
    const AccCode = localStorage.getItem("AccCode");

    console.log(SocietyCode, AccCode);

    // Ensure both values are available before making the request
    if (SocietyCode && AccCode) {
      const Values = { SocietyCode, AccCode };

      axios
        .post("/app/milk-report", Values)
        .then((res) => {
          console.log(res.data);

          setRecords(res.data.records);
          setSummary(res.data.summary);
        })
        .catch((err) => {
          console.log(err.message);
        })
        .finally(() => {
          setLoading(false); // Stop loading after data fetch
        });
    } else {
      console.error("SocietyCode and AccCode must be set in localStorage");
      setLoading(false); // Stop loading if data is missing
    }
  }, []);

  return (
    <>
      <div className="cust-milk-col-report w100 h1 d-flex-col bg">
        <div className="menu-title-div w100 h10 d-flex p10">
          <h2 className="heading">Current Payment Milk Collection</h2>
        </div>
        <div className="current-pay-milk-report w100 h90 d-flex-col">
          <div className="pay-title-div w100 d-flex a-center sa px10">
            <div className="date-div w80 text d-flex">
              Date: from: {fromDate} - to: {toDate}
            </div>
            <button className="save-btn-btn w30 text d-flex j-center">
              SAVE PDF
            </button>
          </div>
          <div className="invoice-of-collection-div w100 h90 d-flex-col">
            <div className="invoice-title-div w100 h10 d-flex a-center">
              <span className="heading">Collection Details :</span>
            </div>
            <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
              <span className="text w15">Date</span>
              <span className="text w5">M/E</span>
              <span className="text w5">C/B</span>
              <span className="text w10">Liters</span>
              <span className="text w5">FAT</span>
              <span className="text w5">SNF</span>
              <span className="text w10">Rate</span>
              <span className="text w15">Amount</span>
            </div>

            {loading ? (
              <div className="d-flex center">
                <Spinner />
              </div>
            ) : (
              <div className="report-data-container w100 h90 d-flex-col hidescrollbar">
                {records.length > 0 ? (
                  records.map((report, index) => (
                    <div
                      key={index}
                      className="content-values-div w100 h10 d-flex center t-center sa px10">
                      <span className="text w15">
                        {new Date(report.ReceiptDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </span>
                      <span className="text w5">
                        {report.ME === 0 ? "M" : "E"}
                      </span>
                      <span className="text w5">
                        {report.CB === 0 ? "C" : "B"}
                      </span>
                      <span className="text w10">
                        {parseFloat(report.Litres).toFixed(1)}
                      </span>
                      <span className="text w5">
                        {parseFloat(report.fat).toFixed(1)}
                      </span>
                      <span className="text w5">
                        {parseFloat(report.snf).toFixed(1)}
                      </span>
                      <span className="text w10">
                        {parseFloat(report.Rate).toFixed(1)}
                      </span>
                      <span className="text w15">
                        {parseFloat(report.Amt).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="box d-flex center subheading">
                    No data available
                  </div>
                )}
              </div>
            )}
            <div className="content-titles-div w100 h10 d-flex center t-center sa px10">
              <span className="text w15">Total : </span>
              <span className="text w5"></span>
              <span className="text w5"></span>
              <span className="text w10">
                {parseFloat(summary.totalLiters)?.toFixed(1)}
              </span>
              <span className="text w5">
                {parseFloat(summary.avgFat)?.toFixed(1)}
              </span>
              <span className="text w5">
                {parseFloat(summary.avgSNF)?.toFixed(1)}
              </span>
              <span className="text w10">
                {parseFloat(summary.avgRate)?.toFixed(1)}
              </span>
              <span className="text w15">
                {parseFloat(summary.totalAmount)?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MilkReport;
