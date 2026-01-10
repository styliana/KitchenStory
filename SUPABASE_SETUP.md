# Supabase setup (quick start)

Follow these steps to enable Supabase for this app:

1) Copy env file

- Copy `.env.example` → `.env.local` (or `.env`) in the project root and fill the values.
- Don't commit this file — `.gitignore` already excludes `.env`.

2) Install dependencies and start dev server

- Install: `npm install`
- Start dev server: `npm run dev`

3) Create `recipes` table in Supabase (SQL Editor)

Run the following SQL in the Supabase SQL editor for a simple schema:

```sql
-- Optional: enable uuid generation function
create extension if not exists "pgcrypto";

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  ingredients jsonb not null,
  steps jsonb not null,
  additional_info text,
  created_at timestamptz default now()
);

create index if not exists recipes_created_at_idx on public.recipes(created_at desc);
```

4) Row Level Security and policies (development)

By default Supabase enforces RLS. For quick development you can allow public reads/inserts:

```sql
alter table public.recipes enable row level security;
create policy "public_select" on public.recipes for select using (true);
create policy "public_insert" on public.recipes for insert with check (true);
```

**Warning:** allowing public insert/select is convenient for development but insecure for production. For production, enable auth and define policies that only allow appropriate operations (e.g., signed-in users only, or per-user ownership).

5) Test

- Open app, go to `/add`, add a recipe — it will insert into the `recipes` table if Supabase is configured.
- On the list page `/` your recipe should appear (hook `useRecipes` will fetch from Supabase). If you see the warning "Supabase not configured", copy envs and restart dev server.

Troubleshooting

- If `npm install` fails, check your Node.js version (use Node >=16 or 18). Run `npm install --legacy-peer-deps` as a fallback.
- If insert/select returns an error, check the SQL editor logs and the table policies.
- Ensure the `.env` values are prefixed with `VITE_` (Vite requirement) and that you restarted the dev server after editing `.env`.
