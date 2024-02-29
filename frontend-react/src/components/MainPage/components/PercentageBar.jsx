import React from "react";
import "./PercentageBar.css";

const PercentageBar = ({ title, percentage }) => {
  return (
    <div className="percentage_bar_container">
      <div className="percentage_bar_title">
        <p>{title}</p>
      </div>
      <div className="percentage_bar">
        <div style={{ width: `${percentage}0%` }} className="percentage_bar_rate"></div>
      </div>
    </div>
  );
};

export default PercentageBar;
