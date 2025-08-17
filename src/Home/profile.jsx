import React, { useEffect, useState } from 'react';
import { FaHeart, FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
import api from '../service/api';
import { useNavigate,useParams } from 'react-router-dom';
import AuthService from '../service/authService';

const Card = ({ item, showHeart = false }) => {
  const commentsCount = item.reviewReplies?.length || 0;
  const navigate = useNavigate();
  const userId = AuthService.getUserId;
   const handlePost = async (item) => {
    if(item.contentReviews!=null){
        navigate(`/review/${item.contentReviews.id}`);
    }else{
        alert('no review found !')
    }
  }

  return (
    <div className="card">
      <img src={item.contentPoster} alt={item.contentName} />
      <div className="content">
        <span onClick={() => handlePost(item)} style={{ cursor: 'pointer' }}><h3>{item.contentName}</h3></span>
        <p>{item.contentReviews?.review}</p>
        <div className="icons">
          <span><FaThumbsUp /> {item.contentReviews?.likes}</span>
          <span><FaThumbsDown /> {item.contentReviews?.dislikes}</span>
          <span><FaComment /> {commentsCount}</span>
          {showHeart && <span className="heart"><FaHeart /></span>}
        </div>
      </div>
    </div>
  );
};

const HorizontalScroll = ({ title, data, showHeart = false }) => (
  <div className="section">
    <h2>{title}</h2>
    <div className="scroll-container">
      {data?.map(item => (
        <Card key={item.id} item={item} showHeart={showHeart} />
      ))}
    </div>
  </div>
);

const Profile = () => {
  var { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
   var userId = AuthService.getUserId();
   debugger
   if(id===undefined){
    id = userId;
   }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        debugger
        const response = await api.get(`myprofile/${id}`); 
        console.log('Success:', response.data);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        alert('Unable to fetch the Reviews.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!profileData) return <div>No data available</div>;

  return (
    <div className="dashboard">
      {/* User Info */}
      <section className="user-info">
        <h1>User Info</h1>
        <p><strong>Name:</strong> {profileData.user.name}</p>
        <p><strong>Email:</strong> {profileData.user.email}</p>
        <p><strong>Role:</strong> {profileData.user.roles.join(', ')}</p>
      </section>

      {/* Review Section */}
      <HorizontalScroll title="Your Reviews" data={profileData.reviewpage} />

      {/* Liked Section */}
      <HorizontalScroll title="Liked List ❤️" data={profileData.likedList} showHeart={true} />

      {/* Watchlist Section */}
      <HorizontalScroll title="Watchlist 👀" data={profileData.watchedList} showHeart={true} />
    </div>
  );
};

export default Profile;
