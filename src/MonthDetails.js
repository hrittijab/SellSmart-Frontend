import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const MonthDetails = () => {
  const { year, month } = useParams();
  const email = localStorage.getItem("userEmail");
  const [dailyProfits, setDailyProfits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyProfits = async () => {
      try {
        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const paddedMonth = String(monthIndex + 1).padStart(2, "0");
        const fullMonth = `${year}-${paddedMonth}`;

        const res = await fetch(
          `http://localhost:8080/api/sales/profit-summary?email=${email}&month=${fullMonth}`
        );
        const data = await res.json();
        setDailyProfits(data);
      } catch (err) {
        console.error("Error fetching daily profits:", err);
      } finally {
        setLoading(false);
      }
    };

    if (email && year && month) {
      fetchDailyProfits();
    }
  }, [email, year, month]);

  const styles = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #e9fbe4, #c0e8a9)",
      padding: "2rem",
      fontFamily: "Segoe UI, sans-serif",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      background: "#fff",
      borderRadius: "10px",
      padding: "2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "1rem",
      textAlign: "center",
    },
    link: {
      display: "inline-block",
      marginBottom: "1rem",
      textDecoration: "none",
      color: "#007BFF",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      marginTop: "1rem",
    },
    th: {
      backgroundColor: "#4CAF50",
      color: "#fff",
      padding: "10px",
    },
    td: {
      padding: "10px",
      borderBottom: "1px solid #eee",
      textAlign: "center",
    },
    noData: {
      textAlign: "center",
      fontStyle: "italic",
      color: "#555",
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>📅 Daily Profits for {month} {year}</h2>
    <Link to="/report" style={{
    display: "inline-block",
    marginBottom: "1.5rem",
    padding: "8px 16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
    transition: "background-color 0.3s ease"
    }}
    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0056b3"}
    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#007BFF"}
    >
    ← Back to Report
    </Link>

        {loading ? (
          <p style={styles.noData}>Loading...</p>
        ) : dailyProfits.length === 0 ? (
          <p style={styles.noData}>No sales data for this month.</p>
        ) : (
          <table style={styles.table} border="1">
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Profit (৳)</th>
              </tr>
            </thead>
            <tbody>
              {dailyProfits.map((day, i) => (
                <tr key={i}>
                  <td style={styles.td}>
                    {new Date(day.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </td>
                  <td style={styles.td}>{day.profit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MonthDetails;
