def create_test_order(client):
    return client.post(
        "/api/orders",
        json={
            "customer_name": "Kshiti",
            "delivery_address": "123 Test Street",
            "phone": "9876543210",
            "items": [{"menu_item_id": 1, "quantity": 2}],
        },
    )


def test_create_order_calculates_total_on_backend(client):
    response = create_test_order(client)

    assert response.status_code == 201
    data = response.json()

    assert data["total_amount"] == 200
    assert data["items"][0]["unit_price"] == 100
    assert data["items"][0]["subtotal"] == 200
    assert data["status"] == "RECEIVED"


def test_create_order_rejects_invalid_menu_item(client):
    response = client.post(
        "/api/orders",
        json={
            "customer_name": "Kshiti",
            "delivery_address": "123 Test Street",
            "phone": "9876543210",
            "items": [{"menu_item_id": 999, "quantity": 1}],
        },
    )

    assert response.status_code == 400


def test_create_order_rejects_invalid_quantity(client):
    response = client.post(
        "/api/orders",
        json={
            "customer_name": "Kshiti",
            "delivery_address": "123 Test Street",
            "phone": "9876543210",
            "items": [{"menu_item_id": 1, "quantity": 0}],
        },
    )

    assert response.status_code == 422


def test_create_order_rejects_unavailable_item(client):
    response = client.post(
        "/api/orders",
        json={
            "customer_name": "Kshiti",
            "delivery_address": "123 Test Street",
            "phone": "9876543210",
            "items": [{"menu_item_id": 2, "quantity": 1}],
        },
    )

    assert response.status_code == 400


def test_get_order(client):
    created = create_test_order(client)
    order_id = created.json()["id"]

    response = client.get(f"/api/orders/{order_id}")

    assert response.status_code == 200
    assert response.json()["id"] == order_id


def test_update_order_status(client):
    created = create_test_order(client)
    order_id = created.json()["id"]

    response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "PREPARING"},
    )

    assert response.status_code == 200
    assert response.json()["status"] == "PREPARING"


def test_invalid_status_transition(client):
    created = create_test_order(client)
    order_id = created.json()["id"]

    response = client.patch(
        f"/api/orders/{order_id}/status",
        json={"status": "DELIVERED"},
    )

    assert response.status_code == 409


def test_delete_order(client):
    created = create_test_order(client)
    order_id = created.json()["id"]

    response = client.delete(f"/api/orders/{order_id}")

    assert response.status_code == 204

    get_response = client.get(f"/api/orders/{order_id}")
    assert get_response.status_code == 404
