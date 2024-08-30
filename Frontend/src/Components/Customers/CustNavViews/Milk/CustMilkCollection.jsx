import React, { useEffect, useState } from "react";
import "../../../../Styles/Customer/CustNavViews/CustMilkCollection.css";
import Reportviews from "./Reportviews";
import Reportlinks from "./Reportlinks";

const CustMilkCollection = () => {
  // Retrieve isselected from localStorage, defaulting to 0 if not set
  const [isselected, setIsselected] = useState(
    parseInt(localStorage.getItem("selectedReport")) || 0
  );

  // Update localStorage whenever isselected changes
  useEffect(() => {
    localStorage.setItem("selectedReport", isselected);
  }, [isselected]);

  // ...............................
  return (
    <div className="cust-milk-collection-info w100 h1 d-felx-col">
      <div className="menu-title-div w70 mx-15 h10 d-flex a-center p10">
        <h2 className="heading">Milk Collection Reports</h2>
      </div>
      <div className="report-type-container w70 mx-15 h10 d-flex a-center sa ">
        <Reportlinks setselected={setIsselected} />
      </div>
      <div className="report-virews-container w70 mx-15 h80 d-flex p10 ">
        <Reportviews index={isselected} />
      </div>
    </div>
  );
};

export default CustMilkCollection;
