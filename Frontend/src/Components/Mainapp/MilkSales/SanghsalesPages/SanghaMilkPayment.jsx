import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getCenterSetting } from "../../../../App/Features/Mainapp/Settings/dairySettingSlice";
import {
  deleteSangahPayment,
  editSangahPayment,
  fetchsanghaLedger,
  fetchSanghaList,
  saveSangahPayment,
} from "../../../../App/Features/Mainapp/Sangha/sanghaSlice";
import Swal from "sweetalert2";

const SanghaMilkPayment = ({ clsebtn, todate, editData }) => {
  const dispatch = useDispatch();
  const sanghaList = useSelector((state) => state.sangha.sanghaList);
  const sanghaLedger = useSelector((state) => state.sangha.sanghaLedger); // sangha Ledger
  const sanghaSales = useSelector((state) => state.sangha.sanghaSales); // sangha Sales
  const sanghaPayment = useSelector((state) => state.sangha.sanghaPayment); // sangha milk payment
  const saveStatus = useSelector((state) => state.sangha.savespstatus); // save sangha payment Status
  const editStatus = useSelector((state) => state.sangha.editspstatus); // edit sangha payment Status
  const delStatus = useSelector((state) => state.sangha.delPaystatus); // delete sangha payment Status
  const otherCommRefs = useRef([]);
  const chillingRefs = useRef([]);
  const overrateRefs = useRef([]);
  const inputRefs = useRef([]);
  const submitBtnRef = useRef(null);
  const dedStatus = useSelector((state) => state.payment.savededstatus); // save other ded status
  const [sanghid, setSanghId] = useState("1");
  const [smData, setSMData] = useState([]);
  const [sanghLedger, setSanghLedger] = useState(sanghaLedger || []);
  const [sanghaBill, setSanghaBill] = useState([]);
  const [sanghaBillDed, setSanghaBillDed] = useState([]);

  let initialValues = {
    id: 0,
    billno: "",
    billdate: todate,
    sanghacode: sanghid,
    morningliters: "",
    eveningliters: "",
    totalcollection: "",
    othercommission: "",
    chilling: "",
    overrate: "",
    Amount: "",
    totalPayment: 0.0,
    totalcommission: 0.0,
    totalDeduction: 0.0,
    netPayment: 0.0,
  };

  const [formData, setFormData] = useState(initialValues);

  useEffect(() => {
    dispatch(fetchSanghaList());
    dispatch(fetchsanghaLedger());
    dispatch(getCenterSetting());
  }, []);

  // set
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      billdate: todate,
      billno: smData[0]?.billno || "",
      sanghacode: smData[0]?.sanghaId || sanghid,
      morningliters: parseFloat(smData[0]?.mrgLiters || 0).toFixed(2),
      eveningliters: parseFloat(smData[0]?.eveLiters || 0).toFixed(2),
      totalcollection: parseFloat(smData[0]?.totalLiters || 0).toFixed(2),
      othercommission: smData[0]?.totalOtherCharges || 0,
      chilling: smData[0]?.totalChilling || 0,
      totalPayment: parseFloat(smData[0]?.totalAmt || 0).toFixed(2),
    }));
  }, [todate, smData]);

  //  calculations for total commission ------------------------------------------------->
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      totalcommission: parseFloat(
        (
          parseFloat(formData.othercommission || 0) +
          parseFloat(formData.chilling || 0) +
          parseFloat(formData.overrate || 0)
        ).toFixed(2)
      ).toFixed(2),
    }));
  }, [formData.othercommission, formData.chilling, formData.overrate]);

  // fillter data over sanghaid  from sanghaSales------------------------------------------>
  useEffect(() => {
    const sanghaMilkDetails = sanghaSales?.filter(
      (sangh) => sangh?.sanghid.toString() === sanghid.toString()
    );
    console.log(sanghaMilkDetails);
    setSMData(sanghaMilkDetails);
  }, [sanghaSales, sanghid]);

  const handleAmountChange = (index, value) => {
    const amount = parseFloat(value) || "";

    if (editData) {
      // Deep copy and update for editData case
      const updatedLedgers = sanghaBillDed.map((item, i) =>
        i === index ? { ...item, Amount: amount } : { ...item }
      );
      setSanghaBillDed(updatedLedgers);
    } else {
      // Deep copy and update for normal case
      const updatedLedger = sanghLedger.map((item, i) =>
        i === index ? { ...item, Amount: amount } : { ...item }
      );
      setSanghLedger(updatedLedger);
    }
  };
