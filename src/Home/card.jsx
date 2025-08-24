import { FaHeart, FaThumbsUp, FaThumbsDown, FaComment } from 'react-icons/fa';
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

export default Card;