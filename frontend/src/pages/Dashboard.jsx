import { useEffect, useMemo, useState } from "react";
import api from "../api/axios.js";
import TaskForm from "../components/TaskForm.jsx";
import TaskItem from "../components/TaskItem.jsx";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "overdue", label: "Not Completed" },
  { key: "completed", label: "Completed" },
];

const isOverdue = (task) =>
  task.status === "pending" && task.dueDate && new Date(task.dueDate) < new Date();

const PRIORITY_FILTERS = [
  { key: "none", label: "None" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

// Sorts tasks by priority (high -> medium -> low) then by how close the due
// date is (soonest first). Tasks without a due date sink to the bottom of
// their priority tier.
const sortTasks = (list) =>
  [...list].sort((a, b) => {
    const pa = PRIORITY_RANK[a.priority] ?? 1;
    const pb = PRIORITY_RANK[b.priority] ?? 1;
    if (pa !== pb) return pa - pb;

    const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
    const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
    return da - db;
  });

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("none");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // "all" and "pending" both only show active tasks - once a task is
  // completed it drops out of view here and only shows up in "Completed".
  const fetchTasks = async (status = filter) => {
    setLoading(true);
    setError("");
    try {
      const query = status === "completed" ? "?status=completed" : "?status=pending";
      const { data } = await api.get(`/tasks${query}`);
      setTasks(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks(filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleCreate = async (form) => {
    try {
      const { data } = await api.post("/tasks", form);
      if (filter !== "completed") {
        setTasks((prev) => [data, ...prev]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    }
  };

  const handleUpdate = async (id, form) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, form);
      setTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleToggle = async (id) => {
    try {
      const { data } = await api.patch(`/tasks/${id}/toggle`);
      const belongsHere = filter === "completed" ? data.status === "completed" : data.status === "pending";
      setTasks((prev) =>
        belongsHere ? prev.map((t) => (t._id === id ? data : t)) : prev.filter((t) => t._id !== id)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete task");
    }
  };

  const visibleTasks = useMemo(() => {
    let list = tasks;

    if (filter === "overdue") {
      list = list.filter(isOverdue);
    }

    if (priorityFilter !== "none") {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    const query = search.trim().toLowerCase();
    if (query) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    return sortTasks(list);
  }, [tasks, filter, priorityFilter, search]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Your Tasks</h1>

      <TaskForm onSubmit={handleCreate} />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks by title or description..."
        className="w-full border border-slate-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-teal"
      />

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              filter === f.key
                ? "bg-brand-dark text-white"
                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide mr-1">
          Priority
        </span>
        {PRIORITY_FILTERS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPriorityFilter(p.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
              priorityFilter === p.key
                ? "bg-brand-dark text-white"
                : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading tasks...</p>
      ) : visibleTasks.length === 0 ? (
        <p className="text-slate-500 text-sm">No tasks here yet.</p>
      ) : (
        <div className="space-y-3">
          {visibleTasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
