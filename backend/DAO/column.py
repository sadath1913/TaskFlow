import logging

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models import BoardColumn


logger = logging.getLogger(__name__)


def create_column(
    db: Session,
    board_id: int,
    name: str,
    position: int
):
    logger.info(
        "Creating column | board_id=%s | name=%s | position=%s",
        board_id,
        name,
        position
    )

    column = BoardColumn(
        board_id=board_id,
        name=name,
        position=position
    )

    try:
        db.add(column)
        db.commit()
        db.refresh(column)

        logger.info(
            "Column created successfully | column_id=%s",
            column.id
        )

        return column

    except SQLAlchemyError:
        db.rollback()

        logger.exception(
            "Database error while creating column | board_id=%s",
            board_id
        )

        raise


def get_column(db: Session, column_id: int):
    logger.info(
        "Fetching column | column_id=%s",
        column_id
    )

    column = (
        db.query(BoardColumn)
        .filter(BoardColumn.id == column_id)
        .first()
    )

    if not column:
        logger.warning(
            "Column not found | column_id=%s",
            column_id
        )

    return column


def get_columns_by_board(db: Session, board_id: int):
    logger.info(
        "Fetching columns | board_id=%s",
        board_id
    )

    columns = (
        db.query(BoardColumn)
        .filter(BoardColumn.board_id == board_id)
        .order_by(BoardColumn.position)
        .all()
    )

    logger.info(
        "Columns fetched | board_id=%s | count=%s",
        board_id,
        len(columns)
    )

    return columns