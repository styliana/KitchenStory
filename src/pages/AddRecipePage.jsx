import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';
import ImageUploader from '../components/recipes/ImageUploader';
import { uploadImageToSupabase } from '../services/imageService';

const emptyIngredient = () => ({ name: '', amount: '', unit: '' });

export default function AddRecipePage() {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient(), emptyIngredient()]);
  const [steps, setSteps] = useState(['', '']);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  // --- Handlers ---
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
      // 1. Upload zdjęcia (jeśli jest)
      const imageUrl = await uploadImageToSupabase(imageFile);

      // 2. Zapis przepisu
      await addRecipe({ 
        title, 
        additional_info: additionalInfo,
        image_url: imageUrl,
        ingredients: ingredients.filter((i) => i.name.trim()), 
        steps: steps.filter((s) => s.trim()) 
      });
      navigate('/');
    } catch (err) {
      console.error('Save failed', err);
      alert('Wystąpił błąd. Sprawdź konsolę.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Nowy Przepis</h2>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 space-y-8">
        
        {/* Komponent do zdjęć */}
        <ImageUploader onImageSelected={setImageFile} />
        
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nazwa potrawy</label>
            <input required placeholder="np. Szarlotka Babci Zosi" value={title} onChange={(e) => setTitle(e.target.value)} className="input-kitchen text-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Info (czas, porcje)</label>
            <input placeholder="np. 45 min, 4 osoby" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="input-kitchen" />
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
                {ingredients.length > 1 && <button type="button" onClick={() => removeIngredient(i)} className="text-red-400 font-bold px-2">✕</button>}
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
                {steps.length > 1 && <button type="button" onClick={() => removeStep(i)} className="text-red-400 font-bold mt-2">✕</button>}
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary text-lg px-10">{saving ? 'Zapisywanie...' : 'Zapisz przepis'}</button>
        </div>
      </form>
    </div>
  );
}