import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import Select from "react-select";
import { toast } from "react-toastify";
import axiosInstance from "../../../../App/axiosInstance";

//gett todays date------------>
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};
//set default date to today------------->

const LedgerList = () => {
  const dispatch = useDispatch();
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const [formData, setFormData] = useState({
    GLCode: "",
    date: getTodaysDate(),
  });
  const [voucherList, setVoucherlist] = useState([]);

  //option list show only name
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  useEffect(() => {
    dispatch(listSubLedger());
  }, []);

  // handle Select Change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
  };

  const handleFetchData = async (e) => {
    e.preventDefault();
    if (formData.GLCode && formData.date) {
      try {
        const res = await axiosInstance.get(
          `/voucher-sublegder-list?glcode=${formData.GLCode}&date${formData.date}`
        );
        if (res.status === 200) {
          setVoucherlist(res.data?.voucherList || []);
        }
      } catch (error) {
        // console.error("Error fetching data:", error);
        toast.error("Server falied fetching data");
      }
    } else {
      toast.error("Please fill all the fields");
    }
  };

  return (
    <div className="w100 h1 d-flex-col m10 ">
      <div className="w100 p10 bg">
        <div className="w100 d-flex center sa f-wrap">
          <input
            type="date"
            className="data w20"
            value={formData.date}
            onChange={(e) =>
              setFormData({
                ...formData,
                date: e.target.value,
              })
            }
          />
          <span className="info-text">खतावणी नं.</span>
          <input
            type="text"
            id="GLCode"
            className="data w10"
            autoComplete="off"
            onFocus={(e) => e.target.select()}
            value={formData.GLCode}
            onChange={(e) =>
              setFormData({ ...formData, GLCode: e.target.value })
            }
          />

          <Select
            options={options}
            className=" mx10 w40"
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
          />
          <button type="button" className="w-btn" onClick={handleFetchData}>
            यादी
          </button>
        </div>
      </div>
      <div
        className="account-legder-table w100 my10 bg p10 h1"
        style={{ overflow: "hidden" }}
      >
        <table className="account-legder-table w100">
          <thead>
            <tr>
              <th>खाते नं.</th>
              <th>खातेदार</th>
              <th>रक्कम</th>
              <th>जमा / नावे</th>
            </tr>
          </thead>
        </table>
        <div style={{ maxHeight: "456px", overflowY: "auto" }}>
          <table className="account-legder-table w100">
            <tbody>
              {voucherList.length > 0 ? (
                voucherList.map((item, i) => (
                  <tr key={i}>
                    <td>{item.Accode}</td>
                    <td>{item.AccName}</td>
                    <td>{item.Amount}</td>
                    <td>{item.v_type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerList;
