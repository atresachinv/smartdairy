import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

import "../../../Styles/Home/Forms.css";

const Forms = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);

  const switchToLogin = () => {
    setIsLoginForm(true);
  };

  const switchToRegister = () => {
    setIsLoginForm(false);
  };
  return (
    <>
      <div className="auth-container w100 h1 d-flex-col center">
        <div className="app-logo-div w100 h10 d-flex center">
          <img
            className="applogo"
            src="./src/assets/samrtdairylogo.png"
            alt="smartdairylogo"
          />
        </div>
        {isLoginForm ? (
          <Login switchToRegister={switchToRegister} />
        ) : (
          <Register switchToLogin={switchToLogin} />
        )}
      </div>
    </>
  );
};

export default Forms;
