import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPencilSquare, BsTrash3 } from "react-icons/bs";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/Reports.css";

const MilkReports = () => {
  const [morningData, setMorningData] = useState([]);
  const [eveningData, setEveningData] = useState([]);
  const [totalMilk, setTotalMilk] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [date, setDate] = useState("2023-10-11");

  console.log(totalMilk);

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;
  useEffect(() => {
    if (date) {
      axios
        .get(`/milk/report?date=${date}`)
        .then((res) => {
          setMorningData(res.data.morningData || []);
          setEveningData(res.data.eveningData || []);
          setTotalMilk(res.data.totalMilk || 0);
          setTotalCustomers(res.data.totalCustomers || 0);
          setTotalAmount(res.data.totalAmount || 0);
        })
        .catch((err) => {
          console.log(err);
          setMorningData([]);
          setEveningData([]);
          setTotalMilk(0);
          setTotalCustomers(0);
          setTotalAmount(0);
        });
    }
  }, [date]);

  return (
    <div className="milk-collection-details-container w100 h1 d-flex-col p10 bg5">
      <div className="title-container w100 h10 p10">
        <h2 className="subtitle">Today's Milk Collection Report</h2>
      </div>
      <div className="milk-main-details w100 h10 d-flex sa my10">
        <div className="details-container w20 h1 d-flex-col a-center bg">
          <span className="sub-heading">Total Collection</span>
          <span className="text">{totalMilk} ltr</span>
        </div>
        <div className="details-container w20 h1 d-flex-col a-center bg">
          <span className="sub-heading">Total Customers</span>
          <span className="text">{totalCustomers}</span>
        </div>
        <div className="details-container w20 h1 d-flex-col a-center bg">
          <span className="sub-heading">Total Amount</span>
          <span className="text">{totalAmount} Rs.</span>
        </div>
      </div>

      <div className="milk-collection-time-wise w100 h80 d-flex-col">
        <div className="div title w100 h10 d-flex">
          <span className="heading h10">Milk Collection Details </span>
        </div>
        <div className="time-wise-milk-collection w100 h90 d-flex sa p10">
          <div className="morning-milk-collection w45 h1 d-flex-col bg">
            <span className="heading p10">Morning Collection</span>
            <div className="details-info-div w100 h10 d-flex a-center sa bg6 p10">
              <span className="w15 heading d-flex center">FAT</span>
              <span className="w15 heading d-flex center">SNF</span>
              <span className="w15 heading d-flex center">Litre</span>
              <span className="w15 heading d-flex center">Rate</span>
              <span className="w15 heading d-flex center">Amount</span>
              {/* <span className="w15 heading d-flex center">Edit</span>
              <span className="w15 heading d-flex center">Delete</span> */}
            </div>
            <div className="amt-info-details-div w100 mh100 hidescrollbar d-flex-col">
              {/* <div className="amt-info-div w100 h10 d-flex a-center sa">
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
              </div> */}
            </div>
          </div>
          <div className="evening-milk-collection w45 h1 d-flex-col bg">
            <span className="heading p10">Evening Collection</span>
            <div className="details-info-div w100 h10 d-flex a-center sa bg6 p10">
              <span className="w15 heading d-flex center">FAT</span>
              <span className="w15 heading d-flex center">SNF</span>
              <span className="w15 heading d-flex center">Litre</span>
              <span className="w15 heading d-flex center">Rate</span>
              <span className="w15 heading d-flex center">Amount</span>
              {/* <span className="w15 heading d-flex center">Edit</span>
              <span className="w15 heading d-flex center">Delete</span> */}
            </div>
            <div className="amt-info-details-div w100  mh100 hidescrollbar d-flex-col">
              {/* <div className="amt-info-div w100 h10 d-flex a-center sa">
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
                <span className="w15 text d-flex center">00</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilkReports;
