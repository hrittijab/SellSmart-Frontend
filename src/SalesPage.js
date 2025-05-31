import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";

function SalesPage() {
  const [sales, setSales] = useState([]);
  const [damages, setDamages] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const email = localStorage.getItem("userEmail");

  const [editingSaleId, setEditingSaleId] = useState(null);
  const [newSaleQuantity, setNewSaleQuantity] = useState(0);

  const [editingDamageId, setEditingDamageId] = useState(null);
  const [newDamageQuantity, setNewDamageQuantity] = useState(0);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const fetchSales = useCallback(async () => {
    try {
      const response = await fetch(`https://sellsmart-backend.onrender.com/api/sales/view?email=${email}&date=${date}`);
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Failed to fetch sales:", error);
    }
  }, [email, date]);

  const fetchDamages = useCallback(async () => {
    try {
      const response = await fetch(`https://sellsmart-backend.onrender.com/api/damages/view?email=${email}&date=${date}`);
      const data = await response.json();
      setDamages(data);
    } catch (error) {
      console.error("Failed to fetch damages:", error);
    }
  }, [email, date]);

  useEffect(() => {
    if (email) {
      fetchSales();
      fetchDamages();
    }
  }, [email, fetchSales, fetchDamages]);

  const updateSale = async (sale) => {
    await fetch(`https://sellsmart-backend.onrender.com/api/sales/update/${sale.id}?email=${email}&date=${date}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...sale, quantitySold: newSaleQuantity }),
    });
    setEditingSaleId(null);
    fetchSales();
  };

  const deleteSale = async (id) => {
    await fetch(`https://sellsmart-backend.onrender.com/api/sales/delete/${id}?email=${email}&date=${date}`, {
      method: "DELETE",
    });
    fetchSales();
  };

  const updateDamage = async (item) => {
    await fetch(`https://sellsmart-backend.onrender.com/api/damages/update/${item.id}?email=${email}&date=${date}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, quantityDamaged: newDamageQuantity }),
    });
    setEditingDamageId(null);
    fetchDamages();
  };

  const deleteDamage = async (id) => {
    await fetch(`https://sellsmart-backend.onrender.com/api/damages/delete/${id}?email=${email}&date=${date}`, {
      method: "DELETE",
    });
    fetchDamages();
  };

  const getTotalEarned = () => sales.reduce((total, s) => total + (s.quantitySold * s.sellPrice), 0);
  const getTotalSpent = () => sales.reduce((total, s) => total + (s.quantitySold * s.buyPrice), 0);
  const getTotalProfit = () => getTotalEarned() - getTotalSpent();
  const getTotalDamageLoss = () => damages.reduce((total, d) => total + (d.quantityDamaged * d.buyPrice), 0);


  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #e0f8d8, rgb(167, 201, 124), rgb(121, 184, 91))',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
    },
    sectionTitle: {
      fontSize: '22px',
      marginBottom: '1rem',
      color: '#333',
    },
    dateInput: {
      fontSize: '16px',
      padding: '8px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      marginBottom: '1rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '2rem',
      backgroundColor: '#fff',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
    },
    th: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '10px',
    },
    td: {
      padding: '10px',
      textAlign: 'center',
    },
    button: {
      padding: '6px 10px',
      borderRadius: '5px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '500',
      margin: '0 2px',
    },
    editBtn: {
      backgroundColor: '#2196F3',
      color: '#fff',
    },
    deleteBtn: {
      backgroundColor: '#f44336',
      color: '#fff',
    },
    saveBtn: {
      backgroundColor: '#4CAF50',
      color: '#fff',
    },
    cancelBtn: {
      backgroundColor: '#777',
      color: '#fff',
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
    },
  };

  return (
    <div style={styles.wrapper}>
      <Link to="/home" style={{
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
      }}>
        ← Back to Home
      </Link>

      <h2 style={styles.sectionTitle}>📈 Sales Summary</h2>
      <label>
        Select Date:{" "}
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={styles.dateInput}
        />
      </label>

      <table style={styles.table} border="1">
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={styles.th}>Qty Sold</th>
            <th style={styles.th}>Sell Price</th>
            <th style={styles.th}>Buy Price</th>
            <th style={styles.th}>Total Earned</th>
            <th style={styles.th}>Total Spent</th>
            <th style={styles.th}>Profit</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.length === 0 ? (
            <tr><td colSpan="8" style={styles.td}>No sales found</td></tr>
          ) : (
            sales.map((sale) => {
              const totalEarned = sale.quantitySold * sale.sellPrice;
              const totalSpent = sale.quantitySold * sale.buyPrice;
              const profit = totalEarned - totalSpent;

              return (
                <tr key={sale.id}>
                  <td style={styles.td}>{sale.name}</td>
                  <td style={styles.td}>
                    {editingSaleId === sale.id ? (
                      <input type="number" min="1" value={newSaleQuantity}
                        onChange={(e) => setNewSaleQuantity(Number(e.target.value))} />
                    ) : sale.quantitySold}
                  </td>
                  <td style={styles.td}>{sale.sellPrice.toFixed(2)}</td>
                  <td style={styles.td}>{sale.buyPrice.toFixed(2)}</td>
                  <td style={styles.td}>{totalEarned.toFixed(2)}</td>
                  <td style={styles.td}>{totalSpent.toFixed(2)}</td>
                  <td style={styles.td}>{profit.toFixed(2)}</td>
                  <td style={styles.td}>
                    {editingSaleId === sale.id ? (
                      <>
                        <button style={{ ...styles.button, ...styles.saveBtn }} onClick={() => updateSale(sale)}>Save</button>
                        <button style={{ ...styles.button, ...styles.cancelBtn }} onClick={() => setEditingSaleId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button style={{ ...styles.button, ...styles.editBtn }} onClick={() => {
                          setEditingSaleId(sale.id);
                          setNewSaleQuantity(sale.quantitySold);
                        }}>Edit</button>
                        <button style={{ ...styles.button, ...styles.deleteBtn }}
                          onClick={() => {
                            setDeleteType("sale");
                            setDeleteId(sale.id);
                            setShowDeleteModal(true);
                          }}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        {sales.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="4" style={styles.td}><strong>Total</strong></td>
              <td style={styles.td}><strong>৳ {getTotalEarned().toFixed(2)}</strong></td>
              <td style={styles.td}><strong>৳ {getTotalSpent().toFixed(2)}</strong></td>
              <td style={styles.td}><strong>৳ {getTotalProfit().toFixed(2)}</strong></td>
              <td style={styles.td}></td>
            </tr>
          </tfoot>
        )}
      </table>

      <h3 style={styles.sectionTitle}>🧯 Damaged Items</h3>
      <table style={styles.table} border="1">
        <thead>
          <tr>
            <th style={styles.th}>Item</th>
            <th style={styles.th}>Qty Damaged</th>
            <th style={styles.th}>Buy Price</th>
            <th style={styles.th}>Loss</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {damages.length === 0 ? (
            <tr><td colSpan="5" style={styles.td}>No damaged items reported</td></tr>
          ) : (
            damages.map((item) => {
              const loss = item.quantityDamaged * item.buyPrice;
              return (
                <tr key={item.id}>
                  <td style={styles.td}>{item.name}</td>
                  <td style={styles.td}>
                    {editingDamageId === item.id ? (
                      <input type="number" min="1" value={newDamageQuantity}
                        onChange={(e) => setNewDamageQuantity(Number(e.target.value))} />
                    ) : item.quantityDamaged}
                  </td>
                  <td style={styles.td}>{item.buyPrice.toFixed(2)}</td>
                  <td style={styles.td}>{loss.toFixed(2)}</td>
                  <td style={styles.td}>
                    {editingDamageId === item.id ? (
                      <>
                        <button style={{ ...styles.button, ...styles.saveBtn }} onClick={() => updateDamage(item)}>Save</button>
                        <button style={{ ...styles.button, ...styles.cancelBtn }} onClick={() => setEditingDamageId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button style={{ ...styles.button, ...styles.editBtn }} onClick={() => {
                          setEditingDamageId(item.id);
                          setNewDamageQuantity(item.quantityDamaged);
                        }}>Edit</button>
                        <button style={{ ...styles.button, ...styles.deleteBtn }}
                          onClick={() => {
                            setDeleteType("damage");
                            setDeleteId(item.id);
                            setShowDeleteModal(true);
                          }}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        {damages.length > 0 && (
          <tfoot>
            <tr>
              <td colSpan="3" style={styles.td}><strong>Total Loss</strong></td>
              <td style={styles.td}><strong>৳ {getTotalDamageLoss().toFixed(2)}</strong></td>
              <td style={styles.td}></td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modal}>
            <h3>⚠️ Confirm Deletion</h3>
            <p>Are you sure you want to delete this {deleteType === "sale" ? "sale" : "damaged item"}?</p>
            <div style={{ marginTop: "1.5rem" }}>
              <button
                onClick={() => {
                  if (deleteType === "sale") deleteSale(deleteId);
                  else deleteDamage(deleteId);
                  setShowDeleteModal(false);
                }}
                style={{ ...styles.button, ...styles.deleteBtn, marginRight: "10px" }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ ...styles.button, ...styles.cancelBtn }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesPage;
