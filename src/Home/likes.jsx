import React from 'react';

function Likes({ item, onLike, id, onDisLike }) {
  return (
    <div style={styles.container}>
      {/* Like button */}
      <button
        onClick={() => onLike()}
        style={{ ...styles.button, ...styles.like }}
        onMouseEnter={e => e.currentTarget.style.color = "#145dbf"}
        onMouseLeave={e => e.currentTarget.style.color = "#1877F2"}
      >
        👍 {item?.likes}
      </button>

      {/* Dislike button */}
      <button
        onClick={() => onDisLike()}
        style={{ ...styles.button, ...styles.dislike }}
        onMouseEnter={e => e.currentTarget.style.color = "#42464b"}
        onMouseLeave={e => e.currentTarget.style.color = "#606770"}
      >
        👎 {item?.dislikes}
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    gap: "15px",
    marginTop: "10px"
  },
  button: {
    cursor: "pointer",
    fontSize: "18px",
    padding: "6px 14px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    userSelect: "none",
    fontWeight: "600",
    transition: "transform 0.2s ease, color 0.2s ease",
  },
  like: {
    color: "#1877F2", // Facebook blue
    transform: "scale(1)",
  },
  dislike: {
    color: "#606770", // Facebook gray
    transform: "scale(1)",
  },
};

export default Likes;
