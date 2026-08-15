from app.database import Base, engine
from app.models import Board, BoardColumn, Task


def init_db():
    print("Database URL:", engine.url)
    print("Models:", Base.metadata.tables.keys())

    Base.metadata.create_all(bind=engine)

    print("Database initialized successfully.")


if __name__ == "__main__":
    init_db()