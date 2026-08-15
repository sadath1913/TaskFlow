import { NavLink, useNavigate } from "react-router-dom";

function Sidebar({
  boards,
  selectedBoardId,
  onBoardSelect,
}) {
  const navigate = useNavigate();

  const handleBoardClick = (boardId) => {
    onBoardSelect(boardId);
    navigate("/");
  };

  return (
    <aside className="sidebar">

      {/* ================================
          LOGO
      ================================= */}

      <div className="sidebar-brand">
        <div className="sidebar-logo">
          T
        </div>

        <div className="sidebar-brand-text">
          Task<span>Flow</span>
        </div>
      </div>


      {/* ================================
          MAIN NAVIGATION
      ================================= */}

      <div className="sidebar-heading">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">

        <NavLink
          to="/"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-icon">
            ⌂
          </span>

          <span>
            Dashboard
          </span>
        </NavLink>


        <NavLink
          to="/my-tasks"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-icon">
            ✓
          </span>

          <span>
            My Tasks
          </span>
        </NavLink>


        <NavLink
          to="/boards"
          className={({ isActive }) =>
            `sidebar-link ${
              isActive ? "active" : ""
            }`
          }
        >
          <span className="sidebar-icon">
            ▣
          </span>

          <span>
            Boards
          </span>
        </NavLink>

      </nav>


      {/* ================================
          BOARDS
      ================================= */}

      <div className="sidebar-section">

        <div className="sidebar-section-header">

          <span className="sidebar-section-title">
            YOUR BOARDS
          </span>

          <span className="sidebar-board-count">
            {boards.length}
          </span>

        </div>


        <div className="sidebar-boards">

          {boards.map((board) => (

            <button
              key={board.id}
              className={`sidebar-board ${
                selectedBoardId === board.id
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleBoardClick(board.id)
              }
            >

              <span
                className="sidebar-board-icon"
              >
                ▣
              </span>

              <span className="sidebar-board-name">
                {board.name}
              </span>

              {selectedBoardId === board.id && (
                <span className="sidebar-board-active">
                  ●
                </span>
              )}

            </button>

          ))}

        </div>

      </div>


      {/* ================================
          BOTTOM
      ================================= */}

      <div className="sidebar-bottom">

        <div className="sidebar-bottom-line" />

        <div className="sidebar-version">
          TaskFlow Workspace
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;