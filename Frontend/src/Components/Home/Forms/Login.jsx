import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
// css
import "../../../Styles/Home/Forms.css";

//*******************************************

// const Login = ({ switchToRegister }) => {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({
//     user_id: "",
//     user_password: "",
//   });
//
//   const handleInputs = (e) => {
//     const { name, value } = e.target;
//     setValues({ ...values, [name]: value });
//   };
//
//   axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
//   axios.defaults.withCredentials = true;
//
//   const handleLogin = (e) => {
//     e.preventDefault();
//     axios
//       .post("/login", values)
//       .then((res) => {
//         localStorage.setItem("token", res.data.token);
//         toast.success("Login Successful");
//         navigate("/mainapp/home"); // Redirect to Main App
//       })
//       .catch((err) => {
//         if (err.response) {
//           console.error(`Error during login: ${err.response.data.message}`);
//         } else {
//           console.error(`Error during login1: ${err.message}`);
//         }
//       });
//   };
//
//   return (
//     <div className="form-container w50 h1 d-flex-col p10">
//       <div className="form-title w100 h10 d-flex-col">
//         <span className="title">Login Now</span>
//       </div>
//       <form onSubmit={handleLogin} className="login-form w100 h50 d-flex-col">
//         <div className="data-div w100">
//           <span className="text">Enter Userid</span>
//           <input
//             type="text"
//             name="user_id"
//             className="data"
//             required
//             onChange={handleInputs}
//           />
//         </div>
//         <div className="data-div w100">
//           <span className="text">Enter Password</span>
//           <input
//             type="password"
//             name="user_password"
//             className="data"
//             required
//             onChange={handleInputs}
//           />
//         </div>
//         <button className="form-btn" type="submit">
//           Login
//         </button>
//         <div className="account-check-div">
//           <h2 className="text">
//             I don't have account{" "}
//             <button onClick={switchToRegister} className="swith-form-button">
//               Register
//             </button>{" "}
//             Now!
//           </h2>
//         </div>
//       </form>
//     </div>
//   );
// };

const Login = ({ switchToRegister, switchToOptSend }) => {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    user_id: "",
    user_password: "",
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  axios.defaults.baseURL = import.meta.env.VITE_BASE_URI;
  axios.defaults.withCredentials = true;

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("/login", values)
      .then((res) => {
        const { user_role } = res.data;
        toast.success("Login Successful");

        // Redirect based on user_role
        if (user_role === "super_admin") {
          navigate("/adminpanel");
        } else if (user_role === "Admin" || user_role === "Employee") {
          navigate("/mainapp/home");
        } else if (user_role === "Customer") {
          navigate("/customer/dashboard");
        } else {
          toast.error("Unexpected user type!");
        }
      })
      .catch((err) => {
        if (err.response) {
          console.error(`Error during login: ${err.response.data.message}`);
          toast.error(err.response.data.message);
        } else {
          console.error(`Error during login: ${err.message}`);
          toast.error("An error occurred during login.");
        }
      });
  };

  return (
    <div className="form-container w50 h1 d-flex-col p10">
      <div className="form-title w100 h10 d-flex-col t-center">
        <span className="title">Login Now</span>
      </div>
      <form onSubmit={handleLogin} className="login-form w100 h50 d-flex-col">
        <div className="data-div w100">
          <span className="text">Enter Userid</span>
          <input
            type="text"
            name="user_id"
            className="data"
            required
            onChange={handleInputs}
          />
        </div>
        <div className="data-div w100">
          <span className="text">Enter Password</span>
          <input
            type="password"
            name="user_password"
            className="data"
            required
            onChange={handleInputs}
          />
        </div>
        <div className="account-check-div">
          <h2 className="text">
            <button onClick={switchToOptSend} className="swith-form-button">
              Forget Password ?
            </button>
          </h2>
        </div>
        <button className="form-btn" type="submit">
          Login
        </button>
        <div className="account-check-div">
          <h2 className="text">
            I don't have account{" "}
            <button onClick={switchToRegister} className="swith-form-button">
              Register
            </button>{" "}
            Now!
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Login;
