import React, { useEffect, useState } from "react";
import "../../../../Styles/Mainapp/Masters/Subledger.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createSubLedger,
  getMaxSLCode,
  listSubLedger,
} from "../../../../App/Features/Mainapp/Masters/ledgerSlice";

const SubLedger = () => {
  const dispatch = useDispatch();
  const tdate = useSelector((state) => state.date.toDate);
  const maxSlCode = useSelector((state) => state.ledger.maxcodesl);
  const MainLedgers = useSelector((state) => state.ledger.mledgerlist);
  const [errors, setErrors] = useState({});

  console.log(maxSlCode);

  const [formData, setFormData] = useState({
    date: tdate,
    code: "",
    groupcode: "",
    groupname: "",
    eng_name: "",
    marathi_name: "",
    sanghahead: "",
    perltramt: "",
    subAcc: "",
    vcsms: "",
  });

  useEffect(() => {
    dispatch(getMaxSLCode());
    // dispatch(listSubLedger());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      code: maxSlCode,
      date: tdate,
    }));
  }, [maxSlCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const fieldError = validateField(name, value);
    setErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors, ...fieldError };
      if (!value) delete updatedErrors[name]; // Clear error if field is empty
      return updatedErrors;
    });
  };

  const validateField = (name, value) => {
    let error = {};

    switch (name) {
      case "code":
        if (!/^\d+$/.test(value.toString())) {
          error[name] = "Invalid ledger code.";
        } else {
          delete errors[name];
        }
        break;

      case "marathi_name":
        if (!/^[\u0900-\u097F\sA-Za-z]+$/.test(value)) {
          error[name] = "Invalid marathi name.";
        } else {
          delete errors[name];
        }
        break;

      case "eng_name":
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          error[name] = "Invalid english name.";
        } else {
          delete errors[name];
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateFields = () => {
    const fieldsToValidate = ["code", "marathi_name", "eng_name", "category"];
    const validationErrors = {};
    fieldsToValidate.forEach((field) => {
      const fieldError = validateField(field, formData[field]);
      Object.assign(validationErrors, fieldError);
    });
    return validationErrors;
  };

  const handleFrom = async (e) => {
    e.preventDefault();
    // Validate fields before submission
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    if (!formData.date) {
      toast.error("Please refresh your page!");
    }
    const result = await dispatch(createSubLedger(formData)).unwrap();
    if (result?.status === 200) {
      const result = await dispatch(getMaxSLCode()).unwrap();
      const res = await dispatch(listSubLedger()).unwrap();

      setFormData({
        eng_name: "",
        marathi_name: "",
        category: "",
      });

      setFormData((prevData) => ({
        ...prevData,
        date: tdate,
      }));

      toast.success("New Main Ledger Created Successfully!");
    } else {
      toast.error("failed to create new ledger!");
    }
  };

  return (
    <div className="sub-ledger-container w100 h1 d-flex-col p10">
      <h2 className="heading py10">Ledger Master :</h2>
      <form className="ledger-master-form-container w100 h30 d-flex">
        <div className="ledger-info-contsiner w60 h1 d-flex-col sa">
          <div className="ledger-no-group-container w100 h20 d-flex sb">
            <div className="ledger-no-div w15 d-flex a-center sb">
              <label htmlFor="ledger-no" className="label-text w20">
                No.
              </label>
              <input
                id="ledger-no"
                type="number"
                className="data w65"
                value={formData.code || ""}
              />
            </div>
            <div className="ledger-group-div w80 d-flex a-center sb">
              <label htmlFor="ledger-gno" className="label-text w25">
                Select Group :
              </label>
              <input id="ledger-gno" type="number" className="data w15" />
              <input id="ledger-name" type="text" className="data w50" />
            </div>
          </div>
          <div className="ledger-names-div w100 h40 d-flex sb">
            <div className="le-name-div w45 h1 d-flex-col sb">
              <label htmlFor="" className="label-text w100">
                Enter English Name :
              </label>
              <input type="text" name="" id="" className="data w100" />
            </div>
            <div className="le-name-div w45 d-flex-col sb">
              <label htmlFor="" className="label-text w100">
                Enter Marathi Name :
              </label>
              <input type="text" name="" id="" className="data w100" />
            </div>
          </div>
          <div className="ledger-names-div w100 h40 d-flex-col sb">
            <span className="label-text w100">
              Sangha Milk Sales Deduction and Dairy Bank Cheque Head :
            </span>
            <div className="sangha-sale-settings-div w100 h80 d-flex sb">
              <div className="le-name-div w15 d-flex a-center sb">
                <input
                  type="radio"
                  name="sanghahead"
                  id="nayes"
                  className="w25 h50"
                />
                <label htmlFor="nayes" className="info-text t-center w70">
                  N/A
                </label>
              </div>
              <div className="le-name-div w20 d-flex a-center sb">
                <input
                  type="radio"
                  name="sanghahead"
                  id="milksales"
                  className="w25 h50"
                />
                <label htmlFor="milksales" className="info-text t-center w70">
                  Milk Sales
                </label>
              </div>
              <div className="le-name-div w25 d-flex a-center sb">
                <input
                  type="radio"
                  name="sanghahead"
                  id="salescheque"
                  className="w25 h50"
                />
                <label htmlFor="salescheque" className="info-text t-center w75">
                  Sales Cheque
                </label>
              </div>
              <div className="perltr_amt-div w30 d-flex a-center sb">
                <label htmlFor="perltr" className="label-text w40">
                  Per/ltr :
                </label>
                <input
                  type="text"
                  name="perltr"
                  id="perltr"
                  className="data w60 h1"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="ledger-settings-contsiner w40 h1 d-flex-col px10 sb">
          {/* <div className="ledger-other-settings-div w100 h30 d-flex-col sb">
            <span className="label-text w100 py10">General Ledger Side :</span>
            <div className="sangha-sale-settings-div w100 h50 d-flex sb">
              <div className="le-name-div w20 d-flex a-center sb">
                <input
                  type="radio"
                  name="glside"
                  id="assets"
                  className="w25 h70"
                />
                <label htmlFor="assets" className="info-text t-center w70">
                  Assets
                </label>
              </div>
              <div className="le-name-div w25 d-flex a-center sb">
                <input
                  type="radio"
                  name="glside"
                  id="liabilities"
                  className="w25 h70"
                />
                <label htmlFor="liabilities" className="info-text t-center w75">
                  Liabilities
                </label>
              </div>
              <div className="le-name-div w20 d-flex a-center sb">
                <input
                  type="radio"
                  name="glside"
                  id="income"
                  className="w25 h70"
                />
                <label htmlFor="income" className="info-text t-center w70">
                  Income
                </label>
              </div>
              <div className="le-name-div w25 d-flex a-center sb">
                <input
                  type="radio"
                  name="glside"
                  id="expenses"
                  className="w25 h70"
                />
                <label htmlFor="expenses" className="info-text t-center w70">
                  Expenses
                </label>
              </div>
            </div>
          </div>
          <div className="ledger-other-settings-div w100 h30 d-flex-col sb">
            <span className="label-text w100 py10">Account Id :</span>
            <div className="sangha-sale-settings-div w100 h50 d-flex sb">
              <div className="le-name-div w20 d-flex a-center sb">
                <input
                  type="radio"
                  name="accid"
                  id="others"
                  className="w25 h70"
                />
                <label htmlFor="others" className="info-text t-center w70">
                  Others
                </label>
              </div>
              <div className="le-name-div w25 d-flex a-center sb">
                <input
                  type="radio"
                  name="accid"
                  id="purchase"
                  className="w25 h70"
                />
                <label htmlFor="purchase" className="info-text t-center w70">
                  Purchase
                </label>
              </div>
              <div className="le-name-div w20 h1 d-flex a-center sb">
                <input
                  type="radio"
                  name="accid"
                  id="sales"
                  className="w25 h70"
                />
                <label htmlFor="sales" className="info-text t-center w75">
                  Sales
                </label>
              </div>
              <div className="le-name-div w20 h1 d-flex a-center sb">
                <input
                  type="radio"
                  name="accid"
                  id="shares"
                  className="w25 h70"
                />
                <label htmlFor="shares" className="info-text t-center w70">
                  Shares
                </label>
              </div>
            </div>
          </div> */}
          <div className="ledger-subacc-div w100 h20 d-flex a-center sb">
            <label htmlFor="" className="label-text w50 ">
              Sub Accounts ?
            </label>
            <div className="ledger-name-inner-div w40 h1 d-flex sb">
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  type="radio"
                  name="subacc"
                  id="acyes"
                  className="w50 h40"
                />
                <label htmlFor="acyes" className="info-text w50">
                  Yes
                </label>
              </div>
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  type="radio"
                  name="subacc"
                  id="acno"
                  className="w50 h40"
                />
                <label htmlFor="acno" className="info-text w50">
                  NO
                </label>
              </div>
            </div>
          </div>
          <div className="ledger-sms-settings-div w100 h20 d-flex a-center sb">
            <label htmlFor="" className="label-text w50 ">
              Send Voucher sms :
            </label>
            <div className="ledger-name-inner-div w40 h1 d-flex sb">
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  type="radio"
                  name="vcsms"
                  id="acyes"
                  className="w50 h40"
                />
                <label htmlFor="acyes" className="info-text w50">
                  Yes
                </label>
              </div>
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  type="radio"
                  name="vcsms"
                  id="acno"
                  className="w50 h40"
                />
                <label htmlFor="acno" className="info-text w50">
                  NO
                </label>
              </div>
            </div>
          </div>
          <div className="ledger-buttons-div w100 h40 d-flex a-center j-end">
            <button className="w-btn">Edit</button>
            <button className="w-btn mx10">Cancel</button>
            <button className="w-btn">Save</button>
          </div>
        </div>
      </form>
      <div className="ledgers-list-container w100 h70 d-flex-col">
        <label htmlFor="listtitle" className="heading">
          Ledger List :
        </label>
        <div className="ledgers-list-inner-container w100 h90 mh90 hidescrollbar d-flex-col bg">
          <div className="ledger-list-headers-div w100 p10 d-flex t-center sb sticky-top bg7">
            <span className="f-label-text w10">Le.No.</span>
            <span className="f-label-text w30">Name</span>
            <span className="f-label-text w20">Inc/Exp</span>
            <span className="f-label-text w20">Sub Acc.</span>
            <span className="f-label-text w20">Pur/Sales</span>
            <span className="f-label-text w15">Group Code</span>
            <span className="f-label-text w30">Group Name</span>
          </div>
          <div className="ledger-list-data-div w100 p10 d-flex sb">
            <span className="info-text w10">Le.No.</span>
            <span className="info-text w30">Name</span>
            <span className="info-text w20">Inc/Exp</span>
            <span className="info-text w20">Sub Acc.</span>
            <span className="info-text w20">Pur/Sales</span>
            <span className="info-text w15">Group Code</span>
            <span className="info-text w30">Group Name</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubLedger;
