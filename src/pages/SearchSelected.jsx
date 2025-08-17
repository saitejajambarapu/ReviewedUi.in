import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../service/api';

const SearchSelected = () => {
  const { id } = useParams();
  const [result, setResult] = useState(null); // Single object now
  const location = useLocation();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('content/imdb', { params: { imdbId: id } });
        console.log('Success:', response.data);
        setResult(response.data);
      } catch (error) {
        console.error('Error fetching content:', error);
        alert('Unable to fetch the Content Details.');
      }
    };

    fetchContent();
  }, [id]);

  if (!result) {
    return <div>No content found.</div>;
  }

  // --- Interaction handlers now work with single object ---
  const toggleLike = () => {
    const updated = { ...result, liked: !result.liked };
    setResult(updated);
    api.post('savecontentInteractions', updated, {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const toggleWatch = () => {
    const updated = { ...result, watched: !result.watched };
    setResult(updated);
    api.post('savecontentInteractions', updated, {
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const handleReviewText = (value) => {
    setResult((prev) => ({ ...prev, review: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('savecontentInteractions', result, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Review saved!');
    } catch (error) {
      console.error('Failed to save review:', error);
    }
  };

  const handleRatingChange = (value) => {
    if (result.rating === value) return;
    const updated = { ...result, rating: value };
    setResult(updated);
    api
      .post('savecontentInteractions', updated, {
        headers: { 'Content-Type': 'application/json' },
      })
      .then((res) => console.log('Rating saved!', res.data))
      .catch((err) => console.error('Failed to save rating:', err));
  };

  return (
    <div>
      <div
        key={result.id}
        style={{ border: '1px solid #ddd', padding: 15, marginBottom: 20, borderRadius: 8 }}
      >
        <h2>
          {result.Title} ({result.Year})
        </h2>
        <img
          src={result.Poster}
          alt={result.Title}
          style={{ width: 150, float: 'left', marginRight: 15, borderRadius: 8 }}
        />
        <div>
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
          <p><strong>IMDB Rating:</strong> {result.imdbRating} ({result.imdbVotes} votes)</p>

          <div>
            <strong>Ratings:</strong>
            <ul>
              {result.Ratings && result.Ratings.length > 0 ? (
                result.Ratings.map((r, i) => (
                  <li key={i}>
                    {r.Source}: {r.Value}
                  </li>
                ))
              ) : (
                <li>No ratings available</li>
              )}
            </ul>
          </div>

          <div style={{ padding: '1rem' }}>
            <label htmlFor={`ratingSlider-${result.id}`}>
              Select Rating: {result.rating}
            </label>
            <input
              id={`ratingSlider-${result.id}`}
              type="range"
              min="0"
              max="10"
              step="1"
              value={result.rating || 0}
              onChange={(e) => handleRatingChange(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginTop: 10 }}>
            <form onSubmit={handleSubmitReview}>
              <input
                type="text"
                value={result.review || ''}
                onChange={(e) => handleReviewText(e.target.value)}
              />
              <button type="submit">Submit review</button>
            </form>
            <button
              onClick={toggleLike}
              style={{
                backgroundColor: result.liked ? '#0d6efd' : '#eee',
                color: result.liked ? '#fff' : '#000',
                border: 'none',
                padding: '8px 12px',
                marginRight: 10,
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              {result.liked ? 'Liked' : 'Like'}
            </button>
            <button
              onClick={toggleWatch}
              style={{
                backgroundColor: result.watched ? '#198754' : '#eee',
                color: result.watched ? '#fff' : '#000',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              {result.watched ? 'Watched' : 'Watch'}
            </button>
          </div>
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
    </div>
  );
};

export default SearchSelected;
