import React, { useEffect, useState } from "react";
import "./SinglePage.css";
import { useParams } from "react-router-dom";
import SinglePageContent from "./components/SinglePageContent";
import SinglePageFog from "./components/SinglePageFog";
import SinglePageTop from "./components/SinglePageTop.jsx";
import { useSiteState } from "../../context/SiteStateContext.js";

const SinglePage = () => {
  const { id } = useParams();

  const { getTaleByAccess } = useSiteState();

  const [fetchedTale, setFetchedTale] = useState();

  useEffect(() => {
    (async () => {
      const tale = await getTaleByAccess(id);
      setFetchedTale(tale);
    })();
  }, [id, getTaleByAccess]);

  return (
    <div className="single_page">
      <SinglePageTop tale={fetchedTale} />
      <SinglePageContent tale={fetchedTale} />
      <SinglePageFog />
    </div>
  );
};

export default SinglePage;
