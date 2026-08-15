import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


// Boards
export const getBoards = () =>
  api.get("/boards");

export const getBoard = (boardId) =>
  api.get(`/boards/${boardId}`);

export const createBoard = (data) =>
  api.post("/boards", data);

export const deleteBoard = (boardId) =>
  api.delete(`/boards/${boardId}`);


// Columns
export const getBoardColumns = (boardId) =>
  api.get(`/boards/${boardId}/columns`);

export const createColumn = (boardId, data) =>
  api.post(`/boards/${boardId}/columns`, data);

export const getColumnTasks = (columnId) =>
  api.get(`/boards/columns/${columnId}/tasks`);


// Tasks
export const createTask = (data) =>
  api.post("/tasks", data);

export const getTask = (taskId) =>
  api.get(`/tasks/${taskId}`);

export const updateTask = (taskId, data) =>
  api.put(`/tasks/${taskId}`, data);

export const moveTask = (taskId, columnId) =>
  api.patch(`/tasks/${taskId}/move`, {
    column_id: columnId,
  });

export const deleteTask = (taskId) =>
  api.delete(`/tasks/${taskId}`);

export const getBoardTasks = (boardId, priority = null) => {
  const params = {
    board_id: boardId,
  };

  if (priority) {
    params.priority = priority;
  }

  return api.get("/tasks", {
    params,
  });
};

