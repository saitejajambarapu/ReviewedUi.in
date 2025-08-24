import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import api from "../service/api";

const SearchSelected = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get("content/imdb", { params: { imdbId: id } });
        setResult(response.data);
      } catch (error) {
        console.error("Error fetching content:", error);
        alert("Unable to fetch the Content Details.");
      }
    };
    fetchContent();
  }, [id]);

  if (!result) {
    return <div className="no-content">No content found.</div>;
  }

  // --- Handlers ---
  const toggleLike = () => {
    const updated = { ...result, liked: !result.liked };
    setResult(updated);
    api.post("savecontentInteractions", updated, { headers: { "Content-Type": "application/json" } });
  };

  const toggleWatch = () => {
    const updated = { ...result, watched: !result.watched };
    setResult(updated);
    api.post("savecontentInteractions", updated, { headers: { "Content-Type": "application/json" } });
  };

  const handleReviewText = (value) => setResult((prev) => ({ ...prev, review: value }));

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post("savecontentInteractions", result, { headers: { "Content-Type": "application/json" } });
      console.log("Review saved!");
    } catch (error) {
      console.error("Failed to save review:", error);
    }
  };

  const handleRatingChange = (value) => {
    if (result.rating === value) return;
    const updated = { ...result, rating: value };
    setResult(updated);
    api
      .post("savecontentInteractions", updated, { headers: { "Content-Type": "application/json" } })
      .then(() => console.log("Rating saved!"))
      .catch((err) => console.error("Failed to save rating:", err));
  };

  return (
    <div className="page-container">
      <div className="card">
        <div className="poster">
          <img src={result.Poster} alt={result.Title} />
        </div>
        <div className="details">
          <h2>
            {result.Title} <span>({result.Year})</span>
          </h2>
          <p><strong>Genre:</strong> {result.Genre}</p>
          <p><strong>Director:</strong> {result.Director}</p>
          <p><strong>Writer:</strong> {result.Writer}</p>
          <p><strong>Actors:</strong> {result.Actors}</p>
          <p><strong>Plot:</strong> {result.Plot}</p>
          <p><strong>Language:</strong> {result.Language}</p>
          <p><strong>Country:</strong> {result.Country}</p>
          <p><strong>Awards:</strong> {result.Awards}</p>
          <p><strong>Released:</strong> {result.Released}</p>
          <p><strong>Runtime:</strong> {result.Runtime}</p>
          <p><strong>IMDB Rating:</strong> ⭐ {result.imdbRating} ({result.imdbVotes} votes)</p>

          {/* Rating */}
          <div className="rating">
            <strong>Your Rating:</strong>
            <div className="stars">
              {[1, 2, 3, 4, 5,6,7,8,9,10].map((star) => (
                <span
                  key={star}
                  className={star <= (result.rating || 0) ? "star filled" : "star"}
                  onClick={() => handleRatingChange(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Review */}
          <form onSubmit={handleSubmitReview} className="review-form">
            <input
              type="text"
              placeholder="Write your review..."
              value={result.review || ""}
              onChange={(e) => handleReviewText(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>

          {/* Actions */}
          <div className="actions">
            <button
              onClick={toggleLike}
              className={`like-btn ${result.liked ? "active" : ""}`}
            >
              {result.liked ? "❤️ Liked" : "🤍 Like"}
            </button>

            <button
              onClick={toggleWatch}
              className={`watch-btn ${result.watched ? "active" : ""}`}
            >
              {result.watched ? "✔ Watched" : "👀 Watch"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSelected;

/* === Injected CSS === */
const styles = `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #000;
  color: #fff;
}

.page-container {
  background-color: #000;
  color: #fff;
  min-height: 100vh;
  padding: 30px;
  font-family: Arial, sans-serif;
}

.card {
  display: flex;
  gap: 20px;
  background: #111;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 0 20px rgba(255,255,255,0.1);
  max-width: 1000px;
  margin: auto;
}

.poster img {
  width: 250px;
  border-radius: 10px;
  border: 2px solid #444;
}

.details h2 {
  margin-top: 0;
  font-size: 24px;
  color: #ffcc00;
}

.details span {
  color: #aaa;
  font-size: 18px;
}

.stars {
  display: flex;
  gap: 5px;
  margin: 8px 0;
}

.star {
  font-size: 24px;
  cursor: pointer;
  color: #555;
  transition: 0.2s;
}

.star:hover {
  transform: scale(1.2);
}

.star.filled {
  color: gold;
}

.review-form {
  margin: 15px 0;
  display: flex;
  gap: 10px;
}

.review-form input {
  flex: 1;
  padding: 8px;
  border-radius: 6px;
  border: none;
  outline: none;
  background: #222;
  color: #fff;
}

.review-form button {
  padding: 8px 14px;
  background: #ffcc00;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.review-form button:hover {
  background: #e6b800;
}

.actions {
  display: flex;
  gap: 15px;
  margin-top: 15px;
}

.like-btn, .watch-btn {
  padding: 10px 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  font-size: 15px;
  transition: 0.3s;
}

.like-btn {
  background: #222;
  color: #fff;
}

.like-btn.active {
  background: red;
  color: #fff;
}

.watch-btn {
  background: #222;
  color: #fff;
}

.watch-btn.active {
  background: linear-gradient(90deg, #007bff, #00d4ff);
  color: #fff;
}
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
