import React, { useRef, useEffect } from "react";

export default function IngredientsField({ recipe, handleChange }) {
	const ingredientsRef = useRef();
	const seasoningsRef = useRef();

	useEffect(() => {
		if (!recipe.ingredients) {
			ingredientsRef.current.focus();
		} else if (!recipe.seasonings) {
			seasoningsRef.current.focus();
		}
	}, []);

	return (
		<>
			<h3>List the ingredients you need</h3>
			<textarea
				value={recipe.ingredients}
				required={true}
				ref={ingredientsRef}
				onChange={e => handleChange(e.target.value, "ingredients")}
			/>
			<h3>What about the seasonings?</h3>
			<textarea
				value={recipe.seasonings}
				required={true}
				ref={seasoningsRef}
				onChange={e => handleChange(e.target.value, "seasonings")}
			/>
		</>
	);
}
