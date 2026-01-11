import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { usePdfGenerator } from '../hooks/usePdfGenerator';

// Komponenty UI
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import RecipePdfTemplate from '../components/recipes/RecipePdfTemplate';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Hook do PDF
  const { generatePdf, isGenerating } = usePdfGenerator();
  const pdfTemplateRef = useRef(null);

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      
      // Pobieramy przepis ORAZ dane autora (z tabeli profiles)
      const { data, error } = await supabase
        .from('recipes')
        .select('*, profiles(id, username, avatar_url)') // <--- JOIN do profili
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error:', error);
      } else {
        setRecipe(data);
      }
      setLoading(false);
    }
    fetchRecipe();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link skopiowany do schowka! 🔗');
  };

  const handlePdfClick = () => {
    if (recipe) {
      generatePdf(pdfTemplateRef, `${recipe.title}.pdf`);
    }
  };

  const handleEdit = () => navigate(`/edit/${id}`);
  
  const handleDelete = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten przepis?")) return;
    setDeleting(true);
    const { error } = await supabase.from('recipes').delete().eq('id', id);
    if (!error) navigate('/');
    else { 
      alert("Błąd usuwania"); 
      setDeleting(false); 
    }
  };

  const isOwner = user && recipe && user.id === recipe.user_id;

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!recipe) return <div className="text-center py-20 text-gray-500">Nie znaleziono przepisu.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* --- 1. UKRYTY SZABLON PDF (Renderuje się zawsze, ale poza ekranem) --- */}
      <RecipePdfTemplate ref={pdfTemplateRef} recipe={recipe} />

      {/* --- 2. PASEK NAWIGACJI I AKCJI --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 print:hidden">
        <Link to="/" className="text-orange-600 font-bold hover:underline flex items-center gap-1 self-start sm:self-auto">
          ← Wróć
        </Link>
        
        <div className="flex gap-2 flex-wrap justify-end">
          {isOwner && (
            <>
              <Button onClick={handleDelete} variant="danger" className="text-xs sm:text-sm" isLoading={deleting}>
                🗑 Usuń
              </Button>
              <Button onClick={handleEdit} variant="secondary" className="text-xs sm:text-sm" disabled={deleting || isGenerating}>
                ✏️ Edytuj
              </Button>
              <div className="hidden sm:block w-px bg-gray-300 mx-2 h-8 self-center"></div>
            </>
          )}
          <Button onClick={handleShare} variant="secondary" className="text-xs sm:text-sm" disabled={deleting || isGenerating}>
            🔗 Udostępnij
          </Button>
          <Button onClick={handlePdfClick} className="text-xs sm:text-sm" isLoading={isGenerating}>
            📄 Pobierz PDF
          </Button>
        </div>
      </div>

      {/* --- 3. GŁÓWNA KARTA PRZEPISU (WIDOK WEBOWY) --- */}
      <article className="bg-white p-0 rounded-2xl shadow-xl border border-orange-100 text-gray-800 overflow-hidden">
        
        {/* HEADER ZE ZDJĘCIEM */}
        {recipe.image_url ? (
          <div className="w-full h-80 sm:h-96 relative group">
            <img 
              src={recipe.image_url} 
              alt={recipe.title} 
              className="w-full h-full object-cover"
              crossOrigin="anonymous" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            {/* KATEGORIA */}
            {recipe.category && (
               <div className="absolute top-6 right-6 bg-white/90 backdrop-blur text-orange-800 px-4 py-1 rounded-full text-sm font-bold uppercase shadow-sm border border-orange-100">
                 {recipe.category}
               </div>
            )}

            {/* TYTUŁ I METADANE */}
            <div className="absolute bottom-0 left-0 p-8 sm:p-12 text-white w-full">
              <h1 className="text-4xl sm:text-6xl font-bold font-serif shadow-black drop-shadow-lg mb-4 leading-tight">
                {recipe.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-wider">
                {recipe.prep_time && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md border border-white/30">
                    <span className="text-xl">⏱️</span> 
                    <span>{recipe.prep_time}</span>
                  </div>
                )}
                {recipe.servings && (
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-md border border-white/30">
                    <span className="text-xl">👥</span> 
                    <span>{recipe.servings}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* WARIANT BEZ ZDJĘCIA */
          <header className="border-b-2 border-orange-100 p-12 text-center bg-orange-50 relative">
             {recipe.category && (
               <div className="absolute top-4 right-4 bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
                 {recipe.category}
               </div>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold font-serif text-gray-900 mb-6">{recipe.title}</h1>
            
            <div className="flex justify-center gap-6 text-orange-800 font-bold uppercase text-sm tracking-wider">
               {recipe.prep_time && <span className="flex items-center gap-2">⏱️ {recipe.prep_time}</span>}
               {recipe.servings && <span className="flex items-center gap-2">👥 {recipe.servings}</span>}
            </div>
          </header>
        )}

        <div className="p-8 sm:p-12">
          
          {/* NOWOŚĆ: Link do Autora (jeśli dostępny) */}
          {recipe.profiles && (
            <div className="flex items-center justify-center gap-3 mb-10">
              <span className="text-gray-400 text-sm italic">Przepis od:</span>
              <Link 
                to={`/chef/${recipe.profiles.id}`}
                className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-orange-100 hover:border-orange-300 transition-colors group"
              >
                <img 
                  src={recipe.profiles.avatar_url || `https://ui-avatars.com/api/?name=${recipe.profiles.username}`} 
                  alt={recipe.profiles.username} 
                  className="w-6 h-6 rounded-full border border-gray-200"
                />
                <span className="font-bold text-gray-700 text-sm group-hover:text-orange-600">
                  {recipe.profiles.username}
                </span>
              </Link>
            </div>
          )}

          {/* NOTATKI */}
          {recipe.additional_info && (
            <div className="mb-12 p-6 bg-orange-50 rounded-xl border-l-4 border-orange-400 text-gray-700 italic text-lg relative">
               <span className="absolute -top-4 -left-2 text-6xl text-orange-200 opacity-50 font-serif">“</span>
               {recipe.additional_info}
            </div>
          )}

          {/* UKŁAD 2 KOLUMN */}
          <div className="grid md:grid-cols-[1fr_2fr] gap-12">
            
            {/* Lewa: Składniki */}
            <aside>
              <h3 className="text-xl font-bold text-orange-600 mb-6 border-b-2 border-orange-100 pb-2 uppercase tracking-widest text-sm flex items-center gap-2">
                🥦 Składniki
              </h3>
              <ul className="space-y-4 text-lg">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex justify-between items-baseline border-b border-dashed border-gray-200 pb-2 last:border-0">
                    <span className="font-bold text-gray-800">{ing.name}</span>
                    <span className="text-gray-500 font-serif italic whitespace-nowrap ml-4 bg-gray-50 px-2 rounded text-base">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Prawa: Kroki */}
            <section>
              <h3 className="text-xl font-bold text-orange-600 mb-6 border-b-2 border-orange-100 pb-2 uppercase tracking-widest text-sm flex items-center gap-2">
                👨‍🍳 Przygotowanie
              </h3>
              <div className="space-y-8">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-5 group">
                    <span className="flex-shrink-0 w-12 h-12 bg-orange-100 text-orange-600 border-2 border-orange-200 rounded-full flex items-center justify-center font-bold font-serif text-xl group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition-colors">
                      {i + 1}
                    </span>
                    <p className="text-lg leading-relaxed text-gray-700 mt-2 font-light">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
          
          <footer className="mt-20 pt-8 border-t border-gray-100 text-center text-gray-400 text-sm font-serif italic">
            Przepis z aplikacji KitchenStory • Smacznego! 🧡
          </footer>
        </div>
      </article>
    </div>
  );
}