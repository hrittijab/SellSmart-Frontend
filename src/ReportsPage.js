import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Report() {
  const email = localStorage.getItem("userEmail");
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const [year, setYear] = useState(currentYear);
  const [monthlyProfits, setMonthlyProfits] = useState([]);
  const [yearTotal, setYearTotal] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filteredSales, setFilteredSales] = useState([]);
  const [filteredDamages, setFilteredDamages] = useState([]);

  const fetchYearlyProfits = useCallback(async (selectedYear) => {
    try {
      const res = await fetch(`http://localhost:8080/api/sales/yearly-profit-summary?email=${email}&year=${selectedYear}`);
      const data = await res.json();
      setMonthlyProfits(data);
      const total = data.reduce((sum, entry) => sum + entry.profit, 0);
      setYearTotal(total);
    } catch (err) {
      console.error("Yearly profit fetch failed:", err);
    }
  }, [email]);

  const fetchFilteredData = useCallback(async () => {
    if (!fromDate || !toDate) return;
    try {
      const salesRes = await fetch(`http://localhost:8080/api/sales/between?email=${email}&from=${fromDate}&to=${toDate}`);
      const salesData = await salesRes.json();
      setFilteredSales(salesData);

      const damageRes = await fetch(`http://localhost:8080/api/damages/between?email=${email}&from=${fromDate}&to=${toDate}`);
      const damageData = await damageRes.json();
      setFilteredDamages(damageData);
    } catch (err) {
      console.error("Error fetching filtered data:", err);
    }
  }, [email, fromDate, toDate]);

  useEffect(() => {
    if (email) fetchYearlyProfits(year);
  }, [email, year, fetchYearlyProfits]);

  const handleMonthClick = (monthName) => {
    navigate(`/month/${year}/${monthName}`);
  };

  const getFilteredIncome = () => filteredSales.reduce((sum, s) => sum + s.quantitySold * s.sellPrice, 0);
  const getFilteredProfit = () => filteredSales.reduce((sum, s) => sum + (s.sellPrice - s.buyPrice) * s.quantitySold, 0);

  if (!email) return <p style={{ padding: "2rem" }}>⚠️ No user email found. Please log in again.</p>;

  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #e0f8d8, #a7c97c, #79b85b)',
      padding: '2rem',
      fontFamily: 'Segoe UI, sans-serif',
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      backgroundColor: '#fff',
      borderRadius: '10px',
      padding: '2rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    sectionTitle: {
      textAlign: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '2rem',
    },
    th: {
      backgroundColor: '#4CAF50',
      color: '#fff',
      padding: '10px',
    },
    td: {
      padding: '10px',
      borderBottom: '1px solid #eee',
      textAlign: 'center',
    },
    rowHover: {
      cursor: 'pointer',
    },
    select: {
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '15px',
      marginLeft: '8px',
    },
    input: {
      padding: '6px',
      borderRadius: '6px',
      border: '1px solid #ccc',
    },
    button: {
      backgroundColor: '#2196F3',
      color: '#fff',
      border: 'none',
      padding: '6px 16px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    miniSection: {
      marginTop: '2rem',
      paddingTop: '1rem',
      borderTop: '2px dashed #ccc',
    }
  };

  return (
    <div style={styles.page}>
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

        <h2 style={styles.sectionTitle}>📊 Profit Report</h2>

        <div style={{ marginBottom: "1.5rem" }}>
          <label><strong>Select Year:</strong>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} style={styles.select}>
              {[...Array(5)].map((_, i) => {
                const y = currentYear - i;
                return <option key={y} value={y}>{y}</option>;
              })}
            </select>
          </label>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Month</th>
              <th style={styles.th}>Total Profit (৳)</th>
            </tr>
          </thead>
          <tbody>
            {months.map((monthName, idx) => {
              const profitEntry = monthlyProfits.find(p => p.date === monthName);
              const profit = profitEntry ? profitEntry.profit : 0;

              return (
                <tr
                  key={idx}
                  style={styles.rowHover}
                  onClick={() => handleMonthClick(monthName)}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#f9f9f9"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#fff"}
                >
                  <td style={styles.td}>{monthName}</td>
                  <td style={styles.td}>{profit.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <td style={styles.td}><strong>Year Total</strong></td>
              <td style={styles.td}><strong>৳ {yearTotal.toFixed(2)}</strong></td>
            </tr>
          </tfoot>
        </table>

        <h3 style={styles.sectionTitle}>📅 Filter by Date Range</h3>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <label>From:
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={styles.input} />
          </label>
          <label>To:
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={styles.input} />
          </label>
          <button onClick={fetchFilteredData} style={styles.button}>Filter</button>
        </div>

        {(filteredSales.length > 0 || filteredDamages.length > 0) && (
          <div style={styles.miniSection}>
            <p><strong>Total Income from Sales:</strong> ৳ {getFilteredIncome().toFixed(2)}</p>
            <p><strong>Profit from Sales:</strong> ৳ {getFilteredProfit().toFixed(2)}</p>

            <h4>🧾 Items Sold</h4>
            <table style={styles.table} border="1">
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Quantity Sold</th>
                  <th style={styles.th}>Total Earned (৳)</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((s, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.quantitySold}</td>
                    <td style={styles.td}>{(s.quantitySold * s.sellPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ marginTop: "1rem" }}>🧯 Items Damaged</h4>
            <table style={styles.table} border="1">
              <thead>
                <tr>
                  <th style={styles.th}>Product</th>
                  <th style={styles.th}>Quantity Damaged</th>
                </tr>
              </thead>
              <tbody>
                {filteredDamages.map((d, i) => (
                  <tr key={i}>
                    <td style={styles.td}>{d.name}</td>
                    <td style={styles.td}>{d.quantityDamaged}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Report;
