import React from "react";
import Navigation from "./Navigation";
import "../../Styles/Home/Home.css";
import Login from "./Forms/Login";

const Home = () => {
  return (
    <>
      <Navigation />
      <div className="home-container w100 d-flex">
        <div className="text-info-container w50 h1 d-flex-col">
          <div className="img-container box"></div>
        </div>
        <div className="login-register-container w50 h1 d-flex center ">
          <Login />
        </div>
      </div>
    </>
  );
};

export default Home;
