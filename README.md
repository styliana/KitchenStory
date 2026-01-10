# KitchenStory

A simple community recipe app built with Vite, React (JavaScript), and Tailwind.

Features planned:
- Add and edit recipes (title, ingredients, steps, additional info)
- Generate PDFs with multiple layouts
- Share recipe links with friends

Getting started:

1. Install dependencies: `npm install`
2. Run dev server: `npm run dev`
3. Lint: `npm run lint`
4. Format: `npm run format`

Next steps: implement UI forms, storage (local or backend), PDF export, and sharing routes.

Supabase (optional):

- To store recipes in Supabase, set environment variables in a `.env` file at project root:

```
VITE_SUPABASE_URL=https://xyzcompany.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
```

- Create a `recipes` table with columns:
  - `id` (text primary key)
  - `title` (text)
  - `ingredients` (jsonb)
  - `steps` (jsonb)
  - `additionalInfo` (text)
  - `created_at` (timestamptz, default: now())

The app includes a localStorage fallback when Supabase is not configured.

See `SUPABASE_SETUP.md` for step-by-step SQL and policy examples to get Supabase working quickly.
