import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/api';
import AuthService from '../service/authService';

import { Popover, Typography, List, ListItem, ListItemText, Button, TextField } from '@mui/material';

const ContentReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setReviewData] = useState(null);
  const userId = AuthService.getUserId();

  // Popover state
  const [anchorLikes, setAnchorLikes] = useState(null);
  const [anchorDislikes, setAnchorDislikes] = useState(null);
  const [replyText, setReplyText] = useState({});


  // Comment input state
  const [newComment, setNewComment] = useState('');
 const [loadingReply, setLoadingReply] = useState({});
  const [loading, setLoading] = useState(false);


  // Timer references
  let closeLikesTimeout = null;
  let closeDislikesTimeout = null;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(`reviews/${id}`);
        setReviewData(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Unable to fetch the Reviews.');
      }
    };
    fetchReviews();
  }, [id]);

  if (!data) return <div>Loading...</div>;

  // Handlers for likes
  const handleLikesEnter = (event) => {
    clearTimeout(closeLikesTimeout);
    setAnchorLikes(event.currentTarget);
  };

  const handleLikesLeave = () => {
    closeLikesTimeout = setTimeout(() => setAnchorLikes(null), 200);
  };

  // Handlers for dislikes
  const handleDislikesEnter = (event) => {
    clearTimeout(closeDislikesTimeout);
    setAnchorDislikes(event.currentTarget);
  };

  const handleDislikesLeave = () => {
    closeDislikesTimeout = setTimeout(() => setAnchorDislikes(null), 200);
  };

  const handleAddReply = async (id, contentId, commentId) => {
    const reply = replyText[commentId];

    if (!reply || !reply.trim()) {
      alert('Please enter a comment.');
      return;
    }

    setLoadingReply(prev => ({ ...prev, [commentId]: true }));
    try {
      const response = await api.post(
        `reviews/reviewcoment/${id}/${contentId}/${commentId}`,
        reply,
        {
          headers: {
            'Content-Type': 'text/plain',
          },
        }
      );

      setReviewData(prevData => {
        if (!prevData) return prevData;

        const updatedReviewReplies = prevData.reviewReplies.map(item => {
          if (item.commentReply.id === commentId) {
            return {
              ...item,
              replies: [...(item.replies || []), response.data],
            };
          }
          return item;
        });

        return {
          ...prevData,
          reviewReplies: updatedReviewReplies,
        };
      });

      // Clear only the reply for the submitted comment
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
    setLoadingReply(prev => ({ ...prev, [commentId]: false }));
  };


  // Handler for comment submit
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Please enter a comment.');
      return;
    }
    setLoading(true);
    try {
      const response = await api.post(`reviews/reviewcoment/${id}`, newComment, {
        headers: {
          'Content-Type': 'text/plain'
        }
      });

      setReviewData(response.data);
      console.log(response.data)
      setNewComment('');

    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment.');
    }
    setLoading(false);
  };
  const handleContent = async (id) => {
    navigate(`/Profile/${id}`);

  }

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h2>{data.contentName}</h2>
      <img src={data.contentPoster} alt={data.contentName} style={{ width: "100%", borderRadius: "8px" }}  onError={(e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = 'https://www.omdbapi.com/src/poster.jpg'; // replace with fallback image
  }}/>
      <div style={{ marginTop: "20px", backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
        <div>
          {
            data.likedList &&
            <button
              style={{
                backgroundColor: data.likedList ? '#0d6efd' : '#eee',
                color: data.likedList ? '#fff' : '#000',
                border: 'none',
                padding: '8px 12px',
                marginRight: 10,
                cursor: 'pointer',
                borderRadius: 4,
              }}
            >
              {data.likedList ? 'Liked' : 'Like'}
            </button>
          }

          {data.watchList && <button
            style={{
              backgroundColor: data.watchList ? '#198754' : '#eee',
              color: data.watchList ? '#fff' : '#000',
              border: 'none',
              padding: '8px 12px',
              cursor: 'pointer',
              borderRadius: 4,
            }}
          >
            {data.watchList ? 'Watched' : 'Watch'}
          </button>}

        </div>
        <h3>Review</h3>
        <p><strong onClick={() => handleContent(data.contentReviews?.userDto?.id)} style={{ cursor: 'pointer' }}>{data.contentReviews?.userDto?.name}:</strong> {data.contentReviews?.review}</p>

        {/* 👍 Likes */}
        <p
          style={{ cursor: "pointer", color: "blue" }}
          onMouseEnter={handleLikesEnter}
          onMouseLeave={handleLikesLeave}
        >
          👍 Likes: {data.isLiked?.length || 0}
        </p>

        <Popover
          open={Boolean(anchorLikes)}
          anchorEl={anchorLikes}
          onClose={() => setAnchorLikes(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onMouseEnter={handleLikesEnter}
          onMouseLeave={handleLikesLeave}
          PaperProps={{ sx: { maxHeight: 200, overflow: 'auto', p: 1 } }}
        >
          <Typography variant="subtitle1" sx={{ p: 1 }}>Liked by:</Typography>
          <List dense>
            {data.isLiked?.map((user, idx) => (
              <ListItem onClick={() => handleContent(user.id)} style={{ cursor: 'pointer' }} key={idx}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </Popover>

        {/* 👎 Dislikes */}
        <p
          style={{ cursor: "pointer", color: "red" }}
          onMouseEnter={handleDislikesEnter}
          onMouseLeave={handleDislikesLeave}
        >
          👎 Dislikes: {data.disLiked?.length || 0}
        </p>

        <Popover
          open={Boolean(anchorDislikes)}
          anchorEl={anchorDislikes}
          onClose={() => setAnchorDislikes(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          onMouseEnter={handleDislikesEnter}
          onMouseLeave={handleDislikesLeave}
          PaperProps={{ sx: { maxHeight: 200, overflow: 'auto', p: 1 } }}
        >
          <Typography variant="subtitle1" sx={{ p: 1 }}>Disliked by:</Typography>
          <List dense>
            {data.disLiked?.map((user, idx) => (
              <ListItem onClick={() => handleContent(user.id)} style={{ cursor: 'pointer' }} key={idx}>
                <ListItemText primary={user.name} />
              </ListItem>
            ))}
          </List>
        </Popover>

        <p>⭐ Rating: {data.rating}</p>
      </div>

      {/* Replies */}
      <div style={{ marginTop: "20px" }}>
        <h4>Replies</h4>
        {data.reviewReplies?.length > 0 ? (
          data.reviewReplies.map((item, idx) => (
            <div key={idx} style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
              <p>
                <strong onClick={() => handleContent(item.commentReply.userDto?.id)} style={{ cursor: 'pointer' }}>{item.commentReply.userDto?.name}:</strong> {item.commentReply.reply}
              </p>
              <small>{new Date(item.commentReply.createdAt).toLocaleString()}</small>
              {item.replies?.length > 0 && (
                <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                  <strong>Replies:</strong>
                  {item.replies.map((reply) => (
                    <div key={reply.id} style={{ marginTop: "5px" }}>
                      <p>
                        <strong onClick={() => handleContent(reply.commentedBy.repliedUser?.id)} style={{ cursor: 'pointer' }}>{reply.commentedBy.repliedUser?.name}:</strong> {reply.commentedBy.reply}
                      </p>
                      <small>{new Date(reply.commentedBy.updatedAt).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              )}
              <p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', maxWidth: '300px', height: '10px' }}>
                  <TextField
                    label="Reply"
                    variant="outlined"
                    size="small"
                    value={replyText[item.commentReply.id] || ''}
                    onChange={(e) =>
                      setReplyText(prev => ({
                        ...prev,
                        [item.commentReply.id]: e.target.value
                      }))
                    }
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleAddReply(data.id, data.contentId, item.commentReply.id)}
                    disabled={loadingReply[item.commentReply.id]}
                  >
                    {loading ? '...' : 'Send'}
                  </Button>
                </div>


              </p>

            </div>
          ))
        ) : (
          <p>No replies yet.</p>
        )}
      </div>



      {/* New comment input */}
      <div style={{ marginTop: 20 }}>
        <TextField
          label="Add a comment"
          multiline
          rows={4}
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddComment}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Submitting...' : 'Submit Comment'}
        </Button>
      </div>
    </div>
  );
};

export default ContentReview;
