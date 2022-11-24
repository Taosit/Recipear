import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { Link, useNavigate } from "react-router-dom";
import heartIcon from "../assets/heart.png";

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
						<div className="recipe-container">
							<div className="recipe">
								<div className="recipe-image-container">
									<span className="like-count-container">
										<img src={heartIcon} alt="like" /> {recipe.likes}
									</span>
									<img
										className="recipe-image"
										onClick={() => navigate(`/recipes/${recipe.id}`)}
										src={recipe.image.url}
										alt="recipe"
									/>
								</div>
								<h3
									className="link title-link"
									onClick={() => navigate(`/recipes/${recipe.id}`)}
								>
									{capitalize(recipe.name)}
								</h3>
								{recipe.tags[0] &&
									recipe.tags[0] !== "For All" &&
									recipe.tags[0] !== "Other" && (
										<span className="recipe-tag">{recipe?.tags[0]}</span>
								)}
								{recipe.tags[1] && recipe.tags[1] !== "Other" && (
									<span className="recipe-tag">{recipe?.tags[1]}</span>
								)}
								{(!recipe.tags[0] ||
									recipe.tags[0] === "For All" ||
									recipe.tags[0] === "Other") &&
									(!recipe.tags[1] || recipe.tags[1] === "Other") && (
										<div className="margin-div"></div>
									)}
								<p className="card-ingredients">
									{capitalize(getIngredients(recipe.ingredients))}
								</p>
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
