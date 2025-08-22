import React, { useEffect } from "react";

export default function Snackbar({ message, onClose, duration = 3000 }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, onClose, duration]);

  if (!message) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#ff3860",
      color: "white",
      padding: "1rem 2rem",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      zIndex: 1000,
      fontWeight: "600",
      minWidth: "200px",
      textAlign: "center"
    }}>
      {message}
    </div>
  );
}
