# Food Delivery Order Management — Senior Full Stack Assessment

A production-minded order management feature built with:

- **Frontend:** Next.js + TypeScript
- **Backend:** FastAPI + SQLAlchemy + Pydantic
- **Database:** SQLite by default; MySQL supported through `DATABASE_URL`
- **Testing:** Pytest + Vitest + React Testing Library
- **Real-time simulation:** frontend polling + backend automatic status progression

## Features

- Menu listing with image, description, price and availability
- Add/remove items from cart
- Quantity controls
- Checkout form with validation
- Order creation
- Order history
- Order detail/status tracking
- Status progression: `RECEIVED → PREPARING → OUT_FOR_DELIVERY → DELIVERED`
- REST CRUD APIs for orders
- Backend validation and status-transition validation
- API and UI tests
- Responsive UI
- CORS configuration
- Automatic order status simulation

## Architecture

```text
Browser
   |
   v
Next.js UI
   |
   | REST/JSON
   v
FastAPI
   |
   +--> API routes
   |
   +--> Services / business rules
   |
   +--> SQLAlchemy
   |
   v
SQLite / MySQL
```

The frontend never calculates the authoritative order total. The backend loads menu prices and calculates the total from trusted database values.

`order_items.unit_price` stores the price at the time of purchase so historical orders remain correct if menu prices change later.

## Project structure

```text
order-management-assessment/
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   ├── core/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   ├── tests/
│   ├── package.json
│   └── .env.local.example
└── README.md
```

## Run backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt

copy .env.example .env
# macOS/Linux: cp .env.example .env

uvicorn app.main:app --reload --port 8000
```

API docs:

```text
http://localhost:8000/docs
```

## Run frontend

```bash
cd frontend
npm install
copy .env.local.example .env.local
# macOS/Linux: cp .env.local.example .env.local

npm run dev
```

Open:

```text
http://localhost:3000
```

## Run tests

Backend:

```bash
cd backend
pytest
```

Frontend:

```bash
cd frontend
npm test
```

## MySQL

The backend defaults to SQLite for zero-configuration local development.

For MySQL, set:

```env
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/order_management
```

The application creates its tables on startup.

## API

### Menu

```http
GET /api/menu
GET /api/menu/{menu_item_id}
```

### Orders

```http
POST   /api/orders
GET    /api/orders
GET    /api/orders/{order_id}
PATCH  /api/orders/{order_id}/status
DELETE /api/orders/{order_id}
```

### Health

```http
GET /health
```

## Status simulation

After an order is created, the backend automatically progresses:

```text
RECEIVED
   ↓
PREPARING
   ↓
OUT_FOR_DELIVERY
   ↓
DELIVERED
```

Each transition is configurable through environment variables.

The frontend polls the order endpoint every 3 seconds while an order is active. Polling was chosen for this assessment because the requirement asks for simulated real-time updates. A production system with high-frequency updates could use WebSockets or Server-Sent Events.

## AI usage

AI was used as a development assistant for boilerplate, test-case brainstorming, validation edge cases and documentation review. All generated code was reviewed and tested before integration. Architecture and business rules were intentionally reviewed manually.

## Production considerations

For a production system I would additionally consider:

- Authentication/authorization
- Payment integration
- Rate limiting
- Structured logging
- Distributed background jobs
- Redis/message queue for order events
- WebSockets/SSE
- Database migrations with Alembic
- Observability and tracing
- Idempotency keys for order creation
- Inventory/restaurant availability
