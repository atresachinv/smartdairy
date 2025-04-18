import { useEffect, useMemo, useState } from "react";
import "../../../../Styles/AccoundStatment/AccoundStatment.css";
import { useDispatch, useSelector } from "react-redux";
import { listSubLedger } from "../../../../App/Features/Mainapp/Masters/ledgerSlice";
import { listCustomer } from "../../../../App/Features/Customers/customerSlice";
import Select from "react-select";
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

const AccountStatment = () => {
  const dispatch = useDispatch();

  // State management
  const [formData, setFormData] = useState({
    accCode: "",
    GLCode: "",
    autoCenter: "",
    fromVoucherDate: getFinancialDate(),
    toVoucherDate: getTodaysDate(),
  });
  const [voucherList, setVoucherList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [filter, setFilter] = useState(0);
  const [settings, setSettings] = useState({});

  // Redux selectors
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails || []
  );
  const sledgerlist = useSelector((state) => state.ledger.sledgerlist);
  const centerId = useSelector((state) => state.dairy.dairyData.center_id);
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

  // Dispatch actions to fetch data
  useEffect(() => {
    dispatch(listSubLedger());
    dispatch(listCustomer());
  }, [dispatch]);

  // Customer options for Select component
  const custOptions1 = customerList.map((item) => ({
    srno: item.srno,
    value: item.srno,
    label: `${item.cname}`,
  }));

  // Ledger options for Select component
  const options = sledgerlist.map((i) => ({
    value: i.lno,
    label: i.marathi_name,
  }));

  const storedCustomerList = localStorage.getItem("customerlist");
  const parsedCustomerList = JSON.parse(storedCustomerList);
  // Load customer list from local storage and filter based on centerId or filter
  useEffect(() => {
    if (storedCustomerList) {
      // Filter customer list based on centerId or filter
      const filteredCustomerList =
        centerId === 0
          ? parsedCustomerList.filter(
              (customer) => Number(customer.centerid) === Number(filter)
            )
          : parsedCustomerList.filter(
              (customer) => Number(customer.centerid) === Number(centerId)
            );
      setCustomerList(filteredCustomerList);
    }
  }, [centerId, filter]);

  // Handle Select change
  const handleSelectChange = (selectedOption, keyToUpdate) => {
    setFormData({
      ...formData,
      [keyToUpdate]: selectedOption.value,
    });
    setVoucherList([]);
  };

  // Handle Report generation
  const handleReport = async () => {
    const selectedCenterId = centerId > 0 ? centerId : filter;
    const reportData = {
      accCode: formData.accCode,
      GLCode: formData.GLCode,
      autoCenter: autoCenter,
      fromVoucherDate: formData.fromVoucherDate,
      toVoucherDate: formData.toVoucherDate,
      center_id: selectedCenterId,
    };

    try {
      const res = await axiosInstance.get("/statements", {
        params: { ...reportData },
      });

      if (res.data.success) {
        setVoucherList(res.data.statementData || []);
      } else {
        toast.error("Failed to fetch report data");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Error fetching report data");
    }
  };

  return (
    <div className="account-statment-container w100 h1 d-flex">
      <div className="GL-customer-date-first-half-container w70 h1 d-flex-col">
        <span className="px10 heading">Account Statement</span>
        {centerId > 0 ? null : (
          <div className="d-flex a-center mx10">
            <span className="info-text">सेंटर निवडा :</span>
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
        <div className="w100 row sb d-flex my5">
          <span className="info-text">खतावणी नं.</span>
          <input
            type="text"
            id="GLCode"
            className="data w20"
            autoComplete="off"
            onFocus={(e) => e.target.select()}
            value={formData.GLCode}
            onChange={(e) => {
              setFormData({ ...formData, GLCode: e.target.value });
              setVoucherList([]);
            }}
          />
          <Select
            options={options}
            className="mx10 w50"
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
        </div>
        <div className="customer-number-span-inputdiv w100 h10 d-flex a-center">
          <span className="label-text w15">ग्राहक</span>
          <input
            type="text"
            id="accCode"
            className="data w20"
            autoComplete="off"
            onFocus={(e) => e.target.select()}
            value={formData.accCode}
            onChange={(e) => {
              setFormData({ ...formData, accCode: e.target.value });
              setVoucherList([]);
            }}
          />
          <Select
            options={custOptions1}
            className="mx10 w50"
            placeholder=""
            isSearchable
            styles={{
              menu: (provided) => ({
                ...provided,
                zIndex: 200,
              }),
            }}
            value={
              formData.accCode
                ? custOptions1.find(
                    (option) => option.value === Number(formData.accCode)
                  )
                : null
            }
            onChange={(selectedOption) => {
              handleSelectChange(selectedOption, "accCode");
            }}
          />
        </div>
        <div className="from-to-date-account-statment w70 h10 d-flex a-center sb">
          <div className="date-from-account-statment w50 d-flex a-center sa">
            <span className="label-text w50">दिनाक पासून</span>
            <input
              className="data w60"
              type="date"
              value={formData.fromVoucherDate}
              onChange={(e) =>
                setFormData({ ...formData, fromVoucherDate: e.target.value })
              }
            />
          </div>
          <div className="date-from-account-statment w50 d-flex a-center sa">
            <span className="label-text w50">दिनाक पर्येंत</span>
            <input
              className="data w60"
              type="date"
              value={formData.toVoucherDate}
              onChange={(e) =>
                setFormData({ ...formData, toVoucherDate: e.target.value })
              }
            />
          </div>
        </div>
        <div className="account-statment-buttons w70 h20 px10 d-flex a-center">
          <button className="w-btn" type="button" onClick={handleReport}>
            रिपोर्ट
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountStatment;
