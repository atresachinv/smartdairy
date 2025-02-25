/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { centersLists } from "../../../../App/Features/Dairy/Center/centerSlice";

const DairySettings = () => {
  const dispatch = useDispatch();
  const centerList = useSelector(
    (state) => state.center.centersList.centersDetails
  );

  useEffect(() => {
    dispatch(centersLists());
  }, [dispatch]);
  console.log(centerList);
  return (
    <div className="dairy-settings-page w100 h1 d-flex-col">
      <span className="heading p10">Dairy Settings</span>
      <div className="h1 w100 d-flex j-center ">
        <div className="mx5 my5 w90 d-flex-col bg center">
          {centerList.map((center) => {
            return (
              <div key={center.id} className="w50 h10 d-flex px10  d-flex sb">
                <div className=" px10 info-text ">{center.center_id}</div>
                <div className=" info-text  ">{center.center_name}</div>
                <div className=" info-text  "> setting</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DairySettings;
