import React from "react";
import "./ThreadBox.css";

const ThreadBox = ({ icon }) => {
  return (
    <div className="thread_box_container">
      <div className="thread_box">
        <div className="thread_box_content">
          <p>
            Share your thoughts on beloved classics, discover hidden gems, and engage in
            thought-provoking discussions with fellow bibliophiles from around the globe. Whether
            you're a seasoned scholar of literature or just beginning your literary journey, there's
            a place for you within our community.
          </p>
        </div>
        <div className="thread_box_title_container">
          <p className="thread_box_title">FORUM :: DISCUSSIONS</p>
        </div>
      </div>
    </div>
  );
};

export default ThreadBox;