console.log("sanghaSales", sanghaSales);
console.log("sanghaList", sanghaList);
  // Calculate total amount only when sanghaLedger changes
  const totalAmount = useMemo(() => {
    if (editData) {
      if (!Array.isArray(sanghaBillDed)) return 0;
      return sanghaBillDed.reduce(
        (acc, item) => acc + (parseFloat(item.Amount) || ""),
        0
      );
    } else {
      if (!Array.isArray(sanghLedger)) return 0;
      return sanghLedger.reduce(
        (acc, item) => acc + (parseFloat(item.Amount) || ""),
        0
      );
    }
  }, [sanghLedger, sanghaBillDed]);

  useEffect(() => {
    const totalPayment = parseFloat(formData.totalPayment) || 0;
    const totalCommission = parseFloat(formData.totalcommission) || 0;
    const totalDeduction = parseFloat(totalAmount) || 0;

    setFormData((prev) => ({
      ...prev,
      totalDeduction: totalDeduction.toFixed(2),
      netPayment: (totalPayment + totalCommission - totalDeduction).toFixed(2),
    }));
  }, [
    totalAmount,
    formData.totalPayment,
    formData.totalcommission,
    sanghaBillDed,
  ]);

  // Handling form data change -------------------------------------------------->
  const handleFormDataChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //----------------------------------------------------------------------------------->
  // filter sangha payment data based on editData
  useEffect(() => {
    if (sanghaPayment.length > 0 && editData) {
      const sanghaPay = sanghaPayment.filter(
        (payment) => payment.billno === editData && payment.ledgerCode !== 0
      );
      setSanghaBillDed(sanghaPay);
    }
  }, [sanghaPayment, editData]);

  useEffect(() => {
    if (sanghaPayment.length > 0 && editData) {
      const sanghaPay = sanghaPayment.filter(
        (payment) => payment.billno === editData && payment.ledgerCode === 0
      );
      setSanghaBill(sanghaPay);
    }
  }, [sanghaPayment, editData]);

  //  set sangha milk payment in formData --------------------------------------------->

  useEffect(() => {
    if (sanghaBill) {
      setFormData((prev) => ({
        ...prev,
        id: sanghaBill[0]?.id,
        billno: sanghaBill[0]?.billno,
        billdate: sanghaBill[0]?.billdate,
        sanghacode: sanghaBill[0]?.sangh_id,
        morningliters: sanghaBill[0]?.mrgltr,
        eveningliters: sanghaBill[0]?.eveltr,
        totalcollection: sanghaBill[0]?.totalltr,
        othercommission: sanghaBill[0]?.otherCommission,
        chilling: sanghaBill[0]?.chilling,
        overrate: sanghaBill[0]?.overrate,
        Amount: 0,
        totalPayment: sanghaBill[0]?.totalAmount,
        totalcommission: sanghaBill[0]?.totalComm,
        totalDeduction: sanghaBill[0]?.totalDeduction,
        netPayment: sanghaBill[0]?.netPayment,
      }));
    }
  }, [sanghaBill]);

  //handle focus on next input field ----------------------------------------->
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter" && nextRef.current) {
      e.preventDefault();
      nextRef.current.focus();
    } else if (e.key === "Enter" && !nextRef.current) {
      inputRefs.current[0].focus();
    }
  };

  // handle bill save function ----------------------------------------------->
  const handleBillSave = async (e) => {
    e.preventDefault();
    if (formData.totalDeduction !== 0 && formData.netPayment !== 0) {
      return toast.error("सर्व माहिती भरणे गरजेचे आहे!");
    }

    const saveres = await dispatch(
      saveSangahPayment({ formData, paymentDetails: sanghLedger })
    ).unwrap();
    otherCommRefs.focus();

    if (saveres?.status === 200) {
      setFormData(initialValues); // Reset form data
      setSanghaBillDed([]);
      toast.success("Sangha milk payment saved successfully!");
    } else {
      toast.error("Failed to save sangha milk payment!");
    }
  };

  // handle bill save function ----------------------------------------------->
  const handleBillEdit = async (e) => {
    e.preventDefault();
    if (sanghaBillDed.length > 0 && editData) {
      const saveres = await dispatch(
        editSangahPayment({ formData, paymentDetails: sanghaBillDed })
      ).unwrap();
      otherCommRefs.focus();

      if (saveres?.status === 200) {
        setFormData(initialValues); // Reset form data
        toast.success("Sangha milk payment saved successfully!");
      } else {
        toast.error("Failed to save sangha milk payment!");
      }
    } else {
      return toast.error("सर्व माहिती भरणे गरजेचे आहे!");
    }
  };

  // handle bill save function ----------------------------------------------->

  const handleBillDelete = async (ItemCode) => {
    const result = await Swal.fire({
      title: "Confirm Deletion?",
      text: "Are you sure you want to delete this bill?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      if (formData.billno) {
        const saveres = await dispatch(
          deleteSangahPayment({
            billno: formData.billno,
          })
        ).unwrap();

        if (saveres?.status === 200) {
          setFormData(initialValues); // Reset form data
          toast.success("Sangha milk payment deleted successfully!");
        } else {
          toast.error("Failed to delete sangha milk payment!");
        }
      } else {
        return toast.error("सर्व माहिती असणे गरजेचे आहे!");
      }
    }
  };

  return (
    <div className="sangha-milk-payment-container w90 h90 d-flex-col">
      <div className="payment-bill-deduction-main-container w100 h1 d-flex-col p10 sb bg5 br9">
        <div className="payment-deduction-info-outer-container w100 h30 d-flex sb bg-light-green br6">
          <div className="payment-deduction-info-container w40 h1 d-flex-col sa px10">
            {editData ? (
              <span className="heading">संघ पगार कपातीत बदल करा :</span>
            ) : (
              <span className="heading">संघ पगार कपाती :</span>
            )}
            <div className="paymebt-bill-customer-details-div w100 h30 d-flex a-center sb">
              <div className="bill-date-comopent w60 d-flex a-center sb px10">
                <label htmlFor="billdatetxt" className="label-text w35">
                  Bill Date:
                </label>
                <input
                  id="billdatetxt"
                  className="data w60 read-onlytxt"
                  type="date"
                  readOnly
                  name="billdate"
                  value={formData.billdate?.slice(0, 10)}
                />
              </div>
            </div>
            <div className="customer-details-container w100 h30 d-flex a-center sb">
              <select
                name="sanghid"
                id=""
                value={sanghid}
                className="data"
                onChange={(e) => setSanghId(e.target.value)}
              >
                {sanghaList.length > 0 &&
                  sanghaList.map((sangha, index) => (
                    <option key={index} value={sangha.code}>
                      {sangha.sangha_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="bill-payment-deduction-first-half w60 h1 d-flex-col sa">
            <div className="morening-evening-all-collection w100 d-flex sb">
              <div className="morening-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="mrgltrtxt" className="label-text w50">
                  सकाळ लि :
                </label>
                <input
                  id="mrgltrtxt"
                  className="data w50 read-onlytxt"
                  type="text"
                  name="morningliters"
                  placeholder="0.00"
                  readOnly
                  value={formData.morningliters || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="morening-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="eveltrtxt" className="label-text w50">
                  सायं. लि :
                </label>
                <input
                  id="eveltrtxt"
                  className="data w50 read-onlytxt"
                  type="text"
                  name="eveningliters"
                  placeholder="0.00"
                  readOnly
                  value={formData.eveningliters || ""}
                  onChange={handleFormDataChange}
                />
              </div>
              <div className="morening-liter-compoentv w32 d-flex a-center sb">
                <label htmlFor="totalmilktxt" className="label-text w50">
                  ए. संकलन :
                </label>
                <input
                  id="totalmilktxt"
                  className="data w50 read-onlytxt"
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
              <div className="commision-compoent w32 d-flex a-center sb">
                <label htmlFor="ocomtxt" className="label-text w50">
                  प्र व इतर अनु:
                </label>
                <input
                  id="ocomtxt"
                  className="data w50"
                  type="number"
                  name="othercommission"
                  placeholder="0.00"
                  step="any"
                  value={formData.othercommission || ""}
                  onChange={handleFormDataChange}
                  ref={otherCommRefs}
                  onKeyDown={(e) => handleKeyDown(e, chillingRefs)}
                />
              </div>
              <div className="commision-compoent w32 d-flex a-center sb">
                <label htmlFor="chilingtxt" className="label-text w50">
                  शीतकरण:
                </label>
                <input
                  id="chilingtxt"
                  className="data w50"
                  type="text"
                  name="chilling"
                  step="any"
                  placeholder="0.00"
                  value={formData.chilling || ""}
                  onChange={handleFormDataChange}
                  ref={chillingRefs}
                  onKeyDown={(e) => handleKeyDown(e, overrateRefs)}
                />
              </div>
              <div className="commision-compoent w32 d-flex a-center sb">
                <label htmlFor="overratetxt" className="label-text w50">
                  ओवर रेट :
                </label>
                <input
                  id="overratetxt"
                  className="data w50"
                  type="text"
                  name="overrate"
                  step="any"
                  placeholder="0.00"
                  value={formData.overrate || ""}
                  onChange={handleFormDataChange}
                  ref={overrateRefs}
                  onKeyDown={(e) => handleKeyDown(e, inputRefs.current[0])}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="payment-deduction-details-table-container  w100 h65 d-flex sb">
          {editData ? (
            <div className="payment-deduction-table-container  w50 h1 mh100 hidescrollbar d-flex-col bg">
              <div className="deduction-heading-container w100 p10 sa d-flex a-center t-center sticky-top bg7 br-top">
                <span className="f-label-text w20">खता. नं.</span>
                <span className="f-label-text w60">कपातीचे नाव</span>
                <span className="f-label-text w20">कपात</span>
              </div>
              {sanghaBillDed && sanghaBillDed.length > 0 ? (
                sanghaBillDed.map((item, index) => (
                  <div
                    key={index}
                    className="deduction-heading-container w100 p10 sa d-flex t-center a-center"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    <span className="info-text w20">{item.ledgerCode}</span>
                    <span className="info-text w60 t-start">
                      {item.ledgerName || ""}
                    </span>
                    <span className="info-text w20">
                      <input
                        type="number"
                        name="Amount"
                        className="data"
                        step="any"
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={item.Amount}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const isLastInput =
                              index === sanghLedger.length - 1;

                            if (isLastInput) {
                              // Move focus to submit button
                              if (submitBtnRef.current) {
                                submitBtnRef.current.focus();
                              }
                            } else {
                              // Move to next input
                              const nextInput = inputRefs.current[index + 1];
                              if (nextInput) {
                                nextInput.focus();
                              }
                            }
                          }
                        }}
                      />
                    </span>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div className="payment-deduction-table-container  w50 h1 mh100 hidescrollbar d-flex-col bg">
              <div className="deduction-heading-container w100 p10 sa d-flex a-center t-center sticky-top bg7 br-top">
                <span className="f-label-text w20">खता. नं.</span>
                <span className="f-label-text w60">कपातीचे नाव</span>
                <span className="f-label-text w20">कपात</span>
              </div>
              {sanghLedger && sanghLedger.length > 0 ? (
                sanghLedger.map((item, index) => (
                  <div
                    key={index}
                    className="deduction-heading-container w100 p10 sa d-flex t-center a-center"
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    <span className="info-text w20">{item.lno}</span>
                    <span className="info-text w60 t-start">
                      {item.marathi_name || ""}
                    </span>
                    <span className="info-text w20">
                      <input
                        type="number"
                        name="Amount"
                        className="data"
                        step="any"
                        ref={(el) => (inputRefs.current[index] = el)}
                        value={item.Amount}
                        onChange={(e) =>
                          handleAmountChange(index, e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const isLastInput =
                              index === sanghLedger.length - 1;

                            if (isLastInput) {
                              // Move focus to submit button
                              if (submitBtnRef.current) {
                                submitBtnRef.current.focus();
                              }
                            } else {
                              // Move to next input
                              const nextInput = inputRefs.current[index + 1];
                              if (nextInput) {
                                nextInput.focus();
                              }
                            }
                          }
                        }}
                      />
                    </span>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          )}

          <div className="payment-amt-details-container w40 h1 d-flex-col bg-light-skyblue br9 p10">
            <div className="deduction-amount-container w100 h65 d-flex-col a-center sb">
              <div className="deduction-details w100 h1 d-flex a-center sb">
                <label htmlFor="" className="w40">
                  एकूण रक्कम :
                </label>
                <span
                  id=""
                  readOnly
                  className="data w30 t-center label-text read-onlytxt"
                >
                  {formData.totalPayment || 0.0}
                </span>
              </div>
              <div className="deduction-details w100 h1 d-flex a-center sb">
                <label htmlFor="" className="w40">
                  एकूण कमिशन :
                </label>
                <span
                  id=""
                  readOnly
                  className="data w30 t-center label-text read-onlytxt"
                >
                  {formData.totalcommission || 0.0}
                </span>
              </div>
              <div className="deduction-details w100 h1 d-flex a-center sb">
                <label htmlFor="" className="w40">
                  एकूण कपात :
                </label>
                <span
                  id=""
                  readOnly
                  className="data w30 t-center label-text read-onlytxt"
                >
                  {formData.totalDeduction || 0.0}
                </span>
              </div>

              <div className="deduction-details w100 h1 d-flex a-center sb">
                <label htmlFor="netpay" className="w40">
                  निव्वळ देय :
                </label>
                <span
                  id="netpay"
                  className="data w30 t-center label-text read-onlytxt"
                  readOnly
                >
                  {formData.netPayment || 0.0}
                </span>
              </div>
            </div>
            <div className="pay-deduction-btn-container w100 h30 d-flex a-center j-end sb">
              {editData ? (
                <>
                  <button
                    type="submit"
                    className="w-btn"
                    ref={submitBtnRef}
                    onClick={handleBillEdit}
                    disabled={editStatus === "loading"}
                  >
                    {editStatus === "loading" ? "बदल करत आहोत..." : "बदल करा"}
                  </button>
                  <button
                    type="submit"
                    className="btn-danger"
                    ref={submitBtnRef}
                    onClick={handleBillDelete}
                    disabled={delStatus === "loading"}
                  >
                    {delStatus === "loading"
                      ? "काढून टाकत आहोत..."
                      : "काढून टाका"}
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="w-btn"
                  ref={submitBtnRef}
                  onClick={handleBillSave}
                  disabled={saveStatus === "loading"}
                >
                  {saveStatus === "loading"
                    ? "सेव्ह करत आहोत..."
                    : "बिल सेव्ह करा"}
                </button>
              )}

              <button
                type="submit"
                className="btn-danger mx10"
                onClick={() => clsebtn(false)}
              >
                बाहेर पडा
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SanghaMilkPayment;
