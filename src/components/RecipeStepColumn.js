import React from 'react'
import { useParams, useNavigate } from "react-router-dom";
import cookIcon from "../assets/cook.svg";

const RecipeStepColumn = ({recipe}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const cook = () => {
		navigate(`/recipes/${id}/cook`);
	};

  return (
    <div className="recipe-info-column">
      <div className='recipe-steps-header'>
        <h3 className='underlined-heading'>Steps</h3>
        <button className="icon-button cook-button row" onClick={cook}>
          <div className="cook-icon-container">
            <img src={cookIcon} alt="cook" />
          </div>
          <p className="cook-text">Cook</p>
        </button>
      </div>
      <div className='steps-list'>
        {recipe.steps.map((step, index) => (
          <div className='step-container' key={index}>
            <div className='step-header-container'>
              <div className='step-instruction-container'>{step.instruction}</div>
              {step.time && <div className='step-time'><span>{step.time}</span> mins</div>}
            </div>
            {step.image && (
              <div className='step-image-container'>
                <img src={step.image.url} alt="step" />
              </div>
            )}
          </div>   
        ))} 
      </div>
    </div>
  )
}

export default RecipeStepColumn