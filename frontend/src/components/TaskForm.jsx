import { useState } from "react";
import { createTask } from "../services/api";

function TaskForm({ columns, onTaskCreated, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [columnId, setColumnId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("1. FORM SUBMITTED");

    const payload = {
        column_id: Number(columnId),
        title,
        description,
        priority,
    };

    console.log("2. PAYLOAD:", payload);

    try {
        console.log("3. CALLING CREATE TASK API");

        const response = await createTask(payload);

        console.log("4. API SUCCESS:", response.data);

        onTaskCreated(response.data);
        onClose();

    } catch (error) {
        console.error("5. CREATE TASK FAILED");
        console.error("ERROR:", error);
        console.error("RESPONSE:", error.response?.data);
        console.error("STATUS:", error.response?.status);
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
            onChange={(event) => setTitle(event.target.value)}
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
            onChange={(event) =>
              setColumnId(event.target.value)
            }
            required
          >
            <option value="">Select column</option>

            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>

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