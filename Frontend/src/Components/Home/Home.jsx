import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import Forms from "./Forms/Forms";
import { MdSignalWifiConnectedNoInternet0 } from "react-icons/md";
import cow_man_img from "../../assets/man-cow-milk.png";
import FlashScreen from "./FlashScreen";
import "../../Styles/Home/Home.css";

const Home = () => {
  const [showFlashScreen, setShowFlashScreen] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Handle online/offline status
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Timer for flash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlashScreen(false);
    }, 1200); // Flash screen stays for 1.2 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!isOnline) {
    return (
      <div className="nointernet-screen w100 h100 d-flex-col center bg1">
        <span className="first-text">
          <MdSignalWifiConnectedNoInternet0 />
        </span>
        <span className="second-text">No Internet Connection</span>
        <span className="p-text">
          Please check your internet settings and try again.
        </span>
      </div>
    );
  }

  return (
    <div className="main-home-outer-container w100 h100 d-flex-col center">
      {showFlashScreen ? (
        <div className="w100 h1 d-flex-col center">
          <FlashScreen />
        </div>
      ) : (
        <div className="main-outer-view-container w100 h1 mh100 hidescrollbar d-flex-col">
          <div className="nav-bar-container w100 h10 sticky-top">
            <Navigation />
          </div>
          <div className="home-form-container w100 h90 d-flex center">
              <Forms />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
