import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../Home/Spinner/Spinner";
import {
  getMaxSLCode,
  createSubLedger,
  listMainLedger,
  listSubLedger,
  updateSubLedger,
} from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { toast } from "react-toastify";
import "../../../../Styles/Mainapp/Masters/Subledger.css";

const SubLedger = () => {
  const dispatch = useDispatch();
  const tdate = useSelector((state) => state.date.toDate);
  const maxSlCode = useSelector((state) => state.ledger.maxcodesl);
  const MainLedgers = useSelector((state) => state.ledger.mledgerlist);
  const SubLedgers = useSelector((state) => state.ledger.sledgerlist);
  const createStatus = useSelector((state) => state.ledger.cslStatus);
  const updateStatus = useSelector((state) => state.ledger.updatecslStatus);
  const listStatus = useSelector((state) => state.ledger.listcslStatus);
  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    date: tdate,
    code: "",
    groupcode: "",
    groupname: "",
    eng_name: "",
    marathi_name: "",
    sanghahead: "0",
    perltramt: "",
    subAcc: "0",
    vcsms: "0",
  });

  useEffect(() => {
    dispatch(getMaxSLCode());
    dispatch(listMainLedger());
    dispatch(listSubLedger());
  }, [dispatch]);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      code: maxSlCode,
      date: tdate,
    }));
  }, [maxSlCode]);

  // handle edit click ---------------------------------------------------------->

  const handleEditClick = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setFormData((prevData) => ({
        ...prevData,
        cust_no: "",
      }));
    } else {
      resetForm();
    }
  };

  const handleInputChange = (e) => {
    const { name, type, value } = e.target;

    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: parseInt(value, 10), // For radio buttons, set the value as integer
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
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

  // Function to find ledger by code or name
  const findLedgerByInput = (key, value) => {
    let ledger;
    if (key === "groupcode") {
      ledger = MainLedgers.find(
        (ledger) => ledger.code.toString() === value.toString()
      );
    } else if (key === "groupname") {
      ledger = MainLedgers.find(
        (ledger) => ledger.gl_name.toLowerCase() === value.toLowerCase()
      );
    }

    if (ledger) {
      setFormData((prev) => ({
        ...prev,
        groupcode: ledger.code,
        groupname: ledger.gl_name,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [key]: value, // Keep the current input while searching
      }));
    }
  };

  // Handle input changes for both code and name
  const handleLedgerInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value, // Update the current field
    }));

    setTimeout(() => findLedgerByInput(name, value), 300); // Debounce the search
  };

  const findLedgerbyCode = (code) => {
    if (isEditing) {
      const ledger = SubLedgers.find(
        (ledger) => ledger.lno.toString() === code.toString()
      );
      if (ledger) {
        setFormData((prev) => ({
          ...prev,
          id: ledger.id,
          date: tdate,
          groupcode: ledger.group_code,
          groupname: ledger.group_name,
          eng_name: ledger.ledger_name,
          marathi_name: ledger.marathi_name,
          sanghahead: ledger.sangha_head,
          perltramt: ledger.per_ltr_amt,
          subAcc: ledger.subacc,
          vcsms: ledger.vcsms,
        }));
      } else {
        toast.error("Sub Ledger not found!");
      }
    }
  };

  // Function to reset form after success
  const resetForm = () => {
    setFormData((prevData) => ({
      ...prevData,
      date: tdate,
      groupcode: "",
      groupname: "",
      eng_name: "",
      marathi_name: "",
      sanghahead: "0",
      perltramt: "",
      subAcc: "0",
      vcsms: "0",
    }));
  };

  useEffect(() => {
    if (isEditing) {
      const handler = setTimeout(() => {
        if (formData.code.length >= 1) {
          // Adjust length as necessary
          findLedgerbyCode(formData.code);
        }
      }, 500);
      return () => clearTimeout(handler);
    }
  }, [formData.code, isEditing]);

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
      return;
    }

    try {
      if (isEditing) {
        const result = await dispatch(updateSubLedger(formData)).unwrap();
        if (result?.status === 200) {
          await dispatch(listSubLedger()).unwrap();
          resetForm();
          toast.success("Sub ledger updated successfully!");
        } else {
          toast.error("Failed to update ledger!");
        }
      } else {
        const result = await dispatch(createSubLedger(formData)).unwrap();
        if (result?.status === 200) {
          await dispatch(getMaxSLCode()).unwrap();
          await dispatch(listSubLedger()).unwrap();
          resetForm();
          toast.success("New sub ledger created successfully!");
        } else {
          toast.error("Failed to create new ledger!");
        }
      }
    } catch (error) {
      console.error("Error creating sub ledger:", error);
      toast.error(error?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className={`sub-ledger-container w100 h1 d-flex-col p10  ${
        isEditing ? "edit-bg" : ""
      }`}
    >
      <h2 className="heading py10">Ledger Master :</h2>
      <form
        onSubmit={handleFrom}
        className={`ledger-master-form-container w100 h30 d-flex`}
      >
        <div className="ledger-info-contsiner w60 h1 d-flex-col sa">
          <div className="ledger-no-group-container w100 h20 d-flex sb">
            <div className="ledger-no-div w15 d-flex a-center sb">
              <label htmlFor="ledger-no" className="label-text w20">
                No.
              </label>
              <input
                id="ledger-no"
                type="number"
                name="code"
                className="data w65"
                onChange={handleInputChange}
                value={formData.code || ""}
              />
            </div>
            <div className="ledger-group-div w80 d-flex a-center sb">
              <label htmlFor="ledger-gno" className="ledger-gtxt label-text w25">
                Select Group :
              </label>
              <input
                id="ledger-gno"
                type="number"
                name="groupcode"
                value={formData.groupcode}
                className="data w15"
                onChange={handleLedgerInputChange}
              />
              <input
                id="ledger-name"
                type="text"
                name="groupname"
                value={formData.groupname || ""}
                className="data w50"
                list="ledger-options"
                onChange={handleLedgerInputChange}
              />
              <datalist id="ledger-options">
                {MainLedgers.filter((ledger) =>
                  ledger.gl_name
                    .toLowerCase()
                    .includes(formData.groupname.toLowerCase())
                ).map((ledger, index) => (
                  <option key={index} value={ledger.gl_name} />
                ))}
              </datalist>
            </div>
          </div>
          <div className="ledger-names-div w100 h40 d-flex sb">
            <div className="le-name-div w45 h1 d-flex-col sb">
              <label htmlFor="slename" className="label-text w100">
                Enter English Name :
              </label>
              <input
                className="data w100"
                type="text"
                name="eng_name"
                id="slename"
                value={formData.eng_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="le-name-div w45 d-flex-col sb">
              <label htmlFor="slmname" className="label-text w100">
                Enter Marathi Name :
              </label>
              <input
                className="data w100"
                type="text"
                name="marathi_name"
                value={formData.marathi_name}
                id="slmname"
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="ledger-head-div w100 h40 d-flex-col sb">
            <span className="label-text w100">
              Sangha Milk Sales Deduction and Dairy Bank Cheque Head :
            </span>
            <div className="sangha-sale-settings-div w100 h80 d-flex sb">
              <div className="ss-div w15 d-flex a-center sb">
                <input
                  type="radio"
                  name="sanghahead"
                  id="nayes"
                  value="0"
                  checked={formData.sanghahead === 0}
                  onChange={handleInputChange}
                  className="w25 h50"
                />
                <label htmlFor="nayes" className="info-text t-center w70">
                  N/A
                </label>
              </div>
              <div className="ss-div w20 d-flex a-center sb">
                <input
                  type="radio"
                  name="sanghahead"
                  id="milksales"
                  value="1"
                  checked={formData.sanghahead === 1}
                  onChange={handleInputChange}
                  className="w25 h50"
                />
                <label htmlFor="milksales" className="info-text t-center w70">
                  Milk Sales
                </label>
              </div>
              <div className="ss-div w25 d-flex a-center sb">
                <input
                  type="radio"
                  name="sanghahead"
                  id="salescheque"
                  value="2"
                  checked={formData.sanghahead === 2}
                  onChange={handleInputChange}
                  className="w25 h50"
                />
                <label htmlFor="salescheque" className="info-text t-center w75">
                  Sales Cheque
                </label>
              </div>
              {formData.sanghahead.toString() !== "0" ? (
                <div className="perltr_amt-div w30 d-flex a-center sb">
                  <label htmlFor="perltr" className="label-text w40">
                    Per/ltr :
                  </label>
                  <input
                    type="text"
                    name="perltramt"
                    id="perltr"
                    value={formData.perltramt}
                    onChange={handleInputChange}
                    className="data w60"
                  />
                </div>
              ) : (
                <></>
              )}
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
            <div className="subacc-setting-div w40 h1 d-flex sb">
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  type="radio"
                  name="subAcc"
                  id="acno"
                  className="w50 h40"
                  value="0"
                  checked={formData.subAcc === 0}
                  onChange={handleInputChange}
                />
                <label htmlFor="acno" className="info-text w50">
                  No
                </label>
              </div>
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  type="radio"
                  name="subAcc"
                  id="acyes"
                  className="w50 h40"
                  value="1"
                  checked={formData.subAcc === 1}
                  onChange={handleInputChange}
                />
                <label htmlFor="acyes" className="info-text w50">
                  Yes
                </label>
              </div>
            </div>
          </div>
          <div className="ledger-sms-settings-div w100 h20 d-flex a-center sb">
            <label htmlFor="" className="label-text w50 ">
              Send Voucher sms :
            </label>
            <div className="sms-setting-div w40 h1 d-flex sb">
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  className="w50 h40"
                  type="radio"
                  name="vcsms"
                  id="acno"
                  value="0"
                  checked={formData.vcsms === 0}
                  onChange={handleInputChange}
                />
                <label htmlFor="acno" className="info-text w50">
                  No
                </label>
              </div>
              <div className="le-name-div w50 d-flex a-center sb">
                <input
                  className="w50 h40"
                  type="radio"
                  name="vcsms"
                  id="acyes"
                  value="1"
                  checked={formData.vcsms === 1}
                  onChange={handleInputChange}
                />
                <label htmlFor="acyes" className="info-text w50">
                  Yes
                </label>
              </div>
            </div>
          </div>
          <div className="ledger-buttons-div w100 h40 d-flex a-center j-end">
            <button type="button" className="w-btn" onClick={handleEditClick}>
              {isEditing ? "Save" : "Edit"}
            </button>
            <button type="reset" className="w-btn mx10">
              Cancel
            </button>
            {isEditing ? (
              <button
                type="submit"
                className="w-btn"
                disabled={createStatus === "lodaing"}
              >
                {updateStatus === "lodaing" ? "Updating..." : "Update"}
              </button>
            ) : (
              <button
                type="submit"
                className="w-btn"
                disabled={createStatus === "lodaing"}
              >
                {createStatus === "lodaing" ? "Saving..." : "Save"}
              </button>
            )}
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
            <span className="f-label-text w15">Code</span>
            <span className="f-label-text w30">Main Ladger</span>
            <span className="f-label-text w20">Vc. SMS</span>
          </div>
          {listStatus === "loading" ? (
            <Spinner />
          ) : SubLedgers.length === 0 ? (
            <div className="box d-flex center">
              <span className="lebel-text">Record not found!</span>
            </div>
          ) : (
            <>
              {SubLedgers.map((ledger, index) => (
                <div
                  className="ledger-list-data-div w100 t-center p10 d-flex sb"
                  style={{
                    backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                  }}
                >
                  <span className="info-text w10">{ledger.lno}</span>
                  <span className="info-text t-start w30">
                    {ledger.ledger_name}
                  </span>
                  {/* <span className="info-text w20">{ledger.subacc}</span> */}
                  <span className="info-text w15">{ledger.group_code}</span>
                  <span className="info-text t-start w30">
                    {ledger.group_name}
                  </span>
                  <span className="info-text w20">{ledger.vcsms}</span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubLedger;
