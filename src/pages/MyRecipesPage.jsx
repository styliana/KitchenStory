import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import RecipeCard from '../components/recipes/RecipeCard';

export default function MyRecipesPage() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyRecipes() {
      if (!user) return;
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', user.id) // <--- KLUCZ: tylko moje przepisy
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setRecipes(data || []);
      setLoading(false);
    }
    fetchMyRecipes();
  }, [user]);

  if (loading) return <div className="text-center py-20">Ładowanie...</div>;

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Moja Kolekcja</h2>
        <p className="text-gray-600">
          Zarządzaj swoimi przepisami, edytuj je i dziel się ze światem.
        </p>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-orange-200">
          <h3 className="text-xl font-bold text-gray-600 mb-4">Nie dodałeś jeszcze żadnego przepisu.</h3>
          <Link to="/add" className="btn-primary">Dodaj pierwszy przepis</Link>
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