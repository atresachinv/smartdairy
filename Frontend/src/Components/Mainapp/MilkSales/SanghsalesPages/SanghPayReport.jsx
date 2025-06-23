import { useEffect, useRef, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Spinner from "../../../Home/Spinner/Spinner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSanghaList,
  getSangahPayment,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import SanghaMilkPayment from "./SanghaMilkPayment";
import "../../../../Styles/Mainapp/MilkSales/SanghMilkColl.css";

const SanghPayReport = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const sanghaList = useSelector((state) => state.sangha.sanghaList); // sangha list
  const sanghaPayment = useSelector((state) => state.sangha.sanghaPayment); // sangha milk collection
  const sanghaSales = useSelector((state) => state.sangha.sanghaSales); // sangha Sales
  const payStatus = useSelector((state) => state.sangha.getPaystatus); // fetch sangha milk collection status
  const sanghaRef = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModalsOpen, setModalsOpen] = useState(false);
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [fromDate, setFromDate] = useState(tDate);
  const [toDate, setToDate] = useState(tDate);
  const [sanghaid, setSanghaid] = useState("");
  const [sanghaBill, setSanghaBill] = useState([]);
  useEffect(() => {
    dispatch(fetchSanghaList());
  }, []);

  useEffect(() => {
    const sanghaPay = sanghaPayment.filter(
      (payment) => payment.ledgerCode === 0
    );
    setSanghaBill(sanghaPay);
  }, [sanghaPayment]);

  // handle enter press move cursor to next refrence Input -------------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const handleShowbtn = (e) => {
    e.preventDefault();
    dispatch(getSangahPayment({ fromDate, toDate, sanghaid }));
  };
  return (
    <div className="sanghsale-report-container w100 h1 d-flex-col p10 sb">
      <div className="sangha-sales-date-buttons-div w100 h30 d-flex-col bg-light-green sa br9">
        <span className="heading mx10">संघ दुध पेमेंट रिपोर्ट :</span>
        <div className="sangha-from-to-datediv-container w100 h30 d-flex sa a-center">
          <div className="sangha-from-to-datediv-div w50 h1 d-flex sb">
            <div className="sanghaa-from-date-div w50 h1 d-flex a-center sb">
              <span className="label-text w30 px10">
                पासून : <span className="req w40">*</span>
              </span>
              <input
                className="data w60"
                value={fromDate}
                type="date"
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="sanghaa-from-date-div w50 h1 d-flex a-center sb">
              <span className="label-text w30 px10">
                पर्यत : <span className="req w40">*</span>
              </span>
              <input
                className="data w60"
                value={toDate}
                type="date"
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
          </div>
          <div className="select-sangh-div w50 h30 d-flex a-center px10">
            <label htmlFor="sanghid" className="label-text w30">
              संघ निवडा : <span className="req w30">*</span>
            </label>
            <select
              className="data w70"
              name="sanghid"
              id="sanghid"
              value={sanghaid}
              onChange={(e) => setSanghaid(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, timeRef)}
              ref={sanghaRef}
            >
              <option value="">-- संघ निवडा --</option>
              {sanghaList.length > 0 ? (
                sanghaList.map((sangha, i) => (
                  <option key={i} value={sangha.id}>
                    {sangha.sangha_name}
                  </option>
                ))
              ) : (
                <option value="">-- संघ निवडा --</option>
              )}
            </select>
          </div>
        </div>
        <div className="sangha-sales-buttons-div w100 h30 d-flex j-end a-center px10">
          <button
            className="w-btn"
            type="button"
            disabled={payStatus === "loading"}
            onClick={handleShowbtn}
          >
            {payStatus === "loading" ? "दाखवा..." : "दाखवा"}
          </button>
        </div>
      </div>
      <div className="sangha-details-table-container w100 h60 d-flex-col bg mh70 hidescrollbar">
        <div className="sangha-sale-report-table-header w100 p10 d-flex a-center t-center sb sticky-top">
          <span className="f-label-text w15 t-center">दिनांक </span>
          <span className="f-label-text w15">एकूण पेमेंट </span>
          <span className="f-label-text w10">ए.कमिशन</span>
          <span className="f-label-text w10">ए.कपात</span>
          <span className="f-label-text w15">निव्वळ पेमेंट</span>
          <span className="f-label-text w10">Action</span>
        </div>

        {payStatus === "loading" ? (
          <Spinner />
        ) : sanghaBill.length > 0 ? (
          sanghaBill.map((milk, index) => (
            <div
              key={index}
              className="sangha-report-tabledata-section-div w100 p10 d-flex a-center sb"
              style={{
                backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
              }}
            >
              <span className="text w15">{milk.billdate?.slice(0, 10)}</span>
              <span className="text w15 t-end">{milk.totalAmount}</span>
              <span className="text w10 t-end">{milk.totalComm}</span>
              <span className="text w10 t-end">{milk.totalDeduction}</span>
              <span className="text w15 t-end">{milk.netPayment}</span>
              <span className="text w10 t-center">
                <FaEdit
                  className="color-icon"
                  onClick={() => {
                    setSelectedMilk(milk.billno);
                    setModalOpen(true);
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
          <SanghaMilkPayment
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

export default SanghPayReport;
