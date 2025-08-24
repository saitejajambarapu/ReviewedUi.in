import React from 'react';
import { FaHeart, FaStar, FaFilm, FaClock } from 'react-icons/fa';

function About() {
  // Dummy stats
  const stats = [
    { icon: <FaFilm />, label: 'Movies Reviewed', value: 1200 },
    { icon: <FaStar />, label: 'Average Rating', value: '4.7/5' },
    { icon: <FaHeart />, label: 'Users Loved', value: 850 },
    { icon: <FaClock />, label: 'Hours Watched', value: 3200 },
  ];

  // Features list
  const features = [
    'Discover and review movies & shows',
    'Create personalized watchlists',
    'Like and comment on other users’ reviews',
    'Track your watch history and stats',
  ];

  return (
    <div style={{
      padding: '40px',
      backgroundColor: '#111',
      minHeight: '100vh',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Title */}
      <h1 style={{ color: '#e50914', fontSize: '3rem', textAlign: 'center', marginBottom: '20px' }}>
        About This Website
      </h1>

      {/* Description */}
      <p style={{ color: '#ddd', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto 40px', textAlign: 'center' }}>
        Welcome to CineVerse! Explore movies and TV shows, share reviews, rate your favorites, and connect with a community of film lovers. 
        Track your watch history, create watchlists, and discover what others are enjoying.
      </p>

      {/* Features */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginBottom: '50px' }}>
        {features.map((feature, idx) => (
          <div key={idx} style={{
            backgroundColor: '#1a1a1a',
            padding: '20px',
            borderRadius: '12px',
            minWidth: '250px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}>
            {feature}
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
        {stats.map((stat, idx) => (
          <div key={idx} style={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '12px',
            minWidth: '180px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', color: '#e50914', marginBottom: '10px' }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '1rem', color: '#ddd', marginTop: '5px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default About;
