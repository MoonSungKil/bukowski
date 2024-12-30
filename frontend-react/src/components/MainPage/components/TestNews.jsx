import React from "react";
import "./TestNews.css";

const TestNew = () => {
  return (
    <div className="test_new_container">
      <div className="test_new">
        <div className="test_new_title">
          <p>Join our amazing</p>
          <h2>Newsletter</h2>
          <p>We promise you'll love it!</p>
        </div>
        <div className="test_new_text"></div>
        <form className="test_new_form">
          <input type="text" placeholder="Enter email address" />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </div>
  );
};

export default TestNew;
