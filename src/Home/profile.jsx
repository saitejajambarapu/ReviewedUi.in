import React, { useEffect, useState } from 'react';
import { FaHeart, FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
import api from '../service/api';
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from '../service/authService';

const Card = ({ item, showHeart = false }) => {
  const commentsCount = item.reviewReplies?.length || 0;
  const navigate = useNavigate();
  const userId = AuthService.getUserId();

  const handlePost = () => {
    if(item.contentReviews) {
      navigate(`/review/${item.contentReviews.id}`);
    } else {
      alert('No review found!');
    }
  }

  return (
    <div style={{
      position: 'relative',
      minWidth: '200px',
      maxWidth: '200px',
      marginRight: '10px',
      borderRadius: '10px',
      overflow: 'hidden',
      cursor: 'pointer',
      backgroundColor: '#222',
      transition: 'transform 0.3s, box-shadow 0.3s',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
    }}
      onClick={handlePost}
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.7)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.5)' }}
    >
      <img src={item.contentPoster} alt={item.contentName} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
      <div style={{ padding: '10px', color: '#fff' }}>
        <h4 style={{ margin: '5px 0', fontWeight: '700', fontSize: '1rem', color: '#ff0000' }}>{item.contentName}</h4>
        <p style={{ fontSize: '0.85rem', height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.contentReviews?.review}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.85rem', color: '#ddd' }}>
          <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><FaThumbsUp /> {item.contentReviews?.likes || 0}</span>
          <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><FaThumbsDown /> {item.contentReviews?.dislikes || 0}</span>
          <span style={{ display:'flex', alignItems:'center', gap:'4px' }}><FaComment /> {commentsCount}</span>
        </div>
        {showHeart && <FaHeart style={{ position:'absolute', top:'10px', right:'10px', color:'red', fontSize:'1.2rem' }} />}
      </div>
    </div>
  );
};

const HorizontalScroll = ({ title, data, showHeart = false }) => (
  <div style={{ marginBottom: '30px' }}>
    <h2 style={{ color: '#ff0000', marginBottom: '10px', fontSize: '1.5rem' }}>{title}</h2>
    <div style={{
      display: 'flex',
      overflowX: 'auto',
      paddingBottom: '10px',
      scrollbarWidth: 'none',
    }}>
      {data?.map(item => <Card key={item.id} item={item} showHeart={showHeart} />)}
    </div>
  </div>
);

const Profile = () => {
  let { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  let userId = AuthService.getUserId();

  if(!id) id = userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get(`myprofile/${id}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Unable to fetch the profile.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading) return <div style={{ color:'#fff', textAlign:'center', marginTop:'50px' }}>Loading...</div>;
  if (!profileData) return <div style={{ color:'#fff', textAlign:'center', marginTop:'50px' }}>No data available</div>;

  // Stats
  const totalReviews = profileData.reviewpage?.length || 0;
  const totalLiked = profileData.likedList?.length || 0;
  const totalWatched = profileData.watchedList?.length || 0;

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#111',
      minHeight:'100vh',
      fontFamily:'Arial, sans-serif',
      color:'#fff'
    }}>

      {/* User Info Card */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '30px',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        maxWidth: '900px',
        margin: '0 auto 40px',
        display: 'flex',
        gap: '30px',
        alignItems: 'center'
      }}>
        <img 
          src={profileData.user.profilePicture || 'https://via.placeholder.com/150'} 
          alt={profileData.user.name} 
          style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '4px solid #ff0000'
          }}
        />
        <div style={{ flex: 1 }}>
          <h1 style={{ color:'#ff0000', fontSize:'2.5rem', margin:'0 0 10px 0' }}>{profileData.user.name}</h1>
          <p style={{ color:'#ddd', fontSize:'1.1rem', margin:'0 0 20px 0' }}><strong>Email:</strong> {profileData.user.email}</p>

          {/* Stats */}
          <div style={{ display:'flex', gap:'30px' }}>
            <div style={{ textAlign:'center' }}>
              <h2 style={{ margin:0, color:'#ffcc00' }}>{totalReviews}</h2>
              <p style={{ margin:0, color:'#fff' }}>Reviews</p>
            </div>
            <div style={{ textAlign:'center' }}>
              <h2 style={{ margin:0, color:'#ffcc00' }}>{totalLiked}</h2>
              <p style={{ margin:0, color:'#fff' }}>Liked</p>
            </div>
            <div style={{ textAlign:'center' }}>
              <h2 style={{ margin:0, color:'#ffcc00' }}>{totalWatched}</h2>
              <p style={{ margin:0, color:'#fff' }}>Watchlist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Sections */}
      <HorizontalScroll title="Your Reviews" data={profileData.reviewpage} />
      <HorizontalScroll title="Liked List ❤️" data={profileData.likedList} showHeart={true} />
      <HorizontalScroll title="Watchlist 👀" data={profileData.watchedList} showHeart={true} />
    </div>
  );
};

export default Profile;
