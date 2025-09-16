// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../service/authService";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const isLoggedIn = AuthService.isLoggedIn();
  const userId = AuthService.getUserId();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
    }
  };

  return (
    <nav style={styles.navbar}>
      {/* Left - Logo */}
      <div>
        <Link to="/" style={styles.logo}>
          🎬 Reviewed
        </Link>
      </div>

      {/* Middle - Links */}
      <div style={styles.links}>
        <NavLink to="/" label="Home" />
        <NavLink to="/reviews" label="Reviews" />
        <NavLink to="/about" label="About" />
        {isLoggedIn && <NavLink to="/myProfile" label="My Profile" />}
      </div>

      {/* Right - Search + Auth */}
      <div style={styles.rightSide}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            🔍
          </button>
        </form>

        {isLoggedIn ? (
          <Link to="/signout" style={styles.authButton}>
            Sign Out
          </Link>
        ) : (
          <>
            <Link to="/signup" style={styles.authButton}>
              Sign Up
            </Link>
            <Link to="/signin" style={styles.authButton}>
              Sign In
            </Link>
          </>
        )}

      </div>
    </nav>
  );
};

// ✅ Custom NavLink with hover effect
const NavLink = ({ to, label }) => (
  <Link
    to={to}
    style={styles.link}
    onMouseEnter={(e) => (e.target.style.color = "#e50914")}
    onMouseLeave={(e) => (e.target.style.color = "#fff")}
  >
    {label}
  </Link>
);

const styles = {
  navbar: {
    background:
      "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(20,20,20,1) 100%)",
    padding: "12px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },
  logo: {
    color: "#e50914",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "bold",
    fontFamily: "Poppins, sans-serif",
    letterSpacing: "1px",
    transition: "transform 0.3s ease",
  },
  links: {
    display: "flex",
    gap: "25px",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "17px",
    fontWeight: "500",
    transition: "all 0.3s ease",
  },
  rightSide: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  searchForm: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #444",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "#111",
  },
  searchInput: {
    padding: "6px 12px",
    fontSize: "15px",
    border: "none",
    outline: "none",
    color: "white",
    background: "transparent",
    width: "180px",
  },
  searchButton: {
    padding: "6px 12px",
    fontSize: "16px",
    border: "none",
    backgroundColor: "#e50914",
    color: "white",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  authButton: {
    backgroundColor: "#e50914",
    color: "white",
    padding: "6px 14px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "15px",
    transition: "all 0.3s ease",
  },
};

// Extra hover styles (inline JS way)
styles.logo.onMouseEnter = (e) => (e.target.style.transform = "scale(1.1)");
styles.logo.onMouseLeave = (e) => (e.target.style.transform = "scale(1)");

styles.searchButton.onMouseEnter = (e) =>
  (e.target.style.backgroundColor = "#b20710");
styles.searchButton.onMouseLeave = (e) =>
  (e.target.style.backgroundColor = "#e50914");

styles.authButton.onMouseEnter = (e) => {
  e.target.style.backgroundColor = "#b20710";
  e.target.style.transform = "scale(1.05)";
};
styles.authButton.onMouseLeave = (e) => {
  e.target.style.backgroundColor = "#e50914";
  e.target.style.transform = "scale(1)";
};

export default Navbar;
