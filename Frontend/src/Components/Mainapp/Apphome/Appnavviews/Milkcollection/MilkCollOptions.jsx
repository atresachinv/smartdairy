import React, { useEffect, useState } from "react";
import OptionsNavlinks from "./OptionsNavlinks";
import OptionViews from "./OptionViews";
import { useDispatch } from "react-redux";
import { fetchMobileColl } from "../../../../../App/Features/Mainapp/Milk/MilkCollectionSlice";

const MilkCollOptions = () => {
  const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(
    parseInt(localStorage.getItem("milkcollTabIndex")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("milkcollTabIndex", isselected);
  }, [isselected]);



  return (
    <div className="app-home-container w100 h1 d-flex-col">
      <div className="header-nav-div w100 d-flex a-center">
        <OptionsNavlinks
          isselected={isselected}
          setIsSelected={setIsSelected}
        />
      </div>
      <div className="home-nav-views w100 h90 d-flex center">
        <OptionViews index={isselected} />
      </div>
    </div>
  );
};

export default MilkCollOptions;