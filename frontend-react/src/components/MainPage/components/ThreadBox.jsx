import React from "react";
import "./ThreadBox.css";

const ThreadBox = ({ title, content }) => {
  return (
    <div className="thread_box_container">
      <div className="thread_box">
        <div className="thread_box_content">
          <p>{content}</p>
        </div>
        <div className="thread_box_title">
          <p>{title}</p>
        </div>
      </div>
    </div>
  );
};

export default ThreadBox;
