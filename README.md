# Iteme of Hope Family Organization — Website

Full-stack website for **Iteme of Hope Family Organization** ("Iteme ry'ibyiringiro" — Bridge of Hope),
a Rwanda-based nonprofit that pays school fees for vulnerable students and helps families become
self-reliant.

- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express + lowdb (a simple JSON file database — no external database to install)
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

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # loads sample students, staff, members, a charity week, etc. (optional but recommended)
npm run dev       # starts on http://localhost:5000
```

Open `.env` and set:
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the login created automatically the first time the server runs

**Default admin login** (unless you changed `.env` before first run):
- Email: `admin@itemeofhope.org`
- Password: `ChangeMe123!`

⚠️ Change this password immediately after your first login by editing `backend/data/db.json`,
or extend the admin panel with a "change password" screen — the API scaffolding
(`POST /api/auth/register`, protected, superadmin only) already lets a superadmin create
additional admin/staff logins.

## 2. Frontend setup

```bash
cd frontend
cp .env.example .env    # points to http://localhost:5000/api by default
npm install
npm run dev              # starts on http://localhost:5173
```

Visit `http://localhost:5173` for the public site, and `http://localhost:5173/login` to sign in
to the admin dashboard.

## 3. Building for production

```bash
cd frontend
npm run build             # outputs static files to frontend/dist
```

Deploy `frontend/dist` to any static host (Netlify, Vercel, etc.), and deploy the `backend`
folder to any Node host (Render, Railway, a VPS, etc.). Set `CLIENT_URL` in the backend `.env`
to your deployed frontend URL, and `VITE_API_URL` in the frontend `.env` to your deployed backend URL.

For real production use, consider swapping `lowdb` for a proper database (PostgreSQL, MongoDB)
once your data grows — the CRUD route structure in `backend/routes/crudFactory.js` maps cleanly
onto that migration.

---

## Project structure

```
iteme-family-organization/
├── backend/
│   ├── config/db.js          # lowdb setup + default admin seeding
│   ├── middleware/           # auth (JWT) + image upload (multer)
│   ├── routes/                # one file per resource + a shared CRUD factory
│   ├── data/db.json           # the "database" (auto-created)
│   ├── data/seed.js           # sample content loader
│   └── server.js
└── frontend/
    └── src/
        ├── components/        # Navbar, Footer, cards, shared UI
        ├── pages/              # public site pages
        ├── admin/              # admin dashboard + generic ResourceManager
        ├── context/AuthContext.jsx
        └── api/axios.js
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
