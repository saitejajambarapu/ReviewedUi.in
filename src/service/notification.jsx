// src/components/Notification.js
import React from "react";

const styles = {
  container: {
    position: "fixed",
    top: "40px",                     // ⬆️ top area
    left: "50%",                     // center horizontally
    transform: "translateX(-50%)",   // keep it centered
    padding: "18px 40px",
    borderRadius: "12px",
    color: "#fff",
    zIndex: 999999,
    fontSize: "18px",
    fontWeight: "700",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
    cursor: "pointer",
    textAlign: "center",
    minWidth: "280px",
    maxWidth: "90%",
    letterSpacing: "0.5px",
    animation: "slideDown 0.4s ease-out, fadeOut 0.5s ease-in 2.5s forwards",
  },
  success: {
    background: "linear-gradient(135deg, #08f017ff, #3bed05ff)", // Netflix red
  },
  error: {
    background: "linear-gradient(135deg, #b71c1c, #7f0000)", // dark red error
  },
};

// 🔥 Slide + fade animations
const animations = `
@keyframes slideDown {
  from { opacity: 0; transform: translate(-50%, -20px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}
@keyframes fadeOut {
  to { opacity: 0; transform: translate(-50%, -20px); }
}
`;

function Notification({ message, type, onClose }) {
  if (!message) return null;

  return (
    <>
      {/* Inject animations */}
      <style>{animations}</style>
      <div
        style={{ ...styles.container, ...styles[type] }}
        onClick={onClose}
      >
        {message}
      </div>
    </>
  );
}

export default Notification;
