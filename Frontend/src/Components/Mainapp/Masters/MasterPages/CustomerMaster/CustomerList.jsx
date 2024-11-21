import React, { useEffect } from "react";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
import { useDispatch, useSelector } from "react-redux";
import { listCustomer } from "../../../../../App/Features/Customers/customerSlice";
import Spinner from "../../../../Home/Spinner/Spinner";

const CustomerList = () => {
  const dispatch = useDispatch();
  const { customerlist, loading } = useSelector((state) => state.customer);
  
  useEffect(() => {
    dispatch(listCustomer());
  }, []);

  useEffect(() => {
    // When the customer list is updated, store it in localStorage
    if (customerlist.length > 0) {
      localStorage.setItem("customerlist", JSON.stringify(customerlist));
    }
  }, [customerlist]);

  if (loading) {
    return <Spinner />;
  }

  if (!customerlist || customerlist.length === 0) {
    return <div>No customer found</div>;
  }

  return (
    <div className="customer-list-container-div w100 h1 d-flex-col p10">
      <div className="customer-list-table w100 h1 d-flex-col hidescrollbar bg">
        <div className="customer-heading-title-scroller w100 h1 mh100 d-flex-col">
          <div className="data-headings-div h10 d-flex center t-center sb">
            <span className="text w5">Edit</span>
            <span className="text w5">Code</span>
            <span className="text w25">Customer Name</span>
            <span className="text w10">Mobile</span>
            <span className="text w15">Addhar No</span>
            <span className="text w10">City</span>
            <span className="text w10">Tehsil</span>
            <span className="text w10">District</span>
            <span className="text w15">A/C No</span>
            <span className="text w10">IFSC</span>
            <span className="text w15">Caste</span>
            <span className="text w10">Gender</span>
            <span className="text w5">Age</span>
            <span className="text w10">MemberNo</span>
            <span className="text w10">Mem. Date</span>
            <span className="text w15">Ratechart No.</span>
            <span className="text w5">MilkType</span>
            <span className="text w5">Active</span>
          </div>
          {/* Show Spinner if loading, otherwise show the customer list */}
          {loading ? (
            <Spinner />
          ) : customerlist.length > 0 ? (
            customerlist.map((customer, index) => (
              <div
                key={index}
                className={`data-values-div w100 h10 d-flex center t-center sa ${
                  index % 2 === 0 ? "bg-light" : "bg-dark"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faefe3" : "#fff",
                }}>
                <span className="text w5">edit</span>
                <span className="text w5">{customer.cid}</span>
                <span className="text w25">{customer.cname}</span>
                <span className="text w10">
                  {customer.mobile || customer.Phone}
                </span>
                <span className="text w15">{customer.cust_addhar}</span>
                <span className="text w10">{customer.City}</span>
                <span className="text w10">{customer.tal}</span>
                <span className="text w10">{customer.dist}</span>
                <span className="text w15">{customer.cust_accno}</span>
                <span className="text w10">{customer.cust_ifsc}</span>
                <span className="text w15">{customer.caste}</span>
                <span className="text w10">
                  {customer.gender === 0 ? "Female" : "Male"}
                </span>
                <span className="text w5">-</span> {/* Placeholder for age */}
                <span className="text w10">{customer.rno}</span>
                <span className="text w10">
                  {new Date(customer.createdon).toLocaleDateString()}
                </span>
                <span className="text w15">{customer.rateChartNo}</span>
                <span className="text w5">
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
  );
};

export default CustomerList;
