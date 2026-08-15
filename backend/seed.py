from datetime import datetime

from app.database import SessionLocal
from app.models import Board, BoardColumn, Task


def seed_database():
    db = SessionLocal()

    try:
        # Create board
        board = Board(
            name="TaskFlow Project",
            created_at=datetime.utcnow()
        )

        db.add(board)
        db.flush()

        # Create columns
        todo = BoardColumn(
            board_id=board.id,
            name="To Do",
            position=1
        )

        in_progress = BoardColumn(
            board_id=board.id,
            name="In Progress",
            position=2
        )

        done = BoardColumn(
            board_id=board.id,
            name="Done",
            position=3
        )

        db.add_all([todo, in_progress, done])
        db.flush()

        # Create tasks
        tasks = [
            Task(
                column_id=todo.id,
                title="Design Login",
                description="Design the login page",
                priority="High",
                created_at=datetime.utcnow()
            ),
            Task(
                column_id=todo.id,
                title="Create Task API",
                description="Implement task creation API",
                priority="High",
                created_at=datetime.utcnow()
            ),
            Task(
                column_id=in_progress.id,
                title="Build React UI",
                description="Build the TaskFlow board UI",
                priority="Medium",
                created_at=datetime.utcnow()
            ),
            Task(
                column_id=done.id,
                title="Setup Database",
                description="Configure SQLite database",
                priority="Low",
                created_at=datetime.utcnow()
            )
        ]

        db.add_all(tasks)

        db.commit()

        print("Database seeded successfully.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()