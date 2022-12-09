import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import starIcon from "../assets/star.svg";

function Recipes({ recipes }) {

	const navigate = useNavigate();

	const capitalize = str => {
		return str.replace(str[0], str[0].toUpperCase());
	};

	const getIngredients = ingredients => {
		const ingredientNames =  ingredients.map(ingredient => {
			return ingredient.ingredient;
		});
		return ingredientNames.reduce((ingredientsStr, ingredient, index) => {
			return index? `${ingredientsStr}, ${ingredient}` : ingredient;
		}, "");
	}

	return (
		<div className="recipes">
			{recipes.map((recipe, index) => {
				return (
					<div key={uuid()} className="recipe-cell">
						<div className="recipe-container" 
							tabIndex="0"
							onKeyDown={e => e.key === "Enter" && navigate(`/recipes/${recipe.id}`)}>
							<div className="recipe">
								<div className="recipe-image-container">
									<span className="like-count-container">
										<img src={starIcon} alt="like" /> {recipe.likes}
									</span>
									<img
										className="recipe-image"
										onClick={() => navigate(`/recipes/${recipe.id}`)}
										src={recipe.image.url}
										alt="recipe"
									/>
								</div>
								<div className="recipe-card-summary">
									<h3
										className="link title-link"
										onClick={() => navigate(`/recipes/${recipe.id}`)}
									>
										{capitalize(recipe.name)}
									</h3>
									<div className="time-and-difficulty">{recipe.time} | {recipe.difficulty}</div>
									{recipe.tags[0] || recipe.tags[1] && (
										<div className="recipe-card-tags">
											{recipe.tags[0] && (
											<span className="recipe-tag">{recipe?.tags[0]}</span>
										)}
										{recipe.tags[1] && (
											<span className="recipe-tag">{recipe?.tags[1]}</span>
										)}
										</div>
									)}
									<p className="card-ingredients">
										{capitalize(getIngredients(recipe.ingredients))}
									</p>
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}

const memoizedRecipes = React.memo(Recipes);

export default Recipes;
