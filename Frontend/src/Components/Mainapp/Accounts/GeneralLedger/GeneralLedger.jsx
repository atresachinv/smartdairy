import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import axiosInstance from "../../../../App/axiosInstance";
import { toast } from "react-toastify";

// Utility functions for date handling
const getTodaysDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const getFinancialDate = () => {
  const today = new Date();
  const financialYearStart = new Date(today);
  financialYearStart.setMonth(3); // April is the 4th month (0-indexed)
  financialYearStart.setDate(1);
  return financialYearStart.toISOString().split("T")[0];
};

const GeneralLedger = () => {
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const dispatch = useDispatch();
  const [balance, setBalance] = useState(0);
  const [voucherList, setVoucherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
  const [filter, setFilter] = useState(0);
  const [formData, setFormData] = useState({
    GLCode: "",
    fromVoucherDate: getFinancialDate(),
    toVoucherDate: getTodaysDate(),
  });

  const [settings, setSettings] = useState({});
  const centerSetting = useSelector(
    (state) => state.dairySetting.centerSetting
  );

  const autoCenter = useMemo(() => settings?.autoCenter, [settings]);

  // Set settings based on centerSetting
  useEffect(() => {
    if (centerSetting?.length > 0) {
      setSettings(centerSetting[0]);
    }
  }, [centerSetting]);

  //option list show only name
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  useEffect(() => {
    dispatch(listSubLedger());
  }, [dispatch]);

  const handleShow = async () => {
    setLoading(true);
    const selectedCenterId = centerId > 0 ? centerId : filter;
    const reportData = {
      GLCode: formData.GLCode,
      autoCenter: autoCenter,
      fromVoucherDate: formData.fromVoucherDate,
      toVoucherDate: formData.toVoucherDate,
      center_id: selectedCenterId,
    };

    try {
      const res = await axiosInstance.get("/general-ledger-statements", {
        params: { ...reportData },
      });

      if (res.data.success) {
        setVoucherList(res.data.GLStatementData || []);
        setBalance(res.data.openingBalance || 0);
        setLoading(false); // 👈 Show report on success
      } else {
        toast.error("Failed to fetch report data");
        setLoading(false);
      }
    } catch (error) {
      toast.error("Error fetching report data");
      setLoading(false);
    }
  };
  let runningBalance = balance;

  return (
    <div className=" w100 h1 m10  p10 bg">
      <div className="heading w100 d-flex center my5">जनरल लेजर </div>
      <div className="w100 ">
        {centerId > 0 ? null : (
          <div className=" select-center-div d-flex a-center mx10">
            <span className="info-text w15">सेंटर निवडा :</span>
            <select
              className="data w50 a-center my5 mx5"
              name="center"
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setFormData({
                  ...formData,
                  GLCode: "",
                  accCode: "",
                });
                setVoucherList([]);
              }}
            >
              {centerList &&
                [...centerList]
                  .sort((a, b) => a.center_id - b.center_id)
                  .map((center, index) => (
                    <option key={index} value={center.center_id}>
                      {center.center_name}
                    </option>
                  ))}
            </select>
          </div>
        )}
        <div className="d-flex">
          <span className="info-text">खतावणी नं.</span>
          <input
            type="text"
            className="data w10 mx10"
            value={formData.GLCode}
            onChange={(e) =>
              setFormData({
                ...formData,
                GLCode: e.target.value,
              })
            }
          />
          <Select
            options={options}
            className="   w70"
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
              setFormData((prevFormData) => ({
                ...prevFormData,
                GLCode: selectedOption.value,
              }));
            }}
          />
        </div>
        <div className="d-flex my10">
          <div>
            <span className="info-text w30 px10 ">दिनाक पासून</span>
            <input
              className="data "
              type="date"
              value={formData.fromVoucherDate}
              onChange={(e) =>
                setFormData({ ...formData, fromVoucherDate: e.target.value })
              }
            />
          </div>
          <div className="mx10">
            <span className="info-text w30">दिनाक पर्येंत</span>
            <input
              className="data  "
              type="date"
              value={formData.toVoucherDate}
              onChange={(e) =>
                setFormData({ ...formData, toVoucherDate: e.target.value })
              }
            />
          </div>
          <div className="mx10 d-flex a-center">
            <button className="btn" type="button" onClick={handleShow}>
              पाहणे
            </button>
          </div>
        </div>
      </div>
      <div className="w100  ">
        <div className="d-flex w100 px10  j-end">
          <input
            className="data w30  m5 "
            value={`Opening Balance : ${balance}`}
          />
        </div>
        <table>
          <thead>
            <tr>
              <th> दिनांक </th>
              <th>जमा रक्कम</th>
              <th>नावे रक्कम</th>
              <th>बॅलेन्स </th>
              <th>बॅलेन्स प्रकार </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            ) : voucherList.length > 0 ? (
              voucherList.map((item, index) => {
                runningBalance +=
                  Number(Math.abs(item.jamaAmt)) -
                  Number(Math.abs(item.naveAmt));
                return (
                  <tr key={index}>
                    <td>
                      {new Date(item.VoucherDate)
                        .getDate()
                        .toString()
                        .padStart(2, "0") +
                        "-" +
                        (new Date(item.VoucherDate).getMonth() + 1)
                          .toString()
                          .padStart(2, "0") +
                        "-" +
                        new Date(item.VoucherDate).getFullYear()}
                    </td>
                    <td>{Number(Math.abs(item.jamaAmt)).toFixed(2)}</td>
                    <td>{Number(Math.abs(item.naveAmt)).toFixed(2)}</td>
                    <td>{Number(Math.abs(runningBalance)).toFixed(2)} </td>
                    <td>{runningBalance < 0 ? "नावे" : "जमा"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GeneralLedger;
