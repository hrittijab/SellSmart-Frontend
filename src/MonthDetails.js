import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const MonthDetails = () => {
  const { year, month } = useParams();
  const [dailyProfits, setDailyProfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDailyProfits = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const token = localStorage.getItem("jwtToken");

        if (!email || !token) {
          alert("Unauthorized. Please log in.");
          navigate("/");
          return;
        }

        const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
        const paddedMonth = String(monthIndex + 1).padStart(2, "0");
        const fullMonth = `${year}-${paddedMonth}`;

        const res = await fetch(
          `https://sellsmart-backend.onrender.com/api/sales/profit-summary?email=${email}&month=${fullMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await res.json();
        setDailyProfits(data);
      } catch (err) {
        console.error("Error fetching daily profits:", err);
      } finally {
        setLoading(false);
      }
    };

    if (year && month) {
      fetchDailyProfits();
    }
  }, [year, month, navigate]);

  const formatDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-");
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${parseInt(day)} ${monthNames[parseInt(month, 10) - 1]} ${year}`;
  };

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
    backLink: {
      display: "inline-block",
      marginBottom: "1.5rem",
      padding: "8px 16px",
      backgroundColor: "#007BFF",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "6px",
      fontWeight: "bold",
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      transition: "background-color 0.3s ease",
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
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>
          📅 Daily Profits for {month} {year}
        </h2>

        <Link
          to="/report"
          style={styles.backLink}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
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
                    {formatDate(day.date)}
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
