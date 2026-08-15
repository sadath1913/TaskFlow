import KanbanBoard from "../components/KanbanBoard";

function Dashboard({
  selectedBoard,
  columns,
  tasks,
  columnsLoading,
  tasksLoading,
  onEditTask,
  onDeleteTask,
  onMoveTask,
  onAddTask,
}) {
  /*
   * =========================================
   * Calculate task statistics
   * =========================================
   */

  const allTasks = Object.values(tasks || {}).flat();

  const totalTasks = allTasks.length;

  const completedTasks = columns.reduce(
    (count, column) => {
      const columnName =
        column.name?.toLowerCase() || "";

      if (
        columnName.includes("done") ||
        columnName.includes("completed")
      ) {
        return (
          count +
          (tasks[column.id]?.length || 0)
        );
      }

      return count;
    },
    0
  );

  const inProgressTasks = columns.reduce(
    (count, column) => {
      const columnName =
        column.name?.toLowerCase() || "";

      if (
        columnName.includes("progress")
      ) {
        return (
          count +
          (tasks[column.id]?.length || 0)
        );
      }

      return count;
    },
    0
  );

  const todoTasks = columns.reduce(
    (count, column) => {
      const columnName =
        column.name?.toLowerCase() || "";

      if (
        columnName.includes("to do") ||
        columnName.includes("todo")
      ) {
        return (
          count +
          (tasks[column.id]?.length || 0)
        );
      }

      return count;
    },
    0
  );

  return (
    <main className="page-content dashboard-page">

      {/* =========================================
          DASHBOARD HEADER
      ========================================= */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          {selectedBoard && (
            <p className="current-board">
              {selectedBoard.name}
            </p>
          )}
        </div>

        {selectedBoard && (
          <button
            className="add-task-button"
            onClick={onAddTask}
          >
            + Task
          </button>
        )}

      </div>


      {/* =========================================
          LOADING
      ========================================= */}

      {columnsLoading || tasksLoading ? (

        <div className="loading-message">
          Loading board...
        </div>

      ) : selectedBoard ? (

        <>

          {/* =====================================
              STATISTICS
          ===================================== */}

          <div className="dashboard-stats">

            {/* TOTAL */}

            <div className="stat-card stat-total">

              <div className="stat-icon">
                ✓
              </div>

              <div className="stat-content">
                <span>Total Tasks</span>
                <strong>{totalTasks}</strong>
              </div>

            </div>


            {/* COMPLETED */}

            <div className="stat-card stat-completed">

              <div className="stat-icon">
                ✓
              </div>

              <div className="stat-content">
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>

            </div>


            {/* IN PROGRESS */}

            <div className="stat-card stat-progress">

              <div className="stat-icon">
                ◷
              </div>

              <div className="stat-content">
                <span>In Progress</span>
                <strong>{inProgressTasks}</strong>
              </div>

            </div>


            {/* TODO */}

            <div className="stat-card stat-todo">

              <div className="stat-icon">
                ☰
              </div>

              <div className="stat-content">
                <span>To Do</span>
                <strong>{todoTasks}</strong>
              </div>

            </div>

          </div>


          {/* =====================================
              KANBAN BOARD
          ===================================== */}

          <div className="dashboard-kanban">

            <KanbanBoard
              columns={columns}
              tasks={tasks}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
              onMoveTask={onMoveTask}
            />

          </div>


          {/* =====================================
              MOTIVATIONAL FOOTER
          ===================================== */}

          <div className="dashboard-footer">

            <div className="footer-star">
              ★
            </div>

            <div>
              <strong>
                Stay focused, keep building, ship better.
              </strong>

              <p>
                You've got this! 💜
              </p>
            </div>

            <div className="footer-rocket">
              🚀
            </div>

          </div>

        </>

      ) : (

        <div className="empty-dashboard">
          Select a board to get started.
        </div>

      )}

    </main>
  );
}

export default Dashboard;