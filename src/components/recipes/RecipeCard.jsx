import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function RecipeCard({ recipe, showAuthor = true }) {
  const author = recipe.profiles; 

  return (
    <Link 
      to={`/recipe/${recipe.id}`} 
      className="group block h-full outline-none focus:ring-4 focus:ring-orange-200 rounded-3xl"
    >
      <article className="h-full bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col">
        
        {/* --- ZDJĘCIE (Aspect Ratio 4:3) --- */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {recipe.image_url ? (
            <img 
              src={recipe.image_url} 
              alt={recipe.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-orange-200 bg-orange-50">
               <span className="text-6xl">🥘</span>
            </div>
          )}
          
          {/* Ciemny gradient od dołu (dla czytelności) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badge Kategorii (Glassmorphism) */}
          {recipe.category && (
            <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-wider shadow-sm border border-white/50">
              {recipe.category}
            </span>
          )}

          {/* Czas przygotowania */}
          {recipe.prep_time_minutes > 0 && (
             <span className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm border border-white/10">
               ⏱ {recipe.prep_time_minutes} min
             </span>
          )}
        </div>
        
        {/* --- TREŚĆ --- */}
        <div className="p-6 flex flex-col flex-grow">
          
          {/* Tytuł */}
          <h3 className="text-xl font-bold font-serif text-gray-900 mb-2 leading-tight group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>

          {/* Krótki opis / liczba składników */}
          <p className="text-sm text-gray-500 mb-6 line-clamp-2 leading-relaxed">
            {recipe.additional_info || `Pyszne danie zawierające ${recipe.ingredients?.length || 0} składników. Sprawdź przepis!`}
          </p>
          
          {/* Stopka: Autor i Strzałka */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
            
            {showAuthor && author ? (
              <div className="flex items-center gap-2.5">
                <img 
                  src={author.avatar_url || `https://ui-avatars.com/api/?name=${author.username}`} 
                  alt={author.username} 
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm bg-gray-100"
                />
                <span className="text-xs font-bold text-gray-500 group-hover:text-gray-800 transition-colors">
                  {author.username}
                </span>
              </div>
            ) : (
              <span className="text-xs font-bold text-orange-300 uppercase tracking-wider">KitchenStory</span>
            )}

            {/* Animowana strzałka */}
            <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
              ➝
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    image_url: PropTypes.string,
    category: PropTypes.string,
    prep_time_minutes: PropTypes.number,
    additional_info: PropTypes.string,
    ingredients: PropTypes.array,
    profiles: PropTypes.shape({
      username: PropTypes.string,
      avatar_url: PropTypes.string
    })
  }).isRequired,
  showAuthor: PropTypes.bool,
};