import React from "react";
import VoiceCommand from "./VoiceCommand";

export default function Ingredients({recipe, nextStep, previousStep, voiceCommandActive, setVoiceCommandActive}) {

  const capitalize = str => {
		return str.replace(str[0], str[0].toUpperCase());
	};

  const getIngredients = ingredients => {
		const ingredientNames =  ingredients.map(ingredient => {
			return ingredient.amount? `${ingredient.amount} ${ingredient.ingredient}` : ingredient.ingredient;
		});
		return ingredientNames.reduce((ingredientsStr, ingredient, index) => {
			return index? `${ingredientsStr}, ${ingredient}` : capitalize(ingredient);
		}, "");
	}

  return (
    <div className="card-grid">
    <div className="cook-card-body">
      <p className="subtitle">{recipe.name}</p>
      <h2 className="cook-title">Prepare</h2>
      <div className="ingredient-list">
        <h3>Ingredients</h3>
        <p>{getIngredients(recipe.ingredients)}</p>
        <h3>Seasonings</h3>
        <p>{getIngredients(recipe.seasonings)}</p>
      </div>
      </div>
        <div className="navigate-buttons">
          <button className="border-button" onClick={previousStep}>Prev</button>
          <VoiceCommand voiceCommandActive={voiceCommandActive}
                        setVoiceCommandActive={setVoiceCommandActive}
                        recipe={recipe}
                        previousStep={previousStep}
                        nextStep={nextStep}
          />
          <button className="border-button" onClick={nextStep}>Next</button>
        </div>
    </div>
  )
}