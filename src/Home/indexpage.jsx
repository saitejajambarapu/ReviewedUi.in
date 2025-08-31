// Home.jsx 
import React, { useEffect, useState } from 'react'; 
import { FaStar } from 'react-icons/fa'; 
import api from '../service/api'; 

// Card Component 
const Card = ({ item }) => ( 
  <div style={styles.card}> 
    <img 
      src={item.poster && item.poster !== "N/A" ? item.poster : "https://via.placeholder.com/300x450?text=No+Image"} 
      alt={item.title} 
      style={styles.poster} 
    /> 
    <div style={styles.cardContent}> 
      <h4 style={styles.title}>{item.title}</h4> 
      <div style={styles.stats}> 
        {item.imdbRating && item.imdbRating !== "N/A" && ( 
          <span style={styles.stat}><FaStar /> {item.imdbRating}</span> 
        )} 
      </div> 
    </div> 
  </div> 
); 

// Horizontal Scroll Section 
const HorizontalScroll = ({ title, data }) => ( 
  <div style={{ marginBottom: '50px' }}> 
    {data.length > 0 && ( 
      <> 
        <h2 style={styles.sectionTitle}>{title}</h2> 
        <div style={styles.scrollContainer}> 
          {data.map(item => <Card key={item.id} item={item} />)} 
        </div> 
      </> 
    )} 
  </div> 
); 


// Home Page Component 
const Home = () => { 
  const [homeData, setHomeData] = useState([]); 

  useEffect(() => { 
    const fetchReviews = async () => { 
      try { 
        const response = await api.get("/Home"); 
        setHomeData(response.data.contentList || []); 
      } catch (error) { 
        console.error('Error fetching reviews:', error); 
      } 
    }; 
    fetchReviews(); 
  }, []); 

  return ( 
    <div style={styles.page}> 
      <h1 style={styles.pageTitle}>Welcome to CineVerse</h1> 

      {/* Loop over categories */} 
      {homeData.map((category, index) => { 
        const sectionTitle = Object.keys(category)[0]; 
        const sectionData = category[sectionTitle]; 
        return <HorizontalScroll key={index} title={sectionTitle} data={sectionData} />; 
      })} 
    </div> 
  ); 
}; 

// Styles (same as before) 
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
