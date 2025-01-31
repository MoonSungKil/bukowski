import React from "react";
import "./ErrorToast.css";
import { useSiteState } from "../../../context/SiteStateContext";

const ErrorToast = () => {
  const { errorMessage } = useSiteState();

  return <div className="error_toast">{errorMessage}</div>;
};

export default ErrorToast;
