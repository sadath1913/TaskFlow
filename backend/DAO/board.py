import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models import Board, BoardColumn


logger = logging.getLogger(__name__)


def create_board(db: Session, name: str):
    logger.info(
        "Creating board with default columns | name=%s",
        name
    )

    board = Board(name=name)

    try:
        db.add(board)
        db.flush()

        default_columns = [
            BoardColumn(
                board_id=board.id,
                name="To Do",
                position=1
            ),
            BoardColumn(
                board_id=board.id,
                name="In Progress",
                position=2
            ),
            BoardColumn(
                board_id=board.id,
                name="Done",
                position=3
            )
        ]

        db.add_all(default_columns)

        db.commit()
        db.refresh(board)

        logger.info(
            "Board and default columns created successfully | board_id=%s",
            board.id
        )

        return board

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while creating board | name=%s",
            name
        )

        raise


def get_board(db: Session, board_id: int):
    logger.info(
        "Fetching board | board_id=%s",
        board_id
    )

    board = (
        db.query(Board)
        .filter(Board.id == board_id)
        .first()
    )

    if not board:
        logger.warning(
            "Board not found | board_id=%s",
            board_id
        )

    return board


def get_all_boards(db: Session):
    logger.info("Fetching all boards")

    boards = (
        db.query(Board)
        .order_by(Board.id)
        .all()
    )

    logger.info(
        "Boards fetched | count=%s",
        len(boards)
    )

    return boards


def delete_board(db: Session, board_id: int):
    logger.info(
        "Deleting board | board_id=%s",
        board_id
    )

    board = get_board(
        db=db,
        board_id=board_id
    )

    if not board:
        logger.warning(
            "Delete board failed | board not found | board_id=%s",
            board_id
        )

        return None

    try:
        db.delete(board)
        db.commit()

        logger.info(
            "Board deleted successfully | board_id=%s",
            board_id
        )

        return board

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while deleting board | board_id=%s",
            board_id
        )

        raise