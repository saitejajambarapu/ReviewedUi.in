import React, { useState } from "react";
import api from "../service/api";
import { useNavigate } from 'react-router-dom';
import Spinner from "../utils/spinner";

const PowerSearch = () => {
  const [loading, setLoading] = useState(false);
  const [movieName, setMovieName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [movieData, setMovieData] = useState(null);
  const currentYear = new Date().getFullYear();
  const years = [];
  const navigate = useNavigate();
  for (let y = currentYear + 5; y >= currentYear - 20; y--) {
    years.push(y);
  }
  const addReview = (imdbId) => {
    navigate(`/content/${imdbId}`)
  }

  const fetchMovie = async () => {
    setLoading(true);
    if (!movieName) return;
    try {
      const res = await api.get("/content/powersearch", {
        params: { name: movieName, year: year },
      });
      const data = res.data;
      setMovieData(data.Response === "True" ? data : null);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching movie:", error);
      setMovieData(null);
    }
  };

  return (
    <div>
      {loading ? <Spinner /> :
        <div className="app">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
              className="search-input"
            />
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="year-dropdown"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <button onClick={fetchMovie} className="search-button">
              Search
            </button>
          </div>

          {movieData && (
            <div className="movie-card">
              <img src={movieData.Poster} alt={movieData.Title} className="poster" />
              <div className="movie-info">
                <h2>
                  {movieData.Title} ({movieData.Year})
                </h2>
                <p>
                  <strong>Genre:</strong> {movieData.Genre}
                </p>
                <p>
                  <strong>Director:</strong> {movieData.Director}
                </p>
                <p>
                  <strong>Actors:</strong> {movieData.Actors}
                </p>
                <p className="plot">{movieData.Plot}</p>

                {/* Add Review Button */}
                <div className="button-container">
                  <button onClick={() => addReview(movieData.imdbID)} className="review-button">Add Review</button>
                </div>
              </div>
            </div>

          )}

          {/* Inline CSS */}
          <style>{`
        body {
          margin: 0;
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #141414;
          color: #fff;
        }
        .app {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 50px 20px;
        }
        .search-container {
          display: flex;
          gap: 10px;
          margin-bottom: 50px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .search-input {
          padding: 12px 20px;
          border-radius: 5px;
          border: none;
          width: 250px;
          font-size: 16px;
        }
        .year-dropdown {
          padding: 12px;
          border-radius: 5px;
          border: none;
          font-size: 16px;
          background-color: #333;
          color: #fff;
        }
        .search-button {
          padding: 12px 25px;
          border-radius: 5px;
          border: none;
          background-color: #e50914;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        .search-button:hover {
          background-color: #f40612;
        }
        .movie-card {
          display: flex;
          background-color: #222;
          border-radius: 10px;
          overflow: hidden;
          max-width: 900px;
          width: 100%;
          box-shadow: 0 0 20px rgba(0,0,0,0.7);
          animation: fadeIn 0.5s ease-in-out;
        }
        .poster {
          width: 300px;
          object-fit: cover;
        }
        .movie-info {
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          flex: 1;
        }
        .movie-info h2 {
          margin: 0;
          margin-bottom: 10px;
        }
        .movie-info p {
          margin: 5px 0;
        }
        .plot {
          margin-top: 15px;
          font-style: italic;
          line-height: 1.4;
        }
        .button-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .review-button {
          padding: 12px 25px;
          border-radius: 5px;
          border: none;
          background-color: #e50914;
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        .review-button:hover {
          background-color: #f40612;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
      }
    </div>


  );
};

export default PowerSearch;
