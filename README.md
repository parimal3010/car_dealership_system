# Car Dealership Inventory System

A full-stack car dealership inventory application built with **Test-Driven Development (TDD)**.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Backend  | Node.js, Express, JavaScript                    |
| Frontend | React, Vite                                     |
| Database | MongoDB (Docker for dev, Memory Server for tests) |
| Auth     | JWT (jsonwebtoken + bcryptjs)                   |
| Testing  | Jest + Supertest (backend), Vitest (frontend)     |

## Project Structure

```
car_dealership_system/
├── backend/          # REST API
├── frontend/         # React SPA
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Docker (for MongoDB)

### Installation

```bash
npm run install:all
cp backend/.env.example backend/.env
npm run db:up
```

### Running the App

```bash
npm run dev:backend    # http://localhost:5000
npm run dev:frontend   # http://localhost:3000
```

### Running Tests

```bash
npm test                          # all tests
npm run test:watch --prefix backend   # TDD watch mode (backend)
npm run test:watch --prefix frontend  # TDD watch mode (frontend)
```

---

## TDD Development Log

We follow the **Red → Green → Refactor** cycle. Each feature is built in three steps:

1. **Red** — Write failing tests that define expected behavior
2. **Green** — Implement the minimum code to make tests pass
3. **Refactor** — Clean up while keeping tests green

### Step 1: Project Setup ✅

- Monorepo structure with backend and frontend
- Express API with health check endpoint
- React + Vite frontend scaffold
- Jest + Supertest + MongoDB Memory Server for backend TDD
- Vitest + React Testing Library for frontend TDD
- Docker Compose for local MongoDB

**Tests:** `GET /api/health` — passing

---

### Step 2: User Registration — 🔴 RED (tests written, not yet implemented)

**Endpoint:** `POST /api/auth/register`

**Test file:** `backend/tests/auth/register.test.js`

| Test Case                              | Expected Status | Description                                      |
| -------------------------------------- | --------------- | ------------------------------------------------ |
| Register with valid details            | 201             | Returns user object (id, name, email, role)      |
| Password is hashed in database         | —               | Stored password is bcrypt hash, not plain text   |
| Missing name                           | 400             | Validation error for name                        |
| Missing email                          | 400             | Validation error for email                       |
| Missing password                       | 400             | Validation error for password                    |
| Invalid email format                   | 400             | Validation error for email                       |
| Password too short (< 6 chars)         | 400             | Validation error for password                    |
| Duplicate email                        | 409             | Conflict error when email already exists         |

**Request body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected success response (201):**

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "<mongodb-id>",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Status:** Tests written — awaiting implementation (Green phase).

---

## API Endpoints (Planned)

| Method | Endpoint                    | Auth     | Status        |
| ------ | --------------------------- | -------- | ------------- |
| GET    | `/api/health`               | Public   | ✅ Done       |
| POST   | `/api/auth/register`        | Public   | 🔴 Test only  |
| POST   | `/api/auth/login`           | Public   | ⬜ Pending    |
| POST   | `/api/vehicles`             | Protected| ⬜ Pending    |
| GET    | `/api/vehicles`             | Protected| ⬜ Pending    |
| GET    | `/api/vehicles/search`      | Protected| ⬜ Pending    |
| PUT    | `/api/vehicles/:id`         | Protected| ⬜ Pending    |
| DELETE | `/api/vehicles/:id`         | Admin    | ⬜ Pending    |
| POST   | `/api/vehicles/:id/purchase`| Protected| ⬜ Pending    |
| POST   | `/api/vehicles/:id/restock` | Admin    | ⬜ Pending    |

---

## Git Commit Convention

When using AI assistance, add a co-author trailer:

```
feat: add registration tests (TDD red phase)

Co-authored-by: Cursor AI <AI@users.noreply.github.com>
```
