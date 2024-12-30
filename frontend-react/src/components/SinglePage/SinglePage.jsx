import React, { useEffect } from "react";
import "./SinglePage.css";
import { useParams } from "react-router-dom";
import Header from "../MainPage/components/Header";
import SinglePageContent from "./components/SinglePageContent";
import SinglePageFog from "./components/SinglePageFog";
import SinglePageTop from "./components/SinglePageTop.jsx";
import { useTale } from "../../context/TaleContext.js";

const SinglePage = () => {
  const { id } = useParams();

  const { getSingleTale, singleTaleSelected } = useTale();

  useEffect(() => {
    getSingleTale(id);
  }, []);

  console.log(singleTaleSelected);

  return (
    <div className="single_page">
      <Header />
      <SinglePageTop taleId={id} />
      <SinglePageContent />
      <SinglePageFog />
    </div>
  );
};

export default SinglePage;
