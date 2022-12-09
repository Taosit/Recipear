import React from "react";
import { v4 as uuid } from "uuid";

export default function IngredientsField({ type, recipe, updateRecipe }) {

	const capitalize = (str) => {	
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

  const addIngredient = (index) => {
		const id = uuid();
    const newIngredients = [...recipe[type].slice(0, index + 1), { ingredient: "", amount: "", id }, ...recipe[type].slice(index + 1)];
    updateRecipe(newIngredients, type);
  }

  const handleChange = (e, index) => {
    const newIngredients = [...recipe[type]];
    newIngredients[index][e.target.name] = e.target.value;
    updateRecipe(newIngredients, type);
  }

	return (
		<>
			<h1>{capitalize(type)}</h1>
			<div className="recipe-ingredients">
				{recipe[type].map((ingredient, index) => (
					<div key={`${recipe.name}-${type}-${ingredient.id}`} className="recipe-ingredient">
						<div className={`ingredient-count ${index? "" : "required-field"}`}>{capitalize(type).slice(0, type.length - 1)} {index + 1}</div>
						<div className="ingredient-inputs-container">
							<input
								type="text"
								name="ingredient"
                placeholder={index? "" : type === "ingredients" ? "chicken" : "salt"}
								value={ingredient.name}
								onChange={(e) => handleChange(e, index)} />
							<input
								type="text"
								name="amount"
                placeholder={index? "" : type === "ingredients" ? "500g" : "1tsp"}
								value={ingredient.amount}
								onChange={(e) => handleChange(e, index)} />
							<button
								type="button"
								onClick={() => addIngredient(index)}>
									+
							</button>
						</div>						
					</div>
				))}				
			</div>
		</>
	);
}
