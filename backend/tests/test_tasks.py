from app.models import Task
from DAO import task as task_dao


def test_create_task_without_title(client, seed_data):
    response = client.post(
        "/tasks",
        json={
            "title": " ",
            "description": "Task without title",
            "priority": "High",
            "column_id": seed_data["todo"].id,
        },
    )

    assert response.status_code == 422


def test_move_task_updates_column(client, db_session, seed_data):
    task = Task(
        column_id=seed_data["todo"].id,
        title="Move this task",
        description="Task used for move test",
        priority="High",
    )

    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)

    task_id = task.id
    target_column_id = seed_data["in_progress"].id

    response = client.patch(
        f"/tasks/{task_id}/move",
        json={
            "column_id": target_column_id,
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["id"] == task_id
    assert data["column_id"] == target_column_id

    db_session.expire_all()

    updated_task = (
        db_session.query(Task)
        .filter(Task.id == task_id)
        .first()
    )

    assert updated_task is not None
    assert updated_task.column_id == target_column_id

def test_get_tasks_by_priority_database_layer(
    db_session,
    seed_data,
):
    task_1 = Task(
        column_id=seed_data["todo"].id,
        title="Older High Priority Task",
        description="Older task",
        priority="High",
    )

    db_session.add(task_1)
    db_session.commit()

    task_2 = Task(
        column_id=seed_data["todo"].id,
        title="Medium Priority Task",
        description="Medium task",
        priority="Medium",
    )

    task_3 = Task(
        column_id=seed_data["in_progress"].id,
        title="Newest High Priority Task",
        description="Newest task",
        priority="High",
    )

    db_session.add_all([
        task_2,
        task_3,
    ])

    db_session.commit()

    tasks = task_dao.get_tasks(
        db=db_session,
        board_id=seed_data["board"].id,
        priority="High",
    )

    assert len(tasks) == 2

    # Only High priority tasks should be returned
    assert all(
        task.priority == "High"
        for task in tasks
    )

    # Newest task should come first
    assert tasks[0].title == "Newest High Priority Task"
    assert tasks[1].title == "Older High Priority Task"