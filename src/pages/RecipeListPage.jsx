import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { hasSupabase } from '../lib/supabaseClient';

// Komponenty UI
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeFilters from '../components/recipes/RecipeFilters';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

export default function RecipeListPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const usingSupabase = hasSupabase();

  // Stan filtrów
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    maxTime: 0, // 0 oznacza "wszystkie"
    sort: 'newest'
  });

  // Funkcja resetująca filtry
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
        // 1. Budujemy zapytanie podstawowe
        // WAŻNE: Pobieramy przepisy ORAZ dane profilu autora (join)
        let queryBuilder = supabase
          .from('recipes')
          .select('*, profiles(id, username, avatar_url)');

        // 2. Aplikujemy filtry
        
        // Wyszukiwanie po tytule (case-insensitive)
        if (filters.query) {
          queryBuilder = queryBuilder.ilike('title', `%${filters.query}%`);
        }

        // Kategoria
        if (filters.category) {
          queryBuilder = queryBuilder.eq('category', filters.category);
        }

        // Czas przygotowania (wymaga kolumny liczbowej w bazie: prep_time_minutes)
        if (filters.maxTime > 0) {
          queryBuilder = queryBuilder.lte('prep_time_minutes', filters.maxTime);
        }

        // Sortowanie
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

        // 3. Wykonanie zapytania
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
        // To wykona się ZAWSZE - koniec kręcenia spinnerem
        if (mounted) setLoading(false);
      }
    }

    // Debounce: czekamy 400ms po wpisaniu tekstu zanim strzelimy do API
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
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 font-serif">Książka Kucharska</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Znajdź idealny przepis na dziś, przeglądając kolekcję społeczności.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        
        {/* LEWA KOLUMNA: FILTRY */}
        <aside className="lg:sticky lg:top-24">
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
             <div className="flex justify-center py-20 bg-white/50 rounded-3xl min-h-[300px] items-center">
               <Loader size="large" />
             </div>
           ) : recipes.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-orange-100 shadow-sm">
               <span className="text-5xl block mb-4 opacity-50">🔍</span>
               <h3 className="text-xl font-bold text-gray-700">Nic nie znaleziono</h3>
               <p className="text-gray-500 mt-2 mb-6">Spróbuj zmienić parametry wyszukiwania.</p>
               <Button variant="secondary" onClick={clearFilters}>
                 Wyczyść wszystkie filtry
               </Button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
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