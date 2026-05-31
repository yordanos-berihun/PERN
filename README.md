# LMS Project

This repository contains a learning management system split into two main applications:

- `lms-backend` — Node.js + Express backend with Prisma and PostgreSQL support
- `lms-frontend` — React + Vite frontend

## Local development

### Backend

1. Copy the example environment file:

```bash
cd lms-backend
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run the backend in development mode:

```bash
npm run dev
```

4. The server will start on `http://localhost:5000` by default.

### Frontend

1. Install dependencies:

```bash
cd lms-frontend
npm install
```

2. Start the Vite development server:

```bash
npm run dev
```

3. By default, the frontend is available at `http://localhost:5173`.

4. Configure the backend URL with `VITE_API_URL` in your shell or `.env` file:

```bash
export VITE_API_URL=http://localhost:5000/api
```

## Environment variables

### Backend

The backend reads configuration from `lms-backend/.env`.
Use `lms-backend/.env.example` as a template. Required variables:

- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — a strong secret for signing JWT tokens
- `PORT` — port the backend listens on (default: `5000`)

### Frontend

The frontend supports a single runtime variable:

- `VITE_API_URL` — the API base URL, for example `http://localhost:5000/api`

## Testing

### Backend tests

```bash
cd lms-backend
npm test
```

### Frontend build check

```bash
cd lms-frontend
npm run build
```

## Deploy with Docker Compose

The repository includes Docker Compose definitions for the backend.

Build and run the backend container:

```bash
docker compose -f compose.yaml up --build
```

For backend debugging:

```bash
docker compose -f compose.debug.yaml up --build
```

The backend container will use `PORT=3000` in Docker Compose and map to `localhost:3000`.

## Notes

- The frontend repository is not currently included in the Compose deployment; it is intended to run separately during development.
- The GitHub CI workflow runs backend tests and a frontend build on pushes to `main`/`master`.
