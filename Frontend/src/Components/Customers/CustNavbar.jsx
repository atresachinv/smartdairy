import { useState } from "react";
import { BsList, BsArrowLeft, BsEscape } from "react-icons/bs";
import "../../Styles/Customer/Customer.css";
import Custnavlinks from "./Custnavlinks";

const CustNavbar = ({ setselected, handleBackButton }) => {
  const [openNavbar, setOpenNavbar] = useState(false);

  const showNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  return (
    <nav className="cust-navbar w100 d-flex sb p10">
      <div className="logo w20 d-flex a-center">
        <BsArrowLeft className="back-icon" onClick={handleBackButton} />
        <span className="logo-text">SMARTDAIRY</span>
      </div>
      <div className="logout-btn">
        <BsEscape className="icon " />
      </div>
    </nav>
  );
};

export default CustNavbar;
