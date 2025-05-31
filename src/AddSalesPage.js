import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const AddSalesPage = () => {
  const [name, setName] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const email = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const fetchInventory = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/inventory/list?email=${email}`);
      const data = await res.json();
      setInventoryItems(data);
    } catch (err) {
      console.error("Failed to fetch inventory items", err);
      toast.error("Failed to load inventory items.");
    }
  }, [email]);

  useEffect(() => {
    if (email) {
      fetchInventory();
    }
  }, [email, fetchInventory]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const saleItem = {
      name: name.trim(),
      quantitySold: parseInt(quantitySold, 10),
    };

    try {
      const res = await fetch(
        `http://localhost:8080/api/sales/add?email=${email}&date=${date}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([saleItem]),
        }
      );

      if (res.ok) {
        toast.success("✅ Sale added successfully!");
        setName('');
        setQuantitySold('');
      } else {
        toast.error("❌ Failed to add sale.");
      }
    } catch (err) {
      console.error("Error adding sale:", err);
      toast.error("Something went wrong.");
    }
  };

  if (!email) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>⚠️ No logged-in user found. Please log in again.</p>;
  }

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
      <div style={styles.container}>
        <Link
          to="/home"
          style={styles.backButton}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#388E3C")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          ← Back to Home
        </Link>
        <h2 style={styles.heading}>➕ Add Sale</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Item Name:</label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">Select an item</option>
              {inventoryItems.map((item, idx) => (
                <option key={idx} value={item}>{item}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Quantity Sold:</label>
            <input
              type="number"
              value={quantitySold}
              onChange={(e) => setQuantitySold(e.target.value)}
              required
              min="1"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={{ ...styles.button, backgroundColor: "#4CAF50" }}>
              Submit Sale
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
              style={{ ...styles.button, backgroundColor: "#555", marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    background: 'linear-gradient(to bottom right, #e0f8d8, rgb(167, 201, 124), rgb(121, 184, 91))',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Segoe UI, sans-serif",
  },
  container: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    width: "90%",
    maxWidth: "420px",
  },
  backButton: {
    display: "inline-block",
    marginBottom: "1rem",
    padding: "8px 18px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    fontSize: "15px",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    transition: "all 0.3s ease"
  },
  heading: {
    textAlign: "center",
    color: "#4CAF50",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    fontSize: "16px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    boxSizing: "border-box",
    appearance: "none",
    height: "42px",
    lineHeight: "1.5",
  },
  buttonGroup: {
    marginTop: "1.5rem",
    display: "flex",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    padding: "0.75rem",
    fontSize: "16px",
    borderRadius: 8,
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};

export default AddSalesPage;
