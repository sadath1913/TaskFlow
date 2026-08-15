import { useState } from "react";
import { updateTask } from "../services/api";

function EditTaskForm({ task, onTaskUpdated, onClose }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(
    task.description || ""
  );
  const [priority, setPriority] = useState(task.priority);

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Validate title
    if (!title || !title.trim()) {
      setError("Please enter a valid task title.");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      priority,
    };

    try {
      const response = await updateTask(
        task.id,
        payload
      );

      onTaskUpdated(response.data);
      onClose();

    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );

      console.error(
        "RESPONSE:",
        error.response?.data
      );

      setError(
        error.response?.data?.detail?.[0]?.msg ||
        "Failed to update task. Please try again."
      );
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <h2>Edit Task</h2>

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskForm;