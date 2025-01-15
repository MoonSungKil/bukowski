import React from "react";
import "./MainPage.css";
import MainPageFirst from "./components/MainPageFirst";
import MainPageSecond from "./components/MainPageSecond";
import MainPageBody from "./components/MainPageBody";

const MainPage = () => {
  return (
    <div className="main_page">
      <MainPageFirst />
      <MainPageSecond />
      <MainPageBody />
    </div>
  );
};

export default MainPage;
