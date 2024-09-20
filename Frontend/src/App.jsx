import Home from "./Components/Home/Home";
import Mainapp from "./Components/Mainapp/Mainapp";
import Customers from "./Components/Customers/Customers";
import AdminPannel from "./Components/Adminpanel/AdminPannel";
// import Homepage from "./Components/MobileApp/Customer/Homepage";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setToDate,
  setFormDate,
} from "./App/Features/Customers/Date/dateSlice";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);

  useEffect(() => {
    dispatch(setToDate());
  }, [dispatch]);

  useEffect(() => {
    if (toDate) {
      dispatch(setFormDate());
    }
  }, [dispatch, toDate]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route index path="/adminpanel" element={<AdminPannel />} />
          <Route index path="/mainapp/home" element={<Mainapp />} />
          <Route index path="/customer/dashboard" element={<Customers />} />
          {/* <Route index path="/app/home" element={<Homepage />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose="1500"
        hideProgressBar="true"
        className={"react-tosts"}
      />
    </>
  );
}

export default App;
