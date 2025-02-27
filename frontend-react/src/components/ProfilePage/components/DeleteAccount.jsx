import React, { useState } from "react";
import "./DeleteAccount.css";
import { useSiteState } from "../../../context/SiteStateContext";
import { useNavigate } from "react-router-dom";

const DeleteAccount = () => {
  const { deleteUserAccount } = useSiteState();

  const navigate = useNavigate();

  const [inAction, setInAction] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [confirmationTextError, setConfirmationTextError] = useState(false);

  const handleDeleteUser = async (e) => {
    e.preventDefault();
    if (deleteConfirmationText === "permanently delete account") {
      const deleted = await deleteUserAccount();
      if (deleted) {
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } else {
      setConfirmationTextError(true);
      setTimeout(() => {
        setConfirmationTextError(false);
      }, 1000);
    }
  };
  return (
    <div className="delete_account">
      {!inAction ? (
        <div className="delete_account_warning_element">
          <p className="delete_account_text">
            By pressing "DELETE ACCOUNT" your current account will be deleted and you will be logged
            out of your session. This action is irreversable and cannot be revoked or changed
            afterwards.
          </p>
          <button onClick={() => setInAction(true)} className="delete_account_btn">
            DELETE ACCOUNT
          </button>
        </div>
      ) : (
        <form onSubmit={(e) => handleDeleteUser(e)} className="delete_account_form">
          <p className="delete_account_text">
            Enter <span>permanently delete account</span> to permanently delete account
          </p>
          <input
            className={`delete_account_input ${
              confirmationTextError && "delete_account_confirmation_text_error"
            }`}
            value={deleteConfirmationText}
            onChange={(e) => setDeleteConfirmationText(e.target.value)}
            type="text"
          />
          <button className="delete_account_btn" type="submit">
            SUBMIT
          </button>
        </form>
      )}
    </div>
  );
};

export default DeleteAccount;
