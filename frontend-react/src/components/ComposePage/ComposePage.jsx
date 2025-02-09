import React, { useEffect, useState } from "react";
import "./ComposePage.css";
import Compose from "./components/Compose";
import { useParams } from "react-router-dom";
import { useSiteState } from "../../context/SiteStateContext";

const ComposePage = () => {
  const [publishModal, setPublishModal] = useState(false);

  return (
    <div className="compose_page">
      <Compose publishModal={publishModal} setPublishModal={setPublishModal} />
    </div>
  );
};

export default ComposePage;
