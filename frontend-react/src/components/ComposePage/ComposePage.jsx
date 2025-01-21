import React, { useEffect } from "react";
import "./ComposePage.css";
import Compose from "./components/Compose";
import { useParams } from "react-router-dom";
import { useSiteState } from "../../context/SiteStateContext";

const ComposePage = () => {
  return (
    <div className="compose_page">
      <Compose />
    </div>
  );
};

export default ComposePage;
