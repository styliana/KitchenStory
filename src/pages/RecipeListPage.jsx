import React from 'react';
import { Link } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import { hasSupabase } from '../lib/supabaseClient';
import RecipeCard from '../components/recipes/RecipeCard';

export default function RecipeListPage() {
  const { recipes, loading } = useRecipes();
  const usingSupabase = hasSupabase();

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Twoja Książka Kucharska</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Zbiór najlepszych przepisów społeczności. Wybierz coś pysznego na dzisiaj!
        </p>
      </div>

      {!usingSupabase && (
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-8 rounded shadow-sm">
          <p className="font-bold">Tryb offline</p>
          <p>Przepisy są lokalne. Skonfiguruj Supabase, aby dzielić się nimi.</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-orange-100">
          <div className="text-6xl mb-4">🥗</div>
          <h3 className="text-2xl font-bold text-gray-800">Pusto w kuchni...</h3>
          <Link to="/add" className="btn-primary mt-6 inline-block">Dodaj pierwszy przepis</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}