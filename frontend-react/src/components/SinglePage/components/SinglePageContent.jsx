import "./SinglePageContent.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSiteState } from "../../../context/SiteStateContext";

const SinglePageContent = ({ tale }) => {
  const { isPurchasedorPublished } = useSiteState();

  const { id } = useParams();

  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const checkPurchasedStatus = async () => {
      const result = await isPurchasedorPublished(id); // wait for the async function
      setPurchased(result);
    };

    checkPurchasedStatus();
  }, [id, isPurchasedorPublished]);

  let contentSegments = [];

  if (!tale) return <div>Loading</div>;

  if (tale.content) {
    const filterPagesIntoArray = (content, pageLength) => {
      let contentToManipulate = content;
      while (contentToManipulate.length > pageLength) {
        const nextFullStopAtSpecificLength = contentToManipulate.indexOf(". ", pageLength);
        const nextFullStopAtNewLine = contentToManipulate.indexOf("\n", pageLength);

        let nextPageJumpIndex;
        if (nextFullStopAtNewLine > nextFullStopAtSpecificLength) {
          nextPageJumpIndex = nextFullStopAtSpecificLength;
        } else {
          nextPageJumpIndex = nextFullStopAtNewLine;
        }

        if (nextPageJumpIndex === -1) {
          contentSegments.push(contentToManipulate);
          break;
        }

        const contentSegment = contentToManipulate.substring(0, nextPageJumpIndex + 1);
        contentSegments.push(contentSegment);

        contentToManipulate = contentToManipulate.substring(nextPageJumpIndex + 1);
      }

      if (contentToManipulate.length > 0) {
        contentSegments.push(contentToManipulate);
      }
    };
    filterPagesIntoArray(tale.content, 1800);
  }

  return (
    <div className="single_page_content_container">
      <div className="single_page_content">
        {purchased ? (
          <>
            <div className="single_page_content_title_author">
              {tale.title} by {tale.author}
            </div>
            <div className="single_page_content_underline"></div>
            <p className="single_page_content_story">{tale.content}</p>
            <div className="single_page_content_story">
              {contentSegments.map((segment, index) => {
                return (
                  <div className="single_page_content_story_fragment">
                    <p className="single_page_content_story_fragment_content">{segment}</p>
                    <p className="single_page_content_story_fragment_page">{index + 1}</p>
                  </div>
                );
              })}
            </div>
            <p className="single_page_content_story"></p>
          </>
        ) : (
          <div className="single_page_content_locked">
            <div className="single_page_content_locked_text">
              <i className="fa-solid fa-lock"></i>
              <p>Purchase to Unlock Content</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SinglePageContent;
