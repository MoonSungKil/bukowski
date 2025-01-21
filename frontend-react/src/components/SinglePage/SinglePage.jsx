import React, { useEffect } from "react";
import "./SinglePage.css";
import { useParams } from "react-router-dom";
import SinglePageContent from "./components/SinglePageContent";
import SinglePageFog from "./components/SinglePageFog";
import SinglePageTop from "./components/SinglePageTop.jsx";
import { useSiteState } from "../../context/SiteStateContext.js";

const SinglePage = () => {
  const { id } = useParams();

  const { getSingleTale, singleTaleSelected } = useSiteState();

  useEffect(() => {
    getSingleTale(id);
  }, []);

  console.log(singleTaleSelected);

  return (
    <div className="single_page">
      <SinglePageTop />
      <SinglePageContent />
      <SinglePageFog />
    </div>
  );
};

export default SinglePage;
