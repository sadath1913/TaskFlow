from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Board(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    columns = relationship(
        "BoardColumn",
        back_populates="board",
        cascade="all, delete-orphan"
    )


class BoardColumn(Base):
    __tablename__ = "columns"

    id = Column(Integer, primary_key=True, index=True)
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    name = Column(String(100), nullable=False)
    position = Column(Integer, nullable=False)

    board = relationship("Board", back_populates="columns")

    tasks = relationship(
        "Task",
        back_populates="column",
        cascade="all, delete-orphan"
    )


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    column_id = Column(Integer, ForeignKey("columns.id"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(20), nullable=False, default="Medium")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    column = relationship("BoardColumn", back_populates="tasks")