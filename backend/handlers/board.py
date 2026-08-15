import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.database import get_db
from DAO import board as board_dao
from schemas.board import BoardCreate, BoardResponse


logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/boards",
    tags=["Boards"]
)


@router.post(
    "",
    response_model=BoardResponse,
    status_code=status.HTTP_201_CREATED
)
def create_board(
    data: BoardCreate,
    db: Session = Depends(get_db)
):
    logger.info("Create board request | name=%s", data.name)

    try:
        board = board_dao.create_board(
            db=db,
            name=data.name
        )

        logger.info(
            "Create board successful | board_id=%s",
            board.id
        )

        return board

    except SQLAlchemyError:
        logger.exception(
            "Create board failed | name=%s",
            data.name
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create board"
        )


@router.get(
    "",
    response_model=list[BoardResponse]
)
def get_all_boards(
    db: Session = Depends(get_db)
):
    logger.info("Get all boards request")

    try:
        boards = board_dao.get_all_boards(db)

        logger.info(
            "Get all boards successful | count=%s",
            len(boards)
        )

        return boards

    except SQLAlchemyError:
        logger.exception("Get all boards failed")

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch boards"
        )


@router.get(
    "/{board_id}",
    response_model=BoardResponse
)
def get_board(
    board_id: int,
    db: Session = Depends(get_db)
):
    logger.info(
        "Get board request | board_id=%s",
        board_id
    )

    try:
        board = board_dao.get_board(
            db=db,
            board_id=board_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Get board failed | board_id=%s",
            board_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch board"
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

    return board


@router.delete(
    "/{board_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_board(
    board_id: int,
    db: Session = Depends(get_db)
):
    logger.info(
        "Delete board request | board_id=%s",
        board_id
    )

    try:
        board = board_dao.delete_board(
            db=db,
            board_id=board_id
        )

    except SQLAlchemyError:
        logger.exception(
            "Delete board failed | board_id=%s",
            board_id
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete board"
        )

    if not board:
        logger.warning(
            "Delete board failed | board not found | board_id=%s",
            board_id
        )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Board not found"
        )

    logger.info(
        "Delete board successful | board_id=%s",
        board_id
    )

    return None