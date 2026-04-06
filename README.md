# CouchConnect

A full-stack CouchSurfing-style web app built with Angular 17+, Node.js/Express/TypeScript, and MongoDB Atlas.

## Setup

### 1. Backend

```bash
cd backend
# Edit .env — set your MONGO_URI and JWT_SECRET
npm install
npm run dev        # runs on http://localhost:3000
```

### 2. Frontend

```bash
cd client
npm install
ng serve           # runs on http://localhost:4200
```

## Environment

Edit `backend/.env`:
```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/couchconnect
JWT_SECRET=your_secret_here
```

## Features

- JWT auth (cookie + Bearer token), role-based (traveler / local / admin)
- Profile system with base64 image compression (canvas API)
- Leaflet map with CARTO Voyager tiles + Nominatim geocoding
- Real-time-style chat (polling), inbox with unread counts
- Stay requests (traveler → local, accept/reject)
- Community Q&A with city tags
- OCR-based identity verification (Tesseract.js)
- Admin dashboard with donut chart, user management
- Dark/light mode (persisted via ThemeService)
- Skeleton loaders, glassmorphism auth cards, animated hero slideshow

## Routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/login` `/signup` | Auth pages |
| `/home` | Home with photo strip |
| `/locals` | Browse all profiles |
| `/map` | Leaflet map |
| `/profile` | Own profile (edit) |
| `/profile/:id` | View any profile |
| `/inbox` | Message inbox |
| `/messages/:chatId` | Chat window |
| `/questions` | Q&A community |
| `/my-requests` | Traveler's sent requests |
| `/local-requests` | Local's incoming requests |
| `/request-stay/:localId` | Send stay request |
| `/verification` | ID verification |
| `/admin` | Admin dashboard (admin only) |
