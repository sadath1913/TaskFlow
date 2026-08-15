import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/kanban.css";
import "./styles/boards.css";
import "./styles/sidebar.css";
import "./styles/kanbanboard.css";
import "./styles/mytasks.css";

import {
  getBoards,
  getBoardColumns,
  getColumnTasks,
  deleteTask,
  moveTask,
} from "./services/api";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import Boards from "./pages/Boards";

import TaskForm from "./components/TaskForm";
import EditTaskForm from "./components/EditTaskForm";

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(() => {
    const savedBoardId =
      localStorage.getItem("selectedBoardId");

    return savedBoardId
      ? Number(savedBoardId)
      : null; 
  });

  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState({});

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [updatedTask, setUpdatedTask] = useState(null);

  const [error, setError] = useState("");

  const [boardsLoading, setBoardsLoading] = useState(false);
  const [columnsLoading, setColumnsLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);

  /*
   * ================================
   * Load Boards
   * ================================
   */

  useEffect(() => {
    const loadBoards = async () => {
      setBoardsLoading(true);

      try {
        const response = await getBoards();

        const boardData = response.data;

        setBoards(boardData);

        /*
        * Check whether a previously selected
        * board exists.
        */

        const savedBoardId =
          localStorage.getItem("selectedBoardId");

        if (savedBoardId) {
          const savedId = Number(savedBoardId);

          const savedBoardExists =
            boardData.some(
              (board) => board.id === savedId
            );

          if (savedBoardExists) {
            setSelectedBoardId(savedId);
            return;
          }
        }

        /*
        * No saved board or saved board was deleted.
        * Select first board.
        */

        if (boardData.length > 0) {
          const firstBoardId =
            boardData[0].id;

          setSelectedBoardId(firstBoardId);

          localStorage.setItem(
            "selectedBoardId",
            String(firstBoardId)
          );
        } else {
          setSelectedBoardId(null);

          localStorage.removeItem(
            "selectedBoardId"
          );
        }

      } catch (error) {
        console.error(
          "Failed to fetch boards:",
          error
        );

        setError("Failed to load boards");
      } finally {
        setBoardsLoading(false);
      }
    };

    loadBoards();
  }, []);

  /*
   * ================================
   * Load Columns
   * ================================
   */

  useEffect(() => {
    const loadColumns = async () => {
      setColumnsLoading(true);

      try {
        const response =
          await getBoardColumns(selectedBoardId);

        setColumns(response.data);
      } catch (error) {
        console.error(
          "Failed to fetch columns:",
          error
        );

        setColumns([]);
        setTasks({});
      } finally {
        setColumnsLoading(false);
      }
    };

    if (selectedBoardId) {
      loadColumns();
    } else {
      setColumns([]);
      setTasks({});
    }
  }, [selectedBoardId]);
  /*
   * ================================
   * Load Tasks
   * ================================
   */

  useEffect(() => {
    const loadTasks = async () => {
      setTasksLoading(true);

      try {
        const taskResults = await Promise.all(
          columns.map(async (column) => {
            const response =
              await getColumnTasks(column.id);

            return {
              columnId: column.id,
              tasks: response.data,
            };
          })
        );

        const taskMap = {};

        taskResults.forEach((result) => {
          taskMap[result.columnId] =
            result.tasks;
        });

        setTasks(taskMap);
      } catch (error) {
        console.error(
          "Failed to fetch tasks:",
          error
        );

        setTasks({});
      } finally {
        setTasksLoading(false);
      }
    };

    if (columns.length > 0) {
      loadTasks();
    } else {
      setTasks({});
    }
  }, [columns]);

  /*
   * ================================
   * Board Change
   * ================================
   */

  const handleBoardChange = (boardId) => {
    /*
    * Change selected board
    */
    setSelectedBoardId(boardId);

    /*
    * Remember selected board
    */
    localStorage.setItem(
      "selectedBoardId",
      String(boardId)
    );

    /*
    * Immediately remove old board data.
    *
    * This prevents Board 1 tasks from
    * appearing while Board 2 is loading.
    */
    setColumns([]);
    setTasks({});
  };

  /*
   * ================================
   * Delete Task
   * ================================
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

      setTasks((currentTasks) => ({
        ...currentTasks,

        [task.column_id]: (
          currentTasks[task.column_id] || []
        ).filter(
          (currentTask) =>
            currentTask.id !== task.id
        ),
      }));
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );
    }
  };

  /*
   * ================================
   * Move Task
   * ================================
   */

  const handleMoveTask = async (
    taskId,
    targetColumnId
  ) => {
    try {
      await moveTask(
        taskId,
        targetColumnId
      );

      setTasks((currentTasks) => {
        let movedTask = null;

        const updatedTasks = {};

        Object.entries(currentTasks).forEach(
          ([columnId, columnTasks]) => {
            updatedTasks[columnId] =
              columnTasks.filter((task) => {
                if (task.id === taskId) {
                  movedTask = {
                    ...task,
                    column_id: targetColumnId,
                  };

                  return false;
                }

                return true;
              });
          }
        );

        if (movedTask) {
          updatedTasks[targetColumnId] = [
            ...(updatedTasks[
              targetColumnId
            ] || []),
            movedTask,
          ];
        }

        return updatedTasks;
      });
    } catch (error) {
      console.error(
        "Failed to move task:",
        error
      );
    }
  };

  /*
   * ================================
   * Current Board
   * ================================
   */

  const selectedBoard = boards.find(
    (board) =>
      board.id === selectedBoardId
  );

  /*
   * ================================
   * App Layout
   * ================================
   */

  return (
    <BrowserRouter>
      <div className="app">
        <Header />

        <div className="app-layout">
          <Sidebar
            boards={boards}
            selectedBoardId={selectedBoardId}
            onBoardSelect={handleBoardChange}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Dashboard
                  selectedBoard={selectedBoard}
                  columns={columns}
                  tasks={tasks}
                  columnsLoading={
                    columnsLoading
                  }
                  tasksLoading={
                    tasksLoading
                  }
                  boardsLoading={
                    boardsLoading
                  }
                  onEditTask={(task) =>
                    setEditingTask(task)
                  }
                  onDeleteTask={
                    handleDeleteTask
                  }
                  onMoveTask={
                    handleMoveTask
                  }
                  onAddTask={() =>
                    setShowTaskForm(true)
                  }
                />
              }
            />

            <Route
              path="/my-tasks"
              element={
                <MyTasks
                  boards={boards}
                  selectedBoardId={selectedBoardId}
                  onEditTask={(task) =>
                    setEditingTask(task)
                  }
                  updatedTask={updatedTask}
                  onAddTask={() =>
                    setShowTaskForm(true)
                  }
                />
              }
            />

            <Route
              path="/boards"
              element={
                <Boards
                  boards={boards}
                  selectedBoardId={selectedBoardId}
                  onBoardSelect={handleBoardChange}
                  onBoardCreated={(newBoard) => {
                    setBoards((currentBoards) => [
                      ...currentBoards,
                      newBoard,
                    ]);
                  }}
                  onBoardDeleted={(boardId) => {
                    setBoards((currentBoards) =>
                      currentBoards.filter(
                        (board) => board.id !== boardId
                      )
                    );
                  }}
                />
              }
            />
          </Routes>
        </div>

        {error && (
          <div className="global-error">
            {error}
          </div>
        )}

        {showTaskForm && (
          <TaskForm
            columns={columns}
            onClose={() =>
              setShowTaskForm(false)
            }
            onTaskCreated={(newTask) => {
              setTasks(
                (currentTasks) => ({
                  ...currentTasks,

                  [newTask.column_id]: [
                    ...(currentTasks[
                      newTask.column_id
                    ] || []),
                    newTask,
                  ],
                })
              );

              setShowTaskForm(false);
            }}
          />
        )}

        {editingTask && (
          <EditTaskForm
            task={editingTask}
            onClose={() =>
              setEditingTask(null)
            }
            onTaskUpdated={(updatedTask) => {
              // Update Dashboard state
              setTasks((currentTasks) => ({
                ...currentTasks,

                [updatedTask.column_id]:
                  (
                    currentTasks[
                      updatedTask.column_id
                    ] || []
                  ).map((task) =>
                    task.id === updatedTask.id
                      ? updatedTask
                      : task
                  ),
              }));

              // Send updated task to MyTasks
              setUpdatedTask(updatedTask);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;