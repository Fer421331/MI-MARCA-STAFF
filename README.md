# Mi Marca Staff · Portal Interno

> **Plataforma interna de gestión empresarial para el equipo de Mi Marca.**
> Sistema ERP tipo SaaS con arquitectura modular, lista para escalar hacia Supabase, PostgreSQL y roles de usuario.

[![Deploy to GitHub Pages](https://github.com/Fer421331/MI-MARCA-STAFF/actions/workflows/deploy.yml/badge.svg)](https://github.com/Fer421331/MI-MARCA-STAFF/actions/workflows/deploy.yml)

🔗 **Live:** https://fer421331.github.io/MI-MARCA-STAFF/

---

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Framework   | React 19 + Vite 8                   |
| Styling     | TailwindCSS 3                       |
| Routing     | React Router v7                     |
| Icons       | Lucide React                        |
| Auth (next) | Supabase Auth                       |
| DB (next)   | Supabase + PostgreSQL               |
| Deployment  | GitHub Actions → GitHub Pages       |

---

## Getting Started (Local Development)

### 1. Prerequisites

- Node.js **≥ 20**
- npm **≥ 10**

### 2. Clone the repository

```bash
git clone https://github.com/Fer421331/MI-MARCA-STAFF.git
cd MI-MARCA-STAFF
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment (optional for now)

```bash
cp .env.example .env
# Edit .env and fill in Supabase values when ready
```

### 5. Run the development server

```bash
npm run dev
```

App will be available at **http://localhost:5173**

### Available scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start local dev server               |
| `npm run build`   | Build production bundle to `/dist`   |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

---

## Demo Accounts

| Username  | Password     | Role              |
|-----------|--------------|-------------------|
| `admin`   | `admin123`   | Administrador     |
| `ventas`  | `ventas123`  | Ventas            |
| `rrhh`    | `rrhh123`    | Recursos Humanos  |
| `soporte` | `soporte123` | Soporte           |

> These are mock credentials stored in `AuthContext.jsx`. They will be replaced with Supabase Auth in the next phase.

---

## GitHub Pages Deployment

### How it works

1. On every push to `main`, the **GitHub Actions** workflow (`.github/workflows/deploy.yml`) automatically runs.
2. It installs dependencies, runs `npm run build` (produces `/dist`), and deploys the output to the `gh-pages` environment.
3. GitHub Pages serves the static files from the `dist` folder at:
   `https://fer421331.github.io/MI-MARCA-STAFF/`

### First-time GitHub Pages setup

You need to enable GitHub Pages **once** in your repo settings:

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select **"GitHub Actions"** (not a branch)
3. Save

After that, every push to `main` auto-deploys. ✅

### Manual deploy (trigger from GitHub)

1. Go to **Actions** tab in your repo
2. Select **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** → **Run workflow**

### Update the live site

```bash
# Make your changes, then:
git add .
git commit -m "feat: your change description"
git push origin main
# GitHub Actions will auto-deploy in ~1-2 minutes
```

### SPA Routing Fix

React Router uses client-side routing. GitHub Pages does not natively support this
(refreshing `/dashboard` returns a 404).

This project uses the **`public/404.html` redirect technique**:

- GitHub Pages serves `404.html` for unmatched paths
- `404.html` encodes the original URL into a query string and redirects to `index.html`
- The script in `index.html` decodes it and uses `history.replaceState()` so React Router sees the correct path

No server configuration needed. Works automatically in production. ✅

---

## Project Structure

```
MI-MARCA-STAFF/
├── public/
│   └── 404.html                 # SPA routing fix for GitHub Pages
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx      # Collapsible sidebar with role filtering
│   │   │   └── TopBar.jsx       # Top navigation bar
│   │   └── ui/
│   │       ├── MiMarcaLogo.jsx
│   │       └── PlaceholderPage.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx      # Auth state + mock login (→ Supabase)
│   │   └── UIContext.jsx        # Sidebar/UI state
│   ├── hooks/
│   │   └── usePermissions.js    # Role-based access helpers
│   ├── layouts/
│   │   └── AppShell.jsx         # Master authenticated layout
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ReservacionesPage.jsx
│   │   ├── InventarioPage.jsx
│   │   ├── VentasPage.jsx
│   │   ├── RRHHPage.jsx
│   │   ├── SoportePage.jsx
│   │   ├── ReportesPage.jsx
│   │   ├── ConfiguracionPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── routes/
│   │   ├── navConfig.jsx        # Navigation + role visibility config
│   │   └── ProtectedRoute.jsx
│   ├── services/
│   │   └── authService.js       # Supabase Auth integration stub
│   ├── App.jsx                  # Router configuration
│   ├── main.jsx
│   └── index.css                # Global design system (Tailwind)
├── .env.example                 # Environment variable template
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions deployment workflow
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Supabase Integration (Next Phase)

When ready to connect the backend:

**1. Install Supabase client:**
```bash
npm install @supabase/supabase-js
```

**2. Create `src/lib/supabase.js`:**
```js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

**3. Add your Supabase credentials to `.env`** (see `.env.example`)

**4. Update `AuthContext.jsx`** — replace mock login:
```js
const { data, error } = await supabase.auth.signInWithPassword({ email, password })
```

**5. Add secrets to GitHub Actions:**
Go to **Repo Settings → Secrets and variables → Actions** and add:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## License

Internal use only — © Mi Marca · All rights reserved.
