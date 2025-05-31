import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = 'http://localhost:8080/api/inventory';

const Inventory = () => {
  const [email, setEmail] = useState('');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    buyPrice: 0,
    sellPrice: 0,
  });
  const [editingId, setEditingId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      toast.error('⚠️ No logged-in user found. Please log in again.');
      return;
    }
    setEmail(storedEmail);
  }, []);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/all?email=${email}`);
      setItems(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch inventory.');
    }
  }, [email]);

  useEffect(() => {
    if (email) fetchInventory();
  }, [email, fetchInventory]);

  const handleSubmit = async () => {
    if (!newItem.name) return toast.warn('Name is required');

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/update/${editingId}?email=${email}`, newItem);
        toast.success('✅ Item updated successfully!');
        setEditingId(null);
      } else {
        await axios.post(`${BASE_URL}/add?email=${email}`, newItem);
        toast.success('✅ Item added successfully!');
      }

      setNewItem({ name: '', quantity: 0, buyPrice: 0, sellPrice: 0 });
      fetchInventory();
    } catch (err) {
      toast.error('❌ Failed to submit item.');
    }
  };

  const handleEdit = (item) => {
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      buyPrice: item.buyPrice,
      sellPrice: item.sellPrice,
    });
    setEditingId(item.id);
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/delete/${deleteId}?email=${email}`);
      toast.success('🗑️ Item deleted!');
      fetchInventory();
      setShowDeleteModal(false);
    } catch (err) {
      toast.error('❌ Failed to delete item.');
    }
  };

  const handleClear = () => {
    setNewItem({ name: '', quantity: 0, buyPrice: 0, sellPrice: 0 });
    setEditingId(null);
  };

  if (!email) return <p>Loading user data...</p>;

  return (
    <div style={styles.wrapper}>
      <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
      <div style={styles.container}>
        <Link
          to="/home"
          style={{
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
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#388E3C")}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4CAF50")}
        >
          ← Back to Home
        </Link>

        <h2 style={styles.title}>📦 Inventory for {email}</h2>

        <div style={styles.inputSection}>
          <input style={styles.input} type="text" placeholder="Name" value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Quantity" value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) })} />
          <input style={styles.input} type="number" placeholder="Buy Price" value={newItem.buyPrice}
            onChange={(e) => setNewItem({ ...newItem, buyPrice: parseFloat(e.target.value) })} />
          <input style={styles.input} type="number" placeholder="Sell Price" value={newItem.sellPrice}
            onChange={(e) => setNewItem({ ...newItem, sellPrice: parseFloat(e.target.value) })} />
          <button onClick={handleSubmit} style={styles.button}>
            {editingId ? 'Update Item' : 'Add Item'}
          </button>
          {editingId && (
            <button onClick={handleClear} style={styles.cancelButton}>Cancel</button>
          )}
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Buy Price</th>
              <th>Sell Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                  No items in inventory yet. Add something above!
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.buyPrice}</td>
                  <td>{item.sellPrice}</td>
                  <td>
                    <button style={styles.editBtn} onClick={() => handleEdit(item)}>✏️</button>
                    <button style={styles.deleteBtn} onClick={() => confirmDelete(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showDeleteModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3>⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to delete this inventory item?</p>
            <div style={{ marginTop: "1.5rem" }}>
              <button
                onClick={handleDelete}
                style={{ ...styles.button, backgroundColor: '#f44336', marginRight: 10 }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #e0f8d8, rgb(167, 201, 124), rgb(121, 184, 91))',
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
  },
  container: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: 12,
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
    fontSize: '24px',
    color: '#333',
  },
  inputSection: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: '1 1 180px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  button: {
    padding: '10px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelButton: {
    padding: '10px 16px',
    backgroundColor: '#777',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
  },
  editBtn: {
    marginRight: 6,
    backgroundColor: '#2196F3',
    border: 'none',
    padding: '6px 10px',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  deleteBtn: {
    backgroundColor: '#f44336',
    border: 'none',
    padding: '6px 10px',
    color: 'white',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  modalBackdrop: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    width: "90%",
    maxWidth: "400px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
    textAlign: "center",
  }
};

export default Inventory;
