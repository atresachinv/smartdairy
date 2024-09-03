import React from "react";
import Custdashboard from "./CustNavViews/Custdashboard";
import CustProfile from "./CustNavViews/CustProfile";
import CustMilkCollection from "./CustNavViews/Milk/CustMilkCollection";
import CustPayment from "./CustNavViews/CustPayment";
import CustAnimalInfo from "./CustNavViews/CustAnimalInfo";
import CustPurchase from "./CustNavViews/CustPurchase";
import CustDeductions from "./CustNavViews/CustDeductions";
import Custnavlinks from "./Custnavlinks";

const Custnavviews = ({ index, setselected }) => {
  switch (index) {
    case 0:
      return <Custnavlinks setselected={setselected} />;
      break;
    case 1:
      return <Custdashboard />;
      break;
    case 2:
      return <CustMilkCollection />;
      break;
    case 3:
      return <CustPayment />;
      break;
    case 4:
      return <CustPurchase />;
      break;
    case 5:
      return <CustDeductions />;
      break;
    case 6:
      return <CustAnimalInfo />;
      break;
    case 7:
      return <CustProfile />;
      break;

    default:
      break;
  }
};

export default Custnavviews;
