import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/recipes/RecipeCard';
import Loader from '../components/ui/Loader';
import Button from '../components/ui/Button';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyRecipes() {
      // Jeśli user nie jest jeszcze załadowany, czekamy
      if (!user) return;

      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('recipes')
          // WAŻNE: Pobieramy też dane profilu, żeby karta przepisu (RecipeCard) miała co wyświetlić w stopce
          .select('*, profiles(id, username, avatar_url)')
          .eq('user_id', user.id) // Tylko przepisy zalogowanego
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Błąd pobierania moich przepisów:', error);
          alert('Wystąpił problem z pobraniem Twojej kolekcji.');
        } else {
          setRecipes(data || []);
        }
      } catch (err) {
        console.error('Nieoczekiwany błąd:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchMyRecipes();
  }, [user]);

  if (loading) return <div className="py-20 flex justify-center"><Loader /></div>;

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 font-serif">Moja Kolekcja</h2>
        <p className="text-gray-600">
          Zarządzaj swoimi przepisami. Jesteś zalogowany jako <span className="font-bold text-orange-600">{user?.email}</span>.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-orange-200 max-w-2xl mx-auto shadow-sm">
          <span className="text-5xl block mb-4">📝</span>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Twoja książka kucharska jest pusta</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Nie dodałeś jeszcze żadnego przepisu. Czas podzielić się swoim talentem kulinarnym ze światem!
          </p>
          <Link to="/add">
            <Button variant="primary" className="px-8 py-3 text-lg shadow-orange-200">
              + Dodaj pierwszy przepis
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
          {recipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} showAuthor={false} /> 
            // showAuthor={false} bo wiadomo, że to Twoje, ale RecipeCard i tak obsłuży dane profilu jeśli tam są
          ))}
        </div>
      )}
    </div>
  );
}