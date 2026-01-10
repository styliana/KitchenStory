import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

// Helper do wyciągania liczb z tekstu (np. "45 min" -> 45)
const extractNumber = (str) => {
  if (!str) return 0;
  const match = str.toString().match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function AddRecipePage() {
  const navigate = useNavigate();
  const { id } = useParams(); // Jeśli jest ID, to znaczy, że edytujemy

  // --- STANY ---
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [prepTime, setPrepTime] = useState(''); // Tekst (np. "45 min")
  const [servings, setServings] = useState(''); // Tekst (np. "4 osoby")
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient(), emptyIngredient()]);
  const [steps, setSteps] = useState(['', '']);
  
  // Stany techniczne
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [loadingData, setLoadingData] = useState(false);
  const [saving, setSaving] = useState(false);

  // --- ŁADOWANIE DANYCH (PRZY EDYCJI) ---
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
        setPrepTime(data.prep_time || '');
        setServings(data.servings || '');
        setAdditionalInfo(data.additional_info || '');
        setIngredients(data.ingredients || []);
        setSteps(data.steps || []);
        setExistingImageUrl(data.image_url);
      } else {
        alert("Nie udało się pobrać danych przepisu.");
        navigate('/');
      }
      setLoadingData(false);
    }
    fetchRecipeToEdit();
  }, [id, navigate]);

  // --- HANDLERY ZMIAN W FORMULARZU ---
  const handleIngredientChange = (index, key, value) => {
    setIngredients((prev) => prev.map((ing, i) => (i === index ? { ...ing, [key]: value } : ing)));
  };
  const addIngredientRow = () => setIngredients((prev) => [...prev, emptyIngredient()]);
  const removeIngredient = (index) => setIngredients((prev) => prev.filter((_, i) => i !== index));

  const handleStepChange = (index, value) => setSteps((prev) => prev.map((s, i) => (i === index ? value : s)));
  const addStep = () => setSteps((prev) => [...prev, '']);
  const removeStep = (index) => setSteps((prev) => prev.filter((_, i) => i !== index));

  // --- ZAPISYWANIE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // 1. Upload zdjęcia (jeśli wybrano nowe)
      let finalImageUrl = existingImageUrl;
      if (imageFile) {
        finalImageUrl = await uploadImageToSupabase(imageFile);
      }

      // 2. Przygotowanie danych
      const recipeData = {
        title,
        category,
        
        // Zapisujemy wersję tekstową do wyświetlania
        prep_time: prepTime,
        servings: servings,
        
        // Zapisujemy wersję liczbową do filtrowania
        prep_time_minutes: extractNumber(prepTime),
        servings_count: extractNumber(servings),
        
        additional_info: additionalInfo,
        image_url: finalImageUrl,
        ingredients: ingredients.filter((i) => i.name.trim()),
        steps: steps.filter((s) => s.trim())
      };

      // 3. Wysłanie do bazy
      if (id) {
        // Aktualizacja
        const { error } = await supabase.from('recipes').update(recipeData).eq('id', id);
        if (error) throw error;
      } else {
        // Nowy wpis
        const { error } = await supabase.from('recipes').insert(recipeData);
        if (error) throw error;
      }

      navigate(id ? `/recipe/${id}` : '/');
    } catch (err) {
      console.error('Save failed', err);
      alert('Błąd zapisu. Sprawdź konsolę.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return <div className="text-center py-20 font-bold text-orange-400">Ładowanie danych...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-20">
      <h2 className="text-4xl font-bold mb-8 text-center font-serif text-gray-800">
        {id ? 'Edytuj Przepis ✏️' : 'Nowy Przepis 🍳'}
      </h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-orange-100 space-y-10">
        
        {/* Sekcja: ZDJĘCIE */}
        <section>
          {existingImageUrl && !imageFile && (
             <div className="mb-6 relative group overflow-hidden rounded-2xl h-48 border border-orange-100 bg-orange-50">
               <img src={existingImageUrl} alt="Obecne" className="w-full h-full object-cover opacity-80" />
               <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-gray-600 shadow-sm">
                   Obecne zdjęcie (dodaj nowe, aby zmienić)
                 </span>
               </div>
             </div>
          )}
          <ImageUploader onImageSelected={setImageFile} />
        </section>
        
        {/* Sekcja: PODSTAWOWE INFO */}
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
            <Input 
              label="Czas (np. 45 min)"
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

        {/* Sekcja: SKŁADNIKI */}
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
                <Input 
                  value={ing.name} 
                  onChange={(e) => handleIngredientChange(i, 'name', e.target.value)} 
                  className="bg-white" 
                  placeholder="Nazwa"
                />
                <Input 
                  value={ing.amount} 
                  onChange={(e) => handleIngredientChange(i, 'amount', e.target.value)} 
                  className="bg-white text-center" 
                  placeholder="0"
                />
                <Input 
                  value={ing.unit} 
                  onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)} 
                  className="bg-white text-center" 
                  placeholder="szt."
                />
                {ingredients.length > 1 ? (
                  <Button 
                    type="button" 
                    onClick={() => removeIngredient(i)} 
                    variant="ghost" 
                    className="h-[42px] w-[40px] text-red-400 hover:text-red-600 hover:bg-red-50"
                  >
                    🗑
                  </Button>
                ) : <div />} 
              </div>
            ))}
          </div>
        </section>

        <hr className="border-orange-100" />

        {/* Sekcja: KROKI */}
        <section>
          <div className="flex justify-between items-end mb-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">👨‍🍳 Przygotowanie</h3>
            <Button type="button" onClick={addStep} variant="secondary" className="text-xs py-1">+ Dodaj krok</Button>
          </div>
          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-4 items-start group">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm mt-1 border border-orange-200">
                  {i + 1}
                </span>
                <div className="flex-grow">
                   <Textarea 
                     placeholder={`Opisz krok ${i + 1}...`} 
                     value={s} 
                     onChange={(e) => handleStepChange(i, e.target.value)} 
                     className="min-h-[80px]" 
                   />
                </div>
                {steps.length > 1 && (
                  <Button 
                    type="button" 
                    onClick={() => removeStep(i)} 
                    variant="ghost" 
                    className="mt-2 text-gray-300 hover:text-red-500"
                  >
                    ✕
                  </Button>
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