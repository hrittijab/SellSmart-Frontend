import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          Welcome to <span style={styles.brand}>SellSmart</span> 💼
        </h1>
        <p style={styles.subtitle}>Your all-in-one solution for smart inventory and sales tracking.</p>

        <div style={styles.buttonGroup}>
          <button onClick={() => navigate('/inventory')} style={styles.button('#4CAF50')}>
            📦 Inventory
          </button>
          <button onClick={() => navigate('/sales')} style={styles.button('#2196F3')}>
            📈 View Sales
          </button>
          <button onClick={() => navigate('/add-sale')} style={styles.button('#FF9800')}>
            ➕ Add Sale
          </button>
          <button onClick={() => navigate('/add-damage')} style={styles.button('#f44336')}>
            🧯 Add Damaged Goods
          </button>
          <button onClick={() => navigate('/report')} style={styles.button('#9C27B0')}>
            📊 View Report
          </button>
        </div>

        <hr style={{ width: '100%', margin: '25px 0', borderColor: '#eee' }} />

        <button onClick={logout} style={styles.logoutButton}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #e0f8d8, rgb(167, 201, 124), rgb(121, 184, 91))',
    fontFamily: 'Segoe UI, sans-serif',
    padding: '1rem'
  },
  card: {
    background: '#fff',
    padding: '2.5rem 2rem',
    borderRadius: 16,
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: 420,
  },
  title: {
    fontSize: '1.75rem',
    marginBottom: '0.5rem',
    color: '#222',
  },
  brand: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  button: (bgColor) => ({
    width: '100%',
    padding: '12px',
    backgroundColor: bgColor,
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 3px 6px ${bgColor}55`,
  }),
  logoutButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#555',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: 16,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  }
};

export default Home;
