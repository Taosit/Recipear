import React from 'react'
import starIcon from "../assets/star.svg";
import IngredientList from './IngredientList';

const RecipeInfoColumn = ({recipe}) => {

    const tagsExist = (recipe.tags[0] && recipe.tags[0] !== 'For All' && recipe.tags[0] !== 'Other') || (recipe.tags[1] && recipe.tags[1] !== 'Other') || (recipe.tags[3] && recipe.tags[3] !== 'Other') || (recipe.tags[4] && recipe.tags[4] !== 'Other');

    return (
    <div className="recipe-info-column">
        <div className='big-image-container'>
            <div className='star-count-container'>
                <img src={starIcon} alt='star' />
                {recipe.likes}
            </div>
            <img src={recipe.image.url} alt="recipe" />
        </div>
        <div className='recipe-info-card'>
            <h3 className='underlined-heading'>Recipe Info</h3>
            <p className='time-and-difficulty'>{recipe.time} | {recipe.difficulty}</p>
            {tagsExist && (
                <div className='tags-container'>
                    {recipe.tags[0] && recipe.tags[0] !== 'For All' && recipe.tags[0] !== 'Other' && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Protein</p>
                            <p className='tag'>{recipe.tags[0]}</p>
                        </div>
                    )}
                    {recipe.tags[1] && recipe.tags[1] !== 'Other' && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Nutrition</p>
                            <p className='tag'>{recipe.tags[1]}</p>
                        </div>
                    )}
                    {recipe.tags[3] && recipe.tags[3] !== 'Other' && (
                        <div className='recipe-tag-container'>
                            <p className='tag-label'>Region</p>
                            <p className='tag'>{recipe.tags[3]}</p>
                        </div>
                    )}
                    {recipe.tags[4] && recipe.tags[4] !== 'Other' && (
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