import React, { useEffect, useState, useRef } from 'react';
import api from '../service/api';
import AuthService from '../service/authService';
import Likes from './likes';
import { useNavigate } from 'react-router-dom';

const Reviews = () => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null); // For dropdown toggle
  const userId = AuthService.getUserId();
  console.log(userId, "chasdglkasdhgjkashsdak")

  const menuRefs = useRef({});

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("reviews");
        console.log('Success:', response.data);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Unable to fetch the Reviews.');
      }
    };

    fetchReviews();
  }, []);

  // Close dropdown when clicking outside
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
    console.log('Success:', response.data);
    
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
    const userId = AuthService.getUserId();
    const hasUserDisLiked = reviewData.find(review => review.id === id)
      ?.disLiked?.some(user => user.id === Number(userId));
    if (hasUserDisLiked) {
      handleDisLiked(id);
    }
    const likedData = await api.post(`reviews/like/${id}`);
    setReviewData(prevData =>
      prevData.map(item => {
        if (item.id === id) {
          return {
            ...item,
            contentReviews: {
              ...item.contentReviews,
              likes: likedData.data.length,
            }, isLiked: likedData.data,
          };
        }
        return item;
      })
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
      prevData.map(item => {
        if (item.id === id) {
          return {
            ...item,
            contentReviews: {
              ...item.contentReviews,
              dislikes: dislikedData.data.length,
            }, disLiked: dislikedData.data,
          };
        }
        return item;
      })
    );
  };

  const handleReview = async (id) => {
    debugger
    navigate(`/review/${id}`);
  };

  const handleReplyUser = async (id) => {
    navigate(`/Profile/${id}`);
  };

  const handleEdit = (id) => {
    alert(`Edit review ${id}`);
    setMenuOpenId(null);
  };

  const handleDelete = (id) => {
    alert(`Delete review ${id}`);
    setMenuOpenId(null);
  };

  return (
    <div style={styles.container}>
      <h1>Reviews</h1>
      {reviewData.length > 0 && reviewData.map((item) => (
        <div key={item.id} style={styles.card}>
          <img
            onClick={() => handleReview(item.id)}
            src={item.contentPoster}
            alt={item.contentName}
            style={{ ...styles.poster, cursor: 'pointer' }}
          />
          <div style={styles.details}>
            {/* 3-dot menu */}
            <div
              ref={el => menuRefs.current[item.id] = el}
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
                  {userId == item.contentReviews?.userDto?.id && <div style={styles.dropdownItem} onClick={() => handleEdit(item.id)}>Edit</div>}
                  {userId == item.contentReviews?.userDto?.id && <div style={styles.dropdownItem} data-ignore-outside-click="true" onClick={() => handleReviewDelete(item.id)}>Delete</div>}
                  <div style={styles.dropdownItem} data-ignore-outside-click="true" onClick={() => handleReview(item.id)}>View Review</div>
                </div>
              )}
            </div>

            <span onClick={() => handleReview(item.id)} style={{ cursor: 'pointer' }}>
              <h2>{item.contentName}</h2>
            </span>
            <p><strong>Review:</strong> {item.contentReviews?.review}</p>
            <p>
              <strong>Reviewer:</strong>{' '}
              <span
                onClick={() => handleReplyUser(item.contentReviews?.userDto?.id)}
                style={{ cursor: 'pointer' }}
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
            <p>⭐ <strong>{item.rating}/10</strong></p>
          </div>
        </div>
      ))}

      {reviewData.length === 0 && <h1>No reviews found at this time</h1>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
  },
  card: {
    display: 'flex',
    backgroundColor: '#fff',
    marginBottom: '20px',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    position: 'relative',
  },
  poster: {
    width: '120px',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '5px',
    marginRight: '20px',
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
  },
  dropdown: {
    position: 'absolute',
    top: '25px',
    right: '0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    zIndex: 1000,
    minWidth: '100px',
  },
  dropdownItem: {
    padding: '10px',
    cursor: 'pointer',
    borderBottom: '1px solid #f0f0f0',
  },
};

export default Reviews;
