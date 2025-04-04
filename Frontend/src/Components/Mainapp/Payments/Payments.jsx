import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "../../../Styles/Mainapp/Payments/Payments.css";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMaxCustNo } from "../../../App/Features/Mainapp/Masters/custMasterSlice";
import {
  checkAmtZero,
  fetchMilkPaydata,
  savMilkPaydata,
} from "../../../App/Features/Payments/paymentSlice";
import { getDeductionDetails } from "../../../App/Features/Deduction/deductionSlice";
import { getAllSalePayment } from "../../../App/Features/Sales/salesSlice";

const Payments = () => {
  const dispatch = useDispatch();
  const tDate = useSelector((state) => state.date.toDate);
  const custno = useSelector((state) => state.customer.maxCustNo);
  const SalesData = useSelector((state) => state.sales.allSalesPay);
  const payData = useSelector((state) => state.payment.paymentData);
  const deductionDetails = useSelector(
    (state) => state.deduction.deductionDetails || []
  );
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [settings, setSettings] = useState({});
  const [PaymentFD, setPaymentFD] = useState([]);
  const bdateRef = useRef(null);
  const vcdateRef = useRef(null);
  const fdateRef = useRef(null);
  const tdateRef = useRef(null);
  const fcustRef = useRef(null);
  const tcustRef = useRef(null);
  const submitbtn = useRef(null);

  // console.log("sales data", SalesData);
  // console.log("pay data", payData);
  // check center is autonomace or not -------------------------------------->
  const autoCenter = settings?.autoCenter;
  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  const initialData = {
    billDate: "",
    vcDate: "",
    fromDate: "",
    toDate: "",
    custFrom: "" || 1,
    custTo: "",
    commission: "",
    autodeduct: "",
  };

  // console.log(deductionDetails);

  const [formData, setFormData] = useState(initialData);
  useEffect(() => {
    dispatch(getMaxCustNo());
    dispatch(getDeductionDetails(autoCenter));
  }, [dispatch]);

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

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle enter press move cursor to next refrence Input -------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };
  console.log(PaymentFD);
  // const handleFixDeductions = async () => {
  //   // filter deductons deductionDetails.RatePerLitre is !== 0
  //   // get liters for each user from payData if three deduction with RatePerLitre is !== 0 then for first record
  //   // first multiply payData.totalLitres * RatePerLitre = amt  then amt - payData.totalamt = newToatal
  //   // save  deductionDetails.GLCode, deductionDetails.DeductionId, dname, amt (result of payData.totalLitres * RatePerLitre ) and save entry in array
  //   // and same for other but for next deduction totalamt is different and that is newToatal
  // and add last entry of payData.totalamt, payData.totalLitres, payData.rno,  payData.cname , payData.avgSnf,  payData.avgFat, avgRate = payData.totalamt / payData.totalLitres
  // }

  // ----------------------------------------------------------------------------->
  // Function to group sales by BillNo ------------------------------------------->
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

  const handleFixDeductions = async () => {
    try {
      // Filter deductions where RatePerLitre is not equal to 0
      const filteredDeductions = deductionDetails.filter(
        (deduction) => deduction.RatePerLitre !== 0
      );

      // Initialize an array to store deduction entries
      const deductionEntries = [];

      // Iterate over each user in payData
      payData.forEach((user) => {
        let newTotal = user.totalamt; // Initialize newTotal with user's total amount
        let totalDeduction = 0; // Initialize total deduction

        filteredDeductions.forEach((deduction, index) => {
          // Calculate deduction amount
          const amt = (user.totalLitres * deduction.RatePerLitre).toFixed(2);

          // Add deduction amount to totalDeduction
          totalDeduction += parseFloat(amt);

          // Push the deduction entry to the array
          deductionEntries.push({
            GLCode: deduction.GLCode,
            DeductionId: deduction.DeductionId,
            dname: deduction.dname,
            amt: amt,
          });

          // Update newTotal for the next deduction
          newTotal -= parseFloat(amt);
        });
        console.log("",filteredDeductions);
        // Calculate net payment
        const netPayment = (user.totalamt - totalDeduction).toFixed(2);

        // Add last entry with additional payData fields
        deductionEntries.push({
          DeductionId: 0,
          totalamt: user.totalamt.toFixed(2),
          totalLitres: user.totalLitres.toFixed(2),
          rno: user.rno,
          cname: user.cname,
          avgSnf: user.avgSnf.toFixed(1),
          avgFat: user.avgFat.toFixed(1),
          avgRate: (user.totalamt / user.totalLitres).toFixed(1), // Calculating avgRate
          totalDeduction: totalDeduction.toFixed(2), // Total deductions
          netPayment: netPayment, // Net payment after deduction
        });
      });
      setPaymentFD(deductionEntries);
      console.log("Deduction Entries:", deductionEntries);
      // Now you can use deductionEntries to save or update your database
    } catch (error) {
      console.error("Error in handling deductions:", error);
    }
  };

  // const handleFixDeductions = async () => {
  //   try {
  //     // Filter deductions where RatePerLitre is not equal to 0
  //     const filteredDeductions = deductionDetails.filter(
  //       (deduction) => deduction.RatePerLitre !== 0
  //     );

  //     // Initialize an array to store deduction entries
  //     const deductionEntries = [];

  //     // Iterate over each user in payData
  //     payData.forEach((user) => {
  //       let newTotal = user.totalamt; // Initialize newTotal with user's total amount
  //       let totalDeduction = 0; // Initialize total deduction

  //       filteredDeductions.forEach((deduction, index) => {
  //         // Calculate deduction amount
  //         const amt = (user.totalLitres * deduction.RatePerLitre).toFixed(2);

  //         // Add deduction amount to totalDeduction
  //         totalDeduction += parseFloat(amt);

  //         // Push the deduction entry to the array
  //         deductionEntries.push({
  //           GLCode: deduction.GLCode,
  //           DeductionId: deduction.DeductionId,
  //           dname: deduction.dname,
  //           amt: amt,
  //         });

  //         // Update newTotal for the next deduction
  //         newTotal -= parseFloat(amt);
  //       });

  //       // Calculate net payment
  //       const netPayment = (user.totalamt - totalDeduction).toFixed(2);

  //       // >>>>>>>>>>>>>
  //       // befor last deduction 0 entry we have other deductions also so we have to do that also
  //       //  we have done fix deductions above now we have to do more deductions from SalesData we have to first match SalesData.CustCode === payData.rno
  //       // then add this entry new entry in array

  //       // Add last entry with additional payData fields
  //       deductionEntries.push({
  //         DeductionId: 0,
  //         totalamt: user.totalamt.toFixed(2),
  //         totalLitres: user.totalLitres.toFixed(2),
  //         rno: user.rno,
  //         cname: user.cname,
  //         avgSnf: user.avgSnf.toFixed(1),
  //         avgFat: user.avgFat.toFixed(1),
  //         avgRate: (user.totalamt / user.totalLitres).toFixed(1), // Calculating avgRate
  //         totalDeduction: totalDeduction.toFixed(2), // Total deductions
  //         netPayment: netPayment, // Net payment after deduction
  //       });
  //     });
  //     console.log("Deduction Entries:", deductionEntries);
  //     // Now you can use deductionEntries to save or update your database
  //   } catch (error) {
  //     console.error("Error in handling deductions:", error);
  //   }
  // };

  const handleAutoDeductions = async () => {
    try {
      // Filter deductions where RatePerLitre is not equal to 0
      const filteredDeductions = deductionDetails.filter(
        (deduction) => deduction.RatePerLitre !== 0
      );

      // Initialize an array to store deduction entries
      const deductionEntries = [];

      // Iterate over each user in payData
      payData.forEach((user) => {
        let newTotal = user.totalamt; // Initialize newTotal with user's total amount
        let totalDeduction = 0; // Initialize total deduction

        filteredDeductions.forEach((deduction, index) => {
          // Calculate deduction amount
          const amt = (user.totalLitres * deduction.RatePerLitre).toFixed(2);

          // Add deduction amount to totalDeduction
          totalDeduction += parseFloat(amt);

          // Push the deduction entry to the array
          deductionEntries.push({
            GLCode: deduction.GLCode,
            DeductionId: deduction.DeductionId,
            dname: deduction.dname,
            amt: amt,
          });

          // Update newTotal for the next deduction
          newTotal -= parseFloat(amt);
        });

        // Calculate net payment
        const netPayment = (user.totalamt - totalDeduction).toFixed(2);

        // Add last entry with additional payData fields
        deductionEntries.push({
          DeductionId: 0,
          totalamt: user.totalamt.toFixed(2),
          totalLitres: user.totalLitres.toFixed(2),
          rno: user.rno,
          cname: user.cname,
          avgSnf: user.avgSnf.toFixed(1),
          avgFat: user.avgFat.toFixed(1),
          avgRate: (user.totalamt / user.totalLitres).toFixed(1), // Calculating avgRate
          totalDeduction: totalDeduction.toFixed(2), // Total deductions
          netPayment: netPayment, // Net payment after deduction
        });
      });
      console.log("Deduction Entries:", deductionEntries);
      // Now you can use deductionEntries to save or update your database
    } catch (error) {
      console.error("Error in handling deductions:", error);
    }
  };

  useEffect(() => {
    if (payData && deductionDetails && formData.autodeduct === 1) {
      handleFixDeductions();
    } else {
      handleFixDeductions();
      // handleAutoDeductions();
    }
  }, [payData, deductionDetails]);

  // handle Generate bill function --------------------------------------------------------->
  const handleGenerateBill = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      checkAmtZero({ fromDate: formData.fromDate, toDate: formData.toDate })
    ).unwrap();

    const saleres = await dispatch(
      getAllSalePayment({
        fromdate: formData.fromDate,
        todate: formData.toDate,
      })
    ).unwrap();

    // const saveres = await dispatch(
    //   savMilkPaydata({ formData, PaymentFD })
    // ).unwrap();

    if (result?.status === 204) {
      dispatch(
        fetchMilkPaydata({
          fromDate: formData.fromDate,
          toDate: formData.toDate,
        })
      );
    } else if (result?.status === 200) {
      toast.error("Milk correction required!");
    } else {
      toast.error("Unexpected response. Please try again!");
    }
  };

  return (
    <>
      <div className="Bil-list-container w100 h1 d-flex-col sb p10">
        <label className="heading " htmlFor="">
          Payment
        </label>
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
            <button type="button" className="w-btn">
              पाहणे
            </button>
            <button type="submit" className="w-btn">
              बिल निर्माण
            </button>
          </div>
        </form>
        <div className="payment-details-and-report-btn-div w100 h70 d-flex sb">
          <div className="payment-data-report-btn-div w70 h1 d-flex-col se px10">
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
              {PaymentFD.length !== 0 ? (
                PaymentFD.map((item, index) => (
                  <div
                    key={index}
                    className="bill-data-div w100 p10 d-flex a-center sb"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    <span className="info-text w10 t-center">{item.rno}</span>
                    <span className="info-text w40 t-start">{item.cname}</span>
                    <span className="info-text w15 t-end">
                      {item.totalLitres}
                    </span>
                    <span className="info-text w15 t-end">
                      {item.totalamt || 0}
                    </span>
                  </div>
                ))
              ) : (
                <div className="box d-flex center">
                  <span className="label-text">No data Found!</span>
                </div>
              )}
            </div>

            <div className="bill-form-btn-div w100 h10 d-flex j-end">
              <button className="btn">काढूण टाका</button>
              <button className="w-btn mx10">सर्व काढूण टाका</button>
              <button className="btn">बिल रद्द करा </button>
            </div>
          </div>
          <div className="bill-payments-container-div w30 d-flex f-wrap se">
            <button className="w-btn w45">पेमेंट कपाती</button>
            <button className="w-btn w45">संकलन रिपोर्ट </button>
            <button className="w-btn w45">कपात रिपोर्ट</button>
            <button className="w-btn w45">संकलन दुरुस्थी </button>
            <button className="w-btn w45">Payment रजिस्टर </button>
            <button className="w-btn w45">Payment समरी </button>
            <button className="w-btn w45">Payment रजिस्टर बँक </button>
            <button className="w-btn w45">बिल यादी 1 </button>
            <button className="w-btn w45">Collection Report</button>
            <button className="w-btn w45">Deduction Report</button>
            <button className="w-btn w45">Collection Update</button>
            <button className="w-btn w45">Payment Register</button>
            <button className="w-btn w45">Payment Summary</button>
            <button className="w-btn w45">Payment Regi</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payments;
