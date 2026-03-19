# Database Setup — Central Park News (DigitalOcean)

The database is **already created** and **data is already migrated** on DigitalOcean. You only need to connect the app to it by adding the connection details.

---

## What You Need to Do

1. Get the connection string from your team
2. Add it to `.env`
3. Install dependencies and run the app

That's it. The app will fetch all articles, authors, and other data from the existing database.

---

## Step-by-Step

### Step 1: Get the Connection Details

Ask your team for the **PostgreSQL connection string** for the DigitalOcean database. It will look like:

```
postgresql://username:password@db-xxxxx.db.ondigitalocean.com:25060/database_name?sslmode=require
```

You might receive a full URL, or separate values (host, user, password, database name).

---

### Step 2: Add to Your Project

1. In the project root folder, copy the example env file:
   ```bash
   copy .env.example .env
   ```
   (Mac/Linux: `cp .env.example .env`)

2. Open `.env` and add:
   ```env
   DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:25060/DATABASE_NAME?sslmode=require"
   ```
   Paste the full connection string they gave you, or build it from the parts.

3. **Important:** If the password has special characters (`@`, `#`, `%`), encode them (e.g. `@` → `%40`).

---

### Step 3: Install & Run

```bash
npm install
```

Then start the app:

```bash
npm run dev
```

Open `http://localhost:3000` — the app will fetch articles, authors, and everything else from the existing database.

---

### Step 4: If You Get Connection Errors

**"Can't reach database server"** — Your IP may need to be in DigitalOcean **Trusted Sources**:
- Ask your team to add your IP, or
- They can add it in: DigitalOcean → Databases → your cluster → Settings → Trusted Sources

**"Environment variable not found"** — Ensure `.env` is in the project root (same folder as `package.json`) and restart the terminal or dev server.

---

## Summary

| Step | Action |
|------|--------|
| 1 | Get connection string from team |
| 2 | Create `.env` with `DATABASE_URL="..."` |
| 3 | Run `npm install` |
| 4 | Run `npm run dev` |

No database creation, no table creation, no data entry — just add the URL and run the app.
