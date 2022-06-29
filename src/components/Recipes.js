import React, {useEffect, useState} from "react"
import {v4 as uuid} from "uuid"
import {Link, useNavigate} from "react-router-dom"
import heartIcon from "../assets/heart.png"

function Recipes({recipes}) {

  console.log(recipes)

  const navigate = useNavigate()

  const capitalize = (str) => {
    return str.replace(str[0], str[0].toUpperCase())
  }

  return (
    <div className="recipes">
      {recipes.map((recipe, index) => {
        return <div key={uuid()} className="recipe-container">
          <div className="recipe">
            <div className="recipe-image-container">
              <span className="like-count-container">
                <img src={heartIcon} alt="like"/> {recipe.likes}
              </span>
              <img className="recipe-image" onClick={() => navigate(`/recipes/${recipe.id}`)} src={recipe.image} alt="recipe"/>
            </div>
            <h3 className="link title-link" onClick={() => navigate(`/recipes/${recipe.id}`)}>{capitalize(recipe.name)}</h3>
            {recipe.tags[0] && recipe.tags[0] !== "For All" && recipe?.tags[0] !== "Other"
              && <span className="recipe-tag">{recipe?.tags[0]}</span>}
            {recipe.tags[1] && recipe.tags[1] !== "Other"
              && <span className="recipe-tag">{recipe?.tags[1]}</span>}
            <p>Ingredients: {recipe.ingredientStr}</p>
          </div>
        </div>
      })}
    </div>
  );
}

const areEqual = (prevProps, currentProps) => {
  const {recipes: prevRecipes} = prevProps;
  const {recipes: currentRecipes} = currentProps;
  if (prevRecipes.length !== currentRecipes.length) return false;
  prevRecipes.forEach((prevRecipe, i) => {
    if (prevRecipe.id !== currentRecipes[i].id || prevRecipe.likes !== currentRecipes[i].likes) return false;
  })
  return true;
}

const memoizedRecipes = React.memo(Recipes, areEqual)

export default memoizedRecipes;