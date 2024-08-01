import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Home/Navigation.css";

const Navigation = () => {
  return (
    <nav className="navigation-container w100 p10 d-flex a-center sb">
      <div className="logo-container w20 d-flex">
        <h2 className="title">SMARTDAIRY2.0</h2>
      </div>
      <div className="navlink-container w80 d-flex">
        <Link to="#">Home</Link>
        <Link to="#">About</Link>
        <Link to="#">Pricing</Link>
        <Link to="#">Contactus</Link>
      </div>
    </nav>
  );
};

export default Navigation;
