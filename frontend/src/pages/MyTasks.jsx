import { useEffect, useMemo, useState } from "react";

import {
  getBoardTasks,
  getBoardColumns,
  deleteTask,
} from "../services/api";

function MyTasks({
  boards,
  selectedBoardId,
  onEditTask,
  updatedTask,
  onAddTask,
}) {
  const [allTasks, setAllTasks] = useState([]);
  const [columns, setColumns] = useState([]);

  const [search, setSearch] = useState("");
  const [priority, setPriority] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
   * =========================================
   * Load all tasks and columns
   * =========================================
   */

  useEffect(() => {
    const loadTasks = async () => {
        if (!selectedBoardId) {
        setAllTasks([]);
        setColumns([]);
        return;
        }

        setLoading(true);
        setError("");

        try {
        // Get tasks ONLY for selected board
        const taskResponse =
            await getBoardTasks(selectedBoardId);

        setAllTasks(taskResponse.data);

        // Get columns ONLY for selected board
        const columnResponse =
            await getBoardColumns(selectedBoardId);

        const boardColumns = columnResponse.data.map(
            (column) => ({
            ...column,
            board_id: selectedBoardId,
            })
        );

        setColumns(boardColumns);

        } catch (error) {
        console.error(
            "Failed to load selected board tasks:",
            error
        );

        setError("Failed to load tasks");
        setAllTasks([]);
        setColumns([]);
        } finally {
        setLoading(false);
        }
    };

    loadTasks();
    }, [selectedBoardId]);
  /*
   * =========================================
   * Handle task update
   *
   * Called by App after EditTaskForm
   * successfully updates the backend.
   * =========================================
   */

  useEffect(() => {
    if (!updatedTask) {
        return;
    }

    setAllTasks((currentTasks) =>
        currentTasks.map((task) =>
        task.id === updatedTask.id
            ? updatedTask
            : task
        )
    );
  }, [updatedTask]);

  /*
   * =========================================
   * Delete Task
   * =========================================
   */

  const handleDeleteTask = async (task) => {
    const confirmed = window.confirm(
      `Delete "${task.title}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);

      /*
       * Immediately remove task from UI.
       */

      setAllTasks((currentTasks) =>
        currentTasks.filter(
          (currentTask) =>
            currentTask.id !== task.id
        )
      );

    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );

      setError("Failed to delete task");
    }
  };

  /*
   * =========================================
   * Column lookup
   *
   * column.id → column
   * =========================================
   */

  const columnMap = useMemo(() => {
    const map = {};

    columns.forEach((column) => {
      map[column.id] = column;
    });

    return map;
  }, [columns]);

  /*
   * =========================================
   * Board lookup
   *
   * board.id → board
   * =========================================
   */

  const boardMap = useMemo(() => {
    const map = {};

    boards.forEach((board) => {
      map[board.id] = board;
    });

    return map;
  }, [boards]);

  /*
   * =========================================
   * Search + Priority filtering
   * =========================================
   */

  const filteredTasks = useMemo(() => {
    return allTasks.filter((task) => {
      const title =
        task.title?.toLowerCase() || "";

      const description =
        task.description?.toLowerCase() || "";

      const searchValue =
        search.toLowerCase();

      const matchesSearch =
        title.includes(searchValue) ||
        description.includes(searchValue);

      const matchesPriority =
        priority === "all" ||
        task.priority === priority;

      return (
        matchesSearch &&
        matchesPriority
      );
    });
  }, [
    allTasks,
    search,
    priority,
  ]);

  return (
    <main className="mytasks-page">

      {/* =========================================
          PAGE HEADER
      ========================================= */}

      <div className="mytasks-header">
        <div>
          <div className="mytasks-title-row">
            <h1>My Tasks</h1>

            <span className="mytasks-count">
              {allTasks.length}
            </span>
          </div>

          <p>
            View and manage all your tasks
          </p>
        </div>
        <button
            className="create-task-button"
            onClick={onAddTask}
        >
            + Task
        </button>
      </div>

      {/* =========================================
          FILTERS
      ========================================= */}

      <div className="mytasks-filters">

        <div className="mytask-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value)
          }
        >
          <option value="all">
            All priorities
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>
        </select>

      </div>

      {/* =========================================
          ERROR
      ========================================= */}

      {error && (
        <div className="tasks-error">
          {error}
        </div>
      )}

      {/* =========================================
          LOADING / EMPTY / TABLE
      ========================================= */}

      {loading ? (

        <div className="loading-message">
          Loading tasks...
        </div>

      ) : filteredTasks.length === 0 ? (

        <div className="mytasks-empty">
          No tasks found.
        </div>

      ) : (

        <div className="mytasks-table-container">

          <table className="mytasks-table">

            <thead>
              <tr>
                <th>Task</th>
                <th>Board</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredTasks.map((task) => {

                /*
                 * Task → Column
                 */

                const column =
                  columnMap[task.column_id];

                /*
                 * Column → Board
                 */

                const board =
                  column
                    ? boardMap[column.board_id]
                    : null;

                return (
                  <tr key={task.id}>

                    {/* TASK */}

                    <td>
                      <div className="task-table-title">
                        {task.title}
                      </div>

                      {task.description && (
                        <div className="task-table-description">
                          {task.description}
                        </div>
                      )}
                    </td>

                    {/* BOARD */}

                    <td>
                      {board?.name || "Unknown"}
                    </td>

                    {/* STATUS */}

                    <td>
                      <span className="status-badge">
                        {column?.name || "Unknown"}
                      </span>
                    </td>

                    {/* PRIORITY */}

                    <td>
                      <span
                        className={`priority-badge priority-${task.priority?.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    {/* ACTIONS */}

                    <td>

                      <div className="task-table-actions">

                        <button
                          onClick={() =>
                            onEditTask(task)
                          }
                        >
                          Edit
                        </button>

                        <button
                          className="danger"
                          onClick={() =>
                            handleDeleteTask(task)
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </main>
  );
}

export default MyTasks;