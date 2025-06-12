import React, { useState } from "react";

const ReportProblem = () => {
  const [complainttext, setComplianttxt] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
  };

  return (
    <div className="report-problem-page w100 h1 d-flex-col center">
      <form className="report-problem-container w40 h50 d-flex-col sb bg p10">
        <span className="heading w100 t-center">तक्रार नोंदवा</span>
        <textarea
          className="data"
          maxLength={200}
          rows={5}
          placeholder="तुमची समस्या सविस्तर पणे लिहा..."
          onChange={(e) => setComplianttxt(e.target.value)}
        ></textarea>
        <div className="butn-container w100 h10 d-flex j-end my10">
          <button type="reset" className="w-btn mx10">
            रद्द करा
          </button>
          <button type="submit" className="w-btn">
            नोंदवा
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportProblem;
