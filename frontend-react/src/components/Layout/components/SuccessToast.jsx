import React, { useEffect, useState } from "react";
import "./SuccessToast.css";
import { useSiteState } from "../../../context/SiteStateContext";

const SuccessToast = () => {
  const { successMessage } = useSiteState();

  const [showSlide, setShowSlide] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowSlide(true);
    }, 100);
  });

  return (
    <div className={`success_toast ${showSlide && "success_toast_slide"}`}>{successMessage}</div>
  );
};

export default SuccessToast;
