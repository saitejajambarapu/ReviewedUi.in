// Home.jsx
import React from 'react';
import { FaHeart, FaThumbsUp, FaStar } from 'react-icons/fa';

// Dummy Data
const trending = [
  { id: 1, title: "The Dark Knight", poster: "https://via.placeholder.com/300x450?text=Dark+Knight", likes: 120 },
  { id: 2, title: "Inception", poster: "https://via.placeholder.com/300x450?text=Inception", likes: 95 },
  { id: 3, title: "Interstellar", poster: "https://via.placeholder.com/300x450?text=Interstellar", likes: 110 },
  { id: 4, title: "Joker", poster: "https://via.placeholder.com/300x450?text=Joker", likes: 85 },
  { id: 5, title: "The Batman", poster: "https://via.placeholder.com/300x450?text=The+Batman", likes: 102 },
  { id: 6, title: "Avatar: The Way of Water", poster: "https://via.placeholder.com/300x450?text=Avatar+2", likes: 89 },
];

const topRated = [
  { id: 7, title: "Parasite", poster: "https://via.placeholder.com/300x450?text=Parasite", rating: 4.9 },
  { id: 8, title: "Avengers: Endgame", poster: "https://via.placeholder.com/300x450?text=Endgame", rating: 4.8 },
  { id: 9, title: "The Matrix", poster: "https://via.placeholder.com/300x450?text=Matrix", rating: 4.7 },
  { id: 10, title: "Pulp Fiction", poster: "https://via.placeholder.com/300x450?text=Pulp+Fiction", rating: 4.8 },
  { id: 11, title: "Fight Club", poster: "https://via.placeholder.com/300x450?text=Fight+Club", rating: 4.9 },
  { id: 12, title: "The Shawshank Redemption", poster: "https://via.placeholder.com/300x450?text=Shawshank", rating: 5 },
];

const recentlyAdded = [
  { id: 13, title: "Dune", poster: "https://via.placeholder.com/300x450?text=Dune" },
  { id: 14, title: "No Time to Die", poster: "https://via.placeholder.com/300x450?text=No+Time+to+Die" },
  { id: 15, title: "Soul", poster: "https://via.placeholder.com/300x450?text=Soul" },
  { id: 16, title: "Encanto", poster: "https://via.placeholder.com/300x450?text=Encanto" },
  { id: 17, title: "Spider-Man: No Way Home", poster: "https://via.placeholder.com/300x450?text=Spiderman" },
  { id: 18, title: "The Fabelmans", poster: "https://via.placeholder.com/300x450?text=Fabelmans" },
];

const upcoming = [
  { id: 19, title: "Guardians of the Galaxy Vol. 3", poster: "https://via.placeholder.com/300x450?text=Guardians+3" },
  { id: 20, title: "Oppenheimer", poster: "https://via.placeholder.com/300x450?text=Oppenheimer" },
  { id: 21, title: "Mission Impossible 8", poster: "https://via.placeholder.com/300x450?text=MI+8" },
  { id: 22, title: "Barbie", poster: "https://via.placeholder.com/300x450?text=Barbie" },
];

// Card Component
const Card = ({ item, showLikes = false, showRating = false }) => (
  <div style={styles.card}>
    <img src={item.poster} alt={item.title} style={styles.poster} />
    <div style={styles.cardContent}>
      <h4 style={styles.title}>{item.title}</h4>
      <div style={styles.stats}>
        {showLikes && <span style={styles.stat}><FaThumbsUp /> {item.likes}</span>}
        {showRating && <span style={styles.stat}><FaStar /> {item.rating}</span>}
      </div>
    </div>
  </div>
);

// Horizontal Scroll Section
const HorizontalScroll = ({ title, data, showLikes = false, showRating = false }) => (
  <div style={{ marginBottom: '50px' }}>
    <h2 style={styles.sectionTitle}>{title}</h2>
    <div style={styles.scrollContainer}>
      {data?.map(item => <Card key={item.id} item={item} showLikes={showLikes} showRating={showRating} />)}
    </div>
  </div>
);

// Home Page Component
const Home = () => {
  return (
    <div style={styles.page}>
      <h1 style={styles.pageTitle}>Welcome to CineVerse</h1>
      <HorizontalScroll title="Trending 🔥" data={trending} showLikes={true} />
      <HorizontalScroll title="Top Rated ⭐" data={topRated} showRating={true} />
      <HorizontalScroll title="Recently Added 🎬" data={recentlyAdded} />
      <HorizontalScroll title="Upcoming 🌟" data={upcoming} />
    </div>
  );
};

// Styles
const styles = {
  page: {
    padding: '30px 50px',
    backgroundColor: '#0d0d0d',
    minHeight: '100vh',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
  },
  pageTitle: {
    color: '#e50914',
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '40px',
    textShadow: '2px 2px 8px rgba(0,0,0,0.7)',
  },
  card: {
    position: 'relative',
    minWidth: '220px',
    maxWidth: '220px',
    marginRight: '15px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    backgroundColor: '#181818',
    transition: 'transform 0.3s, box-shadow 0.3s',
    boxShadow: '0 6px 15px rgba(0,0,0,0.7)',
  },
  poster: {
    width: '100%',
    height: '330px',
    objectFit: 'cover',
    transition: 'transform 0.3s',
  },
  cardContent: {
    padding: '12px',
    color: '#fff',
  },
  title: {
    margin: '5px 0',
    fontWeight: '700',
    fontSize: '1rem',
    color: '#e50914',
  },
  stats: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '12px',
    marginTop: '8px',
    fontSize: '0.85rem',
    color: '#ddd',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  sectionTitle: {
    color: '#e50914',
    fontSize: '1.8rem',
    marginBottom: '15px',
    fontWeight: '700',
    textShadow: '1px 1px 5px rgba(0,0,0,0.5)',
  },
  scrollContainer: {
    display: 'flex',
    overflowX: 'auto',
    paddingBottom: '15px',
    scrollbarWidth: 'none',
  },
};

export default Home;
