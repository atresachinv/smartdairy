import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import Spinner from "../../../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import { listCustomer } from "../../../../../App/Features/Mainapp/Masters/custMasterSlice";
import { centersLists } from "../../../../../App/Features/Dairy/Center/centerSlice";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";

const CustomerList = ({ setIsSelected }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(["master", "milkcollection", "common"]);
  const customerlist = useSelector(
    (state) => state.customers.customerlist || []
  );
  const status = useSelector((state) => state.customers.cliststatus);
  const centerList = useSelector((state) => state.center.centersList || []);
  const center_id = useSelector(
    (state) =>
      state.dairy.dairyData.center_id || state.dairy.dairyData.center_id
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // set active tab --------------------------------->
  useEffect(() => {
    setIsSelected(0);
  }, []);

  useEffect(() => {
    if (customerlist.length === 0 && centerList.length === 0) {
      dispatch(listCustomer());
      dispatch(centersLists());
    }
  }, [customerlist, centerList]);

  useEffect(() => {
    setFilteredData(customerlist);
  }, [customerlist]);

  const downloadExcel = () => {
    if (!Array.isArray(customerlist) || customerlist.length === 0) {
      alert("No data available to export.");
      return;
    }

    // Prepare data for Excel (including all required fields)
    const excelData = customerlist.map((customer) => [
      customer.srno || "", // Code
      customer.cname || "", // Customer Name
      customer.mobile || "", // Mobile
      customer.cust_addhar || "", // Aadhar No
      customer.City || "", // City
      customer.tal || "", // Tehsil
      customer.dist || "", // District
      customer.cust_accno || "", // A/C No
      customer.cust_ifsc || "", // IFSC
      customer.caste || "", // Caste
      customer.gender === 0 ? "Male" : customer.gender === 1 ? "Female" : "-", // Gender
      customer.age || "-", // Age
      customer.createdon ? customer.createdon.slice(0, 10) : "-", // MemberNo
      customer.createddate || "-", // Mem. Date
      customer.rateChartNo || "-", // Ratechart No.
      customer.milk_type || "-", // MilkType
      customer.active === 1 ? "Yes" : "No", // Active
    ]);

    // Add headings manually
    const worksheet = XLSX.utils.aoa_to_sheet([
      [
        "Code",
        "Customer Name",
        "Mobile",
        "Aadhar No",
        "City",
        "Tehsil",
        "District",
        "A/C No",
        "IFSC",
        "Caste",
        "Gender",
        "Age",
        "MemberNo",
        "Mem. Date",
        "Ratechart No.",
        "MilkType",
        "Active",
      ],
      ...excelData,
    ]);

    const fileName = `Customer_List.xlsx`;

    // Create a workbook and export it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customer Data");
    XLSX.writeFile(workbook, fileName);
  };

  // handle edit customer icon click  ----------------------------------------------------->
  const handleEdit = (cust_code) => {
    navigate(`/mainapp/master/customer/add-new/${cust_code}?isedit=true`);
  };

  //  save only lgoin center customer list in local storage --------------------------------------->
  useEffect(() => {
    // Filter customers with centerid === 0
    const filteredCustomers = customerlist.filter(
      (customer) => customer.centerid === center_id
    );
    // Save only if there are customers with centerid === 0
    if (filteredCustomers.length > 0) {
      localStorage.setItem("customerlist", JSON.stringify(filteredCustomers));
    }
  }, [customerlist]);

  // Filter customer function fillter on name , code , mobile , city
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
  };

  // filter customer on center --------------------------------------->
  const handleSelectInput = (e) => {
    const value = e.target.value;
    if (value === "") {
      setFilteredData(customerlist);
      return;
    }
    const filtered = customerlist.filter((customer) => {
      return customer.centerid.toString() === value;
    });
    setFilteredData(filtered);
  };

  const debouncedFilter = useMemo(() => {
    const timeout = setTimeout(() => {
      const filtered = customerlist.filter((customer) => {
        return (
          (customer.cname &&
            customer.cname.toLowerCase().includes(searchTerm)) ||
          (customer.phone && customer.phone.includes(searchTerm)) ||
          (customer.mobile && customer.mobile.includes(searchTerm)) ||
          (customer.engName &&
            customer.engName.toLowerCase().includes(searchTerm)) ||
          (customer.city && customer.city.toLowerCase().includes(searchTerm)) ||
          (customer.cust_pincode && customer.cust_pincode.includes(searchTerm))
        );
      });
      setFilteredData(filtered);
    }, 300); // 300ms delay

    return () => clearTimeout(timeout);
  }, [searchTerm, customerlist]);

  return (
    <>
      {status === "loading" ? (
        <div className="box d-flex center">
          <Spinner />
        </div>
      ) : (
        <div className="customer-list-container-div w100 h1 d-flex-col p10">
          <div className="download-print-pdf-excel-container w100 h10 d-flex a-center  sb">
            <span className="heading p10">{t("m-custlist")} :</span>
            <input
              type="text"
              className="data w30"
              name=""
              id=""
              placeholder={`${t("common:c-search")}`}
              value={searchTerm}
              onChange={handleSearch}
            />
            {center_id === 0 ? (
              <select
                className="data w40"
                name="center"
                id=""
                onChange={handleSelectInput}
              >
                <option value="">-- Select Center --</option>
                {centerList.map((center, index) => (
                  <option key={index} value={center.center_id}>
                    {center.center_name}
                  </option>
                ))}
              </select>
            ) : (
              ""
            )}
            <button className="btn" onClick={downloadExcel}>
              <span className="f-label-text px10">
                {t("milkcollection:m-d-excel")}
              </span>
              <FaDownload />
            </button>
          </div>
          <div className="customer-list-table w100 h1 d-flex-col bg">
            <div className="customer-heading-title-scroller w100 h1 mh100  d-flex-col">
              <div className="customer-data-headings-div p10 d-flex center t-center hidescrollbar sb">
                <span className="f-label-text w5">{t("Edit")}</span>
                <span className="f-label-text w5">{t("master:m-ccode")}</span>
                <span className="f-label-text w35">{t("master:m-cname")}</span>
                <span className="f-label-text w20">{t("master:m-mobile")}</span>
                <span className="f-label-text w20">{t("master:m-addhar")}</span>
                <span className="f-label-text w15">{t("master:m-accno")}</span>
                <span className="f-label-text w15">{t("master:m-ifsc")}</span>
                <span className="f-label-text w15">{t("master:m-rtype")}</span>
                <span className="f-label-text w10">{t("master:m-mtype")}</span>
                <span className="f-label-text w5">{t("Id")}</span>
              </div>
              {status === "loading" ? (
                <Spinner />
              ) : filteredData.length > 0 ? (
                filteredData.map((customer, index) => (
                  <div
                    key={index}
                    className={`customer-data-values-div w100 p10 d-flex a-center hidescrollbar sa`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    <span
                      className="info-text w5"
                      onClick={() => handleEdit(customer.srno)}
                    >
                      <MdEdit className="color-icon" />
                    </span>
                    <span className="info-text w5">{customer.srno}</span>
                    <span className="info-text w35 t-start">{customer.cname}</span>
                    <span className="info-text w20 t-start">
                      {customer.Phone || customer.mobile}
                    </span>
                    <span className="info-text w20">{customer.cust_addhar}</span>
                    <span className="info-text w15 t-end">
                      {customer.cust_accno}
                    </span>
                    <span className="info-text w15 t-end">{customer.cust_ifsc}</span>
                    <span className="info-text w15 t-center">{customer.rcName}</span>
                    <span className="info-text w10 t-center">
                      {customer.milktype === 0 ? "Cow" : "Buffalo"}
                    </span>
                    <span className="info-text w5">{customer.fax}</span>
                  </div>
                ))
              ) : (
                <div>No customer found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerList;
