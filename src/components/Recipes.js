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

  const getShortenedIngredients = (ingredients) => {
    if (ingredients.length < 53) return ingredients;
    const subString = ingredients.slice(45, 55);
    let splitIndex = 45;
    if (subString.includes(" ")) {
      splitIndex += subString.indexOf(" ")
    } else {
      splitIndex = 50;
    }
    console.log("ingredients length", `${ingredients.slice(0, splitIndex)}...`.length)
    return `${ingredients.slice(0, splitIndex)}...`;
  }

  return (
    <div className="recipes">
      {recipes.map((recipe, index) => {
        return <div key={uuid()} className="recipe-cell">
          <div className="recipe-container">
            <div className="recipe">
              <div className="recipe-image-container">
              <span className="like-count-container">
                <img src={heartIcon} alt="like"/> {recipe.likes}
              </span>
                <img className="recipe-image" onClick={() => navigate(`/recipes/${recipe.id}`)} src={recipe.image.url} alt="recipe"/>
              </div>
              <h3 className="link title-link" onClick={() => navigate(`/recipes/${recipe.id}`)}>{capitalize(recipe.name)}</h3>
              {recipe.tags[0] && recipe.tags[0] !== "For All" && recipe.tags[0] !== "Other"
                && <span className="recipe-tag">{recipe?.tags[0]}</span>}
              {recipe.tags[1] && recipe.tags[1] !== "Other"
                && <span className="recipe-tag">{recipe?.tags[1]}</span>}
              {(!recipe.tags[0] || recipe.tags[0] === "For All" || recipe.tags[0] === "Other") &&
                (!recipe.tags[1] || recipe.tags[1] === "Other") && <div className="margin-div"></div>}
              <p className="card-ingredients">Ingredients: {getShortenedIngredients(recipe.ingredientStr)}</p>
            </div>
          </div>
        </div>
      })}
    </div>
  );
}

const memoizedRecipes = React.memo(Recipes)

export default Recipes;