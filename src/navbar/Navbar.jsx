// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../service/authService';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const isLoggedIn =  AuthService.isLoggedIn();
    const userId = AuthService.getUserId();
  
  const handleSearch = (e) => {
    e.preventDefault();

    if (searchTerm.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/about" style={styles.link}>About</Link>
        <Link to="/reviews" style={styles.link}>Reviews</Link>
        {isLoggedIn ? <><Link to="/signout" style={styles.link}>Sign Out</Link><Link to="/myProfile" style={styles.link}>My Profile</Link></> :
        <><Link to="/signin" style={styles.link}>Signin</Link><Link to="/signup" style={styles.link}>SignUp</Link></>}
        
         
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>🔍</button>
      </form>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#333',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  links: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
  searchForm: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '5px 10px',
    fontSize: '16px',
    borderRadius: '4px 0 0 4px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  searchButton: {
    padding: '5px 10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderLeft: 'none',
    backgroundColor: '#555',
    color: 'white',
    cursor: 'pointer',
    borderRadius: '0 4px 4px 0',
  }
};

export default Navbar;
