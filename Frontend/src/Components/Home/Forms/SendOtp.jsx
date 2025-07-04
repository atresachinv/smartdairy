import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CowImage from "../CowImage";
import axiosInstance from "../../../App/axiosInstance";
import { saveOtptext } from "../../../App/Features/Users/authSlice";
import "../../../Styles/Home/Forms.css";

const SendOtp = ({ switchVerify, switchToLogin }) => {
  const dispatch = useDispatch();
  const userMobile = useSelector((state) => state.users.userInfo.userMobile);
  const [otp, setOtp] = useState(null);

  const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    setOtp(otp);
    return otp;
  };

  const sendMessage = async (newOtp) => {
    const requestBody = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: `91${userMobile.mobile}`,
      type: "template",
      template: {
        name: "acc_updates_message",
        language: { code: "en" },
        components: [
          {
            type: "body",
            parameters: [
              { type: "text", text: "--" },
              { type: "text", text: `OTP : ${newOtp}` },
            ],
          },
        ],
      },
    };
    try {
      const response = await axiosInstance.post(
        "/send-message/otp",
        requestBody
      );
      console.log(response);
      toast.success("Whatsapp message send successfully...");
    } catch (error) {
      toast.error("Error in whatsapp message sending...");
      console.error("Error sending message:", error);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    const newOtp = generateOTP();
    if (newOtp) {
      sendMessage(newOtp);
      dispatch(
        saveOtptext({
          username: userMobile.username,
          mobile: userMobile.mobile,
          otp: newOtp,
        })
      );
      switchVerify();
      toast.success("Otp is Sent on your number!");
    } else {
      toast.error("Failed to generate otp.");
    }
  };

  return (
    <div className="send-otp-container w100 h1 d-flex center sb ">
      <div className="cow-image-container w50 h1 d-flex center">
        <CowImage />
      </div>
      <form className="update-password-container w40 h1 d-flex-col center">
        <span className="heading t-center">Forget Password</span>
        {userMobile.mobile && userMobile.mobile.length >= 6 ? (
          <span className="info-text t-center my10">
            Send OTP on <strong>Whatsapp</strong>{" "}
            {userMobile.mobile.slice(0, 6)}
            XXXX
          </span>
        ) : (
          <span className="info-text t-center my10">
            Mobile number not available
          </span>
        )}
        <button
          // onClick={switchVerify}
          onClick={handleSendOTP}
          type="submit"
          className="w50 my10 form-btn"
        >
          Send
        </button>
        <button onClick={switchToLogin} type="submit" className="w50 form-btn">
          Back
        </button>
      </form>
    </div>
  );
};

export default SendOtp;
