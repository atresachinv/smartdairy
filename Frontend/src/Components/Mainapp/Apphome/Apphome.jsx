import React, { useEffect, useState } from "react";
import AppNavviews from "./AppNavviews";
import "../../../Styles/Mainapp/Apphome/Apphome.css";
import AppNavlinks from "./AppNavlinks";

const Apphome = () => {
  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("selectedTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedTabIndex", isselected);
  }, [isselected]);

   useEffect(() => {
     localStorage.setItem("selectednav", isselected);
   }, [isselected]);

  return (
    <div className="app-home-container w100 h1">
      <div className="header-nav w100 d-flex a-center">
        <AppNavlinks isselected={isselected} setselected={setIsSelected} />
      </div>
      <div className="home-nav-views w100 h90 d-flex center">
        <AppNavviews index={isselected} />
      </div>
    </div>
  );
};

export default Apphome;
