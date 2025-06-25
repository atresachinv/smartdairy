import { useEffect, useState } from "react";
import "../../../../Styles/SanghReport/SanghReport.css";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import Spinner from "../../../Home/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import Sanghsales from "./Sanghsales";
import {
  deletesanghaMilkColl,
  fetchsanghaLedger,
  fetchSanghaList,
  fetchsanghaMilkColl,
  fetchsanghaMilkDetails,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import SanghaMilkPayment from "./SanghaMilkPayment";
import Swal from "sweetalert2";
import "../../../../Styles/Mainapp/MilkSales/SanghMilkColl.css";

const SanghReport = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const sanghaMilkColl = useSelector((state) => state.sangha.sanghamilkColl); // sangha milk collection
  const sanghaSales = useSelector((state) => state.sangha.sanghaSales); // sangha Sales
  const sanghaList = useSelector((state) => state.sangha?.sanghaList || []); // sangha list
  const getstatus = useSelector((state) => state.sangha.fetchsmstatus); // fetch sangha milk collection status
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalsOpen, setModalsOpen] = useState(false);
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [fromDate, setFromDate] = useState(tDate);
  const [toDate, setToDate] = useState(tDate);
   

  console.log("sanghaMilkColl", sanghaMilkColl);
  useEffect(() => {
    dispatch(fetchSanghaList());
  }, []);

  const handleShowbtn = (e) => {
    e.preventDefault();
    dispatch(fetchsanghaMilkColl({ fromDate, toDate }));
    dispatch(fetchsanghaMilkDetails({ fromDate, toDate }));
    dispatch(fetchsanghaLedger());
  };
  
  // handle bill delete function ----------------------------------------------->
  const handleBillDelete = async (id) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this collection entry?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    
    if (result.isConfirmed) {
      if (id) {
        const res = await dispatch(deletesanghaMilkColl({ id })).unwrap();

        if (res?.status === 200) {
          dispatch(fetchsanghaMilkColl({ fromDate, toDate }));
          toast.success("Sangha milk collection deleted successfully!");
        } else {
          toast.error("Failed to delete sangha milk collection!");
        }
      } else {
        return toast.error("सर्व माहिती असणे गरजेचे आहे!");
      }
    }
  };

  
  return (
    <div className="sanghsale-report-container w100 h1 d-flex-col p10 sb">
      <span className="heading mx10">संघ दुध पेमेंट :</span>
      <div className="sangha-sales-date-buttons-div w100 h15 d-flex bg-light-green br9">
        <div className="sangha-from-to-datediv-container w50 h1  d-flex ">
          <div className="sangha-from-date-div w50 h1 d-flex a-center ">
            <span className="label-text w30 px10">पासून</span>
            <input
              className="data w80"
              value={fromDate}
              type="date"
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="sangha-from-date-div w50 h1 d-flex a-center ">
            <span className="label-text w30 px10">पर्यत</span>
            <input
              className="data w80"
              value={toDate}
              type="date"
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="sangha-sales-buttons-div w50 h1  d-flex sa a-center">
          <button className="w-btn" type="button" onClick={handleShowbtn}>
            दाखवा
          </button>
          <button
            className="w-btn"
            type="button"
            onClick={() => {
              setSelectedMilk(null);
              setModalsOpen(true);
            }}
          >
            बिल निर्माण
          </button>
        </div>
      </div>
      <div className="sangha-details-table-container w100 h60 d-flex-col bg mh60 hidescrollbar">
        <div className="sangha-sale-report-table-header-div w100 p10 d-flex a-center t-center sb sticky-top bg7">
          <span className="f-label-text w15 t-start">दिनांक </span>
          <span className="f-label-text w25">संघाचे नाव</span>
          <span className="f-label-text w10">चां. लिटर </span>
          <span className="f-label-text w10">क.प्र.लि</span>
          <span className="f-label-text w10">ना. लिटर</span>
          <span className="f-label-text w10">ए. रक्कम </span>
          <span className="f-label-text w5">टँ.नं.</span>
          <span className="f-label-text w10">Action</span>
        </div>

        {getstatus === "loading" ? (
          <Spinner />
        ) : sanghaMilkColl.length > 0 ? (
          sanghaMilkColl.map((milk, index) => (
            <div
              key={index}
              className="sangha-report-table-data w100 p10 d-flex a-center sb"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="text w15">{milk.colldate.slice(0, 10)}</span>
              {/* <span className="text w30">{milk.sanghid}</span> */}
              <span className="text w25">
                {sanghaList.find((sangha) => sangha.code === milk.sanghid)
                  ?.marathi_name || "-"}
              </span>
              <span className="text w10 t-end">{milk.liter}</span>
              <span className="text w10 t-end">{milk.kamiprat_ltr}</span>
              <span className="text w10 t-end">{milk.nash_ltr}</span>
              <span className="text w15 t-end">{milk.amt}</span>
              <span className="text w5 t-center">{milk.tankerno}</span>
              <span className="text w10 t-center d-flex se a-center">
                <FaEdit
                  className="color-icon"
                  onClick={() => {
                    setSelectedMilk(milk);
                    setModalOpen(true);
                  }}
                />
                <MdDeleteForever
                  className="req"
                  onClick={() => {
                    handleBillDelete(milk.id);
                  }}
                />
              </span>
            </div>
          ))
        ) : (
          <div className="box d-flex center">
            <span className="label-text">Data Not Found!</span>
          </div>
        )}
      </div>

      <div className="Daybook-button-div w100 h10 d-flex a-center j-end">
        <button className="btn">Day Book</button>
      </div>

      {isModalOpen && (
        <div className="model-container w100 d-flex center">
          <Sanghsales
            clsebtn={setModalOpen}
            isModalOpen={isModalOpen}
            editData={selectedMilk}
          />
        </div>
      )}
      {isModalsOpen && (
        <div className="model-container w100 d-flex center">
          <SanghaMilkPayment
            clsebtn={setModalsOpen}
            isModalsOpen={isModalsOpen}
            sanghaSales={sanghaSales}
            todate={toDate}
          />
        </div>
      )}
    </div>
  );
};

export default SanghReport;
