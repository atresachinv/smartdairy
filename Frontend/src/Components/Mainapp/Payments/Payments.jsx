import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../../../Styles/Mainapp/Payments/Payments.css";
import { useDispatch, useSelector } from "react-redux";
import { getMaxCustNo } from "../../../App/Features/Mainapp/Masters/custMasterSlice";
import Spinner from "../../Home/Spinner/Spinner";

import {
  checkAmtZero,
  checkPayExists,
  deleteAllPayment,
  deleteSelectedBill,
  fetchLastMAMT,
  fetchMilkPaydata,
  fetchPaymentDetails,
  fetchTrnDeductions,
  getPayMasters,
  saveMilkPaydata,
} from "../../../App/Features/Payments/paymentSlice";
import { fetchMaxApplyDeductions } from "../../../App/Features/Deduction/deductionSlice";
import { selectPaymasters } from "../../../App/Features/Payments/paymentSelectors";

const Payments = ({ setCurrentPage }) => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const custno = useSelector((state) => state.customer.maxCustNo);
  const center_id = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const payMasters = useSelector(selectPaymasters); // is payment lock
  const payData = useSelector((state) => state.payment.paymentData); // milk collection amount
  const payDetails = useSelector((state) => state.payment.paymentDetails);
  const delOneStatus = useSelector((state) => state.payment.delOnestatus); // delete selected bill status
  const delAllStatus = useSelector((state) => state.payment.delAllstatus); // delete All bill status
  const deductionDetails = useSelector(
    (state) => state.deduction.mAdatededuction || []
  ); // deduction list
  const dedAmts = useSelector((state) => state.payment.trnDeductions); // deduction from trn table
  const prevMamt = useSelector((state) => state.payment.lastMamt);
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  ); // center settings
  const [settings, setSettings] = useState({});
  const [PaymentFD, setPaymentFD] = useState([]);
  const [otherDeduction, setOtherDeduction] = useState([]);
  const [filteredPayDetails, setFilteredPayDetails] = useState([]);
  const [payStatus, setPayStatus] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [payShowStatus, setPayShowStatus] = useState(false);
  const initialData = {
    billDate: "",
    vcDate: "",
    fromDate: "",
    toDate: "",
    custFrom: "" || 1,
    custTo: "",
    commission: "",
    autodeduct: "",
    center_id: 0,
  };
  const [formData, setFormData] = useState(initialData);
  const [isLocked, setIsLocked] = useState(false); // is payment master lock
  const [selectedBills, setSelectedBills] = useState([]); // selected bills to delete
  const bdateRef = useRef(null);
  const vcdateRef = useRef(null);
  const fdateRef = useRef(null);
  const tdateRef = useRef(null);
  const fcustRef = useRef(null);
  const tcustRef = useRef(null);
  const submitbtn = useRef(null);
  const autoCenter = settings?.autoCenter;

  // ----------------------------------------------------------------------->
  // check if payment is lock or not ------------------------------------->

  useEffect(() => {
    if (!payMasters || payMasters.length === 0) {
      dispatch(getPayMasters());
    }
  }, [dispatch, payMasters]);

  useEffect(() => {
    if (formData.fromDate && formData.toDate) {
      const foundLocked = payMasters.some(
        (master) =>
          master.FromDate.slice(0, 10) === formData.fromDate.slice(0, 10) &&
          master.ToDate.slice(0, 10) === formData.toDate.slice(0, 10) &&
          master.islock === 1
      );

      setIsLocked(foundLocked);
    }
  }, [formData.fromDate, formData.toDate, payMasters]);

  // Calculate master on fromdate ----------------------------------------->
  function calculateToDate(fromDate, master) {
    const date = new Date(fromDate);
    date.setDate(date.getDate() + master - 1); // Subtract 1 if range is inclusive
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const master = 10; // to set master days ---------------------------------->

  useEffect(() => {
    const toDate = calculateToDate(formData.fromDate, master);
    setFormData((prevFormData) => ({
      ...prevFormData,
      toDate: toDate,
    }));
  }, [formData.fromDate, master]);

  useEffect(() => {
    dispatch(getMaxCustNo());
    dispatch(fetchMaxApplyDeductions());
  }, [dispatch]);

  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      custTo: `${Math.abs(custno - 1)}`,
      billDate: tDate,
    }));
  }, [custno, tDate]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      vcDate: formData.toDate,
    }));
  }, [formData.toDate]);

  // Filter payment details to show payment details only ---------------------------------------->

  useEffect(() => {
    if (Array.isArray(payDetails) && Array.isArray(customerlist)) {
      const filtered = payDetails
        .filter((entry) => entry.DeductionId === 0)
        .map((entry) => {
          const matchingCustomer = customerlist.find(
            (customer) => customer.srno === entry.Code
          );
          return {
            ...entry,
            cname: matchingCustomer ? matchingCustomer.cname : "", // Add cname if match found
          };
        });

      setFilteredPayDetails(filtered);
    }
  }, [payDetails, customerlist]);

  // handle input change for all inputs ----------------------------------------->
  const handleInput = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  // handle enter kry press ------------------------------------------>
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const groupSales = () => {
    const groupedSales = filteredSalesList.reduce((acc, sale) => {
      const key = sale.BillNo;
      if (!acc[key]) {
        acc[key] = { ...sale, TotalAmount: 0 };
      }
      acc[key].TotalAmount += sale.Amount;
      return acc;
    }, {});

    return Object.values(groupedSales).sort((a, b) => {
      if (sortKey === "BillDate") {
        return sortOrder === "asc"
          ? new Date(a.BillDate) - new Date(b.BillDate)
          : new Date(b.BillDate) - new Date(a.BillDate);
      } else {
        return sortOrder === "asc"
          ? a[sortKey] > b[sortKey]
            ? 1
            : -1
          : a[sortKey] < b[sortKey]
          ? 1
          : -1;
      }
    });
  };

  useEffect(() => {
    const otherDeductionGLCodes = deductionDetails
      .filter((deduction) => deduction.LP !== 0)
      .map((deduction) => deduction.GLCode);
    setOtherDeduction(otherDeductionGLCodes);
  }, [deductionDetails]);

  const handleFixDeductions = async () => {
    try {
      const filteredDeductions = deductionDetails.filter(
        (deduction) => deduction.RatePerLitre !== 0
      );

      const deductionEntries = [];

      for (const user of payData) {
        const { rno, cname, totalamt, totalLitres, avgSnf, avgFat } = user;

        let totalDeduction = 0;

        for (const deduction of filteredDeductions) {
          const amt = +(totalLitres * deduction.RatePerLitre).toFixed(2);
          totalDeduction += amt;

          deductionEntries.push({
            DeductionId: deduction.DeductionId,
            GLCode: deduction.GLCode,
            rno,
            dname: deduction.dname,
            amt: amt.toFixed(2),
            cname: "",
            totalamt: 0.0,
            totalLitres: 0.0,
            avgSnf: 0.0,
            avgFat: 0.0,
            avgRate: 0.0,
            totalDeduction: 0.0,
            dtype: 0,
          });
        }

        const avgRate = totalLitres !== 0 ? totalamt / totalLitres : 0;
        const netPayment = +(totalamt - totalDeduction).toFixed(2);

        deductionEntries.push({
          DeductionId: 0,
          GLCode: 28,
          rno,
          dname: "",
          amt: netPayment.toFixed(2),
          cname,
          totalamt: totalamt.toFixed(2),
          totalLitres: totalLitres.toFixed(2),
          avgSnf: avgSnf.toFixed(1),
          avgFat: avgFat.toFixed(1),
          avgRate: avgRate.toFixed(1),
          totalDeduction: totalDeduction.toFixed(2),
          dtype: 2,
        });
      }

      return deductionEntries;
    } catch (error) {
      console.error("Error in handling dedAmts:", error);
      return [];
    }
  };

  //-------------------------------------------------------------------------------->
  // handle auto deduction --------------------------------------------------------->

  // console.log("deductionDetails", deductionDetails);

  const handleAllDeductions = async () => {
    try {
      const filteredDeductions = deductionDetails.filter(
        (deduction) => deduction.RatePerLitre !== 0
      );

      const deductionEntries = [];
      const leastPayamt = 200;

      for (const user of payData) {
        const { rno, cname, totalamt, totalLitres, avgSnf, avgFat } = user;
        let totalDeduction = 0;
        let remainingAmt = totalamt;

        // FIXED DEDUCTIONS ----------------------------------------->
        for (const deduction of filteredDeductions) {
          const amt = +(totalLitres * deduction.RatePerLitre).toFixed(2);
          totalDeduction += amt;
          remainingAmt -= amt;

          deductionEntries.push({
            DeductionId: deduction.DeductionId,
            GLCode: deduction.GLCode,
            rno,
            dname: deduction.dname,
            amt: amt.toFixed(2),
            cname: "",
            totalamt: 0.0,
            totalLitres: 0.0,
            avgSnf: 0.0,
            avgFat: 0.0,
            avgRate: 0.0,
            totalDeduction: 0.0,
            dtype: 0,
          });
        }

        // OTHER DEDUCTIONS ----------------------------------------->
        const otherDeductions = deductionDetails.filter(
          (deduction) => deduction.RatePerLitre === 0
        );

        const userDedAmts = dedAmts.filter((item) => item.AccCode === rno);
        const userPrevMamt = prevMamt.filter((item) => item.AccCode === rno);
        // console.log("userDedAmts", userDedAmts);
        // console.log("userPrevMamt", userPrevMamt);
        // console.log(otherDeductions, "otherDeductions");
        for (const deduction of otherDeductions) {
          const matchDedAmt = userDedAmts.find(
            (item) => item.GLCode === deduction.GLCode
          );
          const matchPrevAmt = userPrevMamt.find(
            (item) => item.GLCode === deduction.GLCode
          );

          console.log("matchDedAmt", matchDedAmt);
          console.log("matchPrevAmt", matchPrevAmt);
          const currAmt = matchDedAmt ? Math.abs(matchDedAmt.totalamt) : 0;
          const prevAmt = matchPrevAmt ? Math.abs(matchPrevAmt.totalamt) : 0;
          console.log("currAmt", currAmt);
          console.log("prevAmt", prevAmt);
          let deduAmt = +(currAmt + prevAmt).toFixed(2);

          if (remainingAmt - deduAmt < leastPayamt) {
            deduAmt = +(remainingAmt - leastPayamt).toFixed(2);
          }
          console.log(deduAmt, "deduAmt");
          if (deduAmt <= 0) continue;

          totalDeduction += deduAmt;
          remainingAmt -= deduAmt;

          let BAmt = +(currAmt - deduAmt).toFixed(2);
          console.log("BAmt", BAmt);

          deductionEntries.push({
            DeductionId: deduction.DeductionId,
            GLCode: deduction.GLCode,
            rno,
            dname: deduction.dname,
            MAMT: prevAmt.toFixed(2),
            BAMT: BAmt.toFixed(2),
            amt: deduAmt.toFixed(2),
            cname: "",
            totalamt: currAmt.toFixed(2),
            totalLitres: 0.0,
            avgSnf: 0.0,
            avgFat: 0.0,
            avgRate: 0.0,
            totalDeduction: 0.0,
            dtype: 1,
          });

          if (remainingAmt <= leastPayamt) break;
        }

        // Round OFF -------------------------------------------------->
        const roundOffDedu = deductionDetails.find(
          (deduction) => deduction.RatePerLitre === 0 && deduction.GLCode === 2
        );

        const flooredAmt = Math.floor(remainingAmt);
        const roundAmt = Math.floor((remainingAmt - flooredAmt) * 100) / 100;

        // console.log("roundOffDedu", roundOffDedu);
        // console.log("remainingAmt", remainingAmt);
        // console.log("flooredAmt", flooredAmt);
        // console.log("roundAmt", roundAmt);

        if (roundAmt > 0) {
          totalDeduction += roundAmt;
          remainingAmt = flooredAmt;

          deductionEntries.push({
            DeductionId: roundOffDedu.DeductionId,
            GLCode: roundOffDedu.GLCode,
            rno,
            dname: roundOffDedu.dname,
            MAMT: 0.0,
            BAMT: 0.0,
            amt: roundAmt.toFixed(2),
            cname: "",
            totalamt: 0.0,
            totalLitres: 0.0,
            avgSnf: 0.0,
            avgFat: 0.0,
            avgRate: 0.0,
            totalDeduction: 0.0,
            dtype: 1,
          });
        }
        // console.log("remainingAmt aftre round off", remainingAmt);
        //  FINAL NET PAYMENT ---------------------------------------------------------->
        const avgRate = totalLitres !== 0 ? totalamt / totalLitres : 0;
        const netPayment = +remainingAmt.toFixed(2);

        deductionEntries.push({
          DeductionId: 0,
          GLCode: 28,
          rno,
          dname: "",
          amt: netPayment.toFixed(2),
          cname,
          totalamt: totalamt.toFixed(2),
          totalLitres: totalLitres.toFixed(2),
          avgSnf: avgSnf.toFixed(1),
          avgFat: avgFat.toFixed(1),
          avgRate: avgRate.toFixed(1),
          totalDeduction: totalDeduction.toFixed(2),
          dtype: 2,
        });
      }

      return deductionEntries;
    } catch (error) {
      console.error("Error in handleAllDeductions:", error);
      return [];
    }
  };

  //get previous payment last remaing amount of dedAmts ------------------------->
  useEffect(() => {
    if (formData.fromDate && otherDeduction.length > 0) {
      const [year, month, day] = formData.fromDate.split("-").map(Number);

      const date = new Date(year, month - 1, day);

      // Subtract 1 day
      date.setDate(date.getDate() - 1);

      const prevDay = String(date.getDate()).padStart(2, "0");
      const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
      const prevYear = date.getFullYear();

      const result = `${prevYear}-${prevMonth}-${prevDay}`;

      dispatch(fetchLastMAMT({ toDate: result, GlCodes: otherDeduction }));
    }
  }, [formData.fromDate, otherDeduction]);

  //generate payment bill ---------------------------------------------------------->

  const handleGenerateBill = async (e) => {
    e.preventDefault();
    setPayStatus(true);

    try {
      const results = await dispatch(
        checkPayExists({ fromDate: formData.fromDate, toDate: formData.toDate })
      ).unwrap();

      if (results?.found) {
        toast.error("Payment already exists for this date range!");
        return;
      }

      const result = await dispatch(
        checkAmtZero({ fromDate: formData.fromDate, toDate: formData.toDate })
      ).unwrap();

      if (result?.status === 200) {
        toast.error("Milk correction required!");
        return;
      }

      await dispatch(
        fetchMilkPaydata({
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        })
      );
      await dispatch(
        fetchTrnDeductions({
          fromDate: formData.fromDate,
          toDate: formData.toDate,
          GlCodes: otherDeduction,
        })
      ).unwrap();

      let deductionData =
        formData.autodeduct === 1
          ? await handleAllDeductions()
          : await handleFixDeductions();

      if (deductionData.length === 0) {
        toast.error("Error in deduction calculations, try again!");
        return;
      }

      setPaymentFD(deductionData);

      const saveres = await dispatch(
        saveMilkPaydata({ formData, PaymentFD: deductionData })
      ).unwrap();

      if (saveres?.status === 200) {
        const fetchres = await dispatch(
          fetchPaymentDetails({
            fromdate: formData.fromDate,
            todate: formData.toDate,
          })
        ).unwrap();

        if (fetchres?.status === 200) {
          toast.success("Milk payment generated successfully!");
        }
      } else {
        toast.error("Unexpected response. Please try again!");
      }
    } catch (error) {
      console.error("Error in handleGenerateBill:", error);
      toast.error("Unexpected error occurred!");
    } finally {
      setPayStatus(false);
    }
  };

  const handleShowBtn = async (e) => {
    e.preventDefault();
    setPayShowStatus(true);
    try {
      if (formData.fromDate && formData.toDate) {
        const fetchres = await dispatch(
          fetchPaymentDetails({
            fromdate: formData.fromDate,
            todate: formData.toDate,
          })
        ).unwrap();

        const fetchrres = await dispatch(
          fetchMilkPaydata({
            fromDate: formData.fromDate,
            toDate: formData.toDate,
          })
        ).unwrap();

        if (!otherDeduction) {
          toast.error("other deduction glcodes not found!");
          return;
        }

        const fetchress = await dispatch(
          fetchTrnDeductions({
            fromDate: formData.fromDate,
            toDate: formData.toDate,
            GlCodes: otherDeduction,
          })
        ).unwrap();
      } else {
        toast.error("Payment Dates required to show Payment!");
      }
    } catch (error) {
      toast.error("Unexpected error", error);
    } finally {
      setPayShowStatus(false);
    }
  };

  // handle row click data --------------------------------------------------------->
  const handleRowClick = (billNo) => {
    setSelectedBills((prev) =>
      prev.includes(billNo)
        ? prev.filter((id) => id !== billNo)
        : [...prev, billNo]
    );
  };

  //  handle selected bill delete function ---------------------------------------->

  const deleteOneBill = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Milk Payment is Lock, Unlock and try again!");
      return;
    }

    if (selectedBills.length === 0) {
      toast.error("Please select at least one bill to delete.");
      return;
    }

    const response = await dispatch(
      deleteSelectedBill({ BillNo: selectedBills })
    ).unwrap();

    if (response?.status === 200) {
      const fetchres = await dispatch(
        fetchPaymentDetails({
          fromdate: formData.fromDate,
          todate: formData.toDate,
        })
      ).unwrap();
      toast.success("Selected bill deleted successfully!");
      setSelectedBills([]);
    } else {
      toast.error("Failed to delete bill!");
    }
  };

  // all pyamnet delete function ------------------------------------------------->

  const deleteAllBills = async (e) => {
    e.preventDefault();
    if (isLocked) {
      toast.error("Milk Payment is Lock, Unlock and try again!");
      return;
    }
    const responce = await dispatch(
      deleteAllPayment({
        FromDate: formData.fromDate,
        ToDate: formData.toDate,
      })
    ).unwrap();

    if (responce?.status === 200) {
      const fetchres = await dispatch(
        fetchPaymentDetails({
          fromdate: formData.fromDate,
          todate: formData.toDate,
        })
      ).unwrap();
      await setFilteredPayDetails([]);
      toast.success("Milk payment deleted successfully!");
    } else {
      toast.error("Bills not found to delete!");
    }
  };

  return (
    <div className="Bil-list-container w100 h1 d-flex-col sb p10">
      <div className="page-title-select-center-container w100 h10 d-flex a-center">
        <label className="heading py10 mx10" htmlFor="">
          दुध बिले बनवा :
        </label>
        <label className="label-text py10 mx10" htmlFor="">
          सेंटर निवडा :
        </label>
        {center_id === 0 ? (
          <select
            className="data w40"
            name="center_id"
            id=""
            onChange={handleInput}
          >
            {centerList.map((center, index) => (
              <option key={index} value={center.center_id}>
                {center.center_name}
              </option>
            ))}
          </select>
        ) : (
          ""
        )}
      </div>
      <form
        onSubmit={handleGenerateBill}
        className="generate-bill-form-container w100 h20 d-flex sb br6"
      >
        <div className="bill-voucher-date-container w30 px10 d-flex-col bg-light-skyblue br6 sa px10">
          <div className="bil-date-div d-flex w100 h1 a-center sb">
            <label htmlFor="billdate" className="label-text w40">
              बिल दिनांक :
            </label>
            <input
              className="data w60"
              type="date"
              id="billdate"
              name="billDate"
              onChange={handleInput}
              value={formData.billDate || ""}
              onKeyDown={(e) => handleKeyDown(e, vcdateRef)}
              ref={bdateRef}
            />
          </div>
          <div className="Voucher-date-div d-flex w100 h1 a-center sb">
            <label htmlFor="vcdate" className="label-text w40">
              व्हाऊचर दिनांक :
            </label>
            <input
              id="vcdate"
              className="data w60"
              type="date"
              name="vcDate"
              value={formData.vcDate}
              onChange={handleInput}
              onKeyDown={(e) => handleKeyDown(e, fdateRef)}
              ref={vcdateRef}
            />
          </div>
        </div>
        <div className="payment-dates-container w40 d-flex-col  bg-light-skyblue br6 sa px10">
          <div className="pay-fromdate-div d-flex w100 h1 a-center sb">
            <label htmlFor="fdate" className="label-text w40">
              पंधरवडा दिनांक पासून :
            </label>
            <input
              id="fdate"
              className="data w50"
              type="date"
              name="fromDate"
              onChange={handleInput}
              onKeyDown={(e) => handleKeyDown(e, tdateRef)}
              ref={fdateRef}
              max={formData.toDate}
            />
          </div>
          <div className="pay-todate-div d-flex w100 h1 a-center sb">
            <label htmlFor="tdate" className="label-text w40">
              पंधरवडा दिनांक पर्येंत :
            </label>
            <input
              id="tdate"
              className="data w50"
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleInput}
              ref={tdateRef}
              max={formData.billDate}
            />
          </div>
        </div>
        <div className="checkbox-container w10 h1 d-flex-col se a-center">
          <div className="check-acc-div w100 h50 d-flex a-center sb">
            <input
              id="comm"
              className="w20"
              type="checkbox"
              name="commission"
              onChange={handleInput}
            />
            <label htmlFor="comm" className="w70 label-text">
              कमिशन
            </label>
          </div>
          <div className="Auto-kapat-div w100 h50 d-flex a-center sb">
            <input
              id="adeduct"
              className="w20"
              name="autodeduct"
              type="checkbox"
              onChange={handleInput}
            />
            <label htmlFor="adeduct" className="w70 label-text">
              ऑटो कपात
            </label>
          </div>
        </div>
        <div className="form-button-div w10 h1 d-flex-col se a-center">
          <button
            type="button"
            className="w-btn"
            disabled={payShowStatus}
            onClick={handleShowBtn}
          >
            {payShowStatus ? "showing..." : "पाहणे "}
          </button>
          <button type="submit" className="w-btn" disabled={payStatus}>
            {payStatus ? "Generating..." : "बिल निर्माण"}
          </button>
        </div>
      </form>
      <div className="payment-details-and-report-btn-div w100 h70 d-flex sb">
        <div className="payment-data-report-btn-div w80 h1 d-flex-col se px10">
          <div className="customer-code-div w100 h10 d-flex a-center sb px10">
            <span className="label-text">Payment Details : </span>
            <div className="cust-code-div d-flex w50 h1 sb a-center">
              <label htmlFor="cform" className="w30">
                कोड नं पासून :
              </label>
              <input
                id="cform"
                className="data w30"
                type="text"
                name="custFrom"
                value={formData.custFrom}
                onChange={handleInput}
                onKeyDown={(e) => handleKeyDown(e, tcustRef)}
                ref={fcustRef}
              />
              <label htmlFor="custTo" className="w10 t-center">
                ते :
              </label>
              <input
                id="custTo"
                className="data w30"
                type="text"
                name="custTo"
                value={formData.custTo}
                onChange={handleInput}
                ref={tcustRef}
              />
            </div>
          </div>
          <div className="bill-payments-details-container w100 h70 d-flex-col mh70 hidescrollbar bg">
            <div className="bill-heading-div w100 p10 d-flex a-center t-center sb sticky-top bg7 br6">
              <span className="f-label-text w10">उत्पा.क्र</span>
              <span className="f-label-text w40">उत्पादकाचे नाव</span>
              <span className="f-label-text w15">लिटर</span>
              <span className="f-label-text w15">रक्कम</span>
            </div>
            {payStatus || payShowStatus ? (
              <Spinner />
            ) : filteredPayDetails.length !== 0 ? (
              filteredPayDetails.map((item, index) => {
                const isSelected = selectedBills.includes(item.BillNo);

                return (
                  <div
                    key={index}
                    className="bill-data-div w100 p10 d-flex a-center sb pointer"
                    onClick={() => handleRowClick(item.BillNo)}
                    style={{
                      backgroundColor: isSelected
                        ? "#ffe1cc"
                        : index % 2 === 0
                        ? "#faefe3"
                        : "#fff",
                    }}
                  >
                    <span className="info-text w10 t-center">{item.Code}</span>
                    <span className="info-text w40 t-start">{item.cname}</span>
                    <span className="info-text w15 t-end">{item.tliters}</span>
                    <span className="info-text w15 t-end">
                      {item.namt || 0}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="box d-flex center">
                <span className="label-text">No data Found!</span>
              </div>
            )}
          </div>

          <div className="bill-form-btn-div w100 h10 d-flex j-end">
            <button className="btn" onClick={() => setCurrentPage("lockbill")}>
              बिल लॉक करा
            </button>
            <button
              type="button"
              className="btn-danger mx10"
              onClick={deleteOneBill}
              disabled={delOneStatus === "loading"}
            >
              {delOneStatus === "loading" ? "काढूण टाकत आहे..." : "काढूण टाका"}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={deleteAllBills}
              disabled={delAllStatus === "loading"}
            >
              {delAllStatus === "loading"
                ? "काढूण टाकत आहे..."
                : "सर्व काढूण टाका"}
            </button>
          </div>
        </div>
        <div className="bill-payments-container-div w15 d-flex-col se">
          <button className="btn" onClick={() => setCurrentPage("deductions")}>
            पेमेंट कपाती
          </button>
          <button
            className="w-btn"
            onClick={() => setCurrentPage("milkcorrection")}
          >
            संकलन दुरुस्थी
          </button>
          <button className="w-btn">कपात रिपोर्ट</button>
          <button
            className="w-btn"
            onClick={() => setCurrentPage("payregister")}
          >
            पेमेंट रजिस्टर
          </button>
          <button
            className="w-btn"
            onClick={() => setCurrentPage("paysummary")}
          >
            पेमेंट समरी
          </button>
          <button className="w-btn">पेमेंट रजि. बँकेसाठी</button>
          <button className="w-btn">प्रिंट बिल</button>
        </div>
      </div>
    </div>
  );
};

export default Payments;
