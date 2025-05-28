import React, { useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/auth';

const AuthForm = () => {
  const [step, setStep] = useState('email'); // 'email', 'login', 'signup'
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  const checkEmail = async () => {
    if (!email) {
      setMessage('Please enter an email');
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/check-email?email=${email.trim().toLowerCase()}`);
      const { authorized, registered } = res.data;

      if (!authorized) {
        setMessage('Email is not authorized to use this app');
        setIsAuthorized(false);
        return;
      }

      setIsAuthorized(true);
      setStep(registered ? 'login' : 'signup');
      setMessage('');
    } catch (err) {
      setMessage('Backend error occurred');
      setIsAuthorized(false);
    }
  };

  const handleSubmit = async (e) => {
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
      setMessage(res.data); // Success or server message
    } catch (err) {
      setMessage(err.response?.data || 'Error occurred');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>SellSmart Access</h2>

      {step === 'email' && (
        <>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br /><br />
          <button onClick={checkEmail}>Check</button>
        </>
      )}

      {(step === 'login' || step === 'signup') && (
        <form onSubmit={handleSubmit}>
          <p>
            {step === 'login' ? 'Registered user — Please login' : 'Authorized — Create password'}
          </p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <br /><br />

          {step === 'signup' && (
            <>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <br /><br />
            </>
          )}

          <button type="submit">{step === 'signup' ? 'Register' : 'Login'}</button>
        </form>
      )}

      {message && (
        <p style={{ marginTop: 10, color: message.includes('success') ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default AuthForm;
