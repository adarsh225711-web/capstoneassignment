# 💳 Personal Expense Tracker (MERN Stack)

A full-stack web application built using the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) to record, track, and manage daily personal expenses efficiently with real-time summary calculations and responsive UI/UX.

---

## 📁 Repository Structure

```text
project-root/
├── backend/
│   ├── models/
│   │   └── Expense.js          # Mongoose schema with validations
│   ├── routes/
│   │   └── expenseRoutes.js    # Express RESTful API routes (CRUD)
│   ├── .env                    # Test/evaluator database configuration
│   ├── .env.example            # Environment variable template
│   ├── package.json            # Backend dependencies & scripts
│   └── server.js               # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ExpenseForm.jsx # Add & Edit expense form with validation
│   │   │   └── ExpenseList.jsx # Responsive table/card view, search, filter
│   │   ├── api.js              # Centralized API service methods
│   │   ├── App.jsx             # Main dashboard with real-time summary cards
│   │   ├── index.css           # Modern responsive styling & animations
│   │   └── main.jsx            # React root mount
│   ├── .env                    # Frontend environment configuration
│   ├── .env.example            # Frontend environment template
│   ├── index.html              # HTML5 entry point
│   ├── package.json            # Frontend dependencies & scripts
│   └── vite.config.js          # Vite configuration
├── .gitignore                  # Git ignore rules (includes .env as per instructions)
└── README.md                   # Complete documentation
```

---

## ✨ Features & Requirements Addressed

1. **Add Expense**:
   - Fields: Title, Amount, Category (`Food`, `Travel`, `Bills`, `Shopping`, `Other`), and Date.
   - Form validation prevents empty title, invalid/negative amounts (≤ 0), or missing date.
   - Saves record directly to **MongoDB Atlas** via REST API.
   - Displays clear success/failure toast notifications.

2. **View Expenses**:
   - Displays all recorded expenses showing Title, Amount (₹), Category badge, and formatted Date.
   - **Auto-refreshes** immediately after any Add, Edit, or Delete operation without requiring a manual page reload.
   - Includes real-time search by title/category, category filter pills with counts, and multi-field sorting (Date, Amount).

3. **Edit Expense**:
   - Each record includes an **Edit** button.
   - Clicking Edit scrolls to the form and pre-fills all existing data.
   - Visual "Editing Mode" indicator and Cancel option.
   - Saving updates the database record and updates the list and totals on screen.

4. **Delete Expense**:
   - Each expense includes a **Delete** button.
   - Prompts a confirmation dialog before permanently removing the record.
   - Instantly updates the database and frontend display.

5. **Summary Dashboard**:
   - Prominently displays **Total Amount Spent** at the top of the page.
   - Dynamically recalculates whenever an expense is added, edited, or deleted.
   - Additional stat cards: Total Transactions, Top Spending Category, and Average Spending.

6. **Backend & Database**:
   - RESTful API endpoints implemented in Node.js and Express.js for CRUD operations.
   - Hosted on **MongoDB Atlas** using Mongoose ODM with schema validations.

7. **UI/UX**:
   - Clean, modern, intuitive interface with custom CSS variables, gradients, and subtle shadows.
   - **Fully responsive**: Adapts seamlessly from large desktop monitors to tablet and mobile screens (converts table into readable cards on mobile).

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, JavaScript (ES6+), CSS3 (Flexbox & CSS Grid)
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Database**: MongoDB Atlas with Mongoose ODM
- **Tools**: Git, npm

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# The .env file is already provided with test MongoDB Atlas credentials:
# PORT=5000
# MONGO_URI=mongodb+srv://adarsh225711_db_user:FTnAF3_zSFXMXY5@cluster0.jsmtxxj.mongodb.net/expense_tracker?retryWrites=true&w=majority

# Start the backend server
npm start
# (or 'npm run dev' for development with nodemon)
```

The backend server will start at: `http://localhost:5000`

### 2. Frontend Setup

Open a new terminal window:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will start at: `http://localhost:5173`

---

## 📡 RESTful API Reference

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/health` | Service health & MongoDB status | None |
| `GET` | `/api/expenses` | Get all expenses (newest first) | None |
| `GET` | `/api/expenses/:id` | Get single expense by ID | None |
| `POST` | `/api/expenses` | Create a new expense | `{ title, amount, category, date }` |
| `PUT` | `/api/expenses/:id` | Update an existing expense | `{ title, amount, category, date }` |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID | None |

---

## ✅ Evaluation Checklist

- [x] Repository contains complete `frontend/` and `backend/` project structure.
- [x] `.env` file is included with test MongoDB Atlas database connection string.
- [x] `package.json` in both frontend and backend list all dependencies.
- [x] Project connects to MongoDB Atlas and works out of the box after fresh clone & `npm install`.
- [x] Add, View, Edit, and Delete work end-to-end with live updates.
- [x] Total Amount Spent is displayed prominently at the top and auto-updates.
- [x] Clean, modern, responsive UI on mobile and desktop devices.
