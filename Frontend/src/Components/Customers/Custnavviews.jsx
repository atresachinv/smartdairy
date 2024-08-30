import React from "react";
import Custdashboard from "./CustNavViews/Custdashboard";
import CustProfile from "./CustNavViews/CustProfile";
import CustMilkCollection from "./CustNavViews/Milk/CustMilkCollection";
import CustPayment from "./CustNavViews/CustPayment";
import CustAnimalInfo from "./CustNavViews/CustAnimalInfo";
import CustPurchase from "./CustNavViews/CustPurchase";
import CustDeductions from "./CustNavViews/CustDeductions";

const Custnavviews = ({ index }) => {
  switch (index) {
    case 0:
      return <Custdashboard />;
      break;
    case 1:
      return <CustProfile />;
      break;
    case 2:
      return <CustMilkCollection />;
      break;
    case 3:
      return <CustPayment />;
      break;
    case 4:
      return <CustAnimalInfo />;
      break;
    case 5:
      return <CustPurchase />;
      break;
    case 6:
      return <CustDeductions />;
      break;

    default:
      break;
  }
};

export default Custnavviews;
