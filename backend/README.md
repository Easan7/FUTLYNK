# FastAPI Backend

This repository now includes a FastAPI backend under `backend/`.

## Endpoints

- `GET /health` - service health
- `GET /api/v1/ping` - quick API ping
- `GET /docs` - Swagger UI
- `GET /redoc` - ReDoc

## Local setup

1. Create and activate a virtual environment:
   - Linux/macOS:
     - `python3 -m venv .venv`
     - `source .venv/bin/activate`
   - Windows (PowerShell):
     - `py -m venv .venv`
     - `.venv\Scripts\Activate.ps1`
2. Install backend dependencies:
   - `pip install -r backend/requirements.txt`
3. Copy env file:
   - `cp backend/.env.example backend/.env`
4. Start backend:
   - `npm run backend:dev`
5. Start frontend in a second terminal:
   - `npm run dev`

## Mobile emulator notes

- Android emulator frontend URL: `http://10.0.2.2:3000`
- Android emulator backend URL: `http://10.0.2.2:8000`
- iOS simulator frontend URL: `http://localhost:3000`
- iOS simulator backend URL: `http://localhost:8000`

## Frontend API base URL

Use `http://localhost:8000` on desktop browser and iOS simulator.
Use `http://10.0.2.2:8000` on Android emulator.
