import logging

from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models import BoardColumn, Task


logger = logging.getLogger(__name__)


def create_task(
    db: Session,
    column_id: int,
    title: str,
    description: str | None,
    priority: str
):
    logger.info(
        "Creating task | column_id=%s | priority=%s",
        column_id,
        priority
    )

    task = Task(
        column_id=column_id,
        title=title,
        description=description,
        priority=priority
    )

    try:
        db.add(task)
        db.commit()
        db.refresh(task)

        logger.info(
            "Task created successfully | task_id=%s",
            task.id
        )

        return task

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while creating task | column_id=%s",
            column_id
        )

        raise


def get_task(db: Session, task_id: int):
    logger.info(
        "Fetching task | task_id=%s",
        task_id
    )

    task = (
        db.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    if not task:
        logger.warning(
            "Task not found | task_id=%s",
            task_id
        )

    return task


def get_tasks_by_column(db: Session, column_id: int):
    logger.info(
        "Fetching tasks | column_id=%s",
        column_id
    )

    return (
        db.query(Task)
        .filter(Task.column_id == column_id)
        .order_by(Task.created_at.desc())
        .all()
    )


def update_task(
    db: Session,
    task: Task,
    title: str,
    description: str | None,
    priority: str
):
    logger.info(
        "Updating task | task_id=%s",
        task.id
    )

    task.title = title
    task.description = description
    task.priority = priority

    try:
        db.commit()
        db.refresh(task)

        logger.info(
            "Task updated successfully | task_id=%s",
            task.id
        )

        return task

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while updating task | task_id=%s",
            task.id
        )

        raise


def move_task(
    db: Session,
    task: Task,
    column_id: int
):
    logger.info(
        "Moving task | task_id=%s | target_column_id=%s",
        task.id,
        column_id
    )

    task.column_id = column_id

    try:
        db.commit()
        db.refresh(task)

        logger.info(
            "Task moved successfully | task_id=%s | target_column_id=%s",
            task.id,
            column_id
        )

        return task

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while moving task | task_id=%s | target_column_id=%s",
            task.id,
            column_id
        )

        raise


def delete_task(db: Session, task: Task):
    logger.info(
        "Deleting task | task_id=%s",
        task.id
    )

    try:
        db.delete(task)
        db.commit()

        logger.info(
            "Task deleted successfully | task_id=%s",
            task.id
        )

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while deleting task | task_id=%s",
            task.id
        )

        raise


def get_tasks(
    db: Session,
    board_id: int,
    priority: str | None = None
):
    logger.info(
        "Fetching tasks | board_id=%s | priority=%s",
        board_id,
        priority
    )

    query = (
        db.query(Task)
        .join(
            BoardColumn,
            Task.column_id == BoardColumn.id
        )
        .filter(
            BoardColumn.board_id == board_id
        )
    )

    if priority:
        query = query.filter(
            Task.priority == priority
        )

    tasks = (
        query
        .order_by(Task.created_at.desc())
        .all()
    )

    logger.info(
        "Tasks fetched | board_id=%s | priority=%s | count=%s",
        board_id,
        priority,
        len(tasks)
    )

    return tasks

def get_task_count_by_column(
    db: Session,
    board_id: int
):
    logger.info(
        "Fetching task count by column | board_id=%s",
        board_id
    )

    return (
        db.query(
            BoardColumn.id,
            BoardColumn.name,
            func.count(Task.id).label("task_count")
        )
        .outerjoin(
            Task,
            Task.column_id == BoardColumn.id
        )
        .filter(BoardColumn.board_id == board_id)
        .group_by(
            BoardColumn.id,
            BoardColumn.name
        )
        .order_by(BoardColumn.position)
        .all()
    )
