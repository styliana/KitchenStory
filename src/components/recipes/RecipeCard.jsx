import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function RecipeCard({ recipe }) {
  return (
    <article className="card-kitchen hover:shadow-2xl transition-shadow flex flex-col h-full group bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden">
      <div className="h-48 bg-orange-100 overflow-hidden relative">
        {recipe.image_url ? (
          <img 
            src={recipe.image_url} 
            alt={recipe.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-orange-300">
             <span className="text-6xl">🍽️</span>
          </div>
        )}
        
        {recipe.additional_info && (
          <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-orange-800 uppercase tracking-wide shadow-sm">
            {recipe.additional_info}
          </div>
        )}
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 leading-tight text-gray-900">{recipe.title}</h3>
        
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
           <span>{recipe.ingredients?.length || 0} składników</span>
           <Link to={`/recipe/${recipe.id}`} className="text-orange-600 font-bold hover:underline">
             Zobacz →
           </Link>
        </div>
      </div>
    </article>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.object.isRequired,
};