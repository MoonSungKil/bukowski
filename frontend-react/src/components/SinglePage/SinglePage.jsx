import React, { useEffect, useState } from "react";
import "./SinglePage.css";
import { useNavigate, useParams } from "react-router-dom";
import SinglePageContent from "./components/SinglePageContent.jsx";
import SinglePageTop from "./components/SinglePageTop.jsx";
import SinglePageFog from "./components/SinglePageFog.jsx";
import { useSiteState } from "../../context/SiteStateContext.js";
import ArchiveButton from "./components/ArchiveButton.jsx";
import ActivateButton from "./components/ActivateButton.jsx";

const SinglePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaleByAccess, archiveTale, activateTale, published } = useSiteState();

  const [fetchedTale, setFetchedTale] = useState();

  const handleSoftDeleteTale = async (tale_id) => {
    const isDeleted = await archiveTale(tale_id);
    if (isDeleted) {
      navigate(`/`);
    }
  };

  const handleActivateTale = async (tale_id) => {
    const isActive = await activateTale(tale_id);
  };

  useEffect(() => {
    (async () => {
      const tale = await getTaleByAccess(id);
      setFetchedTale(tale);
      if (!tale) {
        navigate("/");
        window.location.reload();
      }
    })();
  }, [id, getTaleByAccess]);

  if (!fetchedTale) {
    return <div>Loading</div>;
  }

  return (
    <div className="single_page">
      <SinglePageTop tale={fetchedTale} />
      <SinglePageContent tale={fetchedTale} />
      <SinglePageFog />
      {published.some((t) => fetchedTale.ID === t.ID) && (
        <div className="single_page_archive_tale_container">
          {fetchedTale.DeletedAt === null ? (
            <ArchiveButton handleSoftDeleteTale={handleSoftDeleteTale} tale={fetchedTale} />
          ) : (
            <ActivateButton handleActivateTale={handleActivateTale} tale={fetchedTale} />
          )}
        </div>
      )}
    </div>
  );
};

export default SinglePage;
