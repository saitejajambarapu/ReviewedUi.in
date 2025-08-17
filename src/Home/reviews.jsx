import React, { useEffect, useState } from 'react';
import api from '../service/api';
import AuthService from '../service/authService';
import Likes from './likes';
import { useNavigate } from 'react-router-dom';

const Reviews = () => {
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState([]);
  const userId = AuthService.getUserId();
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

  const handleLiked = async (id) => {
    const userId = AuthService.getUserId();
    const hasUserDisLiked = reviewData.find(review => review.id === id)
  ?.disLiked?.some(user => user.id === Number(userId));
  if(hasUserDisLiked){
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

  }

  const handleDisLiked = async (id) => {
    const hasUserLiked = reviewData.find(review => review.id === id)
  ?.isLiked?.some(user => user.id === Number(userId));
  if(hasUserLiked){
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

  }

  const handleReview = async (id) => {
    navigate(`/review/${id}`);

  }
  const handleReplyUser = async (id) => {
    navigate(`/Profile/${id}`);

  }


  return (
    <div style={styles.container} >
      <h1>Reviews</h1>
      {reviewData.length>0 &&reviewData.map((item) => (
        <div key={item.id} style={styles.card}>
          <img onClick={() => handleReview(item.id)}
            src={item.contentPoster}
            alt={item.contentName}
            style={{ ...styles.poster, cursor: 'pointer' }}
          />
          <div style={styles.details}>
            <span onClick={() => handleReview(item.id)} style={{ cursor: 'pointer' }}><h2>{item.contentName}</h2></span>
            <p>
              <strong>Review:</strong> {item.contentReviews?.review}
            </p>
            <p>
             <strong>Reviewer:</strong> <span onClick={() => handleReplyUser(item.contentReviews?.userDto?.id)} style={{ cursor: 'pointer' }}>{item.contentReviews?.userDto?.name}</span>
            </p>
            <Likes item={item.contentReviews} onLike={() => handleLiked(item.id)} id={userId} onDisLike={() => handleDisLiked(item.id)} />
            <p>
              ⭐ <strong>{item.rating}/10</strong>
            </p>
          </div>
        </div>
      ))}{reviewData.length===0 && <h1>No reviews found at this time</h1>}
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
  },
};

export default Reviews;
