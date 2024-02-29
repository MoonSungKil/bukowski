import React from "react";
import "./MainPage.css";
import MainPageFirst from "./components/MainPageFirst";
import MainPageSecond from "./components/MainPageSecond";
import MainPageBody from "./components/MainPageBody";
import Auth from "../AuthPage/Auth";

const MainPage = () => {
  return (
    <div className="main_page">
      <MainPageFirst />
      <MainPageSecond />
      <MainPageBody />
      <Auth />
    </div>
  );
};

export default MainPage;
