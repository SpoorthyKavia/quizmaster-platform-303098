import React from "react";
import { Modal } from "./Modal";

// PUBLIC_INTERFACE
export function ConfirmDialog({ title = "Confirm", message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, danger = false }) {
  /** Simple confirm dialog for destructive actions. */
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="btn" onClick={onCancel}>
            {cancelText}
          </button>
          <button className={`btn ${danger ? "btn-danger" : "btn-primary"}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </>
      }
    >
      <p className="card-muted" style={{ marginTop: 0 }}>
        {message}
      </p>
    </Modal>
  );
}
