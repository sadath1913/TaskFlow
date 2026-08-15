from app.database import engine

with engine.connect() as connection:
    result = connection.exec_driver_sql(
        "PRAGMA foreign_keys"
    )

    print("Foreign keys:", result.scalar())