import React, { useEffect, useState } from "react";
import "./MainPageBody.css";
import FilterSearch from "./FilterSearch";
import TalePreview from "./TalePreview";
import FilterElements from "./FilterElements";
import { useTale } from "../../../context/TaleContext";

const MainPageBody = () => {
  const { getAllTales, tales, getSingleTale } = useTale();

  useEffect(() => {
    getAllTales();
  }, []);

  return (
    <div className="main_page_body">
      <FilterSearch />
      <FilterElements />
      <div className="main_page_body_collection">
        {tales.map((tale) => (
          <TalePreview key={tale.ID} tale={tale} />
        ))}
      </div>
    </div>
  );
};

export default MainPageBody;
