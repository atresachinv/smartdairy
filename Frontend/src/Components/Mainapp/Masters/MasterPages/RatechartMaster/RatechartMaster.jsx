import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import RateMasterNavs from "./RateMasterNavs";
import PreviousRatechart from "./PreviousRatechart";
import AddtypeRatechart from "./AddtypeRatechart";
import SaveRatecharts from "./SaveRatecharts";
import Updateratecharts from "./Updateratecharts";
import Applyratecharts from "./Applyratecharts";
import { useDispatch } from "react-redux";
import { getMaxCustNo } from "../../../../../App/Features/Mainapp/Masters/custMasterSlice";
import "../../../../../Styles/Mainapp/Masters/MilkRateMaster.css";

const RatechartMaster = () => {
  const dispatch = useDispatch();
  const [isselected, setIsSelected] = useState(0);

  useEffect(() => {
    dispatch(getMaxCustNo());
  }, []);

  return (
    <div className="ratechart-master-container w100 h1 d-flex-col">
      <div className="ratechart-master-navigation w100 h10 d-flex bg3">
        <RateMasterNavs isselected={isselected} setIsSelected={setIsSelected} />
      </div>
      <div className="ratechart-master-views w100 h90 d-flex center">
        <Routes>
          <Route
            path="previous/list"
            element={<PreviousRatechart setIsSelected={setIsSelected} />}
          />
          <Route
            path="add/new-type"
            element={<AddtypeRatechart setIsSelected={setIsSelected} />}
          />
          <Route
            path="save"
            element={<SaveRatecharts setIsSelected={setIsSelected} />}
          />
          <Route
            path="update"
            element={<Updateratecharts setIsSelected={setIsSelected} />}
          />
          <Route
            path="apply"
            element={<Applyratecharts setIsSelected={setIsSelected} />}
          />
          <Route
            path="*"
            element={<PreviousRatechart setIsSelected={setIsSelected} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default RatechartMaster;
