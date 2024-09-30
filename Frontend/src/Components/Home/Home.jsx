import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import Forms from "./Forms/Forms";
import "../../Styles/Home/Home.css";
import FalshScreen from "./FalshScreen";

const Home = () => {
  const [showFlashScreen, setShowFlashScreen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFlashScreen(false);
    }, 1200); // Flash screen stays for 2 seconds

    return () => clearTimeout(timer); // Cleanup the timer
  }, []);

  return (
    <>
      {showFlashScreen ? (
        <div className="w100 h1 d-flex-col center">
          <FalshScreen />
        </div>
      ) : (
        <>
          <div className="nav-bar w100 h10">
            <Navigation />
          </div>
          <div className="home-container w100 d-flex">
            <div className="img-info-container w50 h1 d-flex-col">
              <div className="img-container box"></div>
            </div>
            <div className="login-register-container w50 h1 d-flex center">
              <Forms />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
