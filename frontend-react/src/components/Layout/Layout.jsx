import React from "react";
import "./Layout.css";
import Header from "../MainPage/components/Header";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="layout_main">{children}</main>
    </div>
  );
};

export default Layout;
