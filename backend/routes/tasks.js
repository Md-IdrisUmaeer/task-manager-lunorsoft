import express from "express";
import Task from "../models/Task.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

// GET /api/tasks?status=pending|completed
router.get("/", async (req, res) => {
  try {
    const filter = { owner: req.user.id };
    if (req.query.status && ["pending", "completed"].includes(req.query.status)) {
      filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks", error: err.message });
  }
});

// GET /api/tasks/stats
// Returns aggregate counts for the current user, plus a score of
// +5 per completed task and -3 per task that's overdue (past its due
// date and still pending).
router.get("/stats", async (req, res) => {
  try {
    const now = new Date();
    const tasks = await Task.find({ owner: req.user.id });

    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const notCompleted = tasks.filter(
      (t) => t.status === "pending" && t.dueDate && new Date(t.dueDate) < now
    ).length;
    const due = tasks.filter(
      (t) => t.status === "pending" && (!t.dueDate || new Date(t.dueDate) >= now)
    ).length;

    const score = completed * 5 - notCompleted * 3;

    res.json({ total, completed, due, notCompleted, score });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats", error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (dueDate) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      if (new Date(dueDate) < startOfToday) {
        return res.status(400).json({ message: "Due date cannot be in the past" });
      }
    }
    const task = await Task.create({
      owner: req.user.id,
      title: title.trim(),
      description,
      priority,
      dueDate,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    const { title, description, priority, dueDate, status } = req.body;
    if (title !== undefined) {
      if (!title.trim()) return res.status(400).json({ message: "Title cannot be empty" });
      task.title = title.trim();
    }
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to update task", error: err.message });
  }
});

router.patch("/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle task", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task", error: err.message });
  }
});

export default router;
