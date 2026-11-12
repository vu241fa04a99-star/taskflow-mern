import express from "express";
import Task from "../models/Task.js";

const router = express.Router();

// Get all tasks
router.get("/", async (_req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Could not fetch tasks." });
  }
});

// Create a task
router.post("/", async (req, res) => {
  try {
    const title = req.body.title?.trim();
    if (!title) return res.status(400).json({ message: "Task title is required." });

    const task = await Task.create({
      title,
      description: req.body.description || ""
    });
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Could not create task." });
  }
});

// Update task completion
router.patch("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: Boolean(req.body.completed) },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch {
    res.status(400).json({ message: "Invalid task ID or update." });
  }
});

// Delete a task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted." });
  } catch {
    res.status(400).json({ message: "Invalid task ID." });
  }
});

export default router;
