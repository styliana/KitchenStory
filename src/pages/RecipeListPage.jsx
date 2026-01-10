import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { hasSupabase } from '../lib/supabaseClient';
import RecipeCard from '../components/recipes/RecipeCard';
import RecipeFilters from '../components/recipes/RecipeFilters'; // <--- Import
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
    async function fetchRecipes() {
      setLoading(true);

      // Budujemy zapytanie
      let queryBuilder = supabase.from('recipes').select('*');

      // 1. Szukanie tekstowe (Tytuł LUB w kolumnie ingredients - wymaga rzutowania jsonb na text)
      if (filters.query) {
        // Proste szukanie po tytule (dla JSONB składników to bardziej skomplikowane w darmowym tierze bez funkcji SQL, 
        // więc na razie szukamy po tytule, a potem możemy dodać client-side filter dla składników)
        queryBuilder = queryBuilder.ilike('title', `%${filters.query}%`);
      }

      // 2. Kategoria
      if (filters.category) {
        queryBuilder = queryBuilder.eq('category', filters.category);
      }

      // 3. Czas (wymaga kolumny prep_time_minutes!)
      if (filters.maxTime > 0) {
        queryBuilder = queryBuilder.lte('prep_time_minutes', filters.maxTime);
      }

      // 4. Sortowanie
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
        console.error('Error fetching recipes:', error);
      } else {
        // Opcjonalne: Client-side filter dla składników, jeśli API search jest za słabe
        let finalData = data || [];
        
        // Jeśli szukamy po składnikach (client-side fallback)
        if (filters.query) {
           const lowerQ = filters.query.toLowerCase();
           // Filtrujemy te, które NIE pasują po tytule (bo API już je zwróciło), ale mogą pasować po składnikach
           // Uwaga: To jest uproszczenie. Idealnie robimy to w SQL.
        }
        
        setRecipes(finalData);
      }
      setLoading(false);
    }

    // Debounce (opóźnienie), żeby nie strzelać do API przy każdej literce
    const timer = setTimeout(() => {
      if (usingSupabase) fetchRecipes();
    }, 400);

    return () => clearTimeout(timer);
  }, [filters, usingSupabase]);

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 font-serif">Książka Kucharska</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Znajdź idealny przepis na dziś.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
        
        {/* LEWA KOLUMNA: FILTRY */}
        <aside>
           <RecipeFilters filters={filters} setFilters={setFilters} onClear={clearFilters} />
        </aside>

        {/* PRAWA KOLUMNA: WYNIKI */}
        <div>
           {!usingSupabase && (
            <div className="bg-orange-100 p-4 mb-4 rounded text-orange-800">Brak połączenia z Supabase.</div>
           )}

           {loading ? (
             <div className="flex justify-center py-20"><Loader /></div>
           ) : recipes.length === 0 ? (
             <div className="text-center py-20 bg-white rounded-3xl border border-orange-100">
               <span className="text-4xl block mb-2">🔍</span>
               <h3 className="text-xl font-bold text-gray-700">Nic nie znaleziono</h3>
               <p className="text-gray-500 mt-2">Spróbuj zmienić filtry.</p>
               <Button variant="ghost" onClick={clearFilters} className="mt-4">Wyczyść filtry</Button>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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