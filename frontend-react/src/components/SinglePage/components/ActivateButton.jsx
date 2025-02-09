import React, { useState } from "react";
import "./ActivateButton.css";

const ArchiveButton = ({ handleActivateTale, tale }) => {
  const [archiveModal, setArchiveModal] = useState(false);

  return (
    <div className="activate_button_container">
      <button onClick={() => setArchiveModal(!archiveModal)} className="activate_button">
        Activate
      </button>
      <div className={`activate_button_box ${archiveModal && "activate_button_box_display"}`}>
        <p className="activate_button_box_text">Click "Enable" to Activate Tale</p>
        <div className="activate_button_box_buttons">
          <div onClick={() => handleActivateTale(tale.ID)} className="activate_button_btn">
            Enable
          </div>
          <div onClick={() => setArchiveModal(false)} className="activate_cancel_btn">
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchiveButton;
