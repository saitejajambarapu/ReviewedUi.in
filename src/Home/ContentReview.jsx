import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../service/api';
import AuthService from '../service/authService';
import { Popover, Typography, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import Card from './card';

const ContentReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setReviewData] = useState(null);
  const userId = AuthService.getUserId();

  const [anchorLikes, setAnchorLikes] = useState(null);
  const [anchorDislikes, setAnchorDislikes] = useState(null);
  const likesTimeout = useRef(null);
  const dislikesTimeout = useRef(null);

  const [replyText, setReplyText] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loadingReply, setLoadingReply] = useState({});
  const [loading, setLoading] = useState(false);

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

  const handleLikesEnter = (event) => {
    if (likesTimeout.current) clearTimeout(likesTimeout.current);
    setAnchorLikes(event.currentTarget);
  };
  const handleLikesLeave = () => {
    likesTimeout.current = setTimeout(() => setAnchorLikes(null), 300);
  };

  const handleDislikesEnter = (event) => {
    if (dislikesTimeout.current) clearTimeout(dislikesTimeout.current);
    setAnchorDislikes(event.currentTarget);
  };
  const handleDislikesLeave = () => {
    dislikesTimeout.current = setTimeout(() => setAnchorDislikes(null), 300);
  };

  const handleAddReply = async (id, contentId, commentId) => {
    const reply = replyText[commentId];
    if (!reply?.trim()) { alert('Enter a reply'); return; }

    setLoadingReply(prev => ({ ...prev, [commentId]: true }));
    try {
      const response = await api.post(`reviews/reviewcoment/${id}/${contentId}/${commentId}`, reply, { headers: { 'Content-Type': 'text/plain' } });

      setReviewData(prev => ({
        ...prev,
        reviewReplies: prev.reviewReplies.map(item => item.commentReply.id === commentId ? { ...item, replies: [...(item.replies || []), response.data] } : item)
      }));
      setReplyText(prev => ({ ...prev, [commentId]: '' }));
    } catch (error) { alert('Failed to add reply'); }
    setLoadingReply(prev => ({ ...prev, [commentId]: false }));
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) { alert('Enter a comment'); return; }
    setLoading(true);
    try {
      const response = await api.post(`reviews/reviewcoment/${id}`, newComment, { headers: { 'Content-Type': 'text/plain' } });
      setReviewData(response.data);
      setNewComment('');
    } catch (error) { alert('Failed to add comment'); }
    setLoading(false);
  };

  const handleContent = (id) => navigate(`/Profile/${id}`);

  const handleContentNavigation = (id) => navigate(`/search/${id}`);

  const handleCommentDelete = async (id) => {
    const res = await api.delete(`reviews/deletereviewcomment/${id}`);
    if (res.data) setReviewData(prev => ({ ...prev, reviewReplies: prev.reviewReplies.filter(r => r?.commentReply.id !== id) }));
    else alert("Delete failed");
  };

  const handleCommentReplyDelete = async (commentId, id) => {
    const res = await api.delete(`reviews/deletereviewcomment/${id}`);
    if (res.data) setReviewData(prev => ({ ...prev, reviewReplies: prev.reviewReplies.map(r => r.commentReply.id === commentId ? { ...r, replies: r.replies.filter(rep => rep.commentedBy.id !== id) } : r) }));
    else alert("Delete failed");
  };

  return (
    <div style={{ maxWidth: "900px", margin: "20px auto", fontFamily: "Arial, sans-serif", backgroundColor: '#1e1e1e', color: '#e0e0e0', padding: '20px', borderRadius: '12px', boxShadow: '0 6px 12px rgba(0,0,0,0.5)' }}>

      <div onMouseEnter={handleLikesLeave} style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: '0 0 40%', maxWidth: '360px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.7)' }}>
          <img onClick={() => handleContentNavigation(data.imdbId)} src={data.contentPoster} alt={data.contentName} style={{ width: '100%', height: 'auto', cursor: 'pointer' }} onError={(e) => { e.target.onerror = null; e.target.src = 'https://www.omdbapi.com/src/poster.jpg'; }} />
        </div>

        <div style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
          <h2 onClick={() => handleContentNavigation(data.imdbId)} style={{ marginTop: 0, marginBottom: '10px', fontWeight: '700', color: '#ffcc00', cursor: 'pointer' }}>{data.contentName}</h2>

          <div style={{ backgroundColor: '#2c2c2c', padding: '15px', borderRadius: '10px', marginBottom: '15px', boxShadow: 'inset 0 0 10px rgba(255,204,0,0.1)' }}>
            <div style={{ marginBottom: '10px' }}>
              {data.likedList && <button style={{ backgroundColor: '#0d6efd', color: '#fff', border: 'none', padding: '6px 12px', marginRight: 10, cursor: 'pointer', borderRadius: 6 }}>Liked</button>}
              {data.watchList && <button style={{ backgroundColor: '#198754', color: '#fff', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: 6 }}>Watched</button>}
            </div>

            <h3 style={{ color: '#ffcc00', marginTop: 0 }}>Review</h3>
            <p><strong onClick={() => handleContent(data.contentReviews?.userDto?.id)} style={{ cursor: 'pointer', color: '#ffcc00', transition: '0.2s', ":hover": { color: '#fff' } }}>{data.contentReviews?.userDto?.name}:</strong> {data.contentReviews?.review}</p>

            <div style={{ display: "flex", gap: "20px" }}>
              {/* Likes */}
              <p
                style={{ cursor: "pointer", color: "#4caf50", fontWeight: '600' }}
                onMouseEnter={handleLikesEnter}
                
              >
                👍 Likes: {data.isLiked?.length || 0}
              </p>
              {data.isLiked?.length > 0 &&
                <Popover
                  open={Boolean(anchorLikes)}
                  anchorEl={anchorLikes}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  PaperProps={{
                    sx: { maxHeight: 200, overflow: 'auto', p: 1, backgroundColor: '#333', color: '#fff' }
                  }}
                ><div onMouseLeave={handleLikesLeave}>
                    <Typography variant="subtitle1" sx={{ p: 1, color: '#ffcc00' }}>Liked by:</Typography>
                    <List dense>
                      {data.isLiked?.map((u, i) => (
                        <ListItem key={i} onClick={() => handleContent(u.id)} style={{ cursor: 'pointer' }}>
                          <ListItemText primary={u.name} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Popover>
              }


              {/* Dislikes */}
              <p
                style={{ cursor: "pointer", color: "#f44336", fontWeight: '600' }}
                onMouseEnter={handleDislikesEnter}
              // onMouseLeave={handleDislikesLeave}
              >
                👎 Dislikes: {data.disLiked?.length || 0}
              </p>
              {data.disLiked?.length > 0 &&
                <Popover
                  open={Boolean(anchorDislikes)}
                  anchorEl={anchorDislikes}
                  anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  PaperProps={{
                    sx: { maxHeight: 200, overflow: 'auto', p: 1, backgroundColor: '#333', color: '#fff' }
                  }}
                ><div onMouseLeave={handleDislikesLeave}>
                    <Typography variant="subtitle1" sx={{ p: 1, color: '#ffcc00' }}>Disliked by:</Typography>
                    <List dense>
                      {data.disLiked?.map((u, i) => (
                        <ListItem key={i} onClick={() => handleContent(u.id)} style={{ cursor: 'pointer' }}>
                          <ListItemText primary={u.name} />
                        </ListItem>
                      ))}
                    </List>
                  </div>
                </Popover>
              }

            </div>

            <p style={{ fontWeight: '600' }}>⭐ Rating: {data.rating}</p>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: '#2c2c2c', padding: '15px', borderRadius: '10px', marginBottom: '15px', boxShadow: 'inset 0 0 10px rgba(255,204,0,0.1)' }}>
        <div style={{ marginTop: 'auto' }}>
          <h4 style={{ color: '#ffcc00', marginBottom: '10px' }}>Replies</h4>
          {data.reviewReplies?.map(item => (
            <div key={item.commentReply.id} style={{ backgroundColor: '#2a2a2a', padding: '12px', borderRadius: '10px', marginBottom: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                {/* Left side: Username + reply */}
                <p style={{ margin: 0, flex: 1 }}>
                  <strong
                    onClick={() => handleContent(item.commentReply.userDto?.id)}
                    style={{ cursor: 'pointer', color: '#ffcc00' }}
                  >
                    {item.commentReply.userDto?.name}:
                  </strong>
                  {item.commentReply.reply}
                </p>

                {/* Right side: Delete button (only if the user owns the comment) */}
                {item.commentReply.userDto.id == userId && (
                  <Button
                    size="small"
                    color="error"
                    variant="contained"
                    onClick={() => handleCommentDelete(item.commentReply.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>

              <small style={{ color: '#aaa' }}>{new Date(item.commentReply.createdAt).toLocaleString()}</small>

              {item.replies?.map(reply => (
                <div key={reply.id} style={{ backgroundColor: '#333', marginLeft: '20px', padding: '8px', borderRadius: '8px', marginTop: '6px' }}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px'}}>
                     <p><strong onClick={() => handleContent(reply.commentedBy.repliedUser?.id)} style={{ cursor: 'pointer', color: '#ffcc00' }}>{reply.commentedBy.repliedUser?.name}:</strong> {reply.commentedBy.reply}</p>
                  {userId == reply.commentedBy.repliedUser?.id && <Button size="small" color="red" variant="contained" onClick={() => handleCommentReplyDelete(item.commentReply.id, reply.commentedBy.id)}>Delete</Button>}
                  </div>
                 <small style={{ color: '#aaa' }}>{new Date(reply.commentedBy.updatedAt).toLocaleString()}</small>
                </div>
              ))}

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                <TextField label="Reply" variant="outlined" size="small" fullWidth value={replyText[item.commentReply.id] || ''} onChange={e => setReplyText(prev => ({ ...prev, [item.commentReply.id]: e.target.value }))} InputProps={{ style: { color: '#e0e0e0' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
                <Button size="small" variant="contained" color="primary" onClick={() => handleAddReply(data.id, data.contentId, item.commentReply.id)} disabled={loadingReply[item.commentReply.id]}>{loadingReply[item.commentReply.id] ? '...' : 'Send'}</Button>
              </div>
            </div>
          ))}

          {data.reviewReplies?.length === 0 && <p>No replies yet.</p>}
        </div>

        <div style={{ marginTop: 20 }}>
          <TextField label="Add a comment" multiline rows={3} fullWidth value={newComment} onChange={e => setNewComment(e.target.value)} variant="outlined" InputProps={{ style: { color: '#e0e0e0' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
          <Button variant="contained" color="primary" onClick={handleAddComment} sx={{ mt: 1 }}>{loading ? 'Submitting...' : 'Submit Comment'}</Button>
        </div>
      </div>
      <div style={{ marginBottom: '30px' }}>
    <h2 style={{ color: '#ff0000', marginBottom: '10px', fontSize: '1.5rem' }}>similarReviews</h2>
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      paddingBottom: '10px',
      scrollbarWidth: 'none',
    }}>
      {data.similarReviews?.map(item => <Card key={item.id} item={item} showHeart={false} />)}
    </div>
  </div>
    </div>
  );
};

export default ContentReview;
