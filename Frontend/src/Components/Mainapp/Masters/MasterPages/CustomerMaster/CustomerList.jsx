/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { FaDownload } from "react-icons/fa6";
import Spinner from "../../../../Home/Spinner/Spinner";
import { useTranslation } from "react-i18next";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
import { listCustomer } from "../../../../../App/Features/Mainapp/Masters/custMasterSlice";

const CustomerList = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation(["common", "milkcollection"]);
  const customerlist = useSelector((state) => state.customers.customerlist);
  const status = useSelector((state) => state.customers.cliststatus);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    dispatch(listCustomer());
  }, [dispatch]);

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
      customer.rno || "", // Code
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

  useEffect(() => {
    // When the customer list is updated, store it in localStorage
    if (customerlist.length > 0) {
      localStorage.setItem("customerlist", JSON.stringify(customerlist));
    }
  }, [customerlist]);

  if (!customerlist || customerlist.length === 0) {
    return <div>No customer found</div>;
  }

  // Filter customer function fillter on name , code , mobile , city
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
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
            <span className="heading p10">Customer List</span>
            <input
              type="text"
              className="data w30"
              name=""
              id=""
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="btn" onClick={downloadExcel}>
              <span className="f-label-text px10">
                {t("milkcollection:m-d-excel")}
              </span>
              <FaDownload />
            </button>
          </div>
          <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
            <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
              <div className="customer-data-headings-div  h10 d-flex center t-center sb">
                <span className="f-info-text w5">Code</span>
                <span className="f-info-text w25">Customer Name</span>
                <span className="f-info-text w10">Mobile</span>
                <span className="f-info-text w15">Addhar No</span>
                <span className="f-info-text w15">City</span>
                <span className="f-info-text w15">Tehsil</span>
                <span className="f-info-text w15">District</span>
                <span className="f-info-text w15">A/C No</span>
                <span className="f-info-text w15">IFSC</span>
                <span className="f-info-text w15">Caste</span>
                <span className="f-info-text w10">Gender</span>
                <span className="f-info-text w5">Age</span>
                <span className="f-info-text w10">MemberNo</span>
                <span className="f-info-text w15">Mem. Date</span>
                <span className="f-info-text w15">Ratechart</span>
                <span className="f-info-text w5">MilkType</span>
                <span className="f-info-text w5">Active</span>
              </div>
              {/* Show Spinner if loading, otherwise show the customer list */}
              {status === "loading" ? (
                <Spinner />
              ) : filteredData.length > 0 ? (
                filteredData.map((customer, index) => (
                  <div
                    key={index}
                    className={`customer-data-values-div w100 h10 d-flex center t-center sa ${
                      index % 2 === 0 ? "bg-light" : "bg-dark"
                    }`}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                    }}
                  >
                    <span className="text w5">{customer.srno}</span>
                    <span className="text w25 t-start">{customer.cname}</span>
                    <span className="text w10">
                      {customer.Phone || customer.mobile}
                    </span>
                    <span className="text w15">{customer.cust_addhar}</span>
                    <span className="text w15 t-start">{customer.City}</span>
                    <span className="text w15 t-start">{customer.tal}</span>
                    <span className="text w15 t-start">{customer.dist}</span>
                    <span className="text w15  t-end">
                      {customer.cust_accno}
                    </span>
                    <span className="text w15  ">{customer.cust_ifsc}</span>
                    <span className="text w15 t-start">{customer.caste}</span>
                    <span className="text w10 t-start">
                      {customer.gender === 1 ? "Female" : "Male"}
                    </span>
                    <span className="text w5">-</span>{" "}
                    {/* Placeholder for age */}
                    <span className="text w10 t-start">{customer.rno}</span>
                    <span className="text w15 t-end">
                      {new Date(customer.createdon).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }
                      )}
                    </span>
                    <span className="text w15">{customer.rcName}</span>
                    <span className="text w5 t-start">
                      {customer.milktype === 1 ? "Cow" : "Buffalo"}
                    </span>
                    <span className="text w5">
                      {customer.isActive === 1 ? "Yes" : "No"}
                    </span>{" "}
                    {/* Assuming all customers are active */}
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
