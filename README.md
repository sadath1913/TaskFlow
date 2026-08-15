# TaskFlow

TaskFlow is a full-stack task and project management application built around boards and Kanban workflows. Users can create multiple boards, organize tasks into workflow columns, set priorities, create/edit/delete tasks, move tasks using drag and drop, and manage tasks from a centralized **My Tasks** page.

## Table of Contents

- [Short Description](#short-description)
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Result / Output](#result--output)
- [Technology Stack](#technology-stack)
- [System Requirements](#system-requirements)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Running the Project](#running-the-project)
- [Application Workflow](#application-workflow)
- [Core Functionality](#core-functionality)
- [API Overview](#api-overview)
- [Data Relationship](#data-relationship)
- [Frontend State Flow](#frontend-state-flow)
- [Testing Checklist](#testing-checklist)
- [Troubleshooting](#troubleshooting)
- [Git Workflow](#git-workflow)
- [Future Improvements](#future-improvements)
- [License](#license)

---

## Short Description

**TaskFlow is a modern Kanban-based task management application that helps users manage projects, boards, workflow columns, and tasks from an interactive dashboard.**

The application provides board-specific task management, task search and filtering, drag-and-drop task movement, task editing/deletion, persistent board selection, and a responsive dark-themed interface.

---

## Project Overview

TaskFlow follows a simple hierarchy:

```text
Board
  |
  +-- Column
        |
        +-- Task
```

Example:

```text
TaskFlow Project
│
├── To Do
│   ├── Create Task API
│   └── Design Login
│
├── In Progress
│   └── Build React UI
│
└── Done
    └── Setup Database
```

A task belongs to a column through `column_id`. A column belongs to a board through `board_id`.

Therefore:

```text
Task
  |
  +-- column_id
        |
        +-- Column
              |
              +-- board_id
                    |
                    +-- Board
```

---

# Key Features

### Dashboard
- Current board display
- Task statistics
- Kanban columns
- Task cards
- Priority indicators
- Add Task button
- Drag-and-drop task movement
- Edit/Delete task actions

### Board Management
- Create boards
- Open boards
- Delete boards
- Switch between boards
- Persist selected board using `localStorage`

### Task Management
- Create tasks
- Edit tasks
- Delete tasks
- Assign priorities
- Assign tasks to columns
- Move tasks between columns

### My Tasks
- Display tasks for the selected board
- Search tasks by title/description
- Filter by priority
- Edit/delete tasks
- Create a task directly from My Tasks

---

# Result / Output

Put the ten screenshots in:

```text
docs/images/
```

Then use the following section in the repository.

## 1. Dashboard

![TaskFlow Dashboard](.png)

Main Kanban dashboard showing the selected board and workflow columns.

## 2. Dashboard Statistics

![Dashboard Statistics](docs/images/dashboard-statistics.png)

Displays task statistics such as Total Tasks, Completed, In Progress, and To Do.

## 3. Kanban Board

![Kanban Board](docs/images/kanban-board.png)

Tasks are organized into workflow columns.

## 4. Task Card

![Task Card](docs/images/task-card.png)

Individual cards display task title, description, priority, and actions.

## 5. My Tasks

![My Tasks](docs/images/my-tasks.png)

Table-based view of tasks belonging to the currently selected board.

## 6. My Tasks Search

![My Tasks Search](docs/images/my-tasks-search.png)

Search tasks by task title or description.

## 7. Create Task

![Create Task](docs/images/create-task.png)

Task creation interface.

## 8. Edit Task

![Edit Task](docs/images/edit-task.png)

Task editing interface.

## 9. Boards

![Boards](docs/images/boards.png)

Board management interface for creating, opening, and deleting boards.

## 10. Sidebar

![TaskFlow Sidebar](docs/images/sidebar.png)

Application navigation and board selection sidebar.

> Rename the image filenames above to match the actual ten screenshots in your repository.

---

# Technology Stack

## Frontend

- React
- JavaScript
- React Router
- Axios
- CSS
- HTML5 Drag and Drop API
- Browser Local Storage

Important React concepts used:

- Functional components
- `useState`
- `useEffect`
- `useMemo`
- Component props
- Conditional rendering
- API integration
- Client-side state management

## Backend

- Python
- FastAPI
- Pydantic
- REST API
- Relational database

## Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman
- Browser Developer Tools

---

# System Requirements

Install the following before running the application.

### Required

```text
Git
Python 3.10+
Node.js
npm
Modern web browser
```

Check installations:

```bash
git --version
python --version
node --version
npm --version
```

---

# Project Structure

A typical structure is:

```text
TaskFlow/
     ├── backend/
     │   check_db.py
     │   check_fk.py
     │   init_db.py
     │   requirements.txt
     │   schema.sql
     │   seed.py
     │   taskflow.db
     │   
     ├───app
     │   │   database.py
     │   │   logging_config.py
     │   │   main.py
     │   │   models.py
     │   │   __init__.py
     │   │   
     │   └───__pycache__
     │           database.cpython-314.pyc
     │           logging_config.cpython-314.pyc
     │           main.cpython-314.pyc
     │           models.cpython-314.pyc
     │           __init__.cpython-314.pyc
     │           
     ├───DAO
     │   │   board.py
     │   │   column.py
     │   │   task.py
     │   │   __init__.py
     │   │   
     │   └───__pycache__
     │           board.cpython-314.pyc
     │           column.cpython-314.pyc
     │           task.cpython-314.pyc
     │           __init__.cpython-314.pyc
     │           
     ├───handlers
     │   │   board.py
     │   │   column.py
     │   │   task.py
     │   │   __init__.py
     │   │   
     │   └───__pycache__
     │           board.cpython-314.pyc
     │           column.cpython-314.pyc
     │           task.cpython-314.pyc
     │           __init__.cpython-314.pyc
     │           
     ├───schemas
     │   │   board.py
     │   │   column.py
     │   │   task.py
     │   │   __init__.py
     │   │   
     │   └───__pycache__
     │           board.cpython-314.pyc
     │           column.cpython-314.pyc
     │           task.cpython-314.pyc
     │           __init__.cpython-314.pyc
     │           
     └───tests
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── BoardSelector.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── EditTaskForm.jsx
│   │   │   └── KanbanBoard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyTasks.jsx
│   │   │   └── Boards.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── assets/
│   │   │   └── image.png ...
│   │   │
│   │   ├── styles/
│   │   │   ├── kanban.css
│   │   │   ├── sidebar.css
│   │   │   ├── boards.css
│   │   │   └── ...
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── ...
│
│
└── README.md
```

Adjust the backend structure to match the actual repository if its module names differ.

---

# Setup

## 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd TaskFlow
```

---

# Backend Setup

## 2. Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux/macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

## 3. Open Backend

```bash
cd backend
```


## 4. Install Dependencies

```bash
pip install -r requirements.txt
```

## 5. Configure Environment

If the backend uses environment variables, create:

```text
.env
```

Example:

```env
DATABASE_URL=sqlite:///./taskflow.db
```

Use the actual variables required by the backend.

Never commit secrets or credentials.

## 6. Start Backend

For a FastAPI application:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open a second terminal.

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

If the project uses an environment variable for the API:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Otherwise configure the API base URL in the project's API service.

Start the frontend:

```bash
npm run dev
```

Vite normally provides a URL similar to:

```text
http://localhost:5173
```

---

# Running the Project

Two terminals are required.

### Terminal 1

```bash
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Terminal 2

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite.

---

# Application Workflow

```text
Start Application
       |
       v
Load Boards
       |
       v
Select Board
       |
       v
Load Columns
       |
       v
Load Tasks
       |
       v
Dashboard
       |
       +----------------------+
       |                      |
       v                      v
Create Task              Manage Task
                              |
                    +---------+---------+
                    |         |         |
                   Edit     Delete     Move
                    |         |         |
                    +---------+---------+
                              |
                              v
                         Updated UI
```

---

# Core Functionality

## Board Creation

```text
Create Board
     |
     v
POST /boards
     |
     v
Backend creates board
     |
     v
Frontend adds board
     |
     v
New board selected/opened
```

## Board Switching

When a board changes, the application:

1. Updates `selectedBoardId`
2. Saves the ID to local storage
3. Clears old columns
4. Clears old tasks
5. Fetches the new board's columns
6. Fetches tasks belonging to the new board
7. Displays only the selected board's data

Conceptually:

```text
Board A
  |
  | switch
  v
Clear Board A state
  |
  v
Board B selected
  |
  v
Load Board B columns
  |
  v
Load Board B tasks
  |
  v
Display Board B
```

## Persistent Selection

The selected board is stored as:

```text
selectedBoardId
```

using:

```js
localStorage.setItem(
  "selectedBoardId",
  String(boardId)
);
```

On refresh, the application checks whether that board still exists.

---

# Task Creation Flow

```text
Click + Task
     |
     v
TaskForm
     |
     v
Enter title
Enter description
Select priority
Select column
     |
     v
Submit
     |
     v
createTask(payload)
     |
     v
POST /tasks
     |
     v
Database
     |
     v
Created task response
     |
     v
Update frontend
```

Example payload:

```json
{
  "title": "Build Login API",
  "description": "Create authentication endpoint",
  "priority": "High",
  "column_id": 3
}
```

---

# Task Editing Flow

```text
Click Edit
     |
     v
EditTaskForm
     |
     v
Modify task
     |
     v
Update API
     |
     v
Backend
     |
     v
Updated task
     |
     v
Update App state
     |
     v
Update My Tasks
```

The UI is updated without requiring a full page refresh.

---

# Task Deletion Flow

```text
Click Delete
     |
     v
Confirmation
     |
     v
DELETE /tasks/{id}
     |
     v
Backend deletes task
     |
     v
Frontend removes task
```

---

# Drag and Drop Flow

```text
Drag Task
    |
    v
Store task ID
    |
    v
Drop on target column
    |
    v
onMoveTask(taskId, targetColumnId)
    |
    v
moveTask()
    |
    v
Backend updates column_id
    |
    v
Frontend moves task
```

---

# My Tasks

My Tasks loads tasks for the currently selected board.

The important operation is conceptually:

```js
getBoardTasks(selectedBoardId)
```

The page then:

1. Loads tasks
2. Loads columns
3. Maps each task to its column
4. Maps the column to its board
5. Displays the task table
6. Applies search and priority filters

---

# Search and Filtering

Search checks:

```text
Task title
Task description
```

Example:

```text
Search: sa
```

The page displays matching tasks.

Priority filtering supports:

```text
All priorities
High
Medium
Low
```

Filtering is performed on the tasks already loaded for the selected board.

---

# API Overview

The frontend API service contains operations similar to:

```text
getBoards()
getBoardColumns(boardId)
getBoardTasks(boardId)
getColumnTasks(columnId)

createBoard(data)
deleteBoard(boardId)

createTask(data)
deleteTask(taskId)
moveTask(taskId, columnId)
```

Typical REST endpoints are:

```text
GET    /boards
POST   /boards
DELETE /boards/{board_id}

GET    /boards/{board_id}/columns
GET    /boards/{board_id}/tasks

GET    /columns/{column_id}/tasks

POST   /tasks
PUT    /tasks/{task_id}
DELETE /tasks/{task_id}
```

Verify the exact endpoint paths against the backend implementation.

---

# Data Relationship

The main relationship is:

```text
Board
  |
  | 1:N
  v
Column
  |
  | 1:N
  v
Task
```

Example task:

```json
{
  "id": 5,
  "column_id": 3,
  "title": "Build Login API",
  "description": "Create authentication endpoint",
  "priority": "High"
}
```

The board is determined through:

```text
Task
  |
  +-- column_id
        |
        +-- Column
              |
              +-- board_id
                    |
                    +-- Board
```

This relationship is also important for ensuring that My Tasks shows only tasks belonging to the selected board.

---

# Frontend State Flow

The main application state is maintained in `App.jsx`.

Important state:

```js
boards
selectedBoardId
columns
tasks
editingTask
updatedTask
```

### Board state

```text
boards
   |
   +-- selectedBoardId
```

### Dashboard state

```text
selectedBoardId
      |
      v
columns
      |
      v
tasks
```

### Edit state

```text
editingTask
      |
      v
EditTaskForm
      |
      v
updatedTask
      |
      v
Dashboard + MyTasks
```

---

# Testing Checklist

## Boards

- [ ] Create board
- [ ] Open board
- [ ] Switch boards
- [ ] Refresh browser
- [ ] Verify selected board persists
- [ ] Delete board
- [ ] Verify deleted board disappears
- [ ] Verify only selected board tasks appear

## Tasks

- [ ] Create task
- [ ] Verify task appears
- [ ] Edit task
- [ ] Verify updated values appear immediately
- [ ] Delete task
- [ ] Move task between columns
- [ ] Refresh browser
- [ ] Verify task remains in correct column

## My Tasks

- [ ] Open My Tasks
- [ ] Verify selected board tasks only
- [ ] Search task title
- [ ] Search task description
- [ ] Filter High
- [ ] Filter Medium
- [ ] Filter Low
- [ ] Edit task
- [ ] Delete task
- [ ] Create task from My Tasks

---

# Troubleshooting

## 422 Unprocessable Content

A `422` response normally means the backend validation rejected the request.

Check:

```text
Request URL
Request method
Request payload
Content-Type
Backend schema
```

In Chrome:

```text
DevTools
→ Network
→ POST /tasks
→ Payload
```

Compare the actual browser payload with a working Postman request.

Example:

```json
{
  "title": "Build Login API",
  "description": "Create authentication endpoint",
  "priority": "High",
  "column_id": 3
}
```

If Postman succeeds but React receives 422, inspect the frontend `createTask()` function and the actual Network request rather than relying only on a console-logged JavaScript object.

## Tasks from Previous Board Appear

Verify:

```text
selectedBoardId
```

changes correctly.

Clear old data during board switching:

```js
setColumns([]);
setTasks({});
```

Then fetch the new board's data.

## My Tasks Shows No Tasks

Check:

```text
selectedBoardId
```

Then verify:

```js
getBoardTasks(selectedBoardId)
```

returns data.

Also verify:

```text
task.column_id
column.id
column.board_id
board.id
```

are consistent.

## Edited Task Does Not Update

Verify the returned task has the same:

```text
id
```

as the existing task.

The frontend update logic should match the task by ID.

## Refresh Loses Board Selection

Open:

```text
Browser DevTools
→ Application
→ Local Storage
```

Verify:

```text
selectedBoardId
```

exists and contains a valid board ID.

---

# Development Commands

## Frontend

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Backend

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

# Git Workflow

Initialize repository:

```bash
git init
```

Add files:

```bash
git add .
```

Commit:

```bash
git commit -m "Initial TaskFlow project"
```

Connect remote:

```bash
git remote add origin <YOUR_REPOSITORY_URL>
```

Push:

```bash
git branch -M main
git push -u origin main
```

Suggested commits:

```text
feat: add board management
feat: add task management
feat: add kanban drag and drop
feat: add my tasks page
feat: add task search and filtering
fix: persist selected board
fix: refresh tasks when board changes
style: improve dashboard UI
style: improve sidebar
style: improve boards page
```

---

# Recommended .gitignore

```gitignore
# Python
venv/
__pycache__/
*.pyc

# Environment
.env

# Node
node_modules/
dist/

# Local database
*.db
*.sqlite
*.sqlite3

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

---

# Future Improvements

Potential improvements include:

- User authentication
- User registration/login
- Multiple users per board
- Board member permissions
- Task due dates
- Task labels/tags
- Task comments
- File attachments
- Notifications
- Task activity history
- Dashboard analytics
- Calendar integration
- Responsive mobile layout
- Pagination
- Server-side search
- Advanced task filtering
- Board templates
- Task sorting
- Real-time updates with WebSockets

---

# Project Goals

TaskFlow demonstrates a complete full-stack workflow:

```text
React
  |
  v
Axios / REST API
  |
  v
FastAPI
  |
  v
Database
```

The project focuses on:

- Component-based React development
- REST API integration
- State management
- Board-specific data handling
- Kanban workflows
- Drag-and-drop interaction
- CRUD operations
- Search and filtering
- Persistent board selection
- Interactive UI design

---

# License

This project is intended for educational, portfolio, and development purposes.

Add the appropriate license before publishing the repository publicly.

Example:

```text
MIT License
```

---

# Author

**Sadath Khan**

**Project:** TaskFlow  
**Type:** Full-Stack Task Management / Kanban Application
