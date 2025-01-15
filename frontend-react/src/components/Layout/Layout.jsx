import React from "react";
import "./Layout.css";
import Header from "../MainPage/components/Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <main className="layout_main">{children}</main>
    </>
  );
};

export default Layout;
