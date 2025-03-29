import { FaRegEdit } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import Select from "react-select";
import "./credit.css";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";
import { getAllVoucher } from "../../../../App/Features/Mainapp/Account/voucherSlice";
import Swal from "sweetalert2";

//gett todays date------------>
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
const TransferCredit = () => {
  const [customerList, setCustomerList] = useState([]);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    AccCode: "",
    GLCode: "",
    VoucherDate: getTodaysDate(),
    BatchNo: "1",
    Vtype: "",
    InstrType: "",
    Amt: "",
    ChequeNo: "",
    ChequeDate: getTodaysDate(),
    VoucherNo: "1",
    ReceiptNo: "1",
    Narration: "",
  });
  const [fix, setFix] = useState("");
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const { loading, voucherList } = useSelector((state) => state.voucher);
  const [filterVoucherList, setfilterVoucherList] = useState([]);
  const [onclickChalan, setOnclickChalan] = useState(false);
  const [edit, setEdit] = useState(false);
  const [ID, setId] = useState("");
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );
  const [settings, setSettings] = useState({});
  const autoCenter = settings?.autoCenter;

  //set setting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  // Get master dates and list customer and voucher
  useEffect(() => {
    if (settings?.autoCenter !== undefined) {
      // console.log("in seleting:", formData.VoucherDate);
      dispatch(
        getAllVoucher({ VoucherDate: getTodaysDate(), autoCenter, filter: 2 })
      );
    }
    dispatch(listCustomer());
    dispatch(listSubLedger());
  }, [settings]);

  // Get  voucher on change voucher date
  useEffect(() => {
    if (settings?.autoCenter !== undefined) {
      // console.log("in use effect:", formData.VoucherDate);

      setFormData({
        ...formData,
        ChequeDate: formData.VoucherDate,
      });
    }
  }, [formData.VoucherDate]);

  // set today date
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      VoucherDate: getTodaysDate(),
      ChequeDate: getTodaysDate(),
    }));
  }, []);

  //----------------------------------------------------------------->
  // Effect to load customer list from local storage
  useEffect(() => {
    const storedCustomerList = localStorage.getItem("customerlist");
    if (storedCustomerList) {
      setCustomerList(JSON.parse(storedCustomerList));
    }
  }, [dispatch]);

  // ----------------------->
  //set max voucher no---
  useEffect(() => {
    if (voucherList && voucherList.length > 0) {
      const maxChequeNo = voucherList.reduce(
        (max, item) =>
          Number(item.VoucherNo || 0) > max ? Number(item.VoucherNo || 0) : max,
        0
      );
      // console.log(maxChequeNo);
      setFormData((prevFormData) => ({
        ...prevFormData,
        VoucherNo: maxChequeNo + 1,
      }));
    }
  }, [voucherList]);

  //cust option list show only name---------------->
  const custOptions1 = customerList.map((item) => ({
    srno: item.srno,
    value: item.srno,
    label: `${item.cname}`,
  }));

  //option list show only name
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  // handle Select Change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
  };

  const handleNewChalan = (e) => {
    e.preventDefault();

    const maxBatchNo = voucherList.reduce((max, item) => {
      return item.BatchNo > max ? item.BatchNo : max;
    }, 0);

    setFormData((prev) => ({
      ...prev,
      BatchNo: maxBatchNo ? maxBatchNo + 1 : 1, // Default to 1 if no maxBatchNo
    }));

    setOnclickChalan(true);
    const comp = document.getElementById("Vtype");
    comp.focus();
  };

  // Handle Enter key press to move to the next field ---------------------------------->
  const handleKeyPress = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        nextField.focus();
      }
    }
  };
  const handlePavtity = (e) => {
    setTimeout(() => {
      if (formData.InstrType === "2") {
        const comp = document.getElementById("ReceiptNo");
        if (comp) comp.focus();
      } else if (formData.InstrType === "1") {
        const comp = document.getElementById("ChequeNo");
        if (comp) comp.focus();
      }
    }, 0);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handlePavtity();
    }
  };

  //----------------------------------------
  //handle submit------->
  const handleSubmit = async () => {
    if (!formData.AccCode) {
      toast.warn("कृपया खाते क्र. भरा ");
      return;
    }
    if (!formData.Amt) {
      toast.warn("कृपया रक्कम भरा ");
      return;
    }

    // Adjust Amt based on Vtype
    const adjustedAmt =
      Number(formData.Vtype) === 1
        ? -Math.abs(formData.Amt)
        : Math.abs(formData.Amt);

    // Ensure the state reflects the adjusted amount before submission
    const updatedFormData = { ...formData, Amt: adjustedAmt };

    if (!edit) {
      try {
        const res = await axiosInstance.post("/voucher/new", updatedFormData);
        if (res.data?.success) {
          toast.success("Submit Successfully");

          const resetData =
            fix === 1
              ? {
                  AccCode: "",
                  Narration: "",
                  Amt: "",
                  VoucherNo: Number(formData.VoucherNo) + 1,
                }
              : {
                  AccCode: "",
                  GLCode: "",
                  Vtype: "",
                  InstrType: "",
                  Amt: "",
                  ChequeNo: "",
                  VoucherNo: Number(formData.VoucherNo) + 1,
                  ReceiptNo: Number(formData.ReceiptNo) + 1,
                  Narration: "",
                };

          setFormData({ ...updatedFormData, ...resetData });
          dispatch(
            getAllVoucher({
              VoucherDate: updatedFormData.VoucherDate,
              autoCenter,
              filter: 2,
            })
          );
        }
      } catch (error) {
        toast.error("Failed to Submit");
        console.error(error);
      }
    } else {
      if (!ID) {
        toast.warn("Not Have the ID");
        return;
      }
      try {
        const res = await axiosInstance.patch(
          `/voucher/update?id=${ID}`,
          updatedFormData
        );
        if (res.data?.success) {
          toast.success("Update Successfully");

          setFormData({
            AccCode: "",
            GLCode: "",
            Vtype: "",
            InstrType: "",
            Amt: "",
            ChequeNo: "",
            ReceiptNo: Number(formData.ReceiptNo) + 1,
            Narration: "",
          });

          dispatch(
            getAllVoucher({
              VoucherDate: updatedFormData.VoucherDate,
              autoCenter,
              filter: 2,
            })
          );

          setEdit(false);
          setOnclickChalan(false);
        }
      } catch (error) {
        toast.error("Failed to Submit");
        console.error(error);
      }
    }
  };

  // ---------------------------------
  //handel to edit voucher
  const handleEdit = (id) => {
    const voucher = voucherList.find((voucher) => voucher.id === id);

    if (!voucher) {
      toast.warn("Failed to Edit");
      return;
    }
    setEdit(true);
    setId(id);
    setOnclickChalan(true);
    setFormData({
      AccCode: voucher.AccCode,
      GLCode: voucher.GLCode,
      VoucherDate: voucher.VoucherDate?.split("T")[0] || getTodaysDate(),
      BatchNo: voucher.BatchNo,
      Vtype: voucher.Vtype,
      InstrType: voucher.InstrType,
      Amt: voucher.Amt,
      ChequeNo: voucher.ChequeNo || "",
      ChequeDate: voucher.ChequeDate?.split("T")[0] || getTodaysDate(),
      VoucherNo: voucher.VoucherNo,
      ReceiptNo: voucher.ReceiptNo,
      Narration: voucher.Narration,
    });
  };
  // ---------------------------------
  //handel to edit voucher
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "तुम्हाला हे नक्की काढून टाकायचे आहे का ?",
      text: "एकदा काढून टाकलेली नोंद परत मिळवता येणार नाही",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "होय, काढून टाका !",
      cancelButtonText: "नाही",
    });

    if (result.isConfirmed) {
      if (!id) {
        toast.error("Id Not found");
        return;
      }
      try {
        const res = await axiosInstance.delete(`/voucher/delete?id=${id}`);
        if (res.data?.success) {
          toast.success(res.data.message);
          dispatch(
            getAllVoucher({
              VoucherDate: formData.VoucherDate,
              autoCenter,
              filter: 2,
            })
          );
        } else {
          toast.error("Failed to delete the voucher.");
        }
      } catch (error) {
        toast.error("Failed to delete. Please try again.");
        console.error(error);
      }
    }
  };

  // handel clear------------->
  const handleClear = () => {
    setEdit(false);
    setOnclickChalan(false);
    setFormData({
      AccCode: "",
      GLCode: "",
      VoucherDate: getTodaysDate(),
      BatchNo: "0",
      Vtype: "",
      InstrType: "",
      Amt: "",
      ChequeNo: "",
      ChequeDate: getTodaysDate(),
      VoucherNo: "1",
      ReceiptNo: "1",
      Narration: "",
    });
  };

  // Changing to batch no on change of voucher list
  useEffect(() => {
    if (voucherList.length > 0) {
      if (formData.BatchNo) {
        const filteredBatchNo = voucherList.filter(
          (item) => Number(item.BatchNo) === Number(formData.BatchNo)
        );

        if (filteredBatchNo.length > 0) {
          setfilterVoucherList(filteredBatchNo); // Use the filtered list
        } else {
          setfilterVoucherList([]);
        }
      } else {
        setfilterVoucherList(voucherList);
      }
    }
  }, [formData.BatchNo, voucherList]);

  return (
    <div className="Credit-container w100 h1 d-flex-col">
      <div className="Credit-container-scroll d-flex-col w100">
        <span className=" heading p10">ट्रान्सफर चलन</span>
        <div className="credit-all-form d-flex w100 ">
          <div className="credit-form d-flex-col mx10 p10 bg">
            <div className="row d-flex w100  sb a-center ">
              <div className="w80  Deal-date-div d-flex a-center">
                <span className="info-text  ">व्यवहार दिनांक</span>
                <input
                  type="date"
                  className="data w50 "
                  value={formData.VoucherDate}
                  onChange={(e) => {
                    setFormData({ ...formData, VoucherDate: e.target.value });
                    dispatch(
                      getAllVoucher({
                        VoucherDate: e.target.value,
                        autoCenter,
                        filter: 2,
                      })
                    );
                  }}
                  onKeyDown={(e) =>
                    handleKeyPress(
                      e,
                      document.getElementById("handleNewChalan")
                    )
                  }
                  disabled={fix === 1}
                />
              </div>
              <div className="Batch No-div d-flex a-center mx10 sb">
                <span className="info-text   ">Batch No:</span>
                <input
                  type="text"
                  className="data w50"
                  value={formData.BatchNo}
                  onChange={(e) =>
                    setFormData({ ...formData, BatchNo: e.target.value })
                  }
                />
                {/* <button className="w-btn">Show</button> */}
              </div>
            </div>
            <div className="deal-container row w100 d-flex my5  sb a-center">
              <div className=" Deal-typr-div  w40  d-flex a-center">
                <span className="info-text w50">व्यवहार प्रकार</span>
                <select
                  className="data w50"
                  id="Vtype"
                  value={formData.Vtype}
                  onChange={(e) =>
                    setFormData({ ...formData, Vtype: e.target.value })
                  }
                  disabled={!onclickChalan || fix === 1}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("VoucherNo"))
                  }
                >
                  <option value=""> Select</option>
                  <option value="1">नावे</option>
                  <option value="4">जमा</option>
                </select>
              </div>
              <div className=" bill-no-div w50 d-flex mx15 a-center sb">
                <span className="info-text">चलन नंबर</span>
                <input
                  id="VoucherNo"
                  type="text"
                  className="data w40"
                  value={formData.VoucherNo}
                  disabled
                />
              </div>
            </div>
            <div className="  bill-type-check-container row w100 d-flex my5 sb a-center">
              <div className=" bill-type-div w50 d-flex a-center  ">
                <span className="info-text w50">पावती प्रकार</span>
                <select
                  className="data w50"
                  value={formData.InstrType}
                  id="InstrType"
                  onChange={(e) => {
                    setFormData({ ...formData, InstrType: e.target.value });
                    handlePavtity();
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={formData.Vtype === "" || fix === 1}
                >
                  <option value="">select</option>
                  <option value="1">चेक </option>
                  <option value="2">व्हॉउचर </option>
                </select>
              </div>
              <div className=" bill-number-div w50 d-flex mx15 a-center sb">
                <span className="info-text">पावती नं.</span>
                <input
                  type="text"
                  id="ReceiptNo"
                  className="data w40"
                  value={formData.ReceiptNo}
                  onChange={(e) =>
                    setFormData({ ...formData, ReceiptNo: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("GLCode"))
                  }
                  disabled={
                    !formData.InstrType || formData.InstrType == 1 || fix === 1
                  }
                />
              </div>
            </div>
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
                  handleKeyPress(e, document.getElementById("AccCode"))
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
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "GLCode")
                }
                isDisabled={fix === 1}
              />
            </div>

            <div className=" w100  row sb d-flex my5  ">
              <span className="info-text">खाते क्र.</span>
              <input
                id="AccCode"
                type="text"
                autoComplete="off"
                className="data w20"
                onFocus={(e) => e.target.select()}
                value={formData.AccCode}
                onKeyDown={(e) =>
                  handleKeyPress(e, document.getElementById("amt"))
                }
                onChange={(e) =>
                  setFormData({ ...formData, AccCode: e.target.value })
                }
                disabled={!formData.GLCode}
              />

              <Select
                options={custOptions1}
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
                  formData.AccCode
                    ? custOptions1.find(
                        (option) => option.value === Number(formData.AccCode)
                      )
                    : null
                }
                onChange={(selectedOption) =>
                  handleSelectChange(selectedOption, "AccCode")
                }
              />
            </div>
            <div className="Amount-button-container  d-flex sb">
              <div className=" Amountt-div d-flex a-center w40 ">
                <span className="info-text ">रक्कम</span>
                <input
                  id="amt"
                  autoComplete="off"
                  type="text"
                  className="data"
                  value={formData.Amt}
                  onKeyDown={(e) =>
                    handleKeyPress(
                      e,
                      document.getElementById("handleSaveBatch")
                    )
                  }
                  onChange={(e) =>
                    setFormData({ ...formData, Amt: e.target.value })
                  }
                  disabled={!formData.AccCode}
                />
              </div>
              <div className=" Amountt-div d-flex a-center w50 ">
                <span className="info-text w60">आज बॅलेन्स </span>
                <input type="text" className="data" disabled />
              </div>
            </div>
            <div className="Amount-button-container  w100 d-flex sb my5">
              <div className=" Amountt-div d-flex a-center  w100  mx5">
                <span className="info-text ">तपशील </span>
                <input
                  type="text"
                  className="data mx5 "
                  value={formData.Narration}
                  onChange={(e) =>
                    setFormData({ ...formData, Narration: e.target.value })
                  }
                  disabled={!formData.Amt}
                />
              </div>
            </div>
            <div className="d-flex j-end ">
              <input
                type="checkbox"
                name=""
                checked={fix === 1}
                onChange={(e) => setFix(e.target.checked ? 1 : 0)}
                disabled={!formData.GLCode}
                className="mx5"
              />
              <span className="info-text mx10 ">एक खतावणी व्यवहार</span>
            </div>
          </div>
          <div className="credit-batchTally d-flex-col mx5  bg ">
            <div className="m10 p10 bg-light-skyblue">
              बॅच टॅलि
              <div className="d-flex a-center ">
                <span className="w50 info-text">नावे </span>
                <input
                  type="text"
                  className="data"
                  value={
                    formData.BatchNo && filterVoucherList
                      ? filterVoucherList.reduce((sum, item) => {
                          if (Number(item.Vtype) === 1) {
                            return sum + Math.abs(item.Amt);
                          }
                          return sum;
                        }, 0)
                      : 0
                  }
                />
              </div>
              <div className="d-flex a-center my10">
                <span className="w50 info-text">जमा </span>
                <input
                  type="text"
                  className="data"
                  value={
                    formData.BatchNo && filterVoucherList
                      ? filterVoucherList.reduce((sum, item) => {
                          if (Number(item.Vtype) === 4) {
                            return sum + Math.abs(item.Amt);
                          }
                          return sum;
                        }, 0)
                      : 0
                  }
                />
              </div>
              <div className="d-flex a-center ">
                <span className="w50 info-text">बॅच फरक </span>
                <span className="w50 req info-text">
                  {formData.BatchNo && filterVoucherList
                    ? filterVoucherList.reduce((sum, item) => {
                        return sum + item.Amt;
                      }, 0)
                    : 0}
                </span>
              </div>
            </div>
            <div className="m10 p10 bg-light-green">
              चेक/डी.डी. माहिती
              <div className="d-flex a-center sa">
                <span className="w50 info-text"> चेक/डी.डी.</span>
                <input
                  type="text"
                  id="ChequeNo"
                  className="data"
                  value={formData.ChequeNo}
                  onChange={(e) =>
                    setFormData({ ...formData, ChequeNo: e.target.value })
                  }
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("ChequeDate"))
                  }
                  disabled={
                    !formData.InstrType || formData.InstrType == 2 || fix === 1
                  }
                />
              </div>
              <div className="d-flex a-center my10  sa">
                <span className="  info-text ">दिनांक </span>
                <input
                  type="date"
                  id="ChequeDate"
                  className="w60 data "
                  value={formData.ChequeDate}
                  onChange={(e) =>
                    setFormData({ ...formData, ChequeDate: e.target.value })
                  }
                  onKeyDown={(e) =>
                    handleKeyPress(e, document.getElementById("GLCode"))
                  }
                  disabled={
                    !formData.InstrType || formData.InstrType == 2 || fix === 1
                  }
                />
              </div>
            </div>
            <div className="credit-batchTally-buttons d-flex mx10 p10 bg">
              <button
                type="button"
                onClick={(e) => handleClear()}
                className="w-btn"
              >
                रद्द करा
              </button>

              <button
                id="handleNewChalan"
                className="w-btn "
                type="button"
                onClick={handleNewChalan}
                disabled={fix === 1}
              >
                नवीन चलन
              </button>
              <button
                id="handleSaveBatch"
                className="w-btn"
                type="submit"
                onClick={(e) => handleSubmit()}
              >
                {edit ? "अपडेट करा" : "सेव्ह करा"}
              </button>
            </div>
          </div>
        </div>
        <div className="credit-table   d-flex-col m10 p10 h1 bg">
          <div className="creditTable-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Edit</th>
                  <th>चलन</th>
                  <th>ख. नं.</th>
                  <th>खतावणी नाव</th>
                  <th>खाते</th>
                  <th>खातेदार नाव</th>
                  <th>रक्कम</th>
                  <th>व्यवहार</th>
                  <th>बॅच</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  "Loading..."
                ) : filterVoucherList.length > 0 ? (
                  filterVoucherList.map((voucher, index) => (
                    <tr key={index}>
                      <td>
                        <FaRegEdit
                          className="icon"
                          onClick={(e) => handleEdit(voucher.id)}
                        />
                      </td>
                      <td className="info-text">{voucher.VoucherNo}</td>
                      <td className="info-text">{voucher.GLCode}</td>
                      <td className="info-text">
                        {options.find(
                          (item) => item.value === Number(voucher.GLCode)
                        )?.label || ""}
                      </td>
                      <td className="info-text">{voucher.AccCode}</td>
                      <td className="info-text">
                        {custOptions1.find(
                          (item) => item.value === Number(voucher.AccCode)
                        )?.label || ""}
                      </td>
                      <td className="info-text">{voucher.Amt}</td>
                      <td className="info-text">
                        {voucher.Vtype === 1
                          ? "नावे"
                          : voucher.Vtype === 4
                          ? "जमा"
                          : ""}
                      </td>
                      <td className="info-text">{voucher.BatchNo}</td>
                      <td>
                        <MdDeleteOutline
                          className="icon req"
                          onClick={(e) => handleDelete(voucher.id)}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <span className=" d-flex a-center info-text">
                    Not found data
                  </span>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TransferCredit;
