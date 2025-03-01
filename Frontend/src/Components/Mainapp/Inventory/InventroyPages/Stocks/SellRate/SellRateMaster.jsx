import { useEffect, useState } from "react";
import SellRateNav from "./SellRateNav";
import UpdateSaleRate from "./UpdateSaleRate";
import { Route, Routes } from "react-router-dom";

const SellRateMaster = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const myrole = localStorage.getItem("userRole");
    setUserRole(myrole);
  }, []);
  const [isselected, setIsSelected] = useState(0);

  return (
    <div className="stock-container w100 h1">
      <div className="header-nav w100 h10 d-flex a-center nav-bg">
        <SellRateNav
          isselected={isselected}
          setIsSelected={setIsSelected}
          userRole={userRole}
        />
      </div>
      <div className="stock-nav-views w100 h90 d-flex center p10">
        <Routes>
          <Route path="*" element={<UpdateSaleRate />} />
        </Routes>
      </div>
    </div>
  );
};

export default SellRateMaster;
