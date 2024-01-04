import React from "react";
import "./ProgressBar.css";

function ProgressBar({ progressBar }) {
  return (
    <div className="ProgressBar">
      <div className="Progress" style={{ width: `${progressBar}%` }}>
        <p>{progressBar ? `${progressBar}%` : "0%"}</p>
      </div>
    </div>
  );
}

export default ProgressBar;
