import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_URL from '../config';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setEmailError(false);
    setPasswordError(false);

    let valid = true;

    if (!emailRegex.test(email)) {
      setEmailError(true);
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError(true);
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        setMessage('Login successful! Redirecting...');
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          window.location.href = '/recipe';
        }, 2000);
      } else {
        setMessage(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />
          {emailError && <span className="error" style={{ display: 'block' }}>Please enter a valid email.</span>}
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password:</label>
          <input
            type="password"
            id="login-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          {passwordError && <span className="error" style={{ display: 'block' }}>Password must be at least 6 characters.</span>}
        </div>
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>}
      <div className="nav-link">
        <p>Don't have an account? <a href="/signup">Sign up</a></p>
      </div>
    </div>
  );
}

export default Login;
