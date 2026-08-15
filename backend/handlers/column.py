import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db

from DAO import column as column_dao
from DAO import board as board_dao
from DAO import task as task_dao

from schemas.column import ColumnCreate, ColumnResponse
from schemas.task import TaskResponse


logger = logging.getLogger(__name__)


router = APIRouter(
    prefix="/boards",
    tags=["Columns"]
)


@router.get(
    "/{board_id}/columns",
    response_model=list[ColumnResponse]
)
def get_board_columns(
    board_id: int,
    db: Session = Depends(get_db)
):
    logger.info(
        "Get board columns request | board_id=%s",
        board_id
    )

    try:
        board = board_dao.get_board(
            db=db,
            board_id=board_id
        )

        if not board:
            logger.warning(
                "Board not found | board_id=%s",
                board_id
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Board not found"
            )

        columns = column_dao.get_columns_by_board(
            db=db,
            board_id=board_id
        )

        logger.info(
            "Board columns fetched | board_id=%s | count=%s",
            board_id,
            len(columns)
        )

        return columns

    except HTTPException:
        raise

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch board columns | board_id=%s",
            board_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch board columns"
        )


@router.post(
    "/{board_id}/columns",
    response_model=ColumnResponse,
    status_code=status.HTTP_201_CREATED
)
def create_column(
    board_id: int,
    data: ColumnCreate,
    db: Session = Depends(get_db)
):
    logger.info(
        "Create column request | board_id=%s | name=%s",
        board_id,
        data.name
    )

    try:
        board = board_dao.get_board(
            db=db,
            board_id=board_id
        )

        if not board:
            logger.warning(
                "Create column failed | board not found | board_id=%s",
                board_id
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Board not found"
            )

        column = column_dao.create_column(
            db=db,
            board_id=board_id,
            name=data.name,
            position=data.position
        )

        logger.info(
            "Column created successfully | column_id=%s",
            column.id
        )

        return column

    except HTTPException:
        raise

    except SQLAlchemyError:
        logger.exception(
            "Create column failed | board_id=%s",
            board_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create column"
        )


@router.get(
    "/columns/{column_id}/tasks",
    response_model=list[TaskResponse]
)
def get_column_tasks(
    column_id: int,
    db: Session = Depends(get_db)
):
    logger.info(
        "Get column tasks request | column_id=%s",
        column_id
    )

    try:
        column = column_dao.get_column(
            db=db,
            column_id=column_id
        )

        if not column:
            logger.warning(
                "Column not found | column_id=%s",
                column_id
            )

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Column not found"
            )

        tasks = task_dao.get_tasks_by_column(
            db=db,
            column_id=column_id
        )

        logger.info(
            "Column tasks fetched | column_id=%s | count=%s",
            column_id,
            len(tasks)
        )

        return tasks

    except HTTPException:
        raise

    except SQLAlchemyError:
        logger.exception(
            "Failed to fetch column tasks | column_id=%s",
            column_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch column tasks"
        )