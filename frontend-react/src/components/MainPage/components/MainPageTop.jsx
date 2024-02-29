import React from "react";
import "./MainPageTop.css";
import NewsletterBox from "./NewsletterBox";
import MainPageText from "./MainPageText";

const MainPageTop = () => {
  return (
    <div className="main_page_top">
      <MainPageText />
      <NewsletterBox />
    </div>
  );
};

export default MainPageTop;
