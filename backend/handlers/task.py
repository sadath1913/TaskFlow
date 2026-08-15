import logging

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import BoardColumn
from DAO import task as task_dao
from DAO import column as column_dao
from schemas.task import (
    Priority,
    TaskCreate,
    TaskMove,
    TaskResponse,
    TaskUpdate,
)


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)


# ---------------------------------------------------------
# CREATE TASK
# POST /tasks
# ---------------------------------------------------------

@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED
)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db)
):
    logger.info(
        "Create task request | column_id=%s | priority=%s",
        data.column_id,
        data.priority
    )

    # Check whether column exists
    column = column_dao.get_column(
        db=db,
        column_id=data.column_id
    )

    if not column:
        logger.warning(
            "Create task failed | column not found | column_id=%s",
            data.column_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Column not found"
        )

    try:
        task = task_dao.create_task(
            db=db,
            column_id=data.column_id,
            title=data.title,
            description=data.description,
            priority=data.priority
        )

        logger.info(
            "Task created successfully | task_id=%s",
            task.id
        )

        return task

    except SQLAlchemyError:
        logger.exception(
            "Create task failed | column_id=%s",
            data.column_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create task"
        )


# ---------------------------------------------------------
# GET TASK
# GET /tasks/{task_id}
# ---------------------------------------------------------

@router.get(
    "/{task_id}",
    response_model=TaskResponse
)
def get_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    logger.info(
        "Get task request | task_id=%s",
        task_id
    )

    try:
        task = task_dao.get_task(
            db=db,
            task_id=task_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Get task failed | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch task"
        )

    if not task:
        logger.warning(
            "Task not found | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


# ---------------------------------------------------------
# UPDATE TASK
# PUT /tasks/{task_id}
# ---------------------------------------------------------

@router.put(
    "/{task_id}",
    response_model=TaskResponse
)
def update_task(
    task_id: int,
    data: TaskUpdate,
    db: Session = Depends(get_db)
):
    logger.info(
        "Update task request | task_id=%s",
        task_id
    )

    try:
        task = task_dao.get_task(
            db=db,
            task_id=task_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch task for update | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch task"
        )

    if not task:
        logger.warning(
            "Update task failed | task not found | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    try:
        updated_task = task_dao.update_task(
            db=db,
            task=task,
            title=data.title,
            description=data.description,
            priority=data.priority
        )

        logger.info(
            "Task updated successfully | task_id=%s",
            task_id
        )

        return updated_task

    except SQLAlchemyError:
        logger.exception(
            "Update task failed | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update task"
        )


# ---------------------------------------------------------
# MOVE TASK
# PATCH /tasks/{task_id}/move
# ---------------------------------------------------------

@router.patch(
    "/{task_id}/move",
    response_model=TaskResponse
)
def move_task(
    task_id: int,
    data: TaskMove,
    db: Session = Depends(get_db)
):
    logger.info(
        "Move task request | task_id=%s | target_column_id=%s",
        task_id,
        data.column_id
    )

    # Check task
    try:
        task = task_dao.get_task(
            db=db,
            task_id=task_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch task for move | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch task"
        )

    if not task:
        logger.warning(
            "Move task failed | task not found | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Check target column
    try:
        column = column_dao.get_column(
            db=db,
            column_id=data.column_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch target column | column_id=%s",
            data.column_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch target column"
        )

    if not column:
        logger.warning(
            "Move task failed | target column not found | column_id=%s",
            data.column_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Target column not found"
        )

    try:
        moved_task = task_dao.move_task(
            db=db,
            task=task,
            column_id=data.column_id
        )

        logger.info(
            "Task moved successfully | task_id=%s | target_column_id=%s",
            task_id,
            data.column_id
        )

        return moved_task

    except SQLAlchemyError:
        logger.exception(
            "Move task failed | task_id=%s | target_column_id=%s",
            task_id,
            data.column_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to move task"
        )


# ---------------------------------------------------------
# DELETE TASK
# DELETE /tasks/{task_id}
# ---------------------------------------------------------

@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db)
):
    logger.info(
        "Delete task request | task_id=%s",
        task_id
    )

    try:
        task = task_dao.get_task(
            db=db,
            task_id=task_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch task for deletion | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch task"
        )

    if not task:
        logger.warning(
            "Delete task failed | task not found | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    try:
        task_dao.delete_task(
            db=db,
            task=task
        )

        logger.info(
            "Task deleted successfully | task_id=%s",
            task_id
        )

        return None

    except SQLAlchemyError:
        logger.exception(
            "Delete task failed | task_id=%s",
            task_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete task"
        )

# ---------------------------------------------------------
# GET TASKS
# GET /tasks?board_id=1
# GET /tasks?board_id=1&priority=High
# ---------------------------------------------------------

@router.get(
    "",
    response_model=list[TaskResponse]
)
def get_tasks(
    board_id: int = Query(...),
    priority: Priority | None = Query(None),
    db: Session = Depends(get_db)
):
    logger.info(
        "Get tasks | board_id=%s | priority=%s",
        board_id,
        priority
    )

    # Check whether board exists
    board = (
        db.query(BoardColumn)
        .filter(
            BoardColumn.board_id == board_id
        )
        .first()
    )

    if not board:
        logger.warning(
            "Get tasks failed | board not found | board_id=%s",
            board_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )

    try:
        tasks = task_dao.get_tasks(
            db=db,
            board_id=board_id,
            priority=priority
        )

        logger.info(
            "Tasks fetched successfully | board_id=%s | priority=%s | count=%s",
            board_id,
            priority,
            len(tasks)
        )

        return tasks

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch tasks | board_id=%s | priority=%s",
            board_id,
            priority
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch tasks"
        )