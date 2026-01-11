import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import RecipeCard from '../components/recipes/RecipeCard';
import Loader from '../components/ui/Loader';

export default function ChefProfilePage() {
  const { id } = useParams(); // ID kucharza z URL
  const [profile, setProfile] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchChefData() {
      setLoading(true);
      
      // 1. Pobierz dane profilu
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      // 2. Pobierz przepisy tego kucharza
      const { data: recipesData, error: recipesError } = await supabase
        .from('recipes')
        .select('*, profiles(*)') // Pobieramy też dane autora do karty
        .eq('user_id', id)
        .order('created_at', { ascending: false });

      if (profileError) {
        console.error("Błąd profilu", profileError);
      } else {
        setProfile(profileData);
        setRecipes(recipesData || []);
      }

      // <--- NAPRAWA 1: Używamy zmiennej recipesError (np. logujemy ją)
      if (recipesError) {
        console.error("Błąd pobierania przepisów kucharza:", recipesError);
      }

      setLoading(false);
    }

    if (id) fetchChefData();
  }, [id]);

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!profile) return <div className="text-center py-20">Nie znaleziono kucharza. 👨‍🍳</div>;

  return (
    <div>
      {/* --- NAGŁÓWEK PROFILU --- */}
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-orange-100 text-center mb-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-orange-100 to-orange-50"></div>
        
        <div className="relative">
          <img 
            src={profile.avatar_url} 
            alt={profile.username} 
            className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-md bg-white object-cover"
          />
          <h1 className="text-3xl font-bold text-gray-800 mt-4 font-serif">
            {profile.username}
          </h1>
          <p className="text-gray-500 text-sm uppercase tracking-widest mt-1">
            Szef Kuchni • Dołączył {new Date(profile.updated_at || Date.now()).toLocaleDateString()}
          </p>
          
          {profile.bio && (
            // <--- NAPRAWA 2: Zamiana cudzysłowów " na encje &quot;
            <p className="mt-4 text-gray-600 italic max-w-lg mx-auto">&quot;{profile.bio}&quot;</p>
          )}

          <div className="mt-6 flex justify-center gap-8">
            <div className="text-center">
              <span className="block text-2xl font-bold text-orange-600">{recipes.length}</span>
              <span className="text-xs text-gray-400 uppercase font-bold">Przepisów</span>
            </div>
            {/* Tutaj w przyszłości: Followers, Likes */}
          </div>
        </div>
      </div>

      {/* --- PRZEPISY KUCHARZA --- */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        🍽️ Przepisy użytkownika <span className="text-orange-600">{profile.username}</span>
      </h2>

      {recipes.length === 0 ? (
        <div className="text-center py-10 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
          Ten kucharz nie dodał jeszcze żadnego przepisu.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} showAuthor={false} /> // showAuthor=false bo jesteśmy na jego profilu
          ))}
        </div>
      )}
    </div>
  );
}