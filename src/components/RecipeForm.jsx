import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../lib/supabaseClient';

function parseIngredients(text) {
  // simple parser: each line is name|amount|unit
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, amount = '', unit = ''] = line.split('|').map((s) => s.trim());
      const amtNum = parseFloat(amount);
      return { name, amount: Number.isNaN(amtNum) ? amount : amtNum, unit };
    });
}

function parseSteps(text) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function RecipeForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [ingredientsText, setIngredientsText] = useState('Pasta|300|g\nTomatoes|4|pcs');
  const [stepsText, setStepsText] = useState('Boil pasta.\nCook sauce.\nCombine and serve.');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      alert('Supabase is not configured. Copy .env.example → .env.local and restart dev server.');
      return;
    }

    const recipe = {
      title: title || 'Untitled',
      ingredients: parseIngredients(ingredientsText),
      steps: parseSteps(stepsText),
      additional_info: additionalInfo || null,
    };

    setLoading(true);
    try {
      const { data, error } = await supabase.from('recipes').insert([recipe]).select();
      if (error) throw error;
      setTitle('');
      setIngredientsText('');
      setStepsText('');
      setAdditionalInfo('');
      if (onCreated) onCreated(data?.[0] ?? null);
    } catch (err) {
      console.error(err);
      alert('Failed to save recipe. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Ingredients (one per line: name|amount|unit)</label>
        <textarea value={ingredientsText} onChange={(e) => setIngredientsText(e.target.value)} rows={4} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Steps (one per line)</label>
        <textarea value={stepsText} onChange={(e) => setStepsText(e.target.value)} rows={4} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <label className="block text-sm font-medium">Additional info</label>
        <input value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="mt-1 block w-full border rounded p-2" />
      </div>

      <div>
        <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">
          {loading ? 'Saving...' : 'Save recipe'}
        </button>
      </div>
    </form>
  );
}

RecipeForm.propTypes = {
  onCreated: PropTypes.func,
};