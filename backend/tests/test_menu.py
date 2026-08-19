def test_get_menu(client):
    response = client.get("/api/menu")

    assert response.status_code == 200
    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "Test Pizza"
    assert data[0]["price"] == 100
