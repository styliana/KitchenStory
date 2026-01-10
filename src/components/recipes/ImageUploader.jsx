import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compressImage } from '../../services/imageService';

export default function ImageUploader({ onImageSelected }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // Generujemy podgląd natychmiast
      setPreview(URL.createObjectURL(file));
      
      // Kompresujemy w tle
      const compressed = await compressImage(file);
      onImageSelected(compressed);
    } catch (error) {
      console.error('Compression error:', error);
      alert('Błąd przetwarzania zdjęcia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <label className="cursor-pointer group relative w-full h-64 bg-orange-50 rounded-2xl border-2 border-dashed border-orange-200 hover:border-orange-400 transition-colors flex flex-col items-center justify-center overflow-hidden">
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-6">
            <span className="text-4xl block mb-2">📸</span>
            <span className="text-orange-600 font-bold">Dodaj zdjęcie potrawy</span>
            <p className="text-xs text-gray-400 mt-1">Kliknij, aby wybrać plik</p>
          </div>
        )}
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
          disabled={loading}
        />

        {preview && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="text-white font-bold">Zmień zdjęcie</span>
          </div>
        )}
      </label>
    </div>
  );
}

ImageUploader.propTypes = {
  onImageSelected: PropTypes.func.isRequired,
};