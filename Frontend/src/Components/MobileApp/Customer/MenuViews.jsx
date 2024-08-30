import React from "react";
import Menulinks from "./Menulinks";
import MilkReport from "./MilkReport";
import Payments from "./Payments";

const MenuViews = ({ index, setselected }) => {
  switch (index) {
    case 0:
      return <Menulinks setselected={setselected} />;
      break;
    case 1:
      return <MilkReport />;
      break;
    case 2:
      return <Payments />;
      break;
    case 3:
      return <Payments />;
      break;
    case 4:
      return <Payments />;
      break;
    case 5:
      return <Payments />;
      break;

    default:
      break;
  }
};

export default MenuViews;
