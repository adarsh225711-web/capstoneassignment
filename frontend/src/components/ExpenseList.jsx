import { useState, useMemo } from "react";

const CATEGORY_META = {
  Food: { icon: "🍔", className: "tag-food" },
  Travel: { icon: "✈️", className: "tag-travel" },
  Bills: { icon: "📄", className: "tag-bills" },
  Shopping: { icon: "🛍️", className: "tag-shopping" },
  Other: { icon: "🏷️", className: "tag-other" },
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function ExpenseList({
  expenses,
  loading,
  editingId,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date-desc");

  const categories = ["All", "Food", "Travel", "Bills", "Shopping", "Other"];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: expenses.length };
    categories.slice(1).forEach((cat) => {
      counts[cat] = expenses.filter((e) => e.category === cat).length;
    });
    return counts;
  }, [expenses]);

  // Filtered and sorted expenses
  const filteredExpenses = useMemo(() => {
    let result = [...expenses];

    // Filter by category
    if (selectedCategory !== "All") {
      result = result.filter((e) => e.category === selectedCategory);
    }

    // Filter by search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "date-desc") return new Date(b.date) - new Date(a.date);
      if (sortBy === "date-asc") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount-desc") return b.amount - a.amount;
      if (sortBy === "amount-asc") return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [expenses, selectedCategory, search, sortBy]);

  const filteredTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  if (loading) {
    return (
      <div className="card list-card">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading expenses from MongoDB Atlas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card list-card">
      <div className="list-header">
        <div>
          <h3>📋 Expense History</h3>
          <p className="list-subtitle">
            Showing {filteredExpenses.length} of {expenses.length} records
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {filteredExpenses.length !== expenses.length && (
              <span> (Filtered Subtotal: {formatCurrency(filteredTotal)})</span>
            )}
          </p>
        </div>
      </div>

      {/* Toolbar: Search, Filters & Sort */}
      <div className="toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select">Sort:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Date: Newest First</option>
            <option value="date-asc">Date: Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="category-pills">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            className={`pill-btn ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "All" ? "🏷️ All" : `${CATEGORY_META[cat]?.icon || ""} ${cat}`}
            <span className="pill-count">{categoryCounts[cat] || 0}</span>
          </button>
        ))}
      </div>

      {/* Expenses Table or Empty State */}
      {expenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🪙</div>
          <h4>No expenses recorded yet</h4>
          <p>Add your first expense using the form to start tracking your spending!</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔎</div>
          <h4>No matching expenses found</h4>
          <p>Try adjusting your search terms or category filter.</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSearch("");
              setSelectedCategory("All");
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="expenses-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => {
                const meta = CATEGORY_META[expense.category] || {
                  icon: "🏷️",
                  className: "tag-other",
                };
                const isCurrentEdit = editingId === expense._id;

                return (
                  <tr
                    key={expense._id}
                    className={isCurrentEdit ? "row-highlight" : ""}
                  >
                    <td data-label="Title" className="col-title">
                      <span className="title-text">{expense.title}</span>
                    </td>
                    <td data-label="Amount" className="col-amount">
                      <span className="amount-text">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td data-label="Category" className="col-category">
                      <span className={`category-tag ${meta.className}`}>
                        <span className="cat-icon">{meta.icon}</span>
                        <span>{expense.category}</span>
                      </span>
                    </td>
                    <td data-label="Date" className="col-date">
                      <span className="date-text">
                        {formatDate(expense.date)}
                      </span>
                    </td>
                    <td data-label="Actions" className="col-actions">
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-action btn-edit"
                          onClick={() => onEdit(expense)}
                          title="Edit this expense"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => onDelete(expense)}
                          title="Delete this expense"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
