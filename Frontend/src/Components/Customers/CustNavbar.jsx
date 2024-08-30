import { useState } from "react";
// import { Link } from "react-router-dom";
import { BsList, BsXLg } from "react-icons/bs";
// import "../../Styles/Home/Navigation.css";
import "../../Styles/Customer/Customer.css";
import Custnavlinks from "./Custnavlinks";

const CustNavbar = ({ setselected }) => {
  const [openNavbar, setOpenNavbar] = useState(false);

  const showNavbar = () => {
    setOpenNavbar(!openNavbar);
  };

  return (
    <nav className="cust-navbar w100 d-flex sb p10">
      <div className="logo w20 d-flex a-center">
        <BsList className="menu-btn open-btn" onClick={showNavbar} />
        <span className="logo-text">SMARTDAIRY</span>
      </div>
      <div className={` ${openNavbar ? "open" : "close"}`}>
        <div className={`navlinks w80 d-flex`}>
          <BsXLg className="menu-btn close-btn" onClick={showNavbar} />
          <Custnavlinks setselected={setselected} showNavbar={showNavbar} />
        </div>
      </div>
    </nav>
  );
};

export default CustNavbar;
