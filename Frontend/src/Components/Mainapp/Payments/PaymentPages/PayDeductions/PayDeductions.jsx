import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentsDeductionInfo } from "../../../../../App/Features/Deduction/deductionSlice";
import "../../../../../Styles/PayDeductions/PayDeductions.css";

const PayDeductions = () => {
  const dispatch = useDispatch();
  const deduction = useSelector((state) => state.deduction.alldeductionInfo);
  const [groupedData, setGroupedData] = useState([]);
  const [dnames, setDnames] = useState([]);

  const start = "2024-11-11";
  const end = "2024-11-20";

  useEffect(() => {
    dispatch(
      getPaymentsDeductionInfo({
        fromDate: start,
        toDate: end,
      })
    );
  }, [dispatch, start, end]);

  useEffect(() => {
    if (deduction && deduction.length > 0) {
      const grouped = deduction.reduce((acc, item) => {
        const {
          BillNo,
          AMT,
          dname,
          DeductionId,
          tliters,
          pamt,
          damt,
          namt,
          Code,
        } = item;

        // Initialize Code entry if it doesn't exist
        if (!acc[Code]) {
          acc[Code] = {
            Code,
            tliters: 0,
            pamt: 0,
            damt: 0,
            namt: 0,
            additionalDeductions: {},
          };
        }

        // Aggregate base values
        acc[Code].tliters += tliters;
        acc[Code].pamt += pamt;
        acc[Code].damt += damt;
        acc[Code].namt += namt;

        // Aggregate additional deductions
        if (DeductionId !== 0) {
          if (!acc[Code].additionalDeductions[dname]) {
            acc[Code].additionalDeductions[dname] = 0;
          }
          acc[Code].additionalDeductions[dname] += AMT;
        }

        return acc;
      }, {});
      console.log(grouped);

      // Convert grouped data to an array
      const groupedArray = Object.values(grouped);
      setGroupedData(groupedArray);

      // Extract unique dnames
      const allDnames = new Set();
      groupedArray.forEach((item) => {
        Object.keys(item.additionalDeductions).forEach((dname) => {
          allDnames.add(dname);
        });
      });
      setDnames([...allDnames]);
    }
  }, [deduction]);

  return (
    <>
      <div className="Payment-Bil-deduction-container w100 h1 d-flex-col">
        <span className="heading px10">Bill</span>
        <div className="bil-payment-deduction-first-half d-flex-col  h50 w100 ">
          <div className="bill-no-bil-date-button-div h20  w100  d-flex">
            <div className="bill-no-comopent w35 d-flex a-center px10">
              <span className="label-text w20">Bill No:</span>
              <input className="data w40" type="text" />
            </div>
            <div className="bill-date-comopent w35 d-flex a-center px10">
              <span className="label-text w20">Bill No:</span>
              <input className="data w40" type="date" />
            </div>
            <div className="collection-changes-compoent a-center">
              <button className=" w-btn">संकलन दुरुस्थी </button>
            </div>
          </div>
          <div className="customer-name-customer-number w100 h20  d-flex">
            <div className="customer-no-div w40 d-flex a-center  px10">
              <span className="label-text w30">उत्पादक क्रमांक:</span>
              <input className="data w40" type="text" />
            </div>
            <div className="customer-name-div w40 d-flex a-center px10">
              <span className="label-text w30">उत्पादक क्रमांक:</span>
              <select className="data w70" name="" id=""></select>
            </div>
          </div>
          <div className="morning-evening-liter-commistion-span-input w100 d-flex h80 ">
            <div className="morning-evening-liter w100 d-flex-col h1 sa bg ">
              <div className="morening-evening-all-collection w100   sa d-flex">
                <div className="morening-liter-compoentv w25 d-flex px10 a-center">
                  <span className="label-text w50">सकाळ लि</span>
                  <input className="data" type="text" />
                </div>
                <div className="morening-liter-compoentv w25 d-flex px10 a-center">
                  <span className="label-text w70">सायंकाळ लि</span>
                  <input className="data" type="text" />
                </div>
                <div className="morening-liter-compoentv w25 d-flex px10 a-center">
                  <span className="label-text w80">एकूण संकलन </span>
                  <input className="data" type="text" />
                </div>
                <div className="all-amount-bil-div d-flex w25  a-center">
                  <span className="label-text w40">एकूण रक्कम:</span>
                  <input className="data w50" type="text" />
                </div>
              </div>
              <div className="collection-commision-all-commission sa w100 d-flex">
                <div className="morening-commision-compoent w25 d-flex px10 a-center">
                  <span className="label-text w50">स.कमिशन</span>
                  <input className="data" type="text" />
                </div>
                <div className="Eveninng-commission-compoent w25 d-flex sa px10 a-center">
                  <span className="label-text w70">सायं.कमिशन</span>
                  <input className="data" type="text" />
                </div>
                <div className="all-commission w25 d-flex px10 a-center">
                  <span className="label-text w80">एकूण कमिशन </span>
                  <input className="data" type="text" />
                </div>
                <div className="all-commission-t-bil-div d-flex w25  a-center">
                  <span className="label-text w40">एकूण कमिशन:</span>
                  <input className="data w50" type="text" />
                </div>
              </div>
              <div className="sari-all-commission-container w100 sa d-flex">
                <div className="sari-all-commission-compoent w25 d-flex  px10 a-center">
                  <span className="label-text w50">स.री.कमिशन</span>
                  <input className="data" type="text" />
                </div>
                <div className="evening-ri-compoentv w25 d-flex px10 a-center">
                  <span className="label-text w70">सायं.री.कमिशन</span>
                  <input className="data" type="text" />
                </div>
                <div className="all-ri-liter-compoentv w25 d-flex px10 a-center">
                  <span className="label-text w80">एकूण.री.कमिशन </span>
                  <input className="data" type="text" />
                </div>
                <div className="all-advance-t-bil-div d-flex w25 a-center">
                  <span className="label-text w40">एकूण अनामत:</span>
                  <input className="data w50" type="text" />
                </div>
              </div>
              <div className="transport-container w100 sa d-flex">
                <div className="transport-commission-compoent w25 d-flex  px10 a-center">
                  <span className="label-text w50">वाहतूक </span>
                  <input className="data" type="text" />
                </div>
                <div className="TOtal-Deduction-compoent w25 d-flex px10 a-center">
                  <span className="label-text w70">एकूण कपात </span>
                  <input className="data" type="text" />
                </div>
                <div className="Raound-amount-liter-compoentv w25 d-flex px10 a-center">
                  <span className="label-text w80">राऊंड रक्कम</span>
                  <input className="data" type="text" />
                </div>
                <div className="remening-amount-bil-div d-flex w25 a-center">
                  <span className="label-text w40">निव्वळ देय :</span>
                  <input className="data w50" type="text" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="deduction-name-table-container-save-print-button  w100 h50 d-flex-col ">
          <div className="bill-table-heading-container w100 h20 sa d-flex">
            <span>कपातीचे नाव</span>
            <span>कपातीचे नाव</span>
            <span>कपातीचे नाव</span>
            <span>कपातीचे नाव</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayDeductions;
