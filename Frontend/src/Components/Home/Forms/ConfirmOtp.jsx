import React, { useState } from "react";
import "../../../Styles/Home/Forms.css";
import { useDispatch, useSelector } from "react-redux";
import { confirmOtptext } from "../../../App/Features/Users/authSlice";
import { toast } from "react-toastify";

const ConfirmOtp = ({ switchToUPass, switchToLogin }) => {
  const dispatch = useDispatch();
  const userMobile = useSelector((state) => state.users.userInfo.userMobile);
  const status = useSelector((state) => state.users.cotpstatus);
  const [userOtp, setUserOtp] = useState("");

  const handleOtpVerfication = async (e) => {
    e.preventDefault();
    const res = await dispatch(
      confirmOtptext({
        username: userMobile.username,
        mobile: userMobile.mobile,
        otp: userOtp,
      })
    ).unwrap();
    if (res?.status === 200) {
      switchToUPass();
    } else {
      toast.error("Invalid Otp!");
    }
  };
  return (
    <form className="update-container w80 h90 d-flex-col a-center">
      <span className="heading t-center">Verify OTP</span>
      <input
        type="number"
        inputMode="numeric"
        maxLength={4}
        className="w50 data"
        value={userOtp}
        required
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d{0,4}$/.test(value)) {
            setUserOtp(value);
          }
        }}
      />
      <button
        onClick={handleOtpVerfication}
        className="form-btn w50 my10"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Verifying..." : "Verify"}
      </button>
      <button onClick={switchToLogin} type="button" className="w50 form-btn">
        Back
      </button>
    </form>
  );
};

export default ConfirmOtp;
