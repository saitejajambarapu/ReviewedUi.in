import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../service/api';
import AuthService  from '../service/authService';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    roles: ['USER'],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      localStorage.clear();
      const response = await api.post('auth/signup', formData);
      console.log('Success:', response.data);
      AuthService.login( response.data);
      navigate("/signin")
      alert('Signup successful!');
    } catch (error) {
      console.error('Error:', error);
      alert('Signup failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Signup</h2>

      <label>Email:</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <br />

      <label>Password:</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <br />

      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <br />

      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
