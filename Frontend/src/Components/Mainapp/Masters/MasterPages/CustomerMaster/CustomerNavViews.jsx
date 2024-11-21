import React from "react";
import CreateCustomer from "./CreateCustomer";
import CustomerList from "./CustomerList";

const CustomerNavViews = ({ index }) => {
  switch (index) {
    case 0:
      return <CreateCustomer />;
      break;
    case 1:
      return <CustomerList />;
      break;

    default:
      break;
  }
};

export default CustomerNavViews;
