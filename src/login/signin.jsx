import React, {useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import AuthService  from '../service/authService';

function Signin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
      });

    const handleChange = (e)=>{
        const {name,value}=e.target;
        console.log(name,value)
        setFormData(prev=>({
            ...prev,[name]:value
        }))
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      console.log('Success:', response.data);
      AuthService.login( response.data);
      navigate("/reviews")
      alert('Welcome Back!');
    } catch (error) {
      console.error('Error:', error);
      alert('Signin failed.');
    }
  };

  return (
    <div> <form onSubmit={handleSubmit}>
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
      <button type="submit">Sign In</button>
      </form>
      </div>
  )
}

export default Signin