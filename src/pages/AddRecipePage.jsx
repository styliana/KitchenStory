import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import ImageUploader from '../components/recipes/ImageUploader';
import { uploadImageToSupabase } from '../services/imageService';
import { supabase } from '../lib/supabaseClient';

const emptyIngredient = () => ({ name: '', amount: '', unit: '' });
const CATEGORIES = ['Śniadanie', 'Obiad', 'Kolacja', 'Deser', 'Przekąska', 'Napój'];

export default function AddRecipePage() {
  const { addRecipe } = useRecipes(); // Do dodawania
  const navigate = useNavigate();
  const { id } = useParams(); // Jeśli jest ID, to znaczy, że edytujemy

  // Stany formularza
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient(), emptyIngredient()]);
  const [steps, setSteps] = useState(['', '']);
  
  // Stany techniczne
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null); // URL zdjęcia przy edycji
  const [loadingData, setLoadingData] = useState(false); // Ładowanie danych do edycji
  const [saving, setSaving] = useState(false);

  // --- 1. ŁADOWANIE DANYCH (JEŚLI EDYCJA) ---
  useEffect(() => {
    if (!id) return;
    
    setLoadingData(true);
    async function fetchRecipeToEdit() {
      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        setTitle(data.title);
        setCategory(data.category || '');
        setAdditionalInfo(data.additional_info || '');
        setIngredients(data.ingredients || []);
        setSteps(data.steps || []);
        setExistingImageUrl(data.image_url);
      } else {
        alert("Nie udało się pobrać przepisu lub nie masz praw do jego edycji.");
        navigate('/');
      }
      setLoadingData(false);
    }
    fetchRecipeToEdit();
  }, [id, navigate]);


  // --- HANDLERY FORMULARZA (bez zmian) ---
  const handleIngredientChange = (index, key, value) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [key]: value } : ing)));
  };
  const addIngredientRow = () => setIngredients((prev) => [...prev, emptyIngredient()]);
  const removeIngredient = (index) => setIngredients((prev) => prev.filter((_, i) => i !== index));

  const handleStepChange = (index, value) => setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  const addStep = () => setSteps((prev) => [...prev, '']);
  const removeStep = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));

  // --- ZAPISYWANIE (DWA TRYBY) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Czy wybrano nowe zdjęcie?
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile);
      }

      const recipeData = {
        title,
        category,
        additional_info: additionalInfo,
        image_url: finalImageUrl,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.trim())
      };

      if (id) {
        // TRYB EDYCJI: Aktualizacja w bazie
        const { error } = await supabase
          .from('recipes')
          .update(recipeData)
          .eq('id', id);
        
        if (error) throw error;
      } else {
        // TRYB DODAWANIA: Używamy starego hooka lub bezpośrednio supabase
        // (Dla spójności użyjmy bezpośredniego insertu, bo hook useRecipes był prosty)
        const { error } = await supabase.from('recipes').insert(recipeData);
        if (error) throw error;
      }

      navigate(id ? `/recipe/${id}` : '/'); // Wróć do detali lub na główną
    } catch (err) {
      console.error('Save failed', err);
      alert('Wystąpił błąd. Sprawdź konsolę.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return <div className="text-center py-20">Ładowanie danych...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {id ? 'Edytuj Przepis ✏️' : 'Nowy Przepis 🍳'}
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 space-y-8">
        
        {/* Jeśli edytujemy i jest stare zdjęcie, pokazujemy je */}
        {existingImageUrl && !imageFile && (
           <div className="mb-4 text-center">
             <p className="text-sm text-gray-400 mb-2">Obecne zdjęcie:</p>
             <img src={existingImageUrl} alt="Obecne" className="h-32 mx-auto rounded-lg object-cover" />
           </div>
        )}
        
        <ImageUploader onImageSelected={setImageFile} />
        
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nazwa potrawy</label>
            <input required placeholder="np. Szarlotka Babci Zosi" value={title} onChange={(e) => setTitle(e.target.value)} className="input-kitchen text-lg" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Kategoria</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                className="input-kitchen"
              >
                <option value="">-- Wybierz --</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Info (czas, porcje)</label>
              <input placeholder="np. 45 min, 4 osoby" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="input-kitchen" />
            </div>
          </div>
        </section>

        <hr className="border-orange-100" />

        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xl font-bold text-gray-800">Składniki</label>
            <button type="button" onClick={addIngredientRow} className="text-sm font-bold text-orange-600">+ Dodaj</button>
          </div>
          <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder="Produkt" value={ing.name} onChange={(e) => handleIngredientChange(i, 'name', e.target.value)} className="input-kitchen flex-grow" />
                <input placeholder="Ilość" value={ing.amount} onChange={(e) => handleIngredientChange(i, 'amount', e.target.value)} className="input-kitchen w-20 text-center" />
                <input placeholder="J.m." value={ing.unit} onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)} className="input-kitchen w-20 text-center" />
                <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 font-bold px-2">✕</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xl font-bold text-gray-800">Przygotowanie</label>
            <button type="button" onClick={addStep} className="text-sm font-bold text-orange-600">+ Dodaj</button>
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3">
                <span className="w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-sm mt-1">{i + 1}</span>
                <textarea placeholder="Opis kroku..." value={s} onChange={(e) => handleStepChange(i, e.target.value)} className="input-kitchen flex-grow min-h-[60px]" />
                <button type="button" onClick={() => removeStep(i)} className="text-red-400 font-bold mt-2">✕</button>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary text-lg px-10">
            {saving ? 'Zapisywanie...' : (id ? 'Zapisz zmiany' : 'Dodaj przepis')}
          </button>
        </div>
      </form>
    </div>
  );
}