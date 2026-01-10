import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, hasSupabase } from '../lib/supabaseClient';

const LOCAL_KEY = 'kitchenstory:recipes';

export default function useRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      if (hasSupabase()) {
        const { data, error } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error('Supabase fetch error', error);
          // fallback to local
          const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
          if (mounted) setRecipes(local);
        } else {
          if (mounted) setRecipes(data || []);
        }
      } else {
        const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        if (mounted) setRecipes(local);
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  async function addRecipe(recipe) {
    const item = { ...recipe, id: recipe.id || uuidv4(), created_at: new Date().toISOString() };
    if (hasSupabase()) {
      const { error } = await supabase.from('recipes').insert(item);
      if (error) throw error;
      // re-fetch
      const { data } = await supabase.from('recipes').select('*').order('created_at', { ascending: false });
      setRecipes(data || []);
    } else {
      const current = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
      const updated = [item, ...current];
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
      setRecipes(updated);
    }
    return item;
  }

  return {
    recipes,
    loading,
    addRecipe,
  };
}
