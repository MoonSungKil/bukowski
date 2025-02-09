import React, { useEffect, useState } from "react";
import "./ErrorToast.css";
import { useSiteState } from "../../../context/SiteStateContext";

const ErrorToast = () => {
  const { errorMessage } = useSiteState();

  const [showSlide, setShowSlide] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSlide(true);
    }, 100);
  });

  return <div className={`error_toast ${showSlide && "error_toast_slide"}`}>{errorMessage}</div>;
};

export default ErrorToast;
