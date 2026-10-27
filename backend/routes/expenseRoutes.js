const express = require("express");
const mongoose = require("mongoose");
const Expense = require("../models/Expense");

const router = express.Router();

// Helper to format validation errors cleanly
const handleError = (res, err) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid data format" });
  }
  return res.status(500).json({ message: err.message || "Server error occurred" });
};

// Middleware to check if id parameter is a valid MongoDB ObjectId
const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid expense ID format" });
  }
  next();
};

// @route   POST /api/expenses
// @desc    Create a new expense
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Explicit validation
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ message: "Title cannot be empty" });
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number greater than 0" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const expense = await Expense.create({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date,
    });

    res.status(201).json(expense);
  } catch (err) {
    handleError(res, err);
  }
});

// @route   GET /api/expenses
// @desc    Get all expenses (newest first)
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    handleError(res, err);
  }
});

// @route   GET /api/expenses/:id
// @desc    Get single expense by ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (err) {
    handleError(res, err);
  }
});

// @route   PUT /api/expenses/:id
// @desc    Update an expense by ID
router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const updates = {};
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({ message: "Title cannot be empty" });
      }
      updates.title = title.trim();
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({ message: "Amount must be a positive number greater than 0" });
      }
      updates.amount = parsedAmount;
    }

    if (category !== undefined) {
      updates.category = category;
    }

    if (date !== undefined) {
      if (!date) {
        return res.status(400).json({ message: "Date is required" });
      }
      updates.date = date;
    }

    const expense = await Expense.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch (err) {
    handleError(res, err);
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense by ID
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted successfully", id: req.params.id });
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
