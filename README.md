# Iteme of Hope Family Organization — Website

Full-stack website for **Iteme of Hope Family Organization** ("Iteme ry'ibyiringiro" — Bridge of Hope),
a Rwanda-based nonprofit that pays school fees for vulnerable students and helps families become
self-reliant.

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express + Mongoose + MongoDB (with an in-memory MongoDB fallback for local development)
- **Auth:** JWT-based admin login
- **Uploads:** Photos are stored locally on the server and served from `/uploads`

---

## What's included

**Public site**
- Home, About, Vulnerable Students (list + detail/sponsor page), Members, Staff,
  Charity Week, Donate, Reports, Contact

**Admin Dashboard** (`/admin`, protected by login)
- Overview stats
- Manage Vulnerable Students (add/edit/delete, with photo upload, fee goal & amount raised)
- Manage Staff
- Manage Members
- Manage Donations (view pledges, confirm status, delete)
- Manage Charity Week campaigns
- Manage Reports (annual/financial reports)
- Manage Contact Messages

---

## 1. Backend setup

From the repository root:

```bash
npm install
npm run dev:backend
```

To run the backend with a real MongoDB instance instead of the in-memory development fallback, create `backend/.env` from `backend/.env.example` and set:
- `MONGODB_URI` — your MongoDB connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login created automatically the first time the server runs

If no `MONGODB_URI` is set, the backend automatically falls back to an in-memory MongoDB server for local testing.

**Default admin login** (unless you changed `.env` before first run):
- Email: `admin@itemeofhope.org`
- Password: `ChangeMe123!`

The API starts on `http://localhost:5001` by default.

## 2. Frontend setup

From the repository root:

```bash
npm run dev:frontend
```

Or, if you want to run both together:

```bash
npm run dev
```

The frontend runs on `http://localhost:5173` and the public site is available there. The admin dashboard is at `/login`.

## 3. Building for production

```bash
cd frontend
npm run build             # outputs static files to frontend/dist
```

Deploy `frontend/dist` to any static host (Netlify, Vercel, etc.), and deploy the `backend`
folder to any Node host (Render, Railway, a VPS, etc.). Set `CLIENT_URL` in the backend `.env`
to your deployed frontend URL, and `VITE_API_URL` in the frontend `.env` to your deployed backend URL.

The project is now set up for MongoDB-backed persistence by default, with a development fallback to an
in-memory MongoDB instance when no `MONGODB_URI` is provided.

---

## Project structure

```
iteme-family-organization/
├── backend/
│   ├── config/db.js          # MongoDB connection + default admin seeding
│   ├── middleware/           # auth (JWT) + image upload (multer)
│   ├── routes/                # one file per resource + a shared CRUD factory
│   ├── data/seed.js           # sample content loader
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/        # Navbar, Footer, cards, shared UI
│       ├── pages/              # public site pages
│       ├── admin/              # admin dashboard + generic ResourceManager
│       ├── context/AuthContext.jsx
│       └── api/axios.js
└── package.json               # root scripts for running backend/frontend together
```

---

## Notes on student photos & privacy

By default, student/staff/member cards show a colored initials avatar instead of a photo
until you upload one in the admin dashboard. Many child-protection policies recommend
being deliberate about publishing real photos of vulnerable children — review your
organization's safeguarding policy before uploading real student photos, and consider
using first names only or illustrated avatars for students who haven't given consent
to be identified publicly.

## Logo

The uploaded Iteme of Hope logo is used as the favicon and throughout the navbar, footer,
and admin sidebar (`frontend/public/logo.png`). Replace that file to update the logo everywhere.
