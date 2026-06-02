# LMS Frontend

Simple React + Vite frontend skeleton for the MERN LMS.

Run locally:

```bash
cd lms-frontend
npm install
npm run dev
```

Set the backend base URL with `VITE_API_URL`:

```bash
export VITE_API_URL=http://localhost:5000/api
```

Production Docker Compose deployment is also supported from the repository root:

```bash
docker compose -f ../compose.yaml up --build
```

```bash
export VITE_API_URL=http://localhost:5000/api
```

Then open the development URL shown by Vite.
