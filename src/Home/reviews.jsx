import React, { useEffect, useState, useRef } from 'react';
import api from '../service/api';
import AuthService from '../service/authService';
import Likes from './likes';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../service/notificationprovider';
import Spinner from '../utils/spinner';
const Reviews = () => {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const userId = AuthService.getUserId();
  const isLoggedIn = AuthService.isLoggedIn();
  const menuRefs = useRef({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn || isLoggedIn == null) {
      showNotification(`Please Login Or SignUp`, "error")
      navigate(`/signin`)
    } else {
      setLoading(true);
      const fetchReviews = async () => {
        try {
          const response = await api.get("reviews");
          setReviewData(response.data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching reviews:', error);
          setLoading(false);
          showNotification(`unable to fetch the reviews. please look back later`, 'error')
        }
      };

      fetchReviews();
    }

  }, []);

  // ✅ Fixed: Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.closest('[data-ignore-outside-click="true"]')) {
        return;
      }

      Object.values(menuRefs.current).forEach(ref => {
        if (ref && !ref.contains(e.target)) {
          setMenuOpenId(true);
        }
      });
    };

    // Register listener
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup — must match the above
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleReviewDelete = async (id) => {
    try {
      const response = await api.delete(`reviews/${id}`);
      if (response.data) {
        setReviewData(prev => prev.filter(item => item.id !== id));
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Unable to delete the Review.');
    }
  };

  const handleLiked = async (id) => {
    const hasUserDisLiked = reviewData.find(review => review.id === id)
      ?.disLiked?.some(user => user.id === Number(userId));

    if (hasUserDisLiked) {
      handleDisLiked(id);
    }

    const likedData = await api.post(`reviews/like/${id}`);
    setReviewData(prevData =>
      prevData.map(item =>
        item.id === id
          ? {
            ...item,
            contentReviews: {
              ...item.contentReviews,
              likes: likedData.data.length,
            },
            isLiked: likedData.data,
          }
          : item
      )
    );
  };

  const handleDisLiked = async (id) => {
    const hasUserLiked = reviewData.find(review => review.id === id)
      ?.isLiked?.some(user => user.id === Number(userId));

    if (hasUserLiked) {
      handleLiked(id);
    }

    const dislikedData = await api.post(`reviews/dislike/${id}`);
    setReviewData(prevData =>
      prevData.map(item =>
        item.id === id
          ? {
            ...item,
            contentReviews: {
              ...item.contentReviews,
              dislikes: dislikedData.data.length,
            },
            disLiked: dislikedData.data,
          }
          : item
      )
    );
  };

  const handleReview = (id) => navigate(`/review/${id}`);
  const handleReplyUser = (id) => navigate(`/Profile/${id}`);
  const handleEdit = (id) => {
    setMenuOpenId(null);
    navigate(`/search/${id}`)
  };

  return (
    <div>
      {loading ? <Spinner /> :
        <div style={styles.container}>

          <h1 style={styles.heading}>Reviews</h1>
          {reviewData.length > 0 ? (
            reviewData.map((item) => (
              <div
                key={item.id}
                style={styles.card}
                className="review-card"
              >
                <img
                  onClick={() => handleReview(item.id)}
                  src={item.contentPoster}
                  alt={item.contentName}
                  style={styles.poster}
                  className="poster" s
                />
                <div style={styles.details}>
                  {/* 3-dot menu */}
                  <div
                    ref={(el) => (menuRefs.current[item.id] = el)}
                    style={{ position: 'relative', textAlign: 'right' }}
                  >
                    <button
                      onClick={() =>
                        setMenuOpenId(menuOpenId === item.id ? null : item.id)
                      }
                      style={styles.dotsButton}
                    >
                      ⋮
                    </button>
                    {menuOpenId === item.id && (
                      console.log("menuOpenId:", menuOpenId, "item.id:", item.id),
                      <div style={styles.dropdown}>
                        {userId == item.contentReviews?.userDto?.id && <div style={styles.dropdownItem} data-ignore-outside-click="true" onClick={() => handleEdit(item.imdbId)}>Edit</div>}
                        {userId == item.contentReviews?.userDto?.id && <div style={styles.dropdownItem} data-ignore-outside-click="true" onClick={() => handleReviewDelete(item.id)}>Delete</div>}
                        <div style={styles.dropdownItem} data-ignore-outside-click="true" onClick={() => handleReview(item.id)}>View Review</div>
                      </div>
                    )}
                  </div>

                  <span onClick={() => handleReview(item.id)} style={{ cursor: 'pointer' }}>
                    <h2 style={styles.title}>{item.contentName}</h2>
                  </span>
                  <p><strong>Review:</strong> {item.contentReviews?.review}</p>
                  <p>
                    <strong>Reviewer:</strong>{' '}
                    <span
                      onClick={() => handleReplyUser(item.contentReviews?.userDto?.id)}
                      style={styles.reviewer}
                    >
                      {item.contentReviews?.userDto?.name}
                    </span>
                  </p>
                  <Likes
                    item={item.contentReviews}
                    onLike={() => handleLiked(item.id)}
                    id={userId}
                    onDisLike={() => handleDisLiked(item.id)}
                  />
                  <p style={styles.rating}>⭐ <strong>{item.rating}/10</strong></p>
                </div>
              </div>
            ))
          ) : (
            <h1>No reviews found at this time</h1>
          )}
        </div>}
    </div>

  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#141414',
    color: '#fff',
  },
  heading: {
    color: '#e50914', // Netflix red
    marginBottom: '20px',
  },
  card: {
    display: 'flex',
    backgroundColor: '#222',
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    position: 'relative',
  },
  poster: {
    width: '120px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginRight: '20px',
    transition: 'transform 0.3s ease',
  },
  details: {
    flex: 1,
    position: 'relative',
  },
  dotsButton: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: '4px 8px',
    color: '#fff',
  },
  dropdown: {
    position: 'absolute',
    top: '25px',
    right: '0',
    backgroundColor: '#333',
    border: '1px solid #444',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
    zIndex: 1000,
    minWidth: '120px',
    animation: 'fadeIn 0.3s ease',
  },
  dropdownItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #444',
    color: '#fff',
  },
  title: {
    color: '#e5e5e5',
  },
  reviewer: {
    cursor: 'pointer',
    color: '#e50914',
    fontWeight: 'bold',
  },
  rating: {
    marginTop: '10px',
    color: '#e5e5e5',
  },
};

export default Reviews;
