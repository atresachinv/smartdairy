import React, { useState } from "react";
import MilkColleform from "./Milkcollform";
import CollSettings from "./CollSettings";
import "../../../../../Styles/Mainapp/Apphome/Appnavview/collsetting.css";

// Define constants for form types
const FORM_TYPES = {
  COLL: "Coll",
  SETTINGS: "settings",
};

const CollectionSettingForm = () => {
  const [currentForm, setCurrentForm] = useState(FORM_TYPES.COLL);

  const switchToColl = () => setCurrentForm(FORM_TYPES.COLL);
  const switchToSettings = () => setCurrentForm(FORM_TYPES.SETTINGS);

  return (
    <div className="forms-container-div w100 h1 d-flex center">
      {currentForm === FORM_TYPES.COLL && (
        <MilkColleform switchToSettings={switchToSettings} />
      )}
      {currentForm === FORM_TYPES.SETTINGS && (
        <CollSettings switchToColl={switchToColl} />
      )}
    </div>
  );
};

export default CollectionSettingForm;
