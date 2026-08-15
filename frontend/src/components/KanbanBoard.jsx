import { useState } from "react";
import "../styles/kanban.css";

function KanbanBoard({
  columns,
  tasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const handleMenuClick = (taskId) => {
    setOpenMenuId(
      openMenuId === taskId ? null : taskId
    );
  };

  return (
    <div className="kanban-board">

      {columns.map((column) => {
        const columnTasks = tasks[column.id] || [];

        /*
         * Determine column style based on name
         */
        const columnName =
          column.name?.toLowerCase() || "";

        let columnType = "column-todo";

        if (
          columnName.includes("progress")
        ) {
          columnType = "column-progress";
        } else if (
          columnName.includes("done") ||
          columnName.includes("complete")
        ) {
          columnType = "column-done";
        }

        return (
          <div
            className={`kanban-column ${columnType}`}
            key={column.id}

            onDragOver={(event) => {
              event.preventDefault();
            }}

            onDrop={(event) => {
              event.preventDefault();

              const taskId = Number(
                event.dataTransfer.getData("taskId")
              );

              if (taskId) {
                onMoveTask(
                  taskId,
                  column.id
                );
              }
            }}
          >

            {/* =====================================
                COLUMN HEADER
            ====================================== */}

            <div className="column-header">

              <div className="column-title-wrapper">

                <h3>
                  {column.name}
                </h3>

                <span className="column-count">
                  {columnTasks.length}
                </span>

              </div>

              <button
                className="column-add-button"
                title="Add task"
                onClick={(event) => {
                  event.stopPropagation();

                  /*
                   * Create task button can be
                   * connected later.
                   */
                }}
              >
                +
              </button>

            </div>


            {/* =====================================
                TASK LIST
            ====================================== */}

            <div className="task-list">

              {columnTasks.map((task) => (

                <div
                  className="task-card"
                  key={task.id}
                  draggable

                  onDragStart={(event) => {
                    event.dataTransfer.setData(
                      "taskId",
                      String(task.id)
                    );
                  }}
                >

                  {/* ================================
                      TASK HEADER
                  ================================= */}

                  <div className="task-card-header">

                    <h4>
                      {task.title}
                    </h4>

                    <div className="task-menu">

                      <button
                        className="task-menu-button"
                        onClick={(event) => {
                          event.stopPropagation();

                          handleMenuClick(
                            task.id
                          );
                        }}
                        title="Task options"
                      >
                        ⋮
                      </button>

                      {openMenuId === task.id && (

                        <div className="task-menu-dropdown">

                          <button
                            onClick={() => {
                              onEditTask(task);
                              setOpenMenuId(null);
                            }}
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => {
                              onDeleteTask(task);
                              setOpenMenuId(null);
                            }}
                          >
                            Delete
                          </button>

                        </div>

                      )}

                    </div>

                  </div>


                  {/* ================================
                      DESCRIPTION
                  ================================= */}

                  {task.description && (
                    <p>
                      {task.description}
                    </p>
                  )}


                  {/* ================================
                      FOOTER
                  ================================= */}

                  <div className="task-card-footer">

                    <span
                      className={`task-priority priority-${task.priority?.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                  </div>

                </div>

              ))}

            </div>


            {/* =====================================
                DROP ZONE
            ====================================== */}

            <div className="column-drop-zone">

              <span className="drop-icon">
                ♢
              </span>

              <span>
                Drop tasks here
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}

export default KanbanBoard;