import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useRecipes from '../hooks/useRecipes';

const emptyIngredient = () => ({ name: '', amount: '', unit: '' });

export default function AddRecipePage() {
  const { addRecipe } = useRecipes();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [ingredients, setIngredients] = useState([emptyIngredient(), emptyIngredient()]);
  const [steps, setSteps] = useState(['', '']);
  const [saving, setSaving] = useState(false);

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
      await addRecipe({ 
        title, 
        additional_info: additionalInfo, // Mapujemy na format bazy danych
        ingredients: ingredients.filter((i) => i.name.trim()), 
        steps: steps.filter((s) => s.trim()) 
      });
      navigate('/');
    } catch (err) {
      console.error('Save failed', err);
      alert('Wystąpił błąd podczas zapisu. Sprawdź konsolę.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Nowy Przepis</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg border border-orange-100 space-y-8">
        
        {/* Sekcja: Podstawy */}
        <section className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nazwa potrawy</label>
            <input 
              required 
              placeholder="np. Szarlotka Babci Zosi" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="input-kitchen text-lg" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Dodatkowe info (czas, porcje)</label>
            <input 
              placeholder="np. 45 min, 4 osoby" 
              value={additionalInfo} 
              onChange={(e) => setAdditionalInfo(e.target.value)} 
              className="input-kitchen" 
            />
          </div>
        </section>

        <hr className="border-orange-100" />

        {/* Sekcja: Składniki */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xl font-bold text-gray-800">Składniki</label>
            <button type="button" onClick={addIngredientRow} className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-full transition-colors">+ Dodaj składnik</button>
          </div>
          <div className="space-y-3 bg-orange-50/50 p-4 rounded-xl">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2 items-start animate-fade-in-up">
                <input 
                  placeholder="Produkt" 
                  value={ing.name} 
                  onChange={(e) => handleIngredientChange(i, 'name', e.target.value)} 
                  className="input-kitchen flex-grow" 
                />
                <input 
                  placeholder="Ilość" 
                  value={ing.amount} 
                  onChange={(e) => handleIngredientChange(i, 'amount', e.target.value)} 
                  className="input-kitchen w-20 text-center" 
                />
                <input 
                  placeholder="J.m." 
                  value={ing.unit} 
                  onChange={(e) => handleIngredientChange(i, 'unit', e.target.value)} 
                  className="input-kitchen w-20 text-center" 
                />
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(i)} className="text-gray-400 hover:text-red-500 p-2">✕</button>
                )}
              </div>
            ))}
          </div>
        </section>

        <hr className="border-orange-100" />

        {/* Sekcja: Kroki */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-xl font-bold text-gray-800">Przygotowanie</label>
            <button type="button" onClick={addStep} className="text-sm font-bold text-orange-600 hover:bg-orange-50 px-3 py-1 rounded-full transition-colors">+ Dodaj krok</button>
          </div>
          <div className="space-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center font-bold text-sm mt-1">{i + 1}</span>
                <textarea 
                  placeholder={`Opisz krok ${i + 1}...`} 
                  value={s} 
                  onChange={(e) => handleStepChange(i, e.target.value)} 
                  className="input-kitchen flex-grow min-h-[80px]" 
                />
                {steps.length > 1 && (
                   <button type="button" onClick={() => removeStep(i)} className="text-gray-400 hover:text-red-500 mt-2">✕</button>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary text-lg px-10">
            {saving ? 'Zapisywanie...' : 'Zapisz przepis'}
          </button>
        </div>
      </form>
    </div>
  );
}