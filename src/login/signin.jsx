import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthService from "../service/authService";
import { useNotification } from "../service/notificationprovider";


function Signin() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData
      );
      debugger
      AuthService.login(response.data);
      debugger
      showNotification("Welcome back 🎉", "success")
      navigate("/reviews");
      
    } catch (error) {
      alert("Signin failed.");
    }
  };

  return (
    <div style={styles.page}>
      {/* Overlay */}
      <div style={styles.overlay}></div>

      {/* Signin Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Sign In</h2>

        {/* Email */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Password */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={styles.input}
          />
        </div>

        {/* Button */}
        <button type="submit" style={styles.button}>
          Sign In
        </button>

        {/* Divider */}
        <div style={styles.dividerContainer}>
          <div style={styles.divider}></div>
          <span style={styles.dividerText}>OR</span>
          <div style={styles.divider}></div>
        </div>

        {/* Sign Up Redirect */}
        <p style={styles.redirectText}>
          New here?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={styles.link}
          >
            Create an account
          </span>
        </p>
      </form>
    </div>
  );
}

// 🎨 Netflix-style red & white theme
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    color: "#fff",
    position: "relative",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9))",
    zIndex: 1,
  },
  form: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#141414",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
    border: "1px solid #222",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "30px",
    color: "#e50914", // Netflix red
  },
  inputGroup: {
    marginBottom: "25px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    color: "#fff",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    backgroundColor: "#222",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    padding: "12px 15px",
    outline: "none",
    transition: "all 0.3s",
  },
  button: {
    width: "100%",
    backgroundColor: "#e50914", // Netflix red
    border: "none",
    padding: "14px",
    borderRadius: "50px",
    fontWeight: "600",
    fontSize: "16px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
    marginTop: "10px",
  },
  dividerContainer: {
    display: "flex",
    alignItems: "center",
    margin: "25px 0",
  },
  divider: {
    flexGrow: 1,
    height: "1px",
    backgroundColor: "#333",
  },
  dividerText: {
    padding: "0 10px",
    color: "#aaa",
    fontSize: "14px",
  },
  redirectText: {
    textAlign: "center",
    color: "#fff",
    fontSize: "14px",
  },
  link: {
    color: "#e50914", // Netflix red
    cursor: "pointer",
    textDecoration: "none",
    marginLeft: "5px",
  },
};

export default Signin;
