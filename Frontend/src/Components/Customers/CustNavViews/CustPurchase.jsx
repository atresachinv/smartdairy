import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPurchaseBill } from "../../../App/Features/Purchase/purchaseSlice";
import { generateMaster } from "../../../App/Features/Customers/Date/masterdateSlice";
import "../../../Styles/Customer/CustNavViews/CustPurchase.css";
import Spinner from "../../Home/Spinner/Spinner";

const CustPurchase = () => {
  const dispatch = useDispatch();
  const date = useSelector((state) => state.date.toDate);
  const master = useSelector((state) => state.master.masterlist);
  const purchaseBill = useSelector((state) => state.purchase.purchaseBill);
  const status = useSelector((state) => state.purchase.status);
  const psummary = useSelector((state) => state.purchase.psummary);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Generate master dates based on the initial date
  useEffect(() => {
    dispatch(generateMaster(date));
  }, [dispatch]);

  // Handle the date selection
  const handleSelectChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      const selectedDates = master[selectedIndex];
      setSelectedPeriod(selectedDates);

      // Dispatch the action with the selected fromDate and toDate
      dispatch(
        getPurchaseBill({
          formDate: selectedDates.start,
          toDate: selectedDates.end,
        })
      );
    }
  };

  return (
    <div className="purchase-info-div w100 h1 d-flex-col p10">
      <div className="menu-title-div w100 h10 d-flex p10">
        <h2 className="heading">Cattle Feeds</h2>
      </div>

      <div className="selection-container w100 p10 d-flex center">
        <span className="w40 heading px10">Select Period</span>
        <select
          className="custom-select text w50 p10 mh80 d-flex-col hidescrollbar"
          onChange={handleSelectChange}>
          <option value="">-- Select Master --</option>
          {master.map((dates, index) => (
            <option className="text" key={index} value={index}>
              {dates.start} To: {dates.end}
            </option>
          ))}
        </select>
      </div>

      <div className="purchase-details-container w100 h80 d-flex-col bg">
        <div className="menu-title-div w100 h10 d-flex p10">
          <h2 className="heading">Sales Details</h2>
        </div>

        <div className="purchase-table-titles w100 h10 t-center a-center d-flex sa bg4">
          <span className="text w15">Bill No.</span>
          <span className="text w15">Date</span>
          <span className="text w20">Product</span>
          <span className="text w15">Qty</span>
          <span className="text w15">Rate</span>
          <span className="text w15">Amount</span>
        </div>

        {/* Show Spinner while loading, otherwise show the purchase bill data */}
        {status === "loading" ? (
          <div className="w100 h80 d-flex center">
            <Spinner /> {/* Only display spinner where the data should be */}
          </div>
        ) : (
          <div className="purchase-detailsitable w100 h80 mh80 d-flex-col hidescrollbar p10">
            {purchaseBill.length > 0 ? (
              purchaseBill.map((bill, index) => (
                <div
                  key={index}
                  className="purchase-table-values w100 h10 t-center a-center d-flex sa my5">
                  <span className="text w15">{bill.BillNo}</span>
                  <span className="text w15">
                    {new Date(bill.BillDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                    })}
                  </span>
                  <span className="text w20">{bill.ItemName}</span>
                  <span className="text w15">{bill.Qty}</span>
                  <span className="text w15">{bill.Rate}</span>
                  <span className="text w15">{bill.Amount}</span>
                </div>
              ))
            ) : (
              <div className="box d-flex center subheading">
                No data available
              </div>
            )}
          </div>
        )}

        <div className="purchase-table-total w100 h10 t-center a-center d-flex sa bg4">
          <span className="text w15">Total</span>
          <span className="text w15"></span>
          <span className="text w20"></span>
          <span className="text w15">{psummary.totalQty}</span>
          <span className="text w15"></span>
          <span className="text w15">{psummary.totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default CustPurchase;
