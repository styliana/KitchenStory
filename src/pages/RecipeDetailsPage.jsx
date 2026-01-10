import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // <--- useNavigate
import { supabase } from '../lib/supabaseClient';
import { exportElementToPdf } from '../utils/exportPdf';
import { useAuth } from '../context/AuthContext'; // <--- useAuth

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Pobieramy zalogowanego usera
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const recipeRef = useRef(null);

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error('Error:', error);
      else setRecipe(data);
      setLoading(false);
    }
    fetchRecipe();
  }, [id]);

  const handleShare = () => { /* ... bez zmian ... */ };
  const handlePdf = async () => { /* ... bez zmian ... */ };

  // --- NOWE FUNKCJE ---
  const handleEdit = () => {
    navigate(`/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten przepis?")) return;
    
    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Błąd usuwania.");
    } else {
      navigate('/');
    }
  };

  const isOwner = user && recipe && user.id === recipe.user_id;
  // --------------------

  if (loading) return <div className="text-center py-20">Ładowanie...</div>;
  if (!recipe) return <div className="text-center py-20">Nie znaleziono przepisu.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-orange-600 font-bold hover:underline">← Wróć</Link>
        <div className="flex gap-2">
          {/* PRZYCISKI WŁAŚCICIELA */}
          {isOwner && (
            <>
              <button onClick={handleDelete} className="bg-red-50 text-red-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-colors">
                🗑 Usuń
              </button>
              <button onClick={handleEdit} className="bg-blue-50 text-blue-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors">
                ✏️ Edytuj
              </button>
              <div className="w-px bg-gray-300 mx-2 h-8 self-center"></div>
            </>
          )}
          
          <button onClick={handleShare} className="btn-secondary text-sm">🔗 Udostępnij</button>
          <button onClick={handlePdf} className="btn-primary text-sm">📄 PDF</button>
        </div>
      </div>

      <article ref={recipeRef} className="bg-white p-0 rounded-2xl shadow-xl border border-orange-100 text-gray-800 overflow-hidden print:shadow-none">
        
        {/* Header ze zdjęciem */}
        {recipe.image_url ? (
          <div className="w-full h-80 relative">
            <img 
              src={recipe.image_url} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            
            {/* KATEGORIA NA ZDJĘCIU */}
            {recipe.category && (
               <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase shadow-sm">
                 {recipe.category}
               </div>
            )}

            <div className="absolute bottom-0 left-0 p-8 text-white">
              <h1 className="text-5xl font-bold font-serif shadow-black drop-shadow-lg">{recipe.title}</h1>
            </div>
          </div>
        ) : (
          <header className="border-b-2 border-orange-100 p-8 text-center bg-orange-50 relative">
             {recipe.category && (
               <div className="absolute top-4 right-4 bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                 {recipe.category}
               </div>
            )}
            <h1 className="text-5xl font-bold font-serif text-gray-900">{recipe.title}</h1>
          </header>
        )}
        
        {/* ... RESZTA KODU BEZ ZMIAN (Ingredients, Steps, Footer) ... */}
        {/* Skopiuj wnętrze <div className="p-10"> z poprzedniej wersji pliku */}
        <div className="p-10">
          {recipe.additional_info && (
            <div className="mb-8 flex justify-center">
              <div className="inline-block bg-orange-50 text-orange-800 px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm border border-orange-100">
                🕒 {recipe.additional_info}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <aside>
              <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-200 pb-2 uppercase tracking-widest text-sm">Składniki</h3>
              <ul className="space-y-3 text-lg">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between border-b border-gray-50 pb-1">
                    <span className="font-medium">{ing.name}</span>
                    <span className="text-gray-500 font-serif italic">{ing.amount} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <section>
              <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-200 pb-2 uppercase tracking-widest text-sm">Przygotowanie</h3>
              <div className="space-y-6">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold font-serif">{i + 1}</span>
                    <p className="text-lg leading-relaxed text-gray-700 mt-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <footer className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm font-serif italic">
            KitchenStory • {new Date().toLocaleDateString()}
          </footer>
        </div>

      </article>
    </div>
  );
}