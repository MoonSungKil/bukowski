import React from "react";
import "./Layout.css";
import Header from "../MainPage/components/Header";
import Footer from "./components/Footer";
import ErrorToast from "./components/ErrorToast";
import { useSiteState } from "../../context/SiteStateContext";
import SuccessToast from "./components/SuccessToast";

const Layout = ({ children }) => {
  const { errorState, successState } = useSiteState();

  return (
    <div className="layout">
      <Header />
      <main className="layout_main">{children}</main>
      <div className="layout_error">{errorState && <ErrorToast />}</div>
      <div className="layout_success">{successState && <SuccessToast />}</div>
      <Footer />
    </div>
  );
};

export default Layout;
