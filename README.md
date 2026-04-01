# FUTLYNK

FUTLYNK is a mobile-first football social coordination app.  
It helps players discover games, coordinate with groups, manage profiles, and handle post-game feedback and rewards in one place.

## What This Repo Contains

- `client/` — React + Vite frontend (mobile-first UI)
- `backend/` — FastAPI backend (API, business rules, Stripe checkout session handling)
- `shared/` — shared code/constants used across app layers
- `server/` — production static server build support

## Core Product Features

### 1) Auth + New User Flow

- Sign up with:
  - display name
  - username
  - optional email
- Login with username or email (MVP, no password flow)
- New signups see onboarding + skill band setup
- Returning users skip onboarding

### 2) Home / My Games

- Next match hero card
- Upcoming joined games list
- Leave game actions
- Pending “Rate Players” tasks (scoped to completed games the user actually played)
- Quick stats:
  - joined count
  - reliability
  - streak

### 3) Search / Matchmaking

- Discover open rooms
- Skill-aware filter chips (dynamic to current user’s band)
- Hybrid / all-room filtering
- Availability filtering toggle
- Joined rooms excluded from search results
- Ranked fit labels:
  - Best fit
  - Strong match
  - Solid option
  - Worth considering

### 4) Room Details

- Location, date/time, skill type, roster fill
- Join/leave logic
- In-room chat
- Price visibility behavior for high-fill rooms
- Wallet-payment trigger for high-fill join thresholds

### 5) Groups

- Group list + group detail
- Skill-band spread and reliability summary
- Group chat
- Recommended games with:
  - availability matching
  - interest/declined/waiting tracking
  - auto-join when all eligible members confirm
- Upcoming group games sourced by `joined_via_group_id`
- Group creator can add members after creation

### 6) Group Recommendation Policy (Skill Restriction)

- Mixed-skill groups -> recommended **Hybrid only**
- Single-tier groups -> recommended **Hybrid** or **same tier only**
- Policy is enforced in backend recommendation generation and interest endpoints

### 7) Friends / Social

- Friend list
- Search-first add friend flow
- Incoming/outgoing pending requests
- Accept/reject request workflow
- View other users’ profiles

### 8) Profile

- Editable:
  - basic identity fields
  - avatar
- Tags + achievements:
  - locked for normal users (unlock messaging shown)
  - editable for demo account `u-me`
- Past matches section
- Community tags from post-game ratings
- Own-profile privacy differences vs other-user profile

### 9) Availability

- Recurring windows (days + from/to)
- Specific-date windows (date + from/to)
- Stored in backend and used for recommendation/discovery matching

### 10) Wallet + Rewards + Vouchers

- Wallet balance and FutPoints
- Top-up actions (`+10 / +20 / +50` + custom amount)
- Stripe hosted checkout redirect flow (test/live key depending env)
- Redeem vouchers with points
- Wallet activity feed

### 11) Post-Game Feedback

- Rate eligible players (1–5 stars)
- Sportsmanship flag
- Assign feedback tags (per-player)
- Tag display expansion in UI (`+more`)
- Eligibility rules enforced in backend

### 12) Hidden Rating + Band Progression

- Hidden skill rating updates after feedback submission using Elo-like logic
- Weighted by history:
  - more prior rated matches -> smaller change per new game
- Public skill band can auto-adjust using threshold/hysteresis rules

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- Wouter routing
- Framer Motion
- Sonner toasts

### Backend

- FastAPI + Pydantic
- Supabase (Postgres)
- Stripe API (server-side secret key)

## Local Development

## Prerequisites

- Node.js 18+
- Python 3.11+
- Valid Supabase project keys

## 1) Install dependencies

```bash
npm install
```

## 2) Backend env (`backend/.env`)

```env
APP_NAME=FUTLYNK API
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://10.0.2.2:3000

SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

STRIPE_SECRET_KEY=sk_test_...
FRONTEND_BASE_URL=http://localhost:3000
```

## 3) Frontend env (`.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 4) Run backend

```bash
npm run backend:dev
```

## 5) Run frontend

```bash
npm run dev
```

## Build + Type Check

```bash
npm run check
npm run build
```

## Deployment Notes

### Backend (Render/Railway style)

- Root directory: repo root
- Start command:

```bash
python3 -m uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT
```

- Required backend env:
  - `SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `STRIPE_SECRET_KEY`
  - `ALLOWED_ORIGINS`
  - `FRONTEND_BASE_URL`

### Frontend (Vercel style)

- Framework preset: Vite
- Build command:

```bash
vite build
```

- Output dir:

```text
dist/public
```

- Required frontend env:
  - `VITE_API_BASE_URL=https://<backend-domain>`

## Security / MVP Notes

- This project is MVP-oriented and intentionally lightweight in auth.
- Keep all server-side keys private (never in frontend env or committed source).
- Rotate secrets if exposed during testing.

---

If you want, this README can also be split into:
- `README.md` (quickstart)
- `docs/FEATURES.md` (full functional spec)
- `docs/DEPLOY.md` (provider-specific deployment playbooks)
