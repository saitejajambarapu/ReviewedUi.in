import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
const SearchResults = () => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const location = useLocation();
  // ✅ This makes sure q updates when the URL changes
  const q = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('q');
  }, [location.search]);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await api.get('content', { params: { title: q } });
        console.log('Success:', response.data);
        setResults(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Unable to fetch the Content Details.');
      }
    };

    if (q) fetchContent();
  }, [q]);
  // const [likedIds, setLikedIds] = useState(new Set());
  // const [watchedIds, setWatchedIds] = useState(new Set());

  if (!results || results.length === 0) {
    return <div>No results found.</div>;
  }

  const handleContent = async (id) => {
    navigate(`/search/${id}`);

  }

    const toggleLike = (id) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updateItem = { ...item, liked: !item.liked };
          api.post("savecontentInteractions", updateItem, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          return updateItem;
        }

        return item;
      }
      )
    );
  };
  const toggleWatch = (id) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updateItem = { ...item, watched: !item.watched };
          api.post("savecontentInteractions", updateItem, {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          return updateItem;
        }

        return item;
      }
      )
    );
  };

  return (
    <div>
      {results.map((item) => (
        <div key={item.id} style={{ border: '1px solid #ddd', padding: 15, marginBottom: 20, borderRadius: 8 }}>
          <h2 onClick={()=> handleContent(item.imdbID)} style={{cursor: 'pointer' }}>{item.Title} ({item.Year})</h2>
          {item.Poster==="N/A" ?<img onClick={() => handleContent(item.imdbID)} src={"https://tse3.mm.bing.net/th/id/OIP.RGIBnKlRSqUFnpzhRNvpOAHaJQ?pid=Api&P=0&h=180"} alt={item.Title} style={{ width: 150, float: 'left', marginRight: 15, borderRadius: 8,cursor: 'pointer' }} /> :
          <img onClick={() => handleContent(item.imdbID)} src={item.Poster}  alt={item.Title} style={{ width: 150, float: 'left', marginRight: 15, borderRadius: 8 , cursor: 'pointer' }} />}
          <div>
            <p><strong>Content Type:</strong> {item.Type}</p>
            <div style={{ marginTop: 10 }}>
              <button
                onClick={() => toggleLike(item.id)}
                style={{
                  backgroundColor: item.liked ? '#0d6efd' : '#eee',
                  color: item.liked ? '#fff' : '#000',
                  border: 'none',
                  padding: '8px 12px',
                  marginRight: 10,
                  cursor: 'pointer',
                  borderRadius: 4,
                }}
              >
                {item.liked ? 'Liked' : 'Like'}
              </button>
              <button
                onClick={() => toggleWatch(item.id)}
                style={{
                  backgroundColor: item.watched ? '#198754' : '#eee',
                  color: item.watched ? '#fff' : '#000',
                  border: 'none',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  borderRadius: 4,
                }}
              >
                {item.watched ? 'Watched' : 'Watch'}
              </button>
            </div>
          </div>
          <div style={{ clear: 'both' }}></div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
