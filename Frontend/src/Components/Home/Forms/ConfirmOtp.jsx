import React from "react";
import "../../../Styles/Home/Forms.css";

const ConfirmOtp = ({ switchToLogin }) => {
  return (
    <form className="update-container w80 h90 d-flex-col a-center">
      <span className="heading t-center">Verify OTP</span>
      <input type="number" maxLength={4} className="w50 data" required />
      <button onClick={""} className="form-btn w50 my10">
        Verify
      </button>
      <button onClick={switchToLogin} type="button" className="w50 form-btn">
        Back
      </button>
    </form>
  );
};

export default ConfirmOtp;
