import React, { useEffect, useMemo, useState } from "react";
import "../../../../Styles/AccoundStatment/AccoundStatment.css";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import Select from "react-select";


const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
const AccoundStatment = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({});
  const [selectedDate, setSelectedDate] = useState(getTodaysDate());
const [fix, setFix] = useState("");
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
   const [customerList, setCustomerList] = useState([]);
    const [haveSubAcc, setHaveSubAcc] = useState(false);
  const voucherList = useSelector((state) => state.voucher.voucherList || []);
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  

const [formData, setFormData] = useState({
    AccCode: "",
    GLCode: "",
    VoucherDate: getTodaysDate(),
    
  });

  useEffect(() => {
    dispatch(listSubLedger());
  });

  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  useEffect(() => {
    dispatch(listCustomer());
    dispatch(listSubLedger());
  }, [dispatch]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const mergedVoucherList = useMemo(() => {
    const temp = [];
    voucherList.forEach((voucher) => {
      const key = voucher.GLCode;
      const existing = temp.find((v) => v.key === key);
      const amt = Math.abs(voucher.Amt || 0);

      if (existing) {
        if (voucher.Vtype === 3) existing.cashIn += amt;
        if (voucher.Vtype === 4) existing.transferIn += amt;
        if (voucher.Vtype === 0) existing.cashOut += amt;
        if (voucher.Vtype === 1) existing.transferOut += amt;
      } else {
        temp.push({
          key,
          GLCode: key,
          cashIn: voucher.Vtype === 3 ? amt : 0,
          transferIn: voucher.Vtype === 4 ? amt : 0,
          cashOut: voucher.Vtype === 0 ? amt : 0,
          transferOut: voucher.Vtype === 1 ? amt : 0,
        });
      }
    });
    return temp;
  }, [voucherList]);
  // 2. Dispatch action when ledger selection changes

  //..
  const handleGLChange = (idx, newCode) => {
    dispatch(setVoucherGLCode({ index: idx, GLCode: newCode }));
  };

  // 🧠 Get unique GL codes used in voucherList
  const uniqueGLCodes = Array.from(new Set(voucherList.map((v) => v.GLCode)));

  // 📘 Build a list of matched ledgers (only once per GLCode)
  const matchedLedgers = uniqueGLCodes
    .map((glCode) => {
      const ledger = sledgerlist.find((l) => l.GLCode === glCode);
      return ledger
        ? { GLCode: glCode, ledger_name: ledger.ledger_name }
        : null;
    })
    .filter(Boolean); // remove nulls

  //......
  const totals = useMemo(() => {
    let jamaCash = 0;
    let jamaTransfer = 0;
    let naveCash = 0;
    let naveTransfer = 0;

    mergedVoucherList.forEach((voucher) => {
      jamaCash += voucher.cashIn || 0;
      jamaTransfer += voucher.transferIn || 0;
      naveCash += voucher.cashOut || 0;
      naveTransfer += voucher.transferOut || 0;
    });

    return {
      openingBalance: 0, // use actual value if needed
      closingBalance: jamaCash + jamaTransfer - naveCash - naveTransfer,
      jamaCash,
      jamaTransfer,
      naveCash,
      naveTransfer,
    };
  }, [mergedVoucherList]);

    const options = sledgerlist.map((i) => ({
      value: i.lno,
      label: i.marathi_name,
    }));
    ///....
    const custOptions1 = customerList.map((item) => ({
      srno: item.srno,
      value: item.srno,
      label: `${item.cname}`,
    }));
  return (
    <div className="accound-Statment-container w100 h1 d-flex ">
      <div className="GL-customer-Date-first-half-containr w70 h1 d-flex-col ">
        <span className="px10 heading">Accound Statment</span>

         <div
                       className="w100  
                     row sb d-flex my5 "
                     >
                       <span className="info-text ">खतावणी नं.</span>
                       <input
                         type="text"
                         id="GLCode"
                         className="data w20"
                         autoComplete="off"
                         onFocus={(e) => e.target.select()}
                         value={formData.GLCode}
                         onChange={(e) =>
                           setFormData({ ...formData, GLCode: e.target.value })
                         }
                         onKeyDown={(e) =>
                           handleKeyPress(
                             e,
                             document.getElementById(haveSubAcc ? "AccCode" : "amt")
                           )
                         }
                         disabled={!formData.InstrType || fix}
                       />
         
                       <Select
                         options={options}
                         className=" mx10 w50"
                         placeholder=""
                         isSearchable
                         styles={{
                           menu: (provided) => ({
                             ...provided,
                             zIndex: 200,
                           }),
                         }}
                         value={
                           formData.GLCode
                             ? options.find(
                                 (option) => option.value === Number(formData.GLCode)
                               )
                             : null
                         }
                         onChange={(selectedOption) => {
                           handleSelectChange(selectedOption, "GLCode");
                         }}
                         isDisabled={fix === 1}
                       />
                     </div>
         
                    

        <div className="customer-number-span-inputdiv w100 h10 d-flex a-center ">
          <span className="label-text w15">ग्राहक</span>
          <input className="data w15 " type="text" />
          <select className="data w30 " name="" id=""></select>
        </div>
        <div className="from-to-date-accound-statmentt w70 h10 d-flex a-center sb">
          <div className="date-from-acc-statment w50 d-flex a-center sa ">
            <span className="label-text w50">दिनाक पासून</span>
            <input className="data w60 " type="date" />
          </div>
          <div className="date-from-acc-statment w50 d-flex a-center sa ">
            <span className="label-text w50">दिनाक पर्येंत</span>
            <input className="data w60" type="date" />
          </div>
        </div>
        <div className="Accound-Statment-buttons w70 h20 px10 d-flex a-center">
          <button className="w-btn">रिपोर्ट</button>
        </div>
      </div>
    </div>
  );
};

export default AccoundStatment;
 