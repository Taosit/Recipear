import React, { useRef, useEffect } from "react";

export default function IngredientsField({ type, recipe, updateRecipe }) {
	const ingredientsRef = useRef();

	useEffect(() => {
		if (!recipe.ingredients) {
			ingredientsRef.current.focus();
		} 
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const capitalize = (str) => {	
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

  const addIngredient = (index) => {
    const newIngredients = [...recipe[type].slice(0, index + 1), { name: "", amount: "" }, ...recipe[type].slice(index + 1)];
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
					<div key={index} className="recipe-ingredient">
						<input
							type="text"
							name="name"
							value={ingredient.name}
							onChange={(e) => handleChange(e, index)} />
						<input
							type="text"
							name="amount"
							value={ingredient.amount}
							onChange={(e) => handleChange(e, index)} />
						<button
							type="button"
							onClick={() => addIngredient(index)}>
								+
						</button>
					</div>
				))}				
			</div>
		</>
	);
}
