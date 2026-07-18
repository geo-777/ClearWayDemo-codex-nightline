# Clearway MVP

## Backend

From the project root:

```bash
cd backend
npm install
npm start
```

The Express backend is intended to run on port 3001.

## Frontend

From the project root:

```bash
cd frontend
npm install
npm run dev
```

Vite runs on its default development port (normally 5173).

## CORS

The frontend and backend run on different ports. Enable CORS on the backend before wiring the frontend API client to it.
