import { useState, useEffect } from "react";

const CATEGORIES = [
  { value: "Food", label: "🍔 Food" },
  { value: "Travel", label: "✈️ Travel" },
  { value: "Bills", label: "📄 Bills" },
  { value: "Shopping", label: "🛍️ Shopping" },
  { value: "Other", label: "🏷️ Other" },
];

const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateForInput = (dateVal) => {
  if (!dateVal) return getTodayDate();
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return getTodayDate();
    return d.toISOString().slice(0, 10);
  } catch {
    return getTodayDate();
  }
};

export default function ExpenseForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: getTodayDate(),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title || "",
        amount: editing.amount !== undefined ? String(editing.amount) : "",
        category: editing.category || "Food",
        date: formatDateForInput(editing.date),
      });
      setError("");
    } else {
      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: getTodayDate(),
      });
      setError("");
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSetToday = () => {
    setForm((prev) => ({ ...prev, date: getTodayDate() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      setError("Please enter an expense title.");
      return;
    }

    const parsedAmount = parseFloat(form.amount);
    if (form.amount === "" || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Amount must be a positive number greater than 0.");
      return;
    }

    if (!form.date) {
      setError("Please select a valid date.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    const success = await onSave({
      title: trimmedTitle,
      amount: parsedAmount,
      category: form.category,
      date: form.date,
    });

    setIsSubmitting(false);

    if (success && !editing) {
      setForm({
        title: "",
        amount: "",
        category: "Food",
        date: getTodayDate(),
      });
    }
  };

  return (
    <div className={`card form-card ${editing ? "editing-mode" : ""}`}>
      <div className="form-header">
        <div>
          <h3>{editing ? "✏️ Edit Expense" : "➕ Add New Expense"}</h3>
          <p className="form-subtitle">
            {editing
              ? `Update details for "${editing.title}"`
              : "Enter your transaction details below"}
          </p>
        </div>
        {editing && (
          <span className="badge-editing">Editing</span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="form-alert error-alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="title">
            Expense Title <span className="req">*</span>
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g., Grocery shopping, Electricity bill"
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">
            Amount (₹) <span className="req">*</span>
          </label>
          <div className="input-prefix-wrapper">
            <span className="input-prefix">₹</span>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category <span className="req">*</span>
          </label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="label-with-action">
            <label htmlFor="date">
              Date <span className="req">*</span>
            </label>
            <button
              type="button"
              className="btn-link"
              onClick={handleSetToday}
            >
              Set Today
            </button>
          </div>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : editing
              ? "Update Expense"
              : "Add Expense"}
          </button>

          {editing ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          ) : (
            (form.title || form.amount) && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setForm({
                    title: "",
                    amount: "",
                    category: "Food",
                    date: getTodayDate(),
                  })
                }
              >
                Clear
              </button>
            )
          )}
        </div>
      </form>
    </div>
  );
}
