import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = 'https://sellsmart-backend.onrender.com/api/auth';

const AuthForm = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const checkEmail = useCallback(async () => {
    if (!email) {
      setMessage('Please enter an email');
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/check-email?email=${email.trim().toLowerCase()}`);
      const { authorized, registered } = res.data;

      if (!authorized) {
        setMessage('Email is not authorized to use this app');
        return;
      }

      setStep(registered ? 'login' : 'signup');
      setMessage('');
    } catch (err) {
      setMessage('Backend error occurred');
    }
  }, [email]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    if (step === 'signup' && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    const endpoint = step === 'signup' ? '/register' : '/login';

    try {
      const res = await axios.post(`${BASE_URL}${endpoint}`, {
        email: email.trim().toLowerCase(),
        password,
      });

      if (res.data.token) {
        localStorage.setItem('jwtToken', res.data.token);
        localStorage.setItem('userEmail', email.trim().toLowerCase());
        setMessage('Login successful!');
        navigate('/home');
      } else {
        setMessage('Authentication failed: No token received.');
      }
    } catch (err) {
      setMessage(err.response?.data || 'Error occurred');
    }
  }, [email, password, confirmPassword, step, navigate]);

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #e0f8d8,rgb(167, 201, 124),rgb(121, 184, 91))',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
    },
    container: {
      maxWidth: 400,
      width: '100%',
      padding: 24,
      background: 'linear-gradient(to bottom right, #fdfbfb, #ebedee)',
      borderRadius: 16,
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
      fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    },
    input: {
      width: '100%',
      padding: '14px',
      marginBottom: 16,
      borderRadius: 8,
      border: '1px solid #ccc',
      fontSize: 16,
      boxSizing: 'border-box',
      backgroundColor: '#fff',
    },
    button: {
      width: '100%',
      padding: '14px',
      marginTop: 6,
      borderRadius: 8,
      border: 'none',
      backgroundColor: '#4CAF50',
      color: '#fff',
      fontSize: 16,
      cursor: 'pointer',
      boxSizing: 'border-box',
      transition: 'background-color 0.3s ease',
    },
    message: {
      marginTop: 14,
      color: message.includes('success') ? '#2e7d32' : '#d32f2f',
      fontWeight: '500',
    },
    title: {
      textAlign: 'center',
      marginBottom: 20,
      fontSize: 24,
      color: '#333',
    },
    paragraph: {
      fontSize: 14,
      color: '#555',
      marginBottom: 12,
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>SellSmart Access</h2>

        {step === 'email' && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <button onClick={checkEmail} style={styles.button}>
              Check
            </button>
          </>
        )}

        {(step === 'login' || step === 'signup') && (
          <form onSubmit={handleSubmit}>
            <p style={styles.paragraph}>
              {step === 'login' ? 'Registered user — Please login' : 'Authorized — Create password'}
            </p>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />

            {step === 'signup' && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={styles.input}
              />
            )}

            <button type="submit" style={styles.button}>
              {step === 'signup' ? 'Register' : 'Login'}
            </button>
          </form>
        )}

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default AuthForm;
