import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function RecipeCard({ recipe, showAuthor = true }) {
  // Zabezpieczenie: Jeśli nie ma profilu (bo stary user lub błąd), author będzie undefined, a nie crashem
  const author = recipe.profiles; 

  return (
    <article className="card-kitchen hover:shadow-2xl transition-all duration-300 flex flex-col h-full group bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden hover:-translate-y-1">
      {/* --- ZDJĘCIE --- */}
      <div className="h-48 bg-orange-100 overflow-hidden relative">
        {recipe.image_url ? (
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-orange-200">
             <span className="text-5xl">🥘</span>
          </div>
        )}
        
        {/* Metadane na zdjęciu */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
          {recipe.category && (
            <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-orange-800 uppercase tracking-wide shadow-sm">
              {recipe.category}
            </span>
          )}
          {(recipe.prep_time_minutes > 0) && (
             <span className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
               ⏱ {recipe.prep_time_minutes} min
             </span>
          )}
        </div>
      </div>
      
      {/* --- TREŚĆ --- */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 leading-tight text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
          {recipe.title}
        </h3>
        
        {/* AUTOR (ZABEZPIECZONY) */}
        {showAuthor && author ? (
          <Link 
            to={`/chef/${author.id}`}
            onClick={(e) => e.stopPropagation()} 
            className="flex items-center gap-2 mb-4 group/author w-fit"
          >
            <img 
              src={author.avatar_url || `https://ui-avatars.com/api/?name=${author.username}`} 
              alt={author.username} 
              className="w-6 h-6 rounded-full border border-gray-200"
            />
            <span className="text-xs text-gray-500 font-medium group-hover/author:text-orange-600 group-hover/author:underline">
              {author.username || 'Nieznany kucharz'}
            </span>
          </Link>
        ) : showAuthor && (
          // Fallback, jeśli autor nie istnieje w bazie (np. usunięte konto)
          <div className="mb-4 text-xs text-gray-400 italic">Autor nieznany</div>
        )}

        <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-sm text-gray-400">
           <span>{recipe.ingredients?.length || 0} skł.</span>
           <Link to={`/recipe/${recipe.id}`} className="text-orange-500 font-bold hover:underline text-xs uppercase tracking-wider">
             Przepis →
           </Link>
        </div>
      </div>
    </article>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
  showAuthor: PropTypes.bool,
};