import React, { useState, useEffect } from "react";

function About() {
  // Dummy data simulating API response
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const dummyData = {
      user: {
        name: "John Doe",
        email: "john.doe@example.com",
        avatar: "https://i.pravatar.cc/150?img=12",
      },
      reviewpage: [
        {
          id: 1,
          contentName: "Stranger Things",
          contentPoster: "https://m.media-amazon.com/images/I/81gUhiYg32L._AC_SL1500_.jpg",
          contentReviews: { review: "Amazing show, loved every episode!" },
        },
        {
          id: 2,
          contentName: "Breaking Bad",
          contentPoster: "https://m.media-amazon.com/images/I/51pdbdzmlkL._AC_.jpg",
          contentReviews: { review: "Masterpiece, every detail perfect." },
        },
        {
          id: 3,
          contentName: "The Witcher",
          contentPoster: "https://m.media-amazon.com/images/I/81Y7l3xWf-L._AC_SL1500_.jpg",
          contentReviews: { review: "Great fantasy series with awesome action." },
        },
      ],
      likedList: [
        {
          id: 4,
          contentName: "Inception",
          contentPoster: "https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg",
        },
        {
          id: 5,
          contentName: "Interstellar",
          contentPoster: "https://m.media-amazon.com/images/I/91kFYg4fX3L._AC_SL1500_.jpg",
        },
      ],
      watchedList: [
        {
          id: 6,
          contentName: "The Dark Knight",
          contentPoster: "https://m.media-amazon.com/images/I/51K8ouYrHeL._AC_.jpg",
        },
        {
          id: 7,
          contentName: "Joker",
          contentPoster: "https://m.media-amazon.com/images/I/71s84PfaH1L._AC_SL1111_.jpg",
        },
      ],
    };

    setProfileData(dummyData);
  }, []);

  if (!profileData) return <div style={styles.loading}>Loading...</div>;

  const totalReviews = profileData.reviewpage.length;
  const totalLiked = profileData.likedList.length;
  const totalWatched = profileData.watchedList.length;

  return (
    <div style={styles.page}>
      {/* User Info */}
      <div style={styles.profileContainer}>
        <img
          src={profileData.user.avatar}
          alt={profileData.user.name}
          style={styles.avatar}
        />
        <h1 style={styles.name}>{profileData.user.name}</h1>
        <p style={styles.email}>{profileData.user.email}</p>
      </div>

      {/* Summary Stats */}
      <div style={styles.statsContainer}>
        <div style={styles.statBox}>
          <h2>{totalReviews}</h2>
          <p>Reviews</p>
        </div>
        <div style={styles.statBox}>
          <h2>{totalLiked}</h2>
          <p>Liked List</p>
        </div>
        <div style={styles.statBox}>
          <h2>{totalWatched}</h2>
          <p>Watchlist</p>
        </div>
      </div>

      {/* Recent Reviews */}
      <div style={styles.reviewsContainer}>
        <h2 style={styles.sectionTitle}>Recent Reviews</h2>
        {profileData.reviewpage.length ? (
          profileData.reviewpage.map((item) => (
            <div key={item.id} style={styles.reviewCard}>
              <img
                src={item.contentPoster}
                alt={item.contentName}
                style={styles.reviewPoster}
              />
              <div>
                <h3 style={styles.reviewTitle}>{item.contentName}</h3>
                <p style={styles.reviewText}>{item.contentReviews.review}</p>
              </div>
            </div>
          ))
        ) : (
          <p style={styles.noReviews}>No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#111",
    color: "#fff",
    fontFamily: "'Arial', sans-serif",
  },
  loading: {
    color: "#fff",
    textAlign: "center",
    marginTop: "50px",
  },
  profileContainer: {
    textAlign: "center",
    marginBottom: "40px",
  },
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    marginBottom: "15px",
    border: "3px solid #e50914",
  },
  name: {
    fontSize: "2rem",
    color: "#e50914",
    marginBottom: "5px",
  },
  email: {
    fontSize: "1rem",
    color: "#fff",
  },
  statsContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginBottom: "40px",
  },
  statBox: {
    textAlign: "center",
  },
  reviewsContainer: {},
  sectionTitle: {
    color: "#e50914",
    marginBottom: "15px",
    fontSize: "1.5rem",
  },
  reviewCard: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    backgroundColor: "#222",
    padding: "10px",
    borderRadius: "10px",
  },
  reviewPoster: {
    width: "80px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  reviewTitle: {
    fontSize: "1rem",
    marginBottom: "5px",
    color: "#ffcc00",
  },
  reviewText: {
    fontSize: "0.9rem",
    color: "#ddd",
  },
  noReviews: {
    color: "#aaa",
  },
};

export default About;
