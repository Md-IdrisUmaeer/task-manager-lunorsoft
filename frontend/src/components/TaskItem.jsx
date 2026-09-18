import { useState } from "react";
import TaskForm from "./TaskForm.jsx";
import ConfirmModal from "./ConfirmModal.jsx";

const priorityColor = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const TaskItem = ({ task, onToggle, onDelete, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const isCompleted = task.status === "completed";
  const isOverdue =
    !isCompleted && task.dueDate && new Date(task.dueDate) < new Date();

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
    <div
      className={`bg-white rounded-lg shadow p-4 flex items-start justify-between gap-4 ${
        isOverdue ? "border-l-4 border-red-500" : ""
      }`}
    >
      <div className="flex items-start gap-3 flex-1">
        {!isCompleted && (
          <input
            type="checkbox"
            checked={false}
            onChange={() => onToggle(task._id)}
            className="mt-1.5 h-4 w-4"
          />
        )}
        <div className="flex-1">
          <p className={`font-medium ${isCompleted ? "line-through text-slate-400" : "text-slate-800"}`}>
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
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isOverdue ? "bg-red-100 text-red-700 font-medium" : "bg-slate-100 text-slate-600"
                }`}
              >
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {isOverdue && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-600 text-white font-medium">
                Overdue
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
          onClick={() => setConfirmingDelete(true)}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>

      {confirmingDelete && (
        <ConfirmModal
          title="Delete task?"
          message={`This will permanently delete "${task.title}". This can't be undone.`}
          confirmLabel="Delete"
          onCancel={() => setConfirmingDelete(false)}
          onConfirm={() => {
            setConfirmingDelete(false);
            onDelete(task._id);
          }}
        />
      )}
    </div>
  );
};

export default TaskItem;
