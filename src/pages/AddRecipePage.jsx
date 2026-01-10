import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import { supabase } from '../lib/supabaseClient';
import { uploadImageToSupabase } from '../services/imageService';

// Komponenty UI
import ImageUploader from '../components/recipes/ImageUploader';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

const emptyIngredient = () => ({ name: '', amount: '', unit: '' });
const CATEGORIES = ['Śniadanie', 'Obiad', 'Kolacja', 'Deser', 'Przekąska', 'Napój'];

export default function AddRecipePage() {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();
  const { id } = useParams();

  // --- STANY ---
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState(''); // Nowe pole
  const [servings, setServings] = useState(''); // Nowe pole
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient(), emptyIngredient()]);
  const [steps, setSteps] = useState(['', '']);
  
  // Stany techniczne
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- ŁADOWANIE DANYCH (EDYCJA) ---
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
        setPrepTime(data.prep_time || ''); // Pobieramy czas
        setServings(data.servings || '');   // Pobieramy porcje
        setAdditionalInfo(data.additional_info || '');
        setIngredients(data.ingredients || []);
        setSteps(data.steps || []);
        setExistingImageUrl(data.image_url);
      } else {
        alert("Nie udało się pobrać danych.");
        navigate('/');
      }
      setLoadingData(false);
    }
    fetchRecipeToEdit();
  }, [id, navigate]);

  // --- HANDLERY ---
  const handleIngredientChange = (index, key, value) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [key]: value } : ing)));
  };
  const addIngredientRow = () => setIngredients((prev) => [...prev, emptyIngredient()]);
  const removeIngredient = (index) => setIngredients((prev) => prev.filter((_, i) => i !== index));

  const handleStepChange = (index, value) => setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  const addStep = () => setSteps((prev) => [...prev, '']);
  const removeStep = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile);
      }

      const recipeData = {
        title,
        category,
        prep_time: prepTime, // Snake_case dla bazy
        servings: servings,  // Snake_case dla bazy
        additional_info: additionalInfo,
        image_url: finalImageUrl,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.trim())
      };

      if (id) {
        const { error } = await supabase.from('recipes').update(recipeData).eq('id', id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('recipes').insert(recipeData);
        if (error) throw error;
      }

      navigate(id ? `/recipe/${id}` : '/');
    } catch (err) {
      console.error('Save failed', err);
      alert('Błąd zapisu.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return <div className="text-center py-20 font-bold text-orange-400">Ładowanie...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h2 className="text-4xl font-bold mb-8 text-center font-serif text-gray-800">
        {id ? 'Edytuj Przepis ✏️' : 'Nowy Przepis 🍳'}
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-orange-100 space-y-10">
        
        {/* ZDJĘCIE */}
        <section>
          {existingImageUrl && !imageFile && (
             <div className="mb-6 relative group overflow-hidden rounded-2xl h-48 border border-orange-100">
               <img src={existingImageUrl} alt="Obecne" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 Obecne zdjęcie
               </div>
             </div>
          )}
          <ImageUploader onImageSelected={setImageFile} />
        </section>
        
        {/* PODSTAWOWE INFO */}
        <section className="space-y-6">
          <Input 
            label="Nazwa potrawy"
            required 
            placeholder="np. Szarlotka Babci Zosi" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select 
              label="Kategoria"
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              options={CATEGORIES}
            />
            {/* NOWE POLA */}
            <Input 
              label="Czas (min)"
              placeholder="np. 45 min" 
              value={prepTime} 
              onChange={(e) => setPrepTime(e.target.value)} 
            />
            <Input 
              label="Ilość porcji"
              placeholder="np. 4 osoby" 
              value={servings} 
              onChange={(e) => setServings(e.target.value)} 
            />
          </div>

          <Input 
              label="Krótki opis / Notatki (opcjonalne)"
              placeholder="np. Najlepiej smakuje na ciepło z lodami..." 
              value={additionalInfo} 
              onChange={(e) => setAdditionalInfo(e.target.value)} 
          />
        </section>

        <hr className="border-orange-100" />

        {/* SKŁADNIKI */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">🥦 Składniki</h3>
            <Button type="button" onClick={addIngredientRow} variant="secondary" className="text-xs py-1">+ Dodaj pozycję</Button>
          </div>
          <div className="space-y-3 bg-orange-50/40 p-6 rounded-2xl border border-orange-100">
            {ingredients.length > 0 && (
              <div className="grid grid-cols-[1fr_80px_80px_40px] gap-3 text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">
                <span>Produkt</span>
                <span>Ilość</span>
                <span>J.m.</span>
                <span></span>
              </div>
            )}
            {ingredients.map((ing, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_80px_40px] gap-3 items-start animate-fade-in-up">
                <Input value={ing.name} onChange={(e) => handleIngredientChange(i, 'name', e.target.value)} className="bg-white" />
                <Input value={ing.amount} onChange={(e) => handleIngredientChange(i, 'amount', e.target.value)} className="bg-white text-center" />
                <Input value={ing.unit} onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)} className="bg-white text-center" />
                {ingredients.length > 1 ? (
                  <Button type="button" onClick={() => removeIngredient(i)} variant="ghost" className="h-[42px] w-[40px] text-red-400 hover:text-red-600 hover:bg-red-50">🗑</Button>
                ) : <div />} 
              </div>
            ))}
          </div>
        </section>

        <hr className="border-orange-100" />

        {/* KROKI */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">👨‍🍳 Przygotowanie</h3>
            <Button type="button" onClick={addStep} variant="secondary" className="text-xs py-1">+ Dodaj krok</Button>
          </div>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mt-1 border border-orange-200">{i + 1}</span>
                <div className="flex-grow">
                   <Textarea placeholder={`Opisz krok ${i + 1}...`} value={s} onChange={(e) => handleStepChange(i, e.target.value)} className="min-h-[80px]" />
                </div>
                {steps.length > 1 && (
                  <Button type="button" onClick={() => removeStep(i)} variant="ghost" className="mt-2 text-gray-300 hover:text-red-500">✕</Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <div className="pt-6 flex justify-end gap-4 border-t border-orange-50">
           <Button type="button" variant="ghost" onClick={() => navigate('/')}>Anuluj</Button>
           <Button type="submit" isLoading={saving} className="px-8 text-lg shadow-orange-300">
             {id ? 'Zapisz zmiany' : 'Opublikuj przepis'}
           </Button>
        </div>
      </form>
    </div>
  );
}