import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { hasSupabase } from '../lib/supabaseClient';

import RecipeCard from '../components/recipes/RecipeCard';
import RecipeFilters from '../components/recipes/RecipeFilters';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const usingSupabase = hasSupabase();

  const [filters, setFilters] = useState({
    query: '',
    category: '',
    maxTime: 0, 
    sort: 'newest'
  });

  const clearFilters = () => setFilters({ query: '', category: '', maxTime: 0, sort: 'newest' });

  useEffect(() => {
    let mounted = true;

    async function fetchRecipes() {
      if (!usingSupabase) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        let queryBuilder = supabase
          .from('recipes')
          .select('*, profiles(id, username, avatar_url)');

        if (filters.query) {
          queryBuilder = queryBuilder.ilike('title', `%${filters.query}%`);
        }
        if (filters.category) {
          queryBuilder = queryBuilder.eq('category', filters.category);
        }
        if (filters.maxTime > 0) {
          queryBuilder = queryBuilder.lte('prep_time_minutes', filters.maxTime);
        }

        switch (filters.sort) {
          case 'oldest':
            queryBuilder = queryBuilder.order('created_at', { ascending: true });
            break;
          case 'time_asc':
            queryBuilder = queryBuilder.order('prep_time_minutes', { ascending: true, nullsFirst: false });
            break;
          case 'time_desc':
            queryBuilder = queryBuilder.order('prep_time_minutes', { ascending: false, nullsLast: true });
            break;
          case 'newest':
          default:
            queryBuilder = queryBuilder.order('created_at', { ascending: false });
            break;
        }

        const { data, error } = await queryBuilder;

        if (error) {
          console.error('Błąd pobierania przepisów:', error);
          if (mounted) setRecipes([]); 
        } else {
          if (mounted) setRecipes(data || []);
        }

      } catch (err) {
        console.error('Nieoczekiwany błąd:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchRecipes();
    }, 400);

    return () => {
      clearTimeout(timer);
      mounted = false;
    };
  }, [filters, usingSupabase]);

  return (
    <div>
      {/* Nagłówek sekcji */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-gray-900 mb-4 font-serif tracking-tight">
          Książka Kucharska
        </h2>
        <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed">
          Odkryj smaki stworzone przez społeczność. Znajdź inspirację na dzisiejszy posiłek.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
        
        {/* LEWA KOLUMNA: FILTRY (Sticky) */}
        <aside className="lg:sticky lg:top-28">
           <RecipeFilters filters={filters} setFilters={setFilters} onClear={clearFilters} />
        </aside>

        {/* PRAWA KOLUMNA: WYNIKI */}
        <div>
           {!usingSupabase && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded text-red-800 shadow-sm">
              <p className="font-bold">Tryb offline / Błąd konfiguracji</p>
              <p className="text-sm">Nie wykryto połączenia z Supabase. Sprawdź plik .env.</p>
            </div>
           )}

           {loading ? (
             <div className="flex justify-center py-20 bg-white/50 rounded-3xl min-h-[400px] items-center">
               <Loader size="large" />
             </div>
           ) : recipes.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
               <span className="text-6xl block mb-6 opacity-30">🍳</span>
               <h3 className="text-xl font-bold text-gray-900">Nic nie znaleziono</h3>
               <p className="text-gray-500 mt-2 mb-8">Nie mamy przepisu pasującego do Twoich filtrów.</p>
               <Button variant="secondary" onClick={clearFilters}>
                 Wyczyść wszystkie filtry
               </Button>
             </div>
           ) : (
             /* ZMIANA: Nowoczesny Grid (gap-8, gap-y-12) */
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-12 animate-fade-in-up">
               {recipes.map((r) => (
                 <RecipeCard key={r.id} recipe={r} />
               ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
}