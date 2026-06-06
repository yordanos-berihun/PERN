docker compose -f ../compose.yaml up --build
# LMS Frontend

React + Vite frontend for the LMS project.

## Run locally

```bash
cd lms-frontend
npm install
npm run dev
```

Set the backend API URL with an environment variable in a terminal:

```bash
export VITE_API_URL=http://localhost:5000/api
```

Then open the local Vite URL shown in the terminal.

## Build for production

```bash
cd lms-frontend
npm run build
```

## Docker

Build and run the full stack from the repository root:

```bash
docker compose -f ../compose.yaml up --build
```
