import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../service/api';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../service/notificationprovider';
import AuthService from '../service/authService';
import Spinner from '../utils/spinner';

const SearchResults = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const location = useLocation();
  const [loadbutton, setLoadButton] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPage, setTotalPage] = useState(10);
  const isLoggedIn = AuthService.isLoggedIn();
  const [loading, setLoading] = useState(true);

  const q = useMemo(() => {
    const queryParams = new URLSearchParams(location.search);
    return queryParams.get('q');
  }, [location.search]);


  const powerSearch = () => {
    navigate('/powersearch')
  }

  const loadData = () => {
    debugger
    setLoading(true);
    const count = totalPage;
    const totalCount = Math.ceil(count / 10);
    var presentCount = pageNumber + 1;
    if (presentCount <= totalCount) {
      setPageNumber(presentCount);
    }
    else {
      setLoadButton(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoggedIn || isLoggedIn == null) {
      showNotification(`Please Login Or SignUp`, "error")
      navigate(`/signin`)
    } else {
      setLoading(true);
      const fetchContent = async () => {
        try {
          debugger
          const response = await api.post("content", {
            title: q,
            pageNumber: pageNumber,
            isApi: loadbutton
          });
          console.log('Success:', response.data);
          setResults(response.data.contents);
          setTotalPage(response.data.totalResults)
          setLoading(false);
          if (response.data.totalResults > 10) {
            setLoadButton(true)
          }
        } catch (error) {
          debugger
          showNotification(`unable fetch the details ${error.message}`, "error")
          console.error('Error fetching reviews:', error);
        }
      };


      if (q) fetchContent();
    }

  }, [q, pageNumber]);

  if (!results || results.length === 0) {
    return (<div> {loading ? <Spinner /> : 
    <div style={{ color: '#fff', textAlign: 'center', marginTop: 100 }}>
      <p>No Content Found.</p>
      <div
        style={{
          position: "fixed",
          top: "80px", // distance from top
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <button
          onClick={powerSearch}
          style={{
            backgroundColor: "#e50914", // Netflix red
            color: "#fff",
            fontSize: "20px",
            fontWeight: "bold",
            padding: "14px 36px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = "#f40612")
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = "#e50914")
          }
        >
          Didn't Find The Content?
        </button>
      </div>
    </div>}
    </div>
    )
}

const handleContent = async (id) => {
  debugger
  setLoading(true);
  const totalCount = Math.ceil(totalPage / 10);
  if (pageNumber < totalCount) {
    const response = await api.post(`content/skippedlist/${pageNumber}`, {
      title: q,
      pageNumber: totalCount,
      isApi: loadbutton
    });
    console.log("saved all the data:", response.data);
    if (response.data) showNotification(`fetched All Details for ${q} `, "success")
  }
  setLoading(false);
  navigate(`/search/${id}`);
};

const toggleLike = (id) => {
  setResults((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        const updateItem = { ...item, liked: !item.liked };
        api.post("savecontentInteractions", updateItem, {
          headers: { 'Content-Type': 'application/json' }
        });
        return updateItem;
      }
      return item;
    })
  );
};

const toggleWatch = (id) => {
  setResults((prev) =>
    prev.map((item) => {
      if (item.id === id) {
        const updateItem = { ...item, watched: !item.watched };
        api.post("savecontentInteractions", updateItem, {
          headers: { 'Content-Type': 'application/json' }
        });
        return updateItem;
      }
      return item;
    })
  );
};

return (
  <div>
    {loading ? <Spinner /> :
      <div>
        {loadbutton && (
          <>
            {/* Fixed button */}
            <div
              style={{
                position: "fixed",
                top: "80px", // distance from top
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
              }}
            >
              <button
                onClick={loadData}
                style={{
                  backgroundColor: "#e50914", // Netflix red
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  padding: "14px 36px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f40612")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e50914")
                }
              >
                Load Data
              </button>
            </div>


            {/* 👇 Invisible spacer div to push content down */}
            <div style={{ height: "80px" }}></div>
          </>
        )}
        {!loadbutton && (
          <>
            {/* Fixed button */}
            <div
              style={{
                position: "fixed",
                top: "80px", // distance from top
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
              }}
            >
              <button
                onClick={powerSearch}
                style={{
                  backgroundColor: "#e50914", // Netflix red
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: "bold",
                  padding: "14px 36px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f40612")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#e50914")
                }
              >
                Didn't Find The Content?
              </button>
            </div>


            {/* 👇 Invisible spacer div to push content down */}
            <div style={{ height: "80px" }}></div>
          </>
        )}

        <div style={styles.container}>
          {results.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.posterContainer} onClick={() => handleContent(item.imdbID)}>
                {item.Poster === "N/A" ? (
                  <img
                    src={"https://tse3.mm.bing.net/th/id/OIP.RGIBnKlRSqUFnpzhRNvpOAHaJQ?pid=Api&P=0&h=180"}
                    alt={item.Title}
                    style={styles.poster}
                  />
                ) : (
                  <img src={item.Poster} alt={item.Title} style={styles.poster} />
                )}
              </div>

              <div style={styles.details}>
                <h2
                  style={styles.title}
                  onClick={() => handleContent(item.imdbID)}
                >
                  {item.Title} ({item.Year})
                </h2>
                <p style={styles.type}><strong>Type:</strong> {item.Type}</p>

                <div style={styles.actions}>
                  <button
                    onClick={() => toggleLike(item.id)}
                    style={{
                      ...styles.button,
                      backgroundColor: item.liked ? '#e50914' : '#2b2b2b',
                      color: item.liked ? '#fff' : '#ccc'
                    }}
                  >
                    {item.liked ? '❤️ Liked' : '🤍 Like'}
                  </button>
                  <button
                    onClick={() => toggleWatch(item.id)}
                    style={{
                      ...styles.button,
                      backgroundColor: item.watched ? '#0f9d58' : '#2b2b2b',
                      color: item.watched ? '#fff' : '#ccc'
                    }}
                  >
                    {item.watched ? '✅ Watched' : '👀 Watch'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    }
  </div>

);
};

const styles = {
  container: {
    paddingTop: "80px",
    backgroundColor: '#141414',
    minHeight: '100vh',
    padding: '30px',
    color: '#fff',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px'
  },
  card: {
    background: 'linear-gradient(145deg, #1c1c1c, #0d0d0d)',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.7)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer'
  },
  posterContainer: {
    width: '100%',
    height: '400px',
    overflow: 'hidden'
  },
  poster: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  details: {
    padding: '15px'
  },
  title: {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    cursor: 'pointer',
    color: '#fff'
  },
  type: {
    fontSize: '0.9rem',
    color: '#aaa'
  },
  actions: {
    marginTop: '15px',
    display: 'flex',
    gap: '10px'
  },
  button: {
    flex: 1,
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background 0.3s ease, transform 0.2s ease'
  }
};

export default SearchResults;
