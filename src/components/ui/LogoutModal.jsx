import React from "react";
import Modal from "./Modal";

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Logout Confirmation"
      message="Are you sure you want to logout? You will need to login again to access the application."
      confirmText="Yes, Logout"
      cancelText="Cancel"
      type="warning"
    />
  );
};

export default LogoutModal;
