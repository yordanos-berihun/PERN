# 📚 LMS Project

<div align="center">

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-supported-blue)](https://www.docker.com/)
[![CI Status](https://img.shields.io/badge/CI-passing-brightgreen)](#)

A full-stack Learning Management System built with modern web technologies.

[Features](#features) • [Quick Start](#quick-start) • [Tech Stack](#tech-stack) • [Contributing](#contributing) • [License](#license)

</div>

## Features

✨ **Core Capabilities**
- 🔐 User authentication with JWT tokens
- 📖 Course management and browsing
- 📝 Course enrollment system
- 👤 User profiles and dashboard
- 🔒 Role-based access control
- 📱 Responsive UI built with React + Vite
- 🐳 Docker Compose support for local development

## Tech Stack

### Backend
- **Node.js + Express** — Server framework
- **Prisma ORM** — Database toolkit
- **PostgreSQL** — Database
- **JWT** — Authentication

### Frontend
- **React 18** — UI library
- **Vite** — Build tool and dev server
- **CSS3** — Styling

### DevOps & Tools
- **Docker & Docker Compose** — Containerization
- **GitHub Actions** — CI/CD
- **Jest** — Testing framework

---

## Quick Start

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

## Docker Compose

Use the repository-level Docker Compose setup for the full stack:

```bash
docker compose -f compose.yaml up --build
```

The backend container is exposed on `http://localhost:5000`, and the frontend is served on `http://localhost:5173`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines, issue templates, and testing instructions.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
