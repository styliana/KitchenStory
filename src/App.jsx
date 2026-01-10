import React, { useRef } from 'react';
import RecipeLayout from './components/RecipeLayout';
import { exportElementToPdf } from './utils/exportPdf';

const sampleRecipe = {
  title: 'Spiced Tomato Pasta',
  additionalInfo: 'A quick and cozy weekday meal.',
  ingredients: [
    { name: 'Pasta', amount: 300, unit: 'g' },
    { name: 'Tomatoes', amount: 4, unit: 'pcs' },
    { name: 'Olive oil', amount: 2, unit: 'tbsp' },
  ],
  steps: [
    'Boil pasta according to package instructions.',
    'Sauté tomatoes with olive oil and seasoning.',
    'Combine pasta and sauce, serve hot.'
  ]
};

export default function App() {
  const ref = useRef(null);

  const handleExport = async () => {
    if (!ref.current) return;
    try {
      await exportElementToPdf(ref.current, `${sampleRecipe.title}.pdf`);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export PDF. See console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="max-w-4xl mx-auto p-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">KitchenStory</h1>
          <p className="mt-2 text-sm text-gray-600">Share recipes, generate beautiful PDFs, and send links to friends.</p>
        </div>
        <div>
          <button onClick={handleExport} className="bg-red-500 text-white px-4 py-2 rounded">Export sample PDF</button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <RecipeLayout ref={ref} recipe={sampleRecipe} />
      </main>
    </div>
  );
}