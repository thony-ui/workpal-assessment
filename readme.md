# Workpal Backend API

A backend API built with **Node.js**, **Express**, **Prisma**, and **MySQL**, designed for the Workpal teacher-student management system.

---

## Production URL

Test the deployed API:
**[https://workpal-assessment-production-99ee.up.railway.app](https://workpal-assessment-production-99ee.up.railway.app)**

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/thony-ui/workpal-api.git
cd workpal-api
```

### 2. Install Dependencies

```bash
npm install
```

---

## Running the App

### Option A: Run locally with `npm run dev`

#### Prerequisites:

- Node.js ≥ 18
- A local MySQL instance (or use PlanetScale/Railway)

#### Steps:

1. Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="mysql://<username>:<password>@localhost:3306/workpal"
PORT=3000
```

2. Push the schema and start:

```bash
npx prisma generate
npx prisma db push
npm run dev
```

App will run at: [http://localhost:3000](http://localhost:3000)

---

### Option B: Run using Docker

#### Prerequisites:

- Docker installed

#### Development Environment:

```bash
docker compose -f infra/docker/docker-compose.dev.yml up --build
```

OR

```bash
docker-compose -f infra/docker/docker-compose.dev.yml up --build
```

depending on the your docker version.

This will:

- Start a MySQL container
- Start the app with hot reload

> Make sure to check or update the `.env` file used in `docker-compose.dev.yml`

#### Production-like Environment:

```bash
docker compose -f infra/docker/docker-compose.prod.yml up --build
```

OR

```bash
docker-compose -f infra/docker/docker-compose.prod.yml up --build
```

This uses the production Dockerfile setup and expects a valid `DATABASE_URL` already configured.

---

## Testing

We use **Jest** and **Supertest** for unit/integration tests.

```bash
npm run test
```

All endpoints are tested for expected responses, including:

- `POST /api/register`
- `GET /api/commonstudents`
- `POST /api/suspend`
- `POST /api/retrievefornotifications`

---

## Tech Stack

- **Express** — Web framework
- **Prisma** — ORM for MySQL
- **MySQL** — Database (local or managed)
- **Docker** — Containerization
- **Railway** — Deployment
- **Jest** — Testing

---

## Project Structure

```
├── prisma/               # Prisma schema & migrations
├── src/
│   ├── modules/
│   │   └── student-management/  # Main domain logic
│   ├── config/          # DB connection
│   └── app.ts           # Express setup
├── infra/
│   └── docker/          # Docker-related files
├── Dockerfile
├── .env.example
└── package.json
```

---

## Notes

- Prisma will look for `DATABASE_URL` from the environment. This must be set properly in Railway or your local setup.
- Dockerfile uses `entrypoint.sh` to run Prisma commands before starting the app.
