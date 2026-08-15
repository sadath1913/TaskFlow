import sys
from pathlib import Path

sys.path.insert(
    0,
    str(Path(__file__).resolve().parents[1])
)

import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from app.main import app
from app.database import Base, get_db
from app.models import Board, BoardColumn, Task


TEST_DATABASE_URL = "sqlite:///./test_taskflow.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def seed_data(db_session):
    board = Board(name="Test Board")

    todo = BoardColumn(
        name="To Do",
        position=1,
        board=board,
    )

    in_progress = BoardColumn(
        name="In Progress",
        position=2,
        board=board,
    )

    done = BoardColumn(
        name="Done",
        position=3,
        board=board,
    )

    db_session.add(board)
    db_session.add_all([
        todo,
        in_progress,
        done,
    ])

    db_session.commit()

    db_session.refresh(board)
    db_session.refresh(todo)
    db_session.refresh(in_progress)
    db_session.refresh(done)

    return {
        "board": board,
        "todo": todo,
        "in_progress": in_progress,
        "done": done,
    }