import React from "react";
import Navigation from "./Navigation";
import Forms from "./Forms/Forms";
import "../../Styles/Home/Home.css";

const Home = () => {
  return (
    <>
      <div className="nav-bar w100 h10">
        <Navigation />
      </div>
      <div className="home-container w100 d-flex">
        <div className="img-info-container w50 h1 d-flex-col">
          <div className="img-container box"></div>
        </div>
        <div className="login-register-container w50 h1 d-flex center ">
          <Forms />
        </div>
      </div>
    </>
  );
};

export default Home;
