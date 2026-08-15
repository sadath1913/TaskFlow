CREATE TABLE boards (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at DATETIME NOT NULL
);

CREATE TABLE columns (
    id INTEGER PRIMARY KEY,
    board_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    position INTEGER NOT NULL,

    FOREIGN KEY (board_id)
        REFERENCES boards(id)
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    column_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
    created_at DATETIME NOT NULL,

    FOREIGN KEY (column_id)
        REFERENCES columns(id)
);