import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
        }}
        onClick={onClose}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background: "rgba(255, 255, 255, 0.16)",
          borderRadius: "16px",
          padding: "2rem",
          backdropFilter: "blur(12px)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
          zIndex: 1001,
          maxWidth: "90vw",
          width: "450px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {children}
      </div>
    </>
  );
}
