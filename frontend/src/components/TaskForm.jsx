import { useState } from "react";
import { createTask } from "../services/api";

function TaskForm({ columns, onTaskCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [columnId, setColumnId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Validate title
    if (!title || !title.trim()) {
      setError("Please enter a valid task title.");
      return;
    }

    // Validate column
    if (!columnId) {
      setError("Please select a column.");
      return;
    }

    const payload = {
      column_id: Number(columnId),
      title: title.trim(),
      description: description.trim(),
      priority,
    };

    console.log(" PAYLOAD:", payload);

    try {
      console.log(" CALLING CREATE TASK API");

      const response = await createTask(payload);

      console.log(" API SUCCESS:", response.data);

      onTaskCreated(response.data);
      onClose();

    } catch (error) {
      console.error("5. CREATE TASK FAILED");
      console.error("ERROR:", error);
      console.error("RESPONSE:", error.response?.data);
      console.error("STATUS:", error.response?.status);

      setError(
        error.response?.data?.detail?.[0]?.msg ||
        "Failed to create task. Please try again."
      );
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h2>Create Task</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setError("");
            }}
            required
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

          <select
            value={priority}
            onChange={(event) =>
              setPriority(event.target.value)
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={columnId}
            onChange={(event) => {
              setColumnId(event.target.value);
              setError("");
            }}
            required
          >
            <option value="">Select column</option>

            {columns.map((column) => (
              <option
                key={column.id}
                value={column.id}
              >
                {column.name}
              </option>
            ))}
          </select>

          {/* Validation / API error */}
          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <div className="task-form-actions">
            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit">
              Create Task
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default TaskForm;