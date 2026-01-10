import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { exportElementToPdf } from '../utils/exportPdf';
import { useAuth } from '../context/AuthContext';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link skopiowany! 🔗');
  };

  const handlePdf = async () => {
    if (recipeRef.current) await exportElementToPdf(recipeRef.current, `${recipe.title}.pdf`);
  };

  const handleEdit = () => navigate(`/edit/${id}`);
  
  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten przepis?")) return;
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) navigate('/');
  };

  const isOwner = user && recipe && user.id === recipe.user_id;

  if (loading) return <div className="text-center py-20">Ładowanie...</div>;
  if (!recipe) return <div className="text-center py-20">Nie znaleziono przepisu.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Pasek nawigacji */}
      <div className="flex justify-between items-center print:hidden">
        <Link to="/" className="text-orange-600 font-bold hover:underline">← Wróć</Link>
        <div className="flex gap-2">
          {isOwner && (
            <>
              <button onClick={handleDelete} className="bg-red-50 text-red-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-red-100 transition-colors">🗑 Usuń</button>
              <button onClick={handleEdit} className="bg-blue-50 text-blue-600 px-3 py-2 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors">✏️ Edytuj</button>
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
          <div className="w-full h-96 relative">
            <img 
              src={recipe.image_url} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {recipe.category && (
               <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-orange-800 px-4 py-1 rounded-full text-sm font-bold uppercase shadow-sm">
                 {recipe.category}
               </div>
            )}

            <div className="absolute bottom-0 left-0 p-8 md:p-12 text-white w-full">
              <h1 className="text-5xl md:text-6xl font-bold font-serif shadow-black drop-shadow-lg mb-4">{recipe.title}</h1>
              
              {/* NOWA SEKCJA METADANYCH NA ZDJĘCIU */}
              <div className="flex gap-6 text-sm font-bold uppercase tracking-wider">
                {recipe.prep_time && (
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <span>⏱️</span> {recipe.prep_time}
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-lg backdrop-blur-sm">
                    <span>👥</span> {recipe.servings}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <header className="border-b-2 border-orange-100 p-12 text-center bg-orange-50 relative">
             {recipe.category && (
               <div className="absolute top-4 right-4 bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                 {recipe.category}
               </div>
            )}
            <h1 className="text-5xl font-bold font-serif text-gray-900 mb-6">{recipe.title}</h1>
            
            {/* METADANE BEZ ZDJĘCIA */}
            <div className="flex justify-center gap-6 text-orange-800 font-bold uppercase text-sm tracking-wider">
               {recipe.prep_time && <span>⏱️ {recipe.prep_time}</span>}
               {recipe.servings && <span>👥 {recipe.servings}</span>}
            </div>
          </header>
        )}

        <div className="p-8 md:p-12">
          {recipe.additional_info && (
            <div className="mb-10 p-4 bg-orange-50 rounded-xl border border-orange-100 text-gray-700 italic text-center">
               "{recipe.additional_info}"
            </div>
          )}

          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            <aside>
              <h3 className="text-xl font-bold text-orange-600 mb-6 border-b-2 border-orange-100 pb-2 uppercase tracking-widest text-sm">Składniki</h3>
              <ul className="space-y-3 text-lg">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between border-b border-gray-50 pb-2 last:border-0">
                    <span className="font-medium">{ing.name}</span>
                    <span className="text-gray-500 font-serif italic whitespace-nowrap ml-4">{ing.amount} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            </aside>

            <section>
              <h3 className="text-xl font-bold text-orange-600 mb-6 border-b-2 border-orange-100 pb-2 uppercase tracking-widest text-sm">Przygotowanie</h3>
              <div className="space-y-8">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-5">
                    <span className="flex-shrink-0 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold font-serif text-xl shadow-orange-200 shadow-lg">
                      {i + 1}
                    </span>
                    <p className="text-lg leading-relaxed text-gray-700 mt-1">{step}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <footer className="mt-20 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm font-serif italic">
            Przepis z aplikacji KitchenStory • Wygenerowano: {new Date().toLocaleDateString()}
          </footer>
        </div>
      </article>
    </div>
  );
}