# KitchenStory 🍽️

**KitchenStory** is a community recipe app built with **Vite**, **React (JavaScript)**, and **Tailwind CSS**. It lets users add recipes (title, ingredients, steps, additional info), store them locally or in **Supabase**, generate PDFs from recipes, and share recipe links with others.

---

## 🚀 Features (current)
- Add recipes with structured ingredients (name, amount, unit) and ordered steps
- LocalStorage fallback when Supabase is not configured
- Export recipe to PDF (via html2canvas + jsPDF)
- Simple list and add UI, ready to connect to Supabase

## 🔭 Roadmap (coming soon)
- Multiple beautiful PDF layouts and templates
- Auth & per-user recipe ownership (Supabase Auth)
- Shareable/permalink recipe pages
- Edit/delete recipes and image attachments

---

## ⚙️ Quick start
Prerequisites: Node.js 18+ and npm

1. Clone the repo

   git clone <your-repo>
   cd kitchenstory2

2. Install dependencies

   npm install

3. Create environment file (optional — for Supabase)

   - Copy `.env.example` → `.env.local` and fill the values
   - Restart the dev server after changing env files

4. Run dev server

   npm run dev

5. Lint and format

   npm run lint
   npm run format

Open http://localhost:5173 to view the app

---

## 🧪 Testing & development notes
- If `npm install` fails, check your Node.js version or try `npm install --legacy-peer-deps`.
- If Supabase responses are errors, check table permissions and SQL logs in the Supabase dashboard.
- Environment variables must start with `VITE_` to be available in the client (Vite requirement).

---

## 🧩 Project structure (high level)
- `src/` — React app source
  - `pages/` — route pages (list, add)
  - `components/` — reusable UI components (forms, layouts)
  - `hooks/` — data hooks (`useRecipes` with local/Supabase fallback)
  - `lib/` — `supabaseClient.js` placeholder
- `SUPABASE_SETUP.md` — SQL and policy examples
