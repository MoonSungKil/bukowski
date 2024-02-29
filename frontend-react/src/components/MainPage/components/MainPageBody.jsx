import React from "react";
import "./MainPageBody.css";
import FilterSearch from "./FilterSearch";
import TalePreview from "./TalePreview";
import FilterElements from "./FilterElements";

const MainPageBody = () => {
  return (
    <div className="main_page_body">
      <FilterSearch />
      <FilterElements />
      <div className="main_page_body_collection">
        <TalePreview />
        <TalePreview />
        <TalePreview />
        <TalePreview />
        <TalePreview />
        <TalePreview />
        <TalePreview />
        <TalePreview />
      </div>
    </div>
  );
};

export default MainPageBody;
