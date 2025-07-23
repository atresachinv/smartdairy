import React, { useEffect, useState } from "react";
import CustomerNavlinks from "./CustomerNavlinks";
import CustomerNavViews from "./CustomerNavViews";
import "../../../../../Styles/Mainapp/Masters/CustomerMaster.css";
import { useDispatch } from "react-redux";
import { getMaxCustNo } from "../../../../../App/Features/Customers/customerSlice";
import { Route, Routes } from "react-router-dom";
import CustomerList from "./CustomerList";
import CreateCustomer from "./CreateCustomer";

const CustomersMaster = () => {
  const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(0);

  useEffect(() => {
    dispatch(getMaxCustNo());
  }, []);

  return (
    <div className="customer-master-container w100 h1 d-flex-col">
      <div className="customer-master-navigation w100 h10 d-flex bg3">
        <CustomerNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="customer-views w100 h90 d-flex center">
        <Routes>
          <Route path="list" element={<CustomerList setIsSelected={setIsSelected}/>} />
          <Route path="add-new" element={<CreateCustomer setIsSelected={setIsSelected}/>} />
          <Route path="add-new/:code" element={<CreateCustomer setIsSelected={setIsSelected}/>} />
          <Route path="*" element={<CustomerList setIsSelected={setIsSelected}/>} />
        </Routes>
      </div>
    </div>
  );
};

export default CustomersMaster;
