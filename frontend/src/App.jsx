import { useEffect, useState, useMemo, useRef } from "react";
import ExpenseForm from "./components/ExpenseForm.jsx";
import ExpenseList from "./components/ExpenseList.jsx";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "./api.js";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: '' }
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState("checking");

  const formRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (type, message) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ type, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(Array.isArray(data) ? data : []);
      setDbStatus("connected");
    } catch (err) {
      setDbStatus("error");
      showToast("error", err.message || "Failed to load expenses from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  // Summary calculations
  const totalAmount = useMemo(() => {
    return expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  }, [expenses]);

  const totalCount = expenses.length;

  const averageExpense = useMemo(() => {
    return totalCount > 0 ? totalAmount / totalCount : 0;
  }, [totalAmount, totalCount]);

  const topCategory = useMemo(() => {
    if (expenses.length === 0) return { category: "None", amount: 0 };
    const catMap = {};
    expenses.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + e.amount;
    });
    let topCat = "None";
    let max = 0;
    for (const [cat, amt] of Object.entries(catMap)) {
      if (amt > max) {
        max = amt;
        topCat = cat;
      }
    }
    return { category: topCat, amount: max };
  }, [expenses]);

  // Handle Create or Update
  const handleSaveExpense = async (data) => {
    try {
      if (editing) {
        await updateExpense(editing._id, data);
        showToast("success", `Updated "${data.title}" successfully!`);
        setEditing(null);
      } else {
        await addExpense(data);
        showToast("success", `Added "${data.title}" successfully!`);
      }
      // Automatic refresh after add/edit
      await loadExpenses();
      return true;
    } catch (err) {
      showToast("error", err.message || "Operation failed. Please try again.");
      return false;
    }
  };

  // Handle Edit initiation
  const handleStartEdit = (expense) => {
    setEditing(expense);
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Handle Delete with confirmation
  const handleDeleteExpense = async (expense) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${expense.title}" (${formatCurrency(expense.amount)})?`
    );
    if (!confirmed) return;

    try {
      await deleteExpense(expense._id);
      if (editing?._id === expense._id) {
        setEditing(null);
      }
      showToast("success", `Expense "${expense.title}" deleted successfully!`);
      // Automatic refresh after delete
      await loadExpenses();
    } catch (err) {
      showToast("error", err.message || "Failed to delete expense.");
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <span className="brand-logo">💳</span>
            <div>
              <h1 className="brand-title">Personal Expense Tracker</h1>
              <p className="brand-tagline">MERN Stack • Full-Stack Daily Budget Manager</p>
            </div>
          </div>
          <div className="db-indicator">
            <span
              className={`status-dot ${
                dbStatus === "connected"
                  ? "dot-green"
                  : dbStatus === "error"
                  ? "dot-red"
                  : "dot-amber"
              }`}
            ></span>
            <span className="status-label">
              {dbStatus === "connected"
                ? "MongoDB Atlas Online"
                : dbStatus === "error"
                ? "Connection Error"
                : "Connecting..."}
            </span>
          </div>
        </div>
      </header>

      <main className="main-container">
        {/* Toast Alert */}
        {toast && (
          <aside
            className={`toast toast-${toast.type}`}
            role="status"
            aria-live="polite"
          >
            <span className="toast-icon">
              {toast.type === "success" ? "✅" : "⚠️"}
            </span>
            <span className="toast-text">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => setToast(null)}
              aria-label="Close notification"
            >
              ✕
            </button>
          </aside>
        )}

        {/* Summary Metric Cards */}
        <section className="summary-section" aria-label="Expense Summary">
          {/* Primary Summary: Total Amount Spent */}
          <div className="summary-card total-card">
            <div className="summary-card-header">
              <span className="summary-label">Total Amount Spent</span>
              <span className="summary-icon">💰</span>
            </div>
            <div className="summary-value highlight-amount">
              {formatCurrency(totalAmount)}
            </div>
            <div className="summary-subtext">
              Across all {totalCount} recorded {totalCount === 1 ? "expense" : "expenses"}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-label">Total Transactions</span>
              <span className="summary-icon">🧾</span>
            </div>
            <div className="summary-value">{totalCount}</div>
            <div className="summary-subtext">Expenses logged in database</div>
          </div>

          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-label">Top Category</span>
              <span className="summary-icon">📊</span>
            </div>
            <div className="summary-value summary-cat">
              {topCategory.category !== "None" ? topCategory.category : "—"}
            </div>
            <div className="summary-subtext">
              {topCategory.category !== "None"
                ? formatCurrency(topCategory.amount)
                : "No data yet"}
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-card-header">
              <span className="summary-label">Average Spending</span>
              <span className="summary-icon">📈</span>
            </div>
            <div className="summary-value">{formatCurrency(averageExpense)}</div>
            <div className="summary-subtext">Per logged expense</div>
          </div>
        </section>

        {/* Content Layout: Form & List */}
        <div className="content-grid">
          <div ref={formRef} className="form-column">
            <ExpenseForm
              key={editing?._id || "create-new"}
              editing={editing}
              onSave={handleSaveExpense}
              onCancel={() => setEditing(null)}
            />
          </div>

          <div className="list-column">
            <ExpenseList
              expenses={expenses}
              loading={loading}
              editingId={editing?._id}
              onEdit={handleStartEdit}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>Personal Expense Tracker &bull; MERN Stack (MongoDB Atlas, Express, React, Node.js)</p>
      </footer>
    </div>
  );
}
