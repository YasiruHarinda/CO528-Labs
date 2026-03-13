# DECP — Department Engagement & Career Platform

> CO528 Applied Software Architecture  Mini Project  
> Department of Computer Engineering, University of Peradeniya

---

## Live Demo

- **Web App:** [https://your-app.vercel.app](https://co-528-labs-oito.vercel.app/
- **Backend API:** https://co528-project.onrender.com

---

## What is DECP?

A platform for current students and alumni of the CE department to connect, share posts, apply for jobs, collaborate on research, and stay up to date with department events.

---

## Features

- User registration and login (index number based)
- Feed with photo/video posts, likes, and comments
- Jobs and internship listings with one-click apply
- Real CE department events (live from CE portal API)
- Real student profiles with photos (live from CE people API)
- Research collaboration projects
- Direct messaging
- Analytics dashboard
- Push notifications (Web Push / VAPID)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML / CSS / JavaScript (Single Page App) |
| Mobile | React Native + Expo |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication + JWT |
| Storage | Firebase Storage |
| Deployment | Vercel (frontend) · Render (backend) |

---

## Project Structure

```
CO528-Labs/mini_project/
├── index.html          ← web client (deployed to Vercel)
├── sw.js               ← service worker for push notifications
├── decp-backend/       ← Node.js + Express API (deployed to Render)
│   ├── index.js
│   ├── firebase.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── jobs.js
│   │   ├── events.js
│   │   ├── research.js
│   │   ├── messages.js
│   │   ├── analytics.js
│   │   └── notifications.js
│   └── utils/
│       └── notify.js
└── DECP-Mobile/        ← React Native mobile app (Expo)
```

---

## Running Locally

### Backend

```bash
cd mini_project/decp-backend
npm install
# create a .env file with the variables listed below
node index.js
```

### Frontend

Open `mini_project/index.html` in your browser, or use the VS Code Live Server extension.

### Mobile

```bash
cd mini_project/DECP-Mobile
npm install
npx expo start --clear
# Scan the QR code with the Expo Go app
```

---

## Environment Variables

Create a `.env` file inside `decp-backend/`:

```
JWT_SECRET=your_secret_here
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_KEY_JSON={"type":"service_account",...}
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_EMAIL=mailto:your@email.com
```

> **Never commit `.env` or `firebase-key.json` to GitHub.**

---

## Team

| Index No. | Name | Role |
|-----------|------|------|
| E/20/___ | Member 1 | Enterprise Architect |
| E/20/___ | Member 2 | Solution Architect |
| E/20/___ | Member 3 | Application Architect |
| E/20/___ | Member 4 | Security & DevOps Architect |

---

## Module: CO528 Applied Software Architecture
