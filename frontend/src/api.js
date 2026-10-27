const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api/expenses";

async function request(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    if (err.message === "Failed to fetch") {
      throw new Error("Unable to connect to backend server. Please verify the backend is running on port 5000.");
    }
    throw err;
  }
}

export const getExpenses = () => request(API);
export const getExpenseById = (id) => request(`${API}/${id}`);
export const addExpense = (expense) =>
  request(API, {
    method: "POST",
    body: JSON.stringify(expense),
  });
export const updateExpense = (id, expense) =>
  request(`${API}/${id}`, {
    method: "PUT",
    body: JSON.stringify(expense),
  });
export const deleteExpense = (id) =>
  request(`${API}/${id}`, {
    method: "DELETE",
  });
