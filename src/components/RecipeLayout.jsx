import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

const RecipeLayout = forwardRef(function RecipeLayout({ recipe }, ref) {
  return (
    <article ref={ref} className="bg-white rounded-lg shadow p-6 print:bg-white">
      <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
      {recipe.additionalInfo && <div className="text-sm text-gray-600 mb-4">{recipe.additionalInfo}</div>}

      <h3 className="font-semibold">Ingredients</h3>
      <ul className="list-disc pl-5 mb-4">
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{`${ing.name} — ${ing.amount} ${ing.unit}`}</li>
        ))}
      </ul>

      <h3 className="font-semibold">Steps</h3>
      <ol className="list-decimal pl-5 space-y-2">
        {recipe.steps.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>
    </article>
  );
});

RecipeLayout.propTypes = {
  recipe: PropTypes.shape({
    title: PropTypes.string.isRequired,
    additionalInfo: PropTypes.string,
    ingredients: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        unit: PropTypes.string,
      })
    ).isRequired,
    steps: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default RecipeLayout;