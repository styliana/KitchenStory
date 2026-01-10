import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { usePdfGenerator } from '../hooks/usePdfGenerator'; // <--- Hook
import RecipePdfTemplate from '../components/recipes/RecipePdfTemplate'; // <--- Szablon

import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

export default function RecipeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  // Hook do PDF
  const { generatePdf, isGenerating } = usePdfGenerator();
  // Ref dla szablonu PDF (nie dla widoku ekranowego!)
  const pdfTemplateRef = useRef(null);

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
    alert('Link skopiowany do schowka! 🔗');
  };

  // Handler używający hooka
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
    else { alert("Błąd usuwania"); setDeleting(false); }
  };

  const isOwner = user && recipe && user.id === recipe.user_id;

  if (loading) return <div className="py-20"><Loader /></div>;
  if (!recipe) return <div className="text-center py-20 text-gray-500">Nie znaleziono przepisu.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* 1. UKRYTY SZABLON PDF (Renderuje się zawsze, ale poza ekranem) */}
      <RecipePdfTemplate ref={pdfTemplateRef} recipe={recipe} />

      {/* 2. PASEK AKCJI */}
      <div className="flex justify-between items-center">
        <Link to="/" className="text-orange-600 font-bold hover:underline flex items-center gap-1">← Wróć</Link>
        <div className="flex gap-2">
          {isOwner && (
            <>
              <Button onClick={handleDelete} variant="danger" className="text-sm" isLoading={deleting}>🗑 Usuń</Button>
              <Button onClick={handleEdit} variant="secondary" className="text-sm" disabled={deleting || isGenerating}>✏️ Edytuj</Button>
              <div className="w-px bg-gray-300 mx-2 h-8 self-center"></div>
            </>
          )}
          <Button onClick={handleShare} variant="secondary" className="text-sm" disabled={deleting || isGenerating}>🔗 Udostępnij</Button>
          
          {/* Przycisk wywołuje hooka */}
          <Button onClick={handlePdfClick} className="text-sm" isLoading={isGenerating}>
            📄 Pobierz PDF
          </Button>
        </div>
      </div>

      {/* 3. WIDOK EKRANOWY (Interfejs Web) - Tu nic nie zmieniamy w wyglądzie */}
      <article className="bg-white p-0 rounded-2xl shadow-xl border border-orange-100 text-gray-800 overflow-hidden">
         {/* ... (Tu zostaje Twój kod widoku webowego - ten sam co w poprzednim kroku) ... */}
         {/* ... (Aby nie wklejać 200 linii kodu ponownie - zostawiamy wnętrze article takie jak było) ... */}
         
         {/* HEADER (Web) */}
         {recipe.image_url ? (
            <div className="w-full h-96 relative group">
              <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                <h1 className="text-5xl font-bold font-serif shadow-black drop-shadow-lg mb-4">{recipe.title}</h1>
                <div className="flex gap-4 text-sm font-bold uppercase">
                  {recipe.prep_time && <span className="bg-white/20 px-3 py-1 rounded backdrop-blur">⏱️ {recipe.prep_time}</span>}
                  {recipe.servings && <span className="bg-white/20 px-3 py-1 rounded backdrop-blur">👥 {recipe.servings}</span>}
                </div>
              </div>
            </div>
         ) : (
           <div className="p-12 text-center border-b border-orange-100 bg-orange-50">
             <h1 className="text-5xl font-bold font-serif text-gray-900 mb-4">{recipe.title}</h1>
           </div>
         )}
         
         {/* CONTENT (Web) */}
         <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-[1fr_2fr] gap-12">
              <aside>
                <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-100 pb-2">Składniki</h3>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="font-bold">{ing.name}</span>
                      <span className="text-gray-500 italic">{ing.amount} {ing.unit}</span>
                    </li>
                  ))}
                </ul>
              </aside>
              <section>
                <h3 className="text-xl font-bold text-orange-600 mb-4 border-b border-orange-100 pb-2">Przygotowanie</h3>
                <div className="space-y-6">
                  {recipe.steps.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">{i+1}</span>
                      <p className="mt-1 text-gray-700 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
         </div>
      </article>

    </div>
  );
}