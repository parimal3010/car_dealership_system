# Car Dealership Inventory System

A full-stack car dealership inventory application built with **Test-Driven Development (TDD)**.

## Tech Stack

| Layer    | Technology                                        |
| -------- | ------------------------------------------------- |
| Backend  | Node.js, Express, JavaScript                      |
| Frontend | React, Vite                                       |
| Database | MongoDB (Docker for dev, Memory Server for tests) |
| Auth     | JWT (jsonwebtoken + bcryptjs)                     |
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

### Step 2: User Registration — ✅ REFACTOR (complete)

**Endpoint:** `POST /api/auth/register`

**Test file:** `backend/tests/auth/register.test.js`

| Test Case                      | Expected Status | Description                                    |
| ------------------------------ | --------------- | ---------------------------------------------- |
| Register with valid details    | 201             | Returns user object (id, name, email, role)    |
| Password is hashed in database | —               | Stored password is bcrypt hash, not plain text |
| Missing name                   | 400             | Validation error for name                      |
| Missing email                  | 400             | Validation error for email                     |
| Missing password               | 400             | Validation error for password                  |
| Invalid email format           | 400             | Validation error for email                     |
| Password too short (< 6 chars) | 400             | Validation error for password                  |
| Duplicate email                | 409             | Conflict error when email already exists       |

**Architecture (after refactor):**

| Layer      | File                              | Responsibility                 |
| ---------- | --------------------------------- | ------------------------------ |
| Route      | `routes/authRoutes.js`            | HTTP routing + async wrapper   |
| Controller | `controllers/authController.js`   | Request/response orchestration |
| Service    | `services/authService.js`         | User lookup and creation       |
| Validator  | `validators/registerValidator.js` | Input validation rules         |
| Model      | `models/User.js`                  | Schema + password hashing      |
| Middleware | `middleware/asyncHandler.js`      | Async error propagation        |
| Middleware | `middleware/errorHandler.js`      | Centralized error responses    |
| Utils      | `utils/formatUser.js`             | Public user response shape     |
| Utils      | `utils/constants.js`              | Shared validation constants    |

**Refactor improvements:**

- Separated validation logic from controller (Single Responsibility)
- Extracted database operations into auth service layer
- Reusable `formatUserResponse` for consistent API output
- Centralized error handling via middleware
- Shared constants for email regex and password rules

**Status:** All 8 registration tests passing after refactor.

---

### Step 3: User Login — ✅ REFACTOR (complete)

**Endpoint:** `POST /api/auth/login`

**Test file:** `backend/tests/auth/login.test.js`

| Test Case                      | Expected Status | Description                        |
| ------------------------------ | --------------- | ---------------------------------- |
| Login with valid credentials   | 200             | Returns JWT token and user object  |
| JWT contains user id and email | —               | Token decodes with correct payload |
| Missing email                  | 400             | Validation error for email         |
| Missing password               | 400             | Validation error for password      |
| Invalid email format           | 400             | Validation error for email         |
| User does not exist            | 401             | Invalid credentials error          |
| Incorrect password             | 401             | Invalid credentials error          |

**Request body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Expected success response (200):**

```json
{
  "message": "Login successful",
  "token": "<jwt-token>",
  "user": {
    "id": "<mongodb-id>",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Status:** All 5 login tests passing.

---

### Step 4: Admin Seeding — ✅ REFACTOR (complete)

**Functionality:** Auto-seed admin user on server startup

**Test file:** `backend/tests/seeds/seedAdmin.test.js`

| Test Case                               | Description                                      |
| --------------------------------------- | ------------------------------------------------ |
| Admin created with correct email & role | Admin account initialized at startup             |
| Password stored as bcrypt hash          | Password security verified                       |
| No duplicate admin on re-seed           | Idempotent seeding (safe to call multiple times) |
| Admin can login with credentials        | Admin user (parimal3010@gmail.com / 123456)      |
| Admin login fails with wrong password   | Invalid credentials rejected                     |

**Implementation:**

| Component          | File                            | Responsibility                         |
| ------------------ | ------------------------------- | -------------------------------------- |
| Seed Function      | `seeds/seedAdmin.js`            | Initialize admin user in database      |
| Server Integration | `server.js`                     | Call seedAdmin() after DB connection   |
| Test Suite         | `tests/seeds/seedAdmin.test.js` | Verify seeding and login functionality |

**Admin Credentials (hardcoded):**

- Email: `parimal3010@gmail.com`
- Password: `123456` (hashed with bcrypt)
- Role: `admin`

**Features:**

- ✅ Prevents duplicate admin creation
- ✅ Runs automatically on server startup
- ✅ Uses bcrypt hashing for password security
- ✅ Admin can login and receive JWT token

**Status:** All 5 seed tests passing. Admin auto-seeded on every server start.

---

### Step 5: Add Vehicle (Admin Only) — ✅ REFACTOR (complete)

**Endpoint:** `POST /api/vehicles`

**Test file:** `backend/tests/vehicles/addVehicle.test.js`

**Authorization:** Admin-only (requires valid JWT with admin role)

| Test Category           | Test Cases | Expected Status | Description                                                                          |
| ----------------------- | ---------- | --------------- | ------------------------------------------------------------------------------------ |
| **Successful Creation** | 2          | 201             | Admin creates vehicle & persists to DB                                               |
| **Authorization**       | 3          | 401/403         | No token, invalid token, non-admin user                                              |
| **Validation**          | 7          | 400             | Missing fields (make, model, year, price), invalid year, negative price, future year |

**Request body:**

```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "price": 25000,
  "mileage": 5000,
  "color": "Silver",
  "fuelType": "Gasoline",
  "transmission": "Automatic"
}
```

**Expected success response (201):**

```json
{
  "message": "Vehicle added successfully",
  "vehicle": {
    "id": "<mongodb-id>",
    "make": "Toyota",
    "model": "Camry",
    "year": 2023,
    "price": 25000,
    "mileage": 5000,
    "color": "Silver",
    "fuelType": "Gasoline",
    "transmission": "Automatic",
    "createdAt": "<timestamp>"
  }
}
```

**Validation Rules:**

- `make` (required, string)
- `model` (required, string)
- `year` (required, number, ≤ current year)
- `price` (required, number, ≥ 0)
- `mileage` (optional, number, ≥ 0)
- `color` (optional, string)
- `fuelType` (optional, string)
- `transmission` (optional, string)

**Test Summary:**

- ✅ 12 test cases written & passing
- ✅ All validation and authorization tests passing
- ✅ Refactored for clean code (grouped validations, clear comments)
- ✅ Inline validation pattern (matches login controller style)

**Implementation Details:**

| Component  | File                               | Pattern                                 |
| ---------- | ---------------------------------- | --------------------------------------- |
| Controller | `controllers/vehicleController.js` | Inline validation, direct DB operations |
| Middleware | `middleware/authMiddleware.js`     | JWT + role-based authorization          |
| Routes     | `routes/vehicleRoutes.js`          | Protected with auth & admin checks      |
| Format     | `utils/formatVehicle.js`           | Response formatting utility             |
| Model      | `models/Vehicle.js`                | MongoDB schema with validations         |

**Refactor Improvements:**

- Grouped validation by type (required fields, year checks, price checks)
- Organized comments for readability
- Direct `Vehicle.create()` in controller (no service layer)
- Consistent response formatting
- Admin-only access via middleware

---

### Step 6: View Vehicles (List All) — 🔴 RED (tests written, not yet implemented)

**Endpoint:** `GET /api/vehicles`

**Test file:** `backend/tests/vehicles/getVehicles.test.js`

**Authorization:** Protected (requires valid JWT, all authenticated users)

| Test Category            | Test Cases | Expected Status | Description                                                                       |
| ------------------------ | ---------- | --------------- | --------------------------------------------------------------------------------- |
| **Successful Retrieval** | 5          | 200             | Empty list, all vehicles, correct structure, no sensitive data, sorted descending |
| **Pagination**           | 3          | 200             | Limit/skip parameters, vehicle count, total count                                 |
| **Authorization**        | 3          | 401             | No token, invalid token, both admin/user can access                               |
| **Error Handling**       | 2          | 200             | Invalid limit, invalid skip (graceful handling)                                   |

**Request (with optional query parameters):**

```
GET /api/vehicles?limit=10&skip=0
Authorization: Bearer <jwt-token>
```

**Expected success response (200):**

```json
{
  "message": "Vehicles retrieved successfully",
  "vehicles": [
    {
      "id": "<mongodb-id>",
      "make": "Toyota",
      "model": "Camry",
      "year": 2023,
      "price": 25000,
      "mileage": 5000,
      "color": "Silver",
      "fuelType": "Gasoline",
      "transmission": "Automatic",
      "createdAt": "<timestamp>"
    }
  ],
  "count": 1,
  "totalCount": 5
}
```

**Query Parameters:**

- `limit` (optional, number, default: 10) — Max vehicles to return
- `skip` (optional, number, default: 0) — Number of vehicles to skip

**Features:**

- ✅ 13 test cases written
- ✅ All tests currently failing (RED phase)
- ✅ Covers successful retrieval, pagination, authorization, error handling
- ⏳ Awaiting implementation (Green phase)

| Method | Endpoint                     | Auth      | Status           | Phase    |
| ------ | ---------------------------- | --------- | ---------------- | -------- |
| GET    | `/api/health`                | Public    | ✅ Done          | Complete |
| POST   | `/api/auth/register`         | Public    | ✅ Done          | Complete |
| POST   | `/api/auth/login`            | Public    | ✅ Done          | Complete |
| POST   | `/api/vehicles`              | Admin     | ✅ Done          | Complete |
| GET    | `/api/vehicles`              | Protected | 🔴 Tests Written | RED      |
| GET    | `/api/vehicles/search`       | Protected | ⬜ Pending       | —        |
| PUT    | `/api/vehicles/:id`          | Admin     | ⬜ Pending       | —        |
| DELETE | `/api/vehicles/:id`          | Admin     | ⬜ Pending       | —        |
| POST   | `/api/vehicles/:id/purchase` | Protected | ⬜ Pending       | —        |
| POST   | `/api/vehicles/:id/restock`  | Admin     | ⬜ Pending       | —        |

---

## Git Commit Convention

When using AI assistance, add a co-author trailer:

```
feat: add registration tests (TDD red phase)

Co-authored-by: Cursor AI <AI@users.noreply.github.com>
```
