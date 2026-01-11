# KitchenStory 🍽️

Your kitchen story to share - join our community of chefs, amateurs and everyone who cooks!

## 🚀 What can you do now?
- Add, view recipes, view your collection!
- Export recipe to PDF
- Log in and have a profile

## 🔭 Coming soon
- Multiple beautiful PDF layouts and templates 
- Shareable/permalink recipe pages
- Edit/delete recipes and image attachments
- Like and make recipes popular
- Have your food influencer profile and edit it

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
