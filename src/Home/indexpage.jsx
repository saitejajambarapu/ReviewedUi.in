// Home.jsx
import React, { useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import api from "../service/api";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/authService";
import { useNotification } from "../service/notificationprovider";
import Spinner from "../utils/spinner";

// Card Component
const Card = ({ item,onNavigate }) => (
  <div style={styles.card}>
    <img  onClick={() => onNavigate(item.imdbID)}
      src={
        item.poster && item.poster !== "N/A"
          ? item.poster
          : "https://via.placeholder.com/300x450?text=No+Image"
      }
      alt={item.title}
      style={styles.poster}
    />
    <div style={styles.cardContent}>
      <h4 onClick={() => onNavigate(item.imdbID)} style={styles.title}>{item.title}</h4>
      <div style={styles.stats}>
        {item.imdbRating && item.imdbRating !== "N/A" && (
          <span style={styles.stat}>
            <FaStar /> {item.imdbRating}
          </span>
        )}
      </div>
    </div>
  </div>
);
  
// Horizontal Scroll Section with Buttons
const HorizontalScroll = ({ title, data }) => {

  const navigate= useNavigate();
  const navigator=(id)=>{
    navigate(`/content/${id}`)
  }
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.8; // scroll ~80% of container
      scrollRef.current.scrollTo({
        left:
          direction === "left"
            ? scrollLeft - scrollAmount
            : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div style={{ marginBottom: "50px", position: "relative" }}>
      {data.length > 0 && (
        <>
          <h2 style={styles.sectionTitle}>{title}</h2>

          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            style={{ ...styles.scrollButton, left: "0" }}
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={() => scroll("right")}
            style={{ ...styles.scrollButton, right: "0" }}
          >
            <FaChevronRight />
          </button>

          {/* Scroll Container */}
          <div ref={scrollRef} style={styles.scrollContainer}>
            {data.map((item) => (
              <Card key={item.id} item={item} onNavigate={navigator} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Home Page Component
const Home = () => {
  const [loading, setLoading] = useState(true);
  const { showNotification } = useNotification();
  const isLoggedIn = AuthService.isLoggedIn();
  debugger;
  const navigate= useNavigate();
  const [homeData, setHomeData] = useState([]);
  useEffect(() => {
    setLoading(true);
    if(!isLoggedIn || isLoggedIn==null){
      showNotification(`Please Login Or SignUp`, "error")
    navigate(`/signin`)
  }else{
    const fetchReviews = async () => {
      try {
        const response = await api.get("/Home");
        setHomeData(response.data.contentList || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();

  }
    
    
  }, []);

  return (
    <div>
      {loading ? <Spinner /> :

      <div style={styles.page}>
      {/* <h1 style={styles.pageTitle}>Welcome to CineVerse</h1> */}

      {/* Loop over categories */}
      {homeData.map((category, index) => {
        const sectionTitle = Object.keys(category)[0];
        const sectionData = category[sectionTitle];
        return (
          <HorizontalScroll
            key={index}
            title={sectionTitle}
            data={sectionData}
          />
        );
      })}
    </div>
}
    </div>
    
  );
};

// Styles
const styles = {
  page: {
    padding: "30px 50px",
    backgroundColor: "#0d0d0d",
    minHeight: "100vh",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  pageTitle: {
    color: "#e50914",
    fontSize: "3rem",
    fontWeight: "700",
    marginBottom: "40px",
    textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
  },
  card: {
    position: "relative",
    minWidth: "220px",
    maxWidth: "220px",
    marginRight: "15px",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    backgroundColor: "#181818",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 6px 15px rgba(0,0,0,0.7)",
  },
  poster: {
    width: "100%",
    height: "330px",
    objectFit: "cover",
    transition: "transform 0.3s",
  },
  cardContent: {
    padding: "12px",
    color: "#fff",
  },
  title: {
    margin: "5px 0",
    fontWeight: "700",
    fontSize: "1rem",
    color: "#e50914",
  },
  stats: {
    display: "flex",
    justifyContent: "flex-start",
    gap: "12px",
    marginTop: "8px",
    fontSize: "0.85rem",
    color: "#ddd",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  sectionTitle: {
    color: "#e50914",
    fontSize: "1.8rem",
    marginBottom: "15px",
    fontWeight: "700",
    textShadow: "1px 1px 5px rgba(0,0,0,0.5)",
  },
  scrollContainer: {
    display: "flex",
    overflowX: "auto",
    scrollBehavior: "smooth",
    paddingBottom: "15px",
    scrollbarWidth: "none",
  },
  scrollButton: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "45px",
    height: "45px",
    fontSize: "1.5rem",
    cursor: "pointer",
    zIndex: 2,
    transition: "all 0.3s ease",
  },
};

export default Home;
