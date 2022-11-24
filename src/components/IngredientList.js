import React from 'react'
import paperclipIcon from "../assets/paperclip.svg";

const IngredientList = ({ingredients, category}) => {

    const capitalize = str => {
		return str.replace(str[0], str[0].toUpperCase());
	};

    return (
    <div className='ingredient-list'>
        <img src={paperclipIcon} alt='paperclip' className='paperclip-image' />
        <h3 className='underlined-heading'>{category}</h3>
        <div className='ingredient-items-container'>
            {ingredients.map((ingredient, index) => (
                <div className='ingredient-item' key={index}>
                    <p className='ingredient-name'>{capitalize(ingredient.ingredient)}</p>
                    <p className='ingredient-amount'>{ingredient.amount}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default IngredientList