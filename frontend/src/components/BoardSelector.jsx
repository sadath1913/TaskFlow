function BoardSelector({
  boards,
  selectedBoardId,
  onBoardChange,
}) {
  return (
    <div className="board-selector">
      <label htmlFor="board-select">
        Board:
      </label>

      <select
        id="board-select"
        value={selectedBoardId || ""}
        onChange={(event) =>
          onBoardChange(Number(event.target.value))
        }
      >
        <option value="" disabled>
          Select a board
        </option>

        {boards.map((board) => (
          <option
            key={board.id}
            value={board.id}
          >
            {board.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default BoardSelector;