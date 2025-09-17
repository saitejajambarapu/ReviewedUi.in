// Spinner.jsx
import React from "react";

const Spinner = () => {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    },
    spinner: {
      width: "50px",
      height: "50px",
      border: "6px solid #ddd",
      borderTop: "6px solid #3498db",
      borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    },
    // Keyframes using inline <style>
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.spinner}></div>
      </div>

      <style>
        {`
          @keyframes spin {
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  );
};

export default Spinner;
