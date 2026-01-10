import React from 'react';
import { Link } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import { hasSupabase } from '../lib/supabaseClient';

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
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 mb-8 rounded shadow-sm" role="alert">
          <p className="font-bold">Tryb offline</p>
          <p>Przepisy są zapisywane tylko w Twojej przeglądarce. Skonfiguruj Supabase, aby dzielić się nimi ze światem.</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      ) : recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-orange-100">
          <div className="text-6xl mb-4">🥗</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Pusto w kuchni...</h3>
          <p className="text-gray-500 mb-6">Bądź pierwszą osobą, która podzieli się przepisem!</p>
          <Link to="/add" className="btn-primary">Dodaj pierwszy przepis</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <article key={r.id} className="card-kitchen hover:shadow-2xl transition-shadow flex flex-col h-full">
              {/* Opcjonalnie tutaj w przyszłości zdjęcie */}
              <div className="h-32 bg-orange-100 flex items-center justify-center text-orange-300">
                 <span className="text-4xl">🍽️</span>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold mb-2 leading-tight">{r.title}</h3>
                {r.additionalInfo && (
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wide mb-3 bg-orange-50 inline-block px-2 py-1 rounded self-start">
                    {r.additionalInfo}
                  </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                   <span>{r.ingredients?.length || 0} składników</span>
                   {/* Tu w przyszłości link do detali */}
                   <button className="text-orange-600 font-bold hover:underline">Zobacz →</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}