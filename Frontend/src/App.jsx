import Home from "./Components/Home/Home";
import ProtectedRoute from "./ProtectedRoutes";
import Mainapp from "./Components/Mainapp/Mainapp";
import Customers from "./Components/Customers/Customers";
import AdminPannel from "./Components/Adminpanel/AdminPannel";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setToDate,
  setFormDate,
} from "./App/Features/Customers/Date/dateSlice";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import {
  requestForToken,
  onMessageListener,
} from "./Notifications/Notification";
import { saveFCMTokenToDB } from "./App/Features/Notifications/notificationSlice";
import Unauthorized from "./Components/Home/Unauthorized";
import { logoutUser } from "./App/Features/Users/authSlice";
import axiosInstance from "./App/axiosInstance";

function App() {
  const dispatch = useDispatch();
  const toDate = useSelector((state) => state.date.toDate);
  const profile = useSelector((state) => state.profile.profileInfo);
  const [fcmToken, setFCMToken] = useState(null);

  useEffect(() => {
    dispatch(setToDate());
  }, [dispatch]);

  useEffect(() => {
    if (toDate) {
      dispatch(setFormDate());
    }
  }, [dispatch, toDate]);

  // Firebase Messaging ....................

  // Foreground Firebase Messaging ..............
  onMessageListener()
    .then((payload) => {
      toast(
        <>
          <strong className="noti-title">{payload.notification.title}</strong>
          <p>{payload.notification.body}</p>
        </>,
        {
          autoClose: 3500,
        }
      );
    })
    .catch((err) => console.error("Error in onMessageListener:", err));

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    });
  }

  useEffect(() => {
    const fetchFCMToken = async () => {
      try {
        const token = await requestForToken();
        if (token) {
          setFCMToken(token);

          // Check if the user is logged in before storing the token
          if (profile?.srno) {
            dispatch(saveFCMTokenToDB({ token, cust_no: profile.srno }));
            localStorage.setItem("fcmToken", token); // Store in localStorage
          }
        } else {
          console.warn("No FCM token returned!");
        }
      } catch (err) {
        console.error(
          err.message === "Notification not granted!"
            ? "User declined Notification permission!"
            : "Error fetching FCM token.",
          err
        );
      }
    };

    // Only fetch the token if the user is logged in and the token is not stored
    if (profile?.srno && !localStorage.getItem("fcmToken")) {
      fetchFCMToken();
    }
  }, [profile?.srno]); // Runs when the user logs in

  useEffect(() => {
    // When the customer list is updated, store it in localStorage
    if (!fcmToken) {
      localStorage.setItem("fcmtoken", JSON.stringify("yes"));
    }
  }, [fcmToken]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Protected Routes admin pannel */}
          <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
            <Route path="/adminpanel" element={<AdminPannel />} />
          </Route>
          {/* Protected Routes main app */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "super_admin",
                  "manager",
                  "milkcollector",
                  "mobilecollector",
                ]}
              />
            }>
            <Route path="/mainapp/*" element={<Mainapp />} />
          </Route>
          {/* Protected Routes customer app */}
          <Route
            element={
              <ProtectedRoute allowedRoles={["super_admin", "customer"]} />
            }>
            <Route path="/customer/home" element={<Customers />} />
          </Route>
          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
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
