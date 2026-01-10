import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const CATEGORIES = ['Śniadanie', 'Obiad', 'Kolacja', 'Deser', 'Przekąska', 'Napój'];
const SORT_OPTIONS = [
  { label: 'Najnowsze', value: 'newest' },
  { label: 'Najstarsze', value: 'oldest' },
  { label: 'Czas: rosnąco', value: 'time_asc' },
  { label: 'Czas: malejąco', value: 'time_desc' },
];

export default function RecipeFilters({ filters, setFilters, onClear }) {
  
  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 space-y-6 h-fit sticky top-24">
      
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
          🔍 Filtry
        </h3>
        {(filters.query || filters.category || filters.maxTime > 0) && (
          <button onClick={onClear} className="text-xs text-orange-600 hover:underline">
            Wyczyść
          </button>
        )}
      </div>

      {/* 1. Słowa kluczowe */}
      <div>
        <Input 
          placeholder="Szukaj przepisu lub składnika..." 
          value={filters.query}
          onChange={(e) => handleChange('query', e.target.value)}
          className="text-sm"
        />
      </div>

      {/* 2. Kategoria */}
      <div>
        <Select
          label="Kategoria"
          value={filters.category}
          onChange={(e) => handleChange('category', e.target.value)}
          options={CATEGORIES}
          placeholder="Wszystkie kategorie"
          className="text-sm"
        />
      </div>

      {/* 3. Czas przygotowania (Suwak) */}
      <div>
        <div className="flex justify-between text-sm font-bold text-gray-700 mb-2">
          <label>Maks. czas</label>
          <span className="text-orange-600">
            {filters.maxTime > 0 ? `${filters.maxTime} min` : 'Dowolny'}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="180"
          step="15"
          value={filters.maxTime}
          onChange={(e) => handleChange('maxTime', Number(e.target.value))}
          className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>3h+</span>
        </div>
      </div>

      {/* 4. Sortowanie */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Sortuj według</label>
        <div className="grid grid-cols-2 gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleChange('sort', opt.value)}
              className={`text-xs py-2 px-2 rounded-lg border transition-colors ${
                filters.sort === opt.value
                  ? 'bg-orange-500 text-white border-orange-500 font-bold'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}