import React from 'react'
import filledStarIcon from "../assets/star-filled.svg";
import emptytarIcon from "../assets/star-empty.svg";
import { useRecipeContext } from '../contexts/RecipeContextProvider';
import { useLikeRecipe } from '../hooks/useLikeRecipe';
import IngredientList from './IngredientList';

const RecipeInfoColumn = ({recipe}) => {
    const { liked, toggleLike } = useLikeRecipe(recipe);

    const tagsExist = recipe.tags.some(t => t);

    return (
    <div className="recipe-info-column">
        <div className='big-image-container'>
            <button className='star-count-container' onClick={toggleLike}>
                <img src={(liked === null || liked)? filledStarIcon : emptytarIcon} alt='star' />
                {recipe.likes}
            </button>
            <img src={recipe.image.url} alt="recipe" />
        </div>
        <div className='recipe-info-card'>
            <h3 className='underlined-heading'>Recipe Info</h3>
            <p className='time-and-difficulty'>{recipe.time} | {recipe.difficulty}</p>
            {tagsExist && (
                <div className='tags-container'>
                    {recipe.tags[0] && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Protein</p>
                            <p className='tag'>{recipe.tags[0]}</p>
                        </div>
                    )}
                    {recipe.tags[1] && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Nutrition</p>
                            <p className='tag'>{recipe.tags[1]}</p>
                        </div>
                    )}
                    {recipe.tags[3] && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Region</p>
                            <p className='tag'>{recipe.tags[3]}</p>
                        </div>
                    )}
                    {recipe.tags[4] && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Flavor</p>
                            <p className='tag'>{recipe.tags[4]}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
        <div className='ingredients-and-seasonings'>
            <IngredientList ingredients={recipe.ingredients} category="Ingredients" />
            <IngredientList ingredients={recipe.seasonings} category="Seasonings" />
        </div>
    </div>
  )
}

export default RecipeInfoColumn