import { useState } from "react";
import TaskForm from "./TaskForm.jsx";

const priorityColor = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const TaskItem = ({ task, onToggle, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <TaskForm
        initial={task}
        onCancel={() => setEditing(false)}
        onSubmit={(data) => {
          onUpdate(task._id, data);
          setEditing(false);
        }}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3 flex-1">
        <input
          type="checkbox"
          checked={task.status === "completed"}
          onChange={() => onToggle(task._id)}
          className="mt-1.5 h-4 w-4"
        />
        <div className="flex-1">
          <p className={`font-medium ${task.status === "completed" ? "line-through text-slate-400" : "text-slate-800"}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="text-sm text-slate-500 mt-0.5">{task.description}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColor[task.priority]}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task._id)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
