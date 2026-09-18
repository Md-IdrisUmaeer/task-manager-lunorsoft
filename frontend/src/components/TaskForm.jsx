import { useState } from "react";

const emptyForm = { title: "", description: "", priority: "medium", dueDate: "" };

const TaskForm = ({ onSubmit, initial, onCancel }) => {
  const [form, setForm] = useState(initial || emptyForm);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    // Only block past due dates when creating a new task - an existing
    // task may already be overdue and its other fields should still be
    // editable without being forced to change/clear the due date.
    if (!initial && form.dueDate) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      if (new Date(form.dueDate) < startOfToday) {
        setError("Due date cannot be in the past");
        return;
      }
    }
    setError("");
    onSubmit(form);
    if (!initial) setForm(emptyForm);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6 space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <input
        name="title"
        placeholder="Task title"
        value={form.title}
        onChange={handleChange}
        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={form.description}
        onChange={handleChange}
        rows={2}
        className="w-full border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border border-slate-300 rounded-md px-3 py-2 flex-1"
        >
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate ? form.dueDate.slice(0, 10) : ""}
          onChange={handleChange}
          min={initial ? undefined : new Date().toISOString().slice(0, 10)}
          className="border border-slate-300 rounded-md px-3 py-2 flex-1"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-brand-dark text-white px-4 py-2 rounded-md hover:bg-brand-teal transition"
        >
          {initial ? "Save changes" : "Add task"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-slate-300 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
