import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignOut() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>You’ve Signed Out</h1>
        <p style={styles.text}>Thanks for visiting CineVerse. Come back soon!</p>

        <button style={styles.button} onClick={() => navigate("/signin")}>
          Log In Again
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    position: "fixed", // Fix the page to viewport
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0d0d0d",
    fontFamily: "Arial, sans-serif",
    color: "#fff",
    overflow: "hidden", // prevent scrolling
    margin: 0,
    padding: 0,
    zIndex: 9999,
  },
  card: {
    backgroundColor: "#181818",
    padding: "50px 40px",
    borderRadius: "12px",
    textAlign: "center",
    maxWidth: "450px",
    width: "90%",
    boxShadow: "0 10px 25px rgba(0,0,0,0.7)",
    border: "1px solid #222",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#e50914",
    textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
  },
  text: {
    fontSize: "1rem",
    color: "#ddd",
    marginBottom: "30px",
  },
  button: {
    backgroundColor: "#e50914",
    padding: "14px 30px",
    borderRadius: "50px",
    fontWeight: "600",
    fontSize: "1rem",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

export default SignOut;
