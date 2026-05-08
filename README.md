# PhysioPath 🩺

> An offline-first physiotherapy exercise card system that bridges the gap between doctors and patients through guided rehabilitation plans, voice-assisted rep counting, and QR-based plan sharing.

**Live Demo:** [physiopath-sandy.vercel.app](https://physiopath-sandy.vercel.app)

---

## Table of Contents

- [Overview](#overview)
- [Core Features](#core-features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Offline-First Patient Experience](#offline-first-patient-experience)
- [Doctor Features](#doctor-features)
- [Patient Features](#patient-features)
- [AI & Media Features](#ai--media-features)
- [Authentication & Verification](#authentication--verification)
- [Analytics](#analytics)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Setup & Installation](#setup--installation)
- [Demo Registration](#demo-registration)
- [Demo Flow](#demo-flow)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## Overview

PhysioPath solves a critical problem in physiotherapy: **patients forget exercise steps, perform movements incorrectly, or lose access to instructions when offline.**

The platform provides:
- Doctors with a simple, intuitive plan builder
- Patients with a no-login, mobile-first, offline-ready exercise experience

Doctors create exercise prescriptions with sets, reps, rest time, step-by-step instructions, common mistakes, and images. Each plan automatically generates a patient URL and QR code. Patients open the link once — the plan is then cached locally for full offline use.

---

## Core Features

| Feature | Description |
|---|---|
| 🔐 Doctor Auth | Registration, login, and NMC-style license verification |
| 📋 Plan Builder | Create and edit patient exercise plans with full detail |
| 📱 QR Code Sharing | Each plan generates a shareable URL and scannable QR code |
| 🌐 Offline Support | PWA + IndexedDB enables full offline patient access after first load |
| 🎙️ Voice Rep Counting | Browser SpeechRecognition API for hands-free rep tracking |
| 🔢 Manual Rep Counting | Sequential rep validation to prevent skipping |
| 📊 Doctor Analytics | Charts and stats backed by real MongoDB data |
| ⭐ Patient Rating | Patients rate doctors; ratings update the doctor's profile |
| 📞 Contact Doctor | Direct phone dialer button on patient dashboard |
| 🌍 Multilingual Content | Language selector on patient exercise pages |

---

## User Roles

### 👨‍⚕️ Doctor

- Register and verify account via NMC-style license flow
- Log in securely with JWT
- Create, edit, and delete patient exercise plans
- Generate QR codes and shareable plan links
- View patient progress, completed plans, and ratings
- Access analytics dashboard
- Edit profile details

### 🧑‍🦯 Patient (No login required)

- Open a shared plan link without any account
- Use the app fully offline after first load
- View prescribed exercises with images and step-by-step guidance
- Select preferred language and listen to audio explanations
- Start guided workout mode
- Count reps manually or by voice
- Track daily progress and streaks
- Rate the treating doctor
- Call the doctor directly

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React + Vite | Core framework and build tool |
| React Router | Client-side routing |
| Framer Motion | Animations and transitions |
| Three.js | 3D landing page scene |
| Dexie.js | IndexedDB wrapper for offline storage |
| vite-plugin-pwa | PWA service worker generation |
| qrcode.react | QR code generation |
| Lucide React | Icon library |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database and ODM |
| JWT | Token-based authentication |
| bcryptjs | Password hashing |

---

## Project Structure
physiopath/
├── client/
│   ├── public/
│   │   ├── exercise images (offline-cached)
│   │   └── medical illustrations
│   └── src/
│       ├── api/              # Axios API calls
│       ├── components/       # Reusable UI components
│       ├── context/          # React Context providers
│       ├── data/             # Static exercise data
│       ├── db/               # Dexie IndexedDB setup
│       ├── pages/            # Route-level page components
│       ├── App.jsx
│       └── App.css
│
└── server/
├── models/
│   ├── User.js
│   ├── Plan.js
│   └── CompletedPlan.js
├── routes/
│   ├── authRoutes.js
│   ├── planRoutes.js
│   └── geminiRoutes.js
└── index.js

---

## Architecture
PhysioPath
├── client (React + Vite)
│   ├── PWA service worker → caches app shell + public assets
│   ├── IndexedDB (Dexie) → stores patient plan locally
│   └── Doctor & Patient UI
│
└── server (Express + MongoDB)
├── Auth routes (register / login / profile)
├── Plan routes (CRUD + progress + rating)
└── Gemini route (AI image fallback)

---

## Offline-First Patient Experience

PhysioPath is designed so patients are **never blocked by poor connectivity**.

### How it works

1. Patient opens the shared plan link while online.
2. Plan data is fetched from the backend.
3. Plan is saved locally to **IndexedDB** via Dexie.
4. PWA service worker caches the app shell and all public assets.
5. Exercise images (served from `client/public`) are included in the PWA cache.
6. Progress is saved locally first, then synced when online.

### What works offline

✅ Patient dashboard  
✅ Exercise list and details  
✅ Exercise images  
✅ Guided workout mode  
✅ Manual rep counting  
✅ Local progress tracking  

### Requires internet

🔄 First-time plan fetch  
🔄 Syncing completion status to doctor dashboard  
🔄 Submitting doctor rating  

---

## Doctor Features

### Dashboard Tabs

| Tab | Content |
|---|---|
| Plans | All created patient plans |
| Patients | Patient list |
| Progress | Real-time progress from patient syncs |
| Completed | Fully completed patient recoveries |
| Analytics | Charts backed by MongoDB data |

### Plan Builder

Doctors can configure:
- Patient name and recovery duration (weeks)
- Exercise selection from a library
- Sets, reps, rest duration (seconds)
- Step-by-step instructions
- Common mistakes to avoid
- Exercise images

### QR & Share Link

Each plan generates:
- A shareable patient URL: `/patient/:token`
- A scannable QR code
- A copy-link option

---

## Patient Features

### Patient Dashboard

- Personalized greeting
- Daily completion percentage
- Recovery streak counter
- Recovery plan timeline
- Full exercise list
- Language selector
- Contact doctor (direct phone dialer)
- Plan QR code for re-access
- Doctor rating card

### Exercise Detail Page

- Main exercise image
- Sets / reps / rest info
- Step-by-step instructions
- Common mistakes to avoid
- Voice explanation button

### Guided Workout Mode

- Countdown before each set
- Active rep counter (manual + voice)
- Rest timer between sets
- Completion screen with progress save

### Voice Rep Counting

The app uses the browser's native `SpeechRecognition` API.

- **Language:** `en-US`
- **Mode:** Continuous listening, no interim results
- **Accepts:** Number words (`one`, `two`, `three`) and digits (`1`, `2`, `3`)
- **Validation:** Sequential — skipping reps triggers a warning
- Manual counting is always available as a fallback

---

## AI & Media Features

- **Offline Exercise Images** served from `client/public` and PWA-cached
- **Gemini AI Endpoint** (`POST /api/gemini/exercise-images`) as an image generation fallback/prototype
- **Three.js 3D Scene** on the landing page

### Built-in Offline Exercise Library

| Exercise |
|---|
| Quad Sets |
| Glute Bridges |
| Wall Slides |
| Ankle Pumps |
| Heel Slides |
| Straight Leg Raise |
| Clamshells |
| Seated Knee Extension |

---

## Authentication & Verification

### Doctor Registration

Collects:
- Full name
- Email and password
- Medical License Number
- State Medical Council
- Profile photo (URL or upload)

### License Verification Flow

1. Backend maps the State Medical Council to an NMC `smcId`
2. Calls the NMC public verification endpoint
3. Cross-checks the submitted registration number
4. Creates the account only on successful verification

> **Demo bypass:** License numbers starting with `DEMO` are accepted locally to prevent NMC service downtime from blocking hackathon demos.

### Login

- Email + password authentication
- `bcryptjs` password comparison
- JWT token issued on success
- Verified account check enforced

---

## Analytics

The Analytics tab displays real MongoDB-backed data:

- 📈 Patient growth chart
- 📊 Plan status breakdown (Pending / In-Progress / Completed)
- 💪 Most prescribed muscle groups
- 📅 Plans shared this week
- 🏃 Active exercise count
- ✅ Completed recovery count

Progress is synced from the patient app using the following plan fields:
- `completedExerciseIds`
- `progressPercent`
- `status`
- `lastProgressAt`

---

## API Reference

### Auth Routes
POST  /api/auth/register    → Register a new doctor
POST  /api/auth/login       → Login and receive JWT
GET   /api/auth/me          → Get current doctor profile
PUT   /api/auth/me          → Update doctor profile

### Plan Routes
GET    /api/plans                     → List all plans for logged-in doctor
POST   /api/plans                     → Create a new patient plan
GET    /api/plans/:token              → Fetch a patient plan (public)
PUT    /api/plans/:token              → Update plan details
DELETE /api/plans/:token              → Delete a plan
GET    /api/plans/completed           → List completed plans
POST   /api/plans/:token/progress     → Sync patient progress
POST   /api/plans/:token/complete     → Mark plan as complete
POST   /api/plans/:token/rate         → Submit a doctor rating

### Gemini Route
POST /api/gemini/exercise-images    → AI image generation (optional/prototype)

---

## Environment Variables

Create a `.env` file inside the `server/` directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_optional
```

Optional frontend variable (create `.env` inside `client/`):

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/vinayaka-112006/physiopath.git
cd physiopath
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

```bash
cd ../server
npm install
```

### 4. Configure environment

Create `server/.env` with your MongoDB URI and JWT secret (see [Environment Variables](#environment-variables)).

### 5. Start the backend

```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

### 6. Start the frontend

```bash
cd client
npm run dev
# Runs on http://127.0.0.1:5173
```

---

## Demo Registration

Use the following details for hackathon/demo testing:
Full Name:              Dr Demo Physio
Email:                  demo.physio1@physiopath.com
Password:               password123
Medical License Number: DEMO12345
State Medical Council:  Karnataka

> If the email already exists, increment the number: `demo.physio2@physiopath.com`

---

## Demo Flow

1. Register or log in as a doctor using the demo credentials.
2. Create a new patient plan from the dashboard.
3. Add exercises with sets, reps, rest time, and instructions.
4. Save the plan — a patient URL and QR code are generated.
5. Copy the patient URL or scan the QR code to open the patient view.
6. Complete exercises using manual or voice rep counting.
7. Return to the doctor dashboard to view synced progress.
8. Rate the doctor from the patient dashboard.
9. View the updated rating in the doctor profile.

---

## Known Limitations

- **Offline mode** requires at least one successful online load to populate the local cache.
- **Voice rep counting** depends on browser `SpeechRecognition` support (works best in Chrome).
- **NMC verification** can be unavailable externally; `DEMO` license numbers bypass this for testing.
- **Patient completion and ratings** require internet to sync to MongoDB.
- Older plans may show as pending until patient progress re-syncs.

---

## License

This project was created for hackathon demonstration and educational purposes.

---

*Built with ❤️ for NCET Hackathon by team Synapse sqad*
