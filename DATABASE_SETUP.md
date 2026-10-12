# Database Setup Guide

## PostgreSQL Connection Error Fix

If you're seeing `ECONNREFUSED` or database connection errors, follow these steps:

### 1. Check PostgreSQL is Running

**Windows:**
```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Start PostgreSQL if not running
Start-Service -Name postgresql-x64-15  # Adjust version number
```

### 2. Create `.env.local` File

Create a file named `.env.local` in the project root:

```bash
# Database Configuration
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/nexstate_db

# Authentication
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=your-secret-key-minimum-32-characters-long

# Node Environment
NODE_ENV=development
```

**Important:** Replace `your_password` with your actual PostgreSQL password.

### 3. Create Database

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE nexstate_db;

-- Connect to the new database
\c nexstate_db

-- Exit
\q
```

### 4. Run Migrations

```bash
# Run the migration files
psql -U postgres -d nexstate_db -f supabase/tables/01_auth.sql
psql -U postgres -d nexstate_db -f supabase/tables/02_properties.sql
```

### 5. Verify Connection

Test your connection string:

```bash
psql "postgresql://postgres:your_password@localhost:5432/nexstate_db"
```

If successful, you should see the PostgreSQL prompt.

### 6. Restart Development Server

```bash
# Kill the current server (Ctrl+C)
# Then restart
bun run dev
```

## Common Issues

### Issue: "database does not exist"
**Solution:** Create the database using step 3 above.

### Issue: "password authentication failed"
**Solution:** Check your PostgreSQL password in the DATABASE_URL.

### Issue: "role does not exist"
**Solution:** Use the default `postgres` user or create a new role:
```sql
CREATE USER nexstate WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE nexstate_db TO nexstate;
```

### Issue: Port already in use
**Solution:** Check if PostgreSQL is running on a different port:
```sql
SHOW port;  -- Run in psql to check port
```

## Alternative: Using Docker PostgreSQL

If you prefer Docker:

```bash
# Run PostgreSQL in Docker
docker run --name nexstate-postgres \
  -e POSTGRES_PASSWORD=yourpassword \
  -e POSTGRES_DB=nexstate_db \
  -p 5432:5432 \
  -d postgres:15

# Then use this connection string:
# DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/nexstate_db
```

## Test Your Setup

1. Visit: `http://localhost:3001/admin/setup`
2. Enter your email and password
3. Click "Set Password & Continue"
4. If successful, you'll be redirected to login

## Still Having Issues?

Check the console logs for specific error messages and ensure:
- ✅ PostgreSQL is running
- ✅ Database `nexstate_db` exists
- ✅ Tables are created (run migrations)
- ✅ `.env.local` file exists with correct DATABASE_URL
- ✅ No typos in connection string

---

**Need Help?** Check the error message in the browser console or terminal for more details.
