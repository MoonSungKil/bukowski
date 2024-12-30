import React from "react";
import "./Header.css";
import Navigation from "./Navigation";
import Auth from "../../AuthPage/Auth";

function Header() {
  return (
    <div className="header_container">
      <div className="header_background">
        <svg className="header_svg" viewBox="0 0 1440 490">
          <path
            className="header_waveform"
            d="M 0,400 L 0,150 C 149,187.32142857142856 298,224.64285714285714 397,218 C 496,211.35714285714286 545,160.75 658,160 C 771,159.25 948,208.35714285714286 1089,215 C 1230,221.64285714285714 1335,185.82142857142856 1440,150 L 1440,400 L 0,400 Z"
          ></path>
        </svg>
      </div>
      <div className="header">
        <div className="header_logo_container">
          <h1 className="header_logo">BUKOWSKI</h1>
        </div>
        <Navigation />
      </div>
      <Auth />
    </div>
  );
}

export default Header;
