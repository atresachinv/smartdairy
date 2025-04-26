import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPayMasters,
  lockMilkPaydata,
} from "../../../../App/Features/Payments/paymentSlice";
import { toast } from "react-toastify";
import Spinner from "../../../Home/Spinner/Spinner";

const LockPayments = ({ showbtn, setCurrentPage }) => {
  const dispatch = useDispatch();
  const payMasters = useSelector((state) => state.payment.paymasters || []);
  const payMstatus = useSelector((state) => state.payment.pmaststatus);
  const lockPaystatus = useSelector((state) => state.payment.lockPaytstatus);
  const [updatedPayMasters, setUpdatedPayMasters] = useState([]);

  // Fetch payment masters ----------------------------------------->
  useEffect(() => {
    dispatch(getPayMasters());
  }, [dispatch]);

  // Sync local copy when payMasters change ------------------------->
  useEffect(() => {
    setUpdatedPayMasters(payMasters.map((item) => ({ ...item })));
  }, [payMasters]);

  // Handle checkbox change
  const handleCheckboxChange = (e, index) => {
    const updated = [...updatedPayMasters];
    updated[index].islock = e.target.checked ? 1 : 0;
    setUpdatedPayMasters(updated);
  };

  // Handle submit of checked checkboxes ------------------------->
  const handleSubmitLocked = async () => {
    try {
      await dispatch(
        lockMilkPaydata({
          updates: updatedPayMasters.map(({ FromDate, ToDate, islock }) => ({
            fromDate: FromDate.slice(0, 10),
            toDate: ToDate.slice(0, 10),
            islock,
          })),
        })
      ).unwrap();

      toast.success("Payment lock status updated successfully!");
      dispatch(getPayMasters());
    } catch (error) {
      console.error("Error updating lock status:", error);
      toast.error("Update failed!");
    }
  };

  return (
    <div className="lock-payment-container w100 h1 d-flex-col a-center p10">
      <div className="lock-unlock-payment-container w50 h1 d-flex-col">
        <div className="title-back-btn-container w100 h10 d-flex a-center sb">
          <span className="heading py10">Lock / Unlock Payments :</span>
          {showbtn ? (
            <button
              className="btn-danger mx10"
              onClick={() => setCurrentPage("main")}
            >
              बाहेर पडा
            </button>
          ) : (
            ""
          )}
        </div>
        <div className="payment-master-dates-lock-container w100 h80 mh80 d-flex-col hidescrollbar bg">
          <div className="master-heading-container w100 p10 d-flex a-center sb t-center sticky-top bg7">
            <span className="f-label-text w70">Payment Masters</span>
            <span className="f-label-text w25">Lock/Unlock</span>
          </div>
          {payMstatus === "loading" ? (
            <div className="box d-flex center">
              <Spinner />
            </div>
          ) : updatedPayMasters.length > 0 ? (
            updatedPayMasters.map((master, index) => (
              <div
                key={index}
                className="master-data-container w100 p10 d-flex a-center sb t-center"
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}
              >
                <span className="info-text w70">
                  <span className="mx10">{master.FromDate.slice(0, 10)}</span>-{" "}
                  {master.ToDate.slice(0, 10)}
                </span>
                <input
                  className="w25 h70"
                  type="checkbox"
                  checked={master.islock === 1}
                  onChange={(e) => handleCheckboxChange(e, index)}
                />
              </div>
            ))
          ) : (
            <div className="no-data-container w100 h100 d-flex a-center j-center">
              <span className="no-data-text">No Payment Masters Available</span>
            </div>
          )}
        </div>
        <div className="button-container w100 h10 d-flex a-center j-end">
          <button
            className="btn mx10"
            onClick={handleSubmitLocked}
            disabled={lockPaystatus === "loading"}
          >
            {lockPaystatus === "loading" ? "updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LockPayments;
