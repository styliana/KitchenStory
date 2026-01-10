import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RecipeListPage from './pages/RecipeListPage';
import AddRecipePage from './pages/AddRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage'; // <--- 1. Import

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm border-b-4 border-orange-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="group">
            <h1 className="text-3xl font-bold text-orange-600 flex items-center gap-2">
              <span className="text-4xl group-hover:rotate-12 transition-transform">🥘</span> 
              KitchenStory
            </h1>
            <p className="text-xs text-gray-500 font-sans tracking-wider uppercase ml-12">Community Cookbook</p>
          </Link>

          <nav className="flex gap-4">
            <Link to="/" className="btn-secondary text-sm">Przeglądaj</Link>
            <Link to="/add" className="btn-primary text-sm flex items-center gap-2">
              <span>+</span> Dodaj przepis
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto w-full p-6">
        <Routes>
          <Route path="/" element={<RecipeListPage />} />
          <Route path="/add" element={<AddRecipePage />} />
          <Route path="/recipe/:id" element={<RecipeDetailsPage />} /> {/* <--- 2. Nowa trasa */}
        </Routes>
      </main>

      <footer className="text-center py-8 text-orange-800/60 text-sm">
        &copy; {new Date().getFullYear()} KitchenStory. Gotowane z pasją.
      </footer>
    </div>
  );
}