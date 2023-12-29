import React from "react";
import "./ProgressBar.css";

function ProgressBar({ progressBar }) {
  return (
    <div className="ProgressBar">
      <div
        className="Progress"
        style={progressBar ? { width: `${progressBar}%` } : {}}
      >
        {progressBar ? `${progressBar}%` : "0%"}
      </div>
    </div>
  );
}

export default ProgressBar;
