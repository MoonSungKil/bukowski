import React, { useState } from "react";
import "./ArchiveButton.css";

const ArchiveButton = ({ handleSoftDeleteTale, tale }) => {
  const [archiveModal, setArchiveModal] = useState(false);

  return (
    <div className="archive_button_container">
      <button onClick={() => setArchiveModal(!archiveModal)} className="archive_button">
        Archive
      </button>
      <div className={`archive_button_box ${archiveModal && "archive_button_box_display"}`}>
        <p className="archive_button_box_text">Click "Approve" to Archive Tale</p>
        <div className="archive_button_box_buttons">
          <div onClick={() => handleSoftDeleteTale(tale.ID)} className="archive_button_btn">
            Approve
          </div>
          <div onClick={() => setArchiveModal(false)} className="archive_cancel_btn">
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveButton;
