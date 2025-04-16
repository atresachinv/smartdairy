import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsChevronDoubleLeft, BsChevronDoubleRight } from "react-icons/bs";
import "../../../../../Styles/PayDeductions/PayDeductions.css";
import { use } from "react";
import { listSubLedger } from "../../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { getDeductionDetails } from "../../../../../App/Features/Deduction/deductionSlice";
import {
  fetchLastMAMT,
  fetchPaymentDetails,
  saveOtherDeductions,
} from "../../../../../App/Features/Payments/paymentSlice";
import { toast } from "react-toastify";

const PayDeductions = () => {
  const dispatch = useDispatch();
  const inputRefs = useRef([]);
  const submitBtnRef = useRef(null);
  const centerid = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const data = useSelector((state) => state.payment.paymentDetails);
  const milkData = useSelector((state) => state.payment.paymentData);
  const deductionDetails = useSelector(
    (state) => state.deduction.deductionDetails || []
  );
  const SubLedgers = useSelector((state) => state.ledger.sledgerlist);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const deductions = useSelector((state) => state.payment.trnDeductions);
  const prevMamt = useSelector((state) => state.payment.lastMamt);
  const dedStatus = useSelector((state) => state.payment.savededstatus); // save other ded status
  const [payData, setPayData] = useState([]);
  const [filteredPayData, setFilteredPayData] = useState([]);
  const [filteredPayData2, setFilteredPayData2] = useState([]);
  const [mergedDeductions, setMergedDeductions] = useState([]);
  const [allDeductions, setAllDeductions] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [settings, setSettings] = useState({});
  const [custTrnDedu, setCustTrnDedu] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [customerName, setCustomerName] = useState(""); // customername
  const [currentIndex, setCurrentIndex] = useState(1); // corrent index of selected customer

  const [formData, setFormData] = useState({
    id: 0,
    billno: 0,
    billdate: "",
    formDate: "",
    toDate: "",
    code: 0,
    morningliters: "",
    eveningliters: "",
    totalcollection: "",
    morningcommission: "",
    eveningcommission: "",
    totalcommission: "",
    morningrebate: "",
    eveningrebate: "",
    totalrebate: "",
    totalPayment: "",
    totalAdvance: 0.0,
    transport: "",
    totalTransport: 0.0,
    totalDeduction: 0.0,
    netDeduction: 0.0,
    roundAmount: 0.0,
    netPayable: 0.0,
    netPayment: 0.0,
    minPayAmount: 0.0,
  }); // form data for the payment deduction

  // console.log("first", filteredPayData2, formData);

  const autoCenter = settings?.autoCenter;
  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  // // Effect to load customer list from local storage ------------------------------------------>
  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(getDeductionDetails(autoCenter));
  }, [dispatch]);

  // // Effect to load customer list from local storage ------------------------------------------>
  useEffect(() => {
    const custLists = customerlist.filter(
      (customer) => customer.centerid === centerid
    );
    setCustomerList(custLists);
  }, [customerlist]);

  //----------------------------------------------------------------->
  // Implemetation of customer prev next buttons and display customer name
  // Handling Code inputs ----------------------------->
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setCurrentIndex(Math.min(Math.max(value, 1), customerlist.length)); // Ensure within bounds
    } else {
      setCurrentIndex(""); // If not a valid number, reset to empty
    }
  };

  // Handling form data change -------------------------------------------------->
  const handleFormDataChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handling "Enter" key press ------------------------------------------------->
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = parseInt(e.target.value, 10);
      if (!isNaN(value)) {
        setCurrentIndex(Math.min(Math.max(value, 1), customerlist.length)); // Ensure within bounds
      }
    }
  };

  // Handling Prev Next Buttons ------------------------------------------------>

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === customerList.length ? 1 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 1 ? customerList.length : prevIndex - 1
    );
  };

  // Handle Milk Data display --------------------------------------------------->
  useEffect(() => {
    if (milkData && milkData.length > 0) {
      const currentCustomer = milkData.find(
        (entry) => parseInt(entry.rno, 10) === parseInt(currentIndex)
      );
      if (currentCustomer) {
        setFormData((prevData) => ({
          ...prevData,
          morningliters: currentCustomer.mrgMilk,
          eveningliters: currentCustomer.eveMilk,
          totalcollection: currentCustomer.mrgMilk + currentCustomer.eveMilk,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          morningliters: 0.0,
          eveningliters: 0.0,
          totalcollection: 0.0,
        }));
      }
      const customer = customerlist.find(
        (entry) => parseInt(entry.srno, 10) === parseInt(currentIndex)
      );
      if (currentCustomer) {
        setFormData((prevData) => ({
          ...prevData,
          morningcommission: currentCustomer.mrgMilk * customer.commission,
          eveningcommission: currentCustomer.eveMilk * customer.commission,
          totalcommission:
            currentCustomer.mrgMilk * customer.commission +
            currentCustomer.eveMilk * customer.commission,
          morningrebate: currentCustomer.mrgMilk * customer.rebet,
          eveningrebate: currentCustomer.eveMilk * customer.rebet,
          totalrebate:
            currentCustomer.mrgMilk * customer.rebet +
            currentCustomer.eveMilk * customer.rebet,
          transport: customer.transportation,
        }));
      } else if (!currentCustomer || !customer) {
        setFormData((prevData) => ({
          ...prevData,
          morningcommission: 0.0,
          eveningcommission: 0.0,
          totalcommission: 0.0,
          morningrebate: 0.0,
          eveningrebate: 0.0,
          totalrebate: 0.0,
          transport: 0.0,
        }));
      }
    }
  }, [milkData, customerlist, currentIndex]);

  //----------------------------------------------------------------------------->
  // Filter milk collection data for the current customer

  useEffect(() => {
    if (data && data.length > 0 && customerlist && customerlist.length > 0) {
      const updatedPayData = data.map((entry) => {
        const matchedCustomer = customerlist.find(
          (customer) => parseInt(customer.srno, 10) === parseInt(entry.Code, 10)
        );
        return {
          ...entry,
          cname: matchedCustomer?.cname || "",
        };
      });

      setPayData(updatedPayData); // Update payData state

      // Find the current customer and set customerName
      const currentCustomer = updatedPayData.find(
        (entry) => parseInt(entry.Code, 10) === currentIndex
      );
      if (currentCustomer) {
        setCustomerName(currentCustomer.cname || ""); // Set customer name or empty if not found
        setFormData((prevData) => ({
          ...prevData,
          id: currentCustomer.id || 0,
          code: currentCustomer.Code || 0,
          billno: currentCustomer.BillNo || 0,
          billdate: currentCustomer.BillDate
            ? currentCustomer.BillDate.slice(0, 10)
            : "",
          formDate: currentCustomer.FromDate.slice(0, 10) || "",
          toDate: currentCustomer.ToDate.slice(0, 10) || "",
          totalPayment: currentCustomer.pamt || 0.0,
          totalDeduction: currentCustomer.damt || 0.0,
          netPayable: currentCustomer.namt || 0.0,
        }));
      } else {
        // Reset formData and customerName if no matching customer is found
        setCustomerName("");
        setFormData((prevData) => ({
          ...prevData,
          id: 0,
          code: 0,
          billno: 0,
          billdate: "",
          formDate: "",
          toDate: "",
          totalPayment: 0.0,
          totalDeduction: 0.0,
          netPayable: 0.0,
        }));
      }
    } else {
      setPayData([]);
      setCustomerName("");
      setFormData((prevData) => ({
        ...prevData,
        id: 0,
        code: 0,
        billno: 0,
        billdate: "",
        formDate: "",
        toDate: "",
        totalPayment: 0.0,
        totalDeduction: 0.0,
        netPayable: 0.0,
      }));
    }
  }, [currentIndex, data, customerlist]);

  // fiter paydata for the current customer ------------------------------------->
  useEffect(() => {
    if (payData && currentIndex) {
      const matchedData = payData.filter(
        (item) => item.Code === currentIndex && item.DeductionId !== 0
      );
      const mDeduData = allDeductions.filter(
        (item) => item.AccCode === currentIndex
      );
      setFilteredPayData(matchedData);
      setFilteredPayData2(mDeduData);
    }
  }, [payData, allDeductions, currentIndex]);

  // mearge data deductions and deductionDetails -------------------------------------->
  useEffect(() => {
    if (deductionDetails && deductions && prevMamt) {
      const merged = deductions.map((deduction) => {
        const matchedDeduction = deductionDetails.find(
          (sub) => sub.GLCode === deduction.GLCode
        );
        const matchedPrevMamt = prevMamt.find(
          (prev) => prev.GLCode === deduction.GLCode
        );
        return {
          ...deduction,
          dname: matchedDeduction ? matchedDeduction.dname : "",
          DeductionId: matchedDeduction ? matchedDeduction.DeductionId : "",
          MAMT: matchedPrevMamt ? matchedPrevMamt.MAMT : 0.0,
        };
      });
      setMergedDeductions(merged);
    }
  }, [deductions, deductionDetails, prevMamt]);

  // handle deduction for perticular customer ----------------------------------->
  useEffect(() => {
    const customerdeductions = mergedDeductions.filter((item) => {
      return item.AccCode === currentIndex;
    });
    setCustTrnDedu(customerdeductions);
  }, [mergedDeductions, currentIndex]);

  //calculate total deduction for the customer ---------------------------------->
  useEffect(() => {
    if (custTrnDedu && custTrnDedu.length > 0) {
      const withCalculated = custTrnDedu.map((item) => {
        const mam = Math.abs(Number(item.MAMT) || 0);
        const total = Math.abs(Number(item.totalamt) || 0); // force +ve
        const amt = Math.abs(Number(item.Amt) || 0); // force +ve

        const net = mam + total - amt;

        return {
          ...item,
          Amt: amt,
          netamt: net,
        };
      });

      setAllDeductions(withCalculated);
    }
  }, [custTrnDedu]);

  // calculate grand total of all deductions ------------------------------------>
  useEffect(() => {
    const total = allDeductions.reduce((acc, item) => acc + (item.Amt || 0), 0);
    setGrandTotal(total);
  }, [allDeductions]);

  // Handle amount change for each deduction ------------------------------------>
  const handleAmtChange = (index, value) => {
    const amt = Math.abs(parseFloat(value)) || 0;

    const updated = [...allDeductions];
    const current = { ...updated[index] };

    const mam = Math.abs(current.MAMT || 0);
    const total = Math.abs(custTrnDedu[index]?.totalamt || 0);

    current.Amt = amt;
    current.netamt = mam + total - amt;

    updated[index] = current;
    setAllDeductions(updated);
  };

  // handle grand total change for all deductions --------------------------------->
 useEffect(() => {
   const netPayment = formData.netPayable - grandTotal;
   const rounded = Math.floor(netPayment);
   const roundAmount = parseFloat((netPayment - rounded).toFixed(1));

   setFormData((prevData) => ({
     ...prevData,
     totalTransport: formData.totalcollection * formData.transport,
     netDeduction: formData.totalDeduction + grandTotal,
     netPayment: netPayment - roundAmount,
     roundAmount: roundAmount,
   }));
 }, [
   grandTotal,
   formData.netPayable,
   formData.totalDeduction,
   formData.totalcollection,
   formData.transport,
 ]);


  //handle focus on next input field ----------------------------------------->

  const handleEnterKey = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      } else if (submitBtnRef.current) {
        submitBtnRef.current.focus();
      }
    }
  };

  const handleBillSave = async (e) => {
    e.preventDefault();
    const saveres = await dispatch(
      saveOtherDeductions({ formData, PaymentFD: filteredPayData2 })
    ).unwrap();

    setCurrentIndex((prevIndex) =>
      prevIndex === customerList.length ? 1 : prevIndex + 1
    );

    if (inputRefs?.current) {
      inputRefs.current[0].focus();
    }
    if (saveres.status === 200) {
      const res = await dispatch(
        fetchPaymentDetails({
          fromdate: formData.formDate,
          todate: formData.toDate,
        })
      ).unwrap();

      toast.success("Bill saved successfully!");
    } else {
      toast.error("Failed to save bill!");
    }
  };

  return (
    <>
      <div className="payment-bill-deduction-main-container w100 h1 d-flex-col p10 sb">
        <div className="payment-deduction-info-outer-container w100 h30 d-flex sb bg-light-green br6">
          <div className="payment-deduction-info-container w50 h1 d-flex-col sa px10">
            <span className="heading px10">Payment Deductions :</span>
            <div className="paymebt-bill-customer-details-div w100 h30 d-flex a-center sb">
              <div className="bill-no-comopent w30 d-flex a-center sb px10">
                <label htmlFor="billtxt" className="label-text w45">
                  Bill No :
                </label>
                <input
                  id="billtxt"
                  className="data w50 read-onlytxt"
                  type="text"
                  value={formData.billno}
                  name="billno"
                  readOnly
                  placeholder="000"
                  onChange={(e) =>
                    setFormData({ ...formData, billno: e.target.value })
                  }
                />
              </div>
              <div className="bill-date-comopent w45 d-flex a-center sb px10">
                <label htmlFor="billdatetxt" className="label-text w35">
                  Bill Date:
                </label>
                <input
                  id="billdatetxt"
                  className="data w65 read-onlytxt"
                  type="date"
                  readOnly
                  value={formData.billdate}
                  name="billdate"
                  onChange={(e) =>
                    setFormData({ ...formData, billdate: e.target.value })
                  }
                />
              </div>
              <button className="btn">संकलन तपशील दर्शवा </button>
            </div>
            <div className="customer-details-container w100 h30 d-flex a-center sb">
              <div className="btn-code-container w35 h1 d-flex a-center sb">
                <button className="btn" onClick={handlePrev}>
                  <BsChevronDoubleLeft className="icon " />
                </button>
                <input
                  className="data w45 t-center mx5"
                  type="number"
                  value={currentIndex || ""}
                  name="code"
                  placeholder="code"
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <button className="btn" onClick={handleNext}>
                  <BsChevronDoubleRight className="icon" />
                </button>
              </div>
              <input
                className="cust_name data w60"
                type="text"
                name="customername"
                value={customerName}
                readOnly
                placeholder="Customer Name"
              />
            </div>
          </div>
          <div className="bil-payment-deduction-first-half w50 h1 d-flex-col sa">
            <div className="morening-evening-all-collection w100 d-flex sb">
              <div className="morening-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="mrgltrtxt" className="label-text w60">
                  सकाळ लि :
                </label>
                <input
                  id="mrgltrtxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="morningliters"
                  placeholder="0.00"
                  readOnly
                  value={formData.morningliters || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="morening-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="eveltrtxt" className="label-text w60">
                  सायंकाळ लि :
                </label>
                <input
                  id="eveltrtxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="eveningliters"
                  placeholder="0.00"
                  readOnly
                  value={formData.eveningliters || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="morening-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="totalmilktxt" className="label-text w60">
                  एकूण संकलन :
                </label>
                <input
                  id="totalmilktxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="totalcollection"
                  placeholder="0.00"
                  readOnly
                  value={formData.totalcollection || ""}
                  onChange={handleFormDataChange}
                />
              </div>
            </div>
            <div className="collection-commision-all-commission w100 sb d-flex">
              <div className="morening-commision-compoent w32 d-flex a-center sb">
                <label htmlFor="mcomtxt" className="label-text w60">
                  स.कमिशन:
                </label>
                <input
                  id="mcomtxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="morningcommission"
                  placeholder="0.00"
                  readOnly
                  value={formData.morningcommission || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="Eveninng-commission-compoent w32 d-flex a-center sb">
                <label htmlFor="ecommtxt" className="label-text w60">
                  सायं.कमिशन:
                </label>
                <input
                  id="ecommtxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="eveningcommission"
                  placeholder="0.00"
                  readOnly
                  value={formData.eveningcommission || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="all-commission w32 d-flex a-center sb">
                <label htmlFor="tcommtxt" className="label-text w60">
                  एकूण कमिशन :
                </label>
                <input
                  id="tcommtxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="totalcommission"
                  placeholder="0.00"
                  readOnly
                  value={formData.totalcommission || ""}
                  onChange={handleFormDataChange}
                />
              </div>
            </div>
            <div className="sari-all-commission-container w100 sb d-flex">
              <div className="sari-all-commission-compoent w32 d-flex a-center sb">
                <label htmlFor="mrebettxt" className="label-text w60">
                  स. रीबेट क. :
                </label>
                <input
                  id="mrebettxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="morningrebate"
                  placeholder="0.00"
                  readOnly
                  value={formData.morningrebate || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="evening-ri-compoentv w32 d-flex a-center sb">
                <label htmlFor="erebettxt" className="label-text w60">
                  सायं. रीबेट क. :
                </label>
                <input
                  id="erebettxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="eveningrebate"
                  placeholder="0.00"
                  readOnly
                  value={formData.eveningrebate || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="all-ri-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="trebettxt" className="label-text w60">
                  एकूण रीबेट क. :
                </label>
                <input
                  id="trebettxt"
                  className="data w40 read-onlytxt"
                  type="text"
                  name="totalrebate"
                  placeholder="0.00"
                  readOnly
                  value={formData.totalrebate || ""}
                  onChange={handleFormDataChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="payment-deduction-details-table-container  w100 h65 d-flex sb">
          <div className="payment-deduction-table-container  w60 h1 mh100 hidescrollbar d-flex-col bg">
            <div className="deduction-heading-container w100 p10 sa d-flex a-center t-center sticky-top bg7 br6">
              <span className="f-label-text w30">कपातीचे नाव</span>
              <span className="f-label-text w20">मागील</span>
              <span className="f-label-text w20">चालू</span>
              <span className="f-label-text w20">कपात</span>
              <span className="f-label-text w20">शिल्लक</span>
            </div>
            {filteredPayData && filteredPayData.length > 0 ? (
              filteredPayData.map((item, index) => (
                <div
                  key={index}
                  className="deduction-heading-container w100 p10 sa d-flex t-center a-center"
                  style={{
                    backgroundColor: "#f5d273",
                  }}
                >
                  <span className="info-text w30">{item.dname}</span>
                  <span className="info-text w10">{item.MAMT}</span>
                  <span className="info-text w10">चालू</span>
                  <span className="info-text w20">{item.Amt}</span>
                  <span className="info-text w10">{item.MAMT + item.Amt}</span>
                </div>
              ))
            ) : (
              <div className="w100 p10 d-flex a-center j-center">
                <span className="label-text">No fix deduction data found!</span>
              </div>
            )}
            {filteredPayData2 && filteredPayData2.length > 0 ? (
              filteredPayData2.map((item, index) => (
                <div
                  key={index}
                  className="deduction-heading-container w100 p10 sa d-flex t-center a-center"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  <span className="info-text w30">{item.dname || ""}</span>
                  <span className="info-text w10">{item.MAMT || 0}</span>
                  <span className="info-text w10">
                    {Math.abs(item.totalamt).toFixed(1) || 0.0}
                  </span>
                  <input
                    type="number"
                    className="data w20"
                    onChange={(e) => handleAmtChange(index, e.target.value)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onKeyDown={(e) => handleEnterKey(e, index)}
                    style={{ textAlign: "center" }}
                  />

                  <span className="info-text w10">
                    {item.netamt.toFixed(1) || 0}
                  </span>
                </div>
              ))
            ) : (
              <div className="w100 p10 d-flex a-center j-center">
                <span className="label-text">No deduction data found</span>
              </div>
            )}
          </div>
          <div className="payment-amt-details-container w40 h1 d-flex-col se bg-light-skyblue br9 p10">
            <div className="deduction-amount-container w100 h25 d-flex a-center sb">
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण रक्कम </label>
                <span
                  id=""
                  className="data h60 t-center label-text read-onlytxt"
                >
                  {formData.totalPayment || 0.0}
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण कमिशन</label>
                <span
                  id=""
                  className="data h60 t-center label-text read-onlytxt"
                >
                  {formData.totalDeduction || 0.0}
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण अनामत</label>
                <span
                  id=""
                  className="data h60 t-center label-text read-onlytxt"
                >
                  0.0
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण वाहतूक</label>
                <span
                  id=""
                  className="data h60 t-center label-text read-onlytxt"
                >
                  {formData.totalTransport || 0.0}
                </span>
              </div>
            </div>
            <div className="deduction-amount-container w100 h25 d-flex a-center sb">
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="">एकूण कपात</label>
                <span
                  id=""
                  className="data h60 t-center label-text read-onlytxt"
                >
                  {formData.netDeduction || 0.0}
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="roff">राउंड रक्कम</label>
                <span
                  id="roff"
                  className="data h60 t-center label-text read-onlytxt"
                >
                  {formData.roundAmount || 0.0}
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb">
                <label htmlFor="netpay">निव्वळ देय</label>
                <span
                  id="netpay"
                  className="data h60 t-center label-text read-onlytxt"
                  readOnly
                >
                  {formData.netPayment.toFixed(1) || 0.0}
                </span>
              </div>
              <div className="deduction-details w20 h1 d-flex-col a-center sb"></div>
            </div>
            <div className="deduction-amount-container w100 h25 d-flex a-center sb">
              <div className="deduction-details w30 h1 d-flex-col a-center sb">
                <label htmlFor="">कमीत कमी रक्कम</label>
                <span
                  id=""
                  className="data h60 t-center label-text read-onlytxt"
                >
                  0.0
                </span>
              </div>
              <button
                type="submit"
                className="btn"
                ref={submitBtnRef}
                onClick={handleBillSave}
                disabled={dedStatus === "loading"}
              >
                {dedStatus === "loading" ? "saving..." : "बिल सेव्ह करा"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayDeductions;
