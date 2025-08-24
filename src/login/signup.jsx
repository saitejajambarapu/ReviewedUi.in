import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../service/api";
import AuthService from "../service/authService";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    roles: ["USER"],
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
      localStorage.clear();
      const response = await api.post("auth/signup", formData);
      console.log("Success:", response.data);
      AuthService.login(response.data);
      navigate("/signin");
      alert("Signup successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Signup failed.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.overlay}></div>

      <form style={styles.card} onSubmit={handleSubmit}>
        <h2 style={styles.title}>Create Your Account</h2>

        <label style={styles.label}>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <label style={styles.label}>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Sign Up
        </button>

        <p style={styles.footer}>
          Already have an account?{" "}
          <a href="/signin" style={styles.link}>
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    position: "relative",
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    color: "#fff",
  },
  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.9))",
    zIndex: 1,
  },
  card: {
    position: "relative",
    zIndex: 2,
    backgroundColor: "rgba(20,20,20,0.95)",
    padding: "40px",
    borderRadius: "12px",
    textAlign: "center",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 8px 30px rgba(0,0,0,0.7)",
    border: "1px solid #222",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "25px",
    color: "#fff",
  },
  label: {
    display: "block",
    textAlign: "left",
    marginBottom: "8px",
    fontSize: "14px",
    color: "#aaa",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "6px",
    border: "1px solid #333",
    backgroundColor: "#111",
    color: "#fff",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    backgroundColor: "#e50914",
    padding: "14px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "600",
    fontSize: "16px",
    color: "#fff",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  footer: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#888",
  },
  link: {
    color: "#1db954",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Signup;
