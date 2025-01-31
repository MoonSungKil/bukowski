import React from "react";
import "./Layout.css";
import Header from "../MainPage/components/Header";
import Footer from "./components/Footer";
import ErrorToast from "./components/ErrorToast";
import { useSiteState } from "../../context/SiteStateContext";

const Layout = ({ children }) => {
  const { errorState } = useSiteState();

  return (
    <div className="layout">
      <Header />
      <main className="layout_main">{children}</main>
      {errorState && <ErrorToast />}
      <Footer />
    </div>
  );
};

export default Layout;
