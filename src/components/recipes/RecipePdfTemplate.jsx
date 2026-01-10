import React, { forwardRef } from 'react';

const RecipePdfTemplate = forwardRef(({ recipe }, ref) => {
  if (!recipe) return null;

  return (
    // Kontener ukryty poza ekranem
    <div className="fixed left-[-9999px] top-0">
      <div 
        ref={ref} 
        // A4 szerokość (794px), wysokość automatyczna (h-auto) dla wielu stron
        className="w-[794px] h-auto min-h-[1123px] bg-[#fffbf2] text-gray-800 font-serif relative flex flex-col"
        style={{ fontFamily: '"Playfair Display", serif' }} 
      >
        
        {/* Padding wewnętrzny */}
        <div className="p-12 flex-grow">
          
          {/* --- HEADER (Tylko Tytuł i Kategoria) --- */}
          <header className="text-center mb-8 border-b border-orange-200 pb-6">
            <div className="flex justify-between items-center mb-4 px-4 text-xs font-sans uppercase tracking-[0.2em] text-orange-400">
               <span>KitchenStory</span>
               <span>{new Date().toLocaleDateString()}</span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 leading-tight drop-shadow-sm mb-2">
              {recipe.title}
            </h1>
             
            {recipe.category && (
              <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2">
                {recipe.category}
              </span>
            )}
          </header>

          {/* --- SEKCJA GÓRNA: ZDJĘCIE + NOTATKI (Obok siebie!) --- */}
          {/* To oszczędza mnóstwo miejsca w pionie */}
          <div className="flex gap-10 mb-10 items-start min-h-[200px]">
            
            {/* LEWO: Zdjęcie (Maks 40% szerokości) */}
            {recipe.image_url ? (
              <div className="w-[40%] flex-shrink-0 flex justify-center pt-2">
                <img 
                  src={recipe.image_url} 
                  alt={recipe.title} 
                  // KLUCZOWE ZMIANY: max-h-[220px] (małe), w-auto (nie rozciągaj), object-contain
                  className="max-h-[220px] w-auto max-w-full rounded shadow-md border-4 border-white rotate-[-2deg]"
                  crossOrigin="anonymous"
                />
              </div>
            ) : (
              // Placeholder jeśli brak zdjęcia (żeby układ się nie sypał)
              <div className="w-[30%] flex items-center justify-center text-orange-200 opacity-20">
                <span className="text-8xl">🍽</span>
              </div>
            )}

            {/* PRAWO: Notatki + Czas/Porcje */}
            <div className="flex-1 flex flex-col justify-center">
               
               {/* Metadane (Czas/Porcje) przeniesione tutaj */}
               <div className="flex gap-6 text-sm font-sans uppercase tracking-widest text-gray-500 mb-6 border-b border-orange-100 pb-4">
                  {recipe.prep_time && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">⏱</span>
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-orange-400">Czas</span>
                        <span className="font-bold text-gray-700">{recipe.prep_time}</span>
                      </div>
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">👥</span>
                      <div className="flex flex-col leading-none">
                        <span className="text-[10px] text-orange-400">Porcje</span>
                        <span className="font-bold text-gray-700">{recipe.servings}</span>
                      </div>
                    </div>
                  )}
               </div>

               {/* Notatki (Cytat) */}
               {recipe.additional_info ? (
                 <div className="relative">
                   <span className="text-5xl text-orange-200 absolute -top-4 -left-4 font-serif leading-none">“</span>
                   <p className="text-lg italic text-gray-700 leading-relaxed font-light pl-2 relative z-10">
                     {recipe.additional_info}
                   </p>
                 </div>
               ) : (
                 <p className="text-gray-400 italic text-sm">Smacznego gotowania!</p>
               )}
            </div>
          </div>

          {/* --- TREŚĆ GŁÓWNA (GRID) --- */}
          <div className="grid grid-cols-[1fr_1.5fr] gap-10 items-start">
            
            {/* LEWA KOLUMNA: SKŁADNIKI */}
            <div className="bg-white/60 p-6 rounded-xl border border-orange-100 shadow-sm">
              <h3 className="text-sm font-bold text-orange-800 border-b-2 border-orange-200 pb-2 mb-4 uppercase tracking-widest font-sans">
                Składniki
              </h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-end justify-between text-sm group">
                    <span className="font-bold text-gray-800 relative z-10 pr-2">
                      {ing.name}
                    </span>
                    <span className="flex-grow border-b-2 border-dotted border-gray-300 mb-1 mx-1 opacity-50"></span>
                    <span className="text-gray-600 font-sans font-medium whitespace-nowrap pl-1">
                      {ing.amount} {ing.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* PRAWA KOLUMNA: KROKI */}
            <div>
              <h3 className="text-sm font-bold text-orange-800 border-b-2 border-orange-200 pb-2 mb-4 uppercase tracking-widest font-sans">
                Przygotowanie
              </h3>
              <div className="space-y-5">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0 mt-0.5">
                      <span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] font-sans shadow-sm">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-gray-800 text-base leading-relaxed text-justify">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="pb-4 pt-4 text-center mt-auto bg-[#fffbf2]">
          <p className="text-orange-900/20 text-[9px] font-sans uppercase tracking-[0.2em]">
            Wygenerowano z aplikacji KitchenStory
          </p>
        </div>

      </div>
    </div>
  );
});

RecipePdfTemplate.displayName = 'RecipePdfTemplate';
export default RecipePdfTemplate;