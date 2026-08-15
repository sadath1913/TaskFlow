import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createBoard,
  deleteBoard,
} from "../services/api";

function Boards({
  boards,
  selectedBoardId,
  onBoardSelect,
  onBoardCreated,
  onBoardDeleted,
}) {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenBoard = (boardId) => {
    onBoardSelect(boardId);
    navigate("/");
  };

  const handleCreateBoard = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Board name is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await createBoard({
        name: name.trim(),
      });

      onBoardCreated(response.data);

      setName("");
      setShowForm(false);

      onBoardSelect(response.data.id);
      navigate("/");
    } catch (error) {
      console.error(
        "Failed to create board:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to create board"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBoard = async (board) => {
    const confirmed = window.confirm(
      `Delete "${board.name}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBoard(board.id);

      onBoardDeleted(board.id);

      if (selectedBoardId === board.id) {
        const remainingBoards = boards.filter(
          (currentBoard) =>
            currentBoard.id !== board.id
        );

        if (remainingBoards.length > 0) {
          onBoardSelect(
            remainingBoards[0].id
          );

          navigate("/");
        } else {
          onBoardSelect(null);
        }
      }
    } catch (error) {
      console.error(
        "Failed to delete board:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to delete board"
      );
    }
  };

  return (
    <main className="boards-page">

      {/* Header */}
      <div className="boards-header">
        <div>
          <div className="boards-title-row">
            <h1>My Boards</h1>
            <span className="boards-count">
              {boards.length}
            </span>
          </div>

          <p>
            Organize your work and keep your projects moving.
          </p>
        </div>

        <button
          className="boards-create-button"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          <span>+</span>
          Create Board
        </button>
      </div>

      {/* Boards */}
      <div className="boards-grid">

        {boards.map((board, index) => (
          <div
            className={`board-card ${
              selectedBoardId === board.id ? "active" : ""
            }`}
            key={board.id}
          >

            <div className="board-card-top">
              <div className="board-icon">
                ▣
              </div>

              <span className="board-number">
                #{String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="board-main-info">
              <h2>{board.name}</h2>

              <span className="board-type">
                Project workspace
              </span>

              {selectedBoardId === board.id && (
                <span className="board-active-badge">
                  • Active
                </span>
              )}
            </div>

            <div className="board-card-actions">

              <button
                className="open-board-button"
                onClick={() =>
                  handleOpenBoard(board.id)
                }
              >
                Open Board
                <span>→</span>
              </button>

              <button
                className="delete-board-button"
                onClick={() =>
                  handleDeleteBoard(board)
                }
                title="Delete board"
              >
                🗑
              </button>

            </div>

          </div>
        ))}

        {/* Create New Board Card */}
        <button
          className="create-board-card"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          <div className="create-board-icon">
            +
          </div>

          <h2>Create New Board</h2>

          <p>Start a new workspace</p>
        </button>

      </div>

      {/* Create Board Modal */}
      {showForm && (
        <div className="task-form-overlay">
          <div className="task-form">

            <h2>Create Board</h2>

            <form onSubmit={handleCreateBoard}>

              <input
                type="text"
                placeholder="Board name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                autoFocus
                required
              />

              {error && (
                <p className="form-error">
                  {error}
                </p>
              )}

              <div className="task-form-actions">

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setName("");
                    setError("");
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                >
                  {loading
                    ? "Creating..."
                    : "Create Board"}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </main>
  );
}

export default Boards;