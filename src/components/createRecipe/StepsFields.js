import React, { useRef, useEffect } from "react";
import ImageField from "./ImageField";

export default function StepsField({ recipe, updateRecipe }) {

	const addStep = (index) => {
    const newSteps = [...recipe.steps.slice(0, index + 1), { instruction: "", image: null }, ...recipe.steps.slice(index + 1)];
		updateRecipe(newSteps, "steps");
	};

	const handleInstructionChange = (e, index) => {
		const newSteps = recipe.steps.map((step, i) => {
			if (index === i) return { ...step, instruction: e.target.value };
			return step;
		});
		updateRecipe(newSteps, "steps");
	};

  const updateStepImage = (img, index) => {
    const newSteps = recipe.steps.map((step, i) => {
      if (index !== i) return step;
      return { ...step, image: img };
    });
    updateRecipe(newSteps, "steps");
  }

	return (
		<>
			<h1>Steps</h1>
			<div className="recipe-steps">
				{recipe.steps.map((step, i) => (
					<div className="step" key={`${recipe.name}-step-${i}`}>
						<div className="step-header">
							<span className="step-label">{`Step ${i + 1}:`}</span>
							<button type="button" className="add-step-button" onClick={() => addStep(i)}>Add Step +</button>
						</div>
						<div className="step-content">
              <div className="instruction-column">
                <label htmlFor={`step${i}`} className={i? "" : "required-field"}>Instruction</label>
                <textarea
                  id={`step${i}`}
                  className="step-instruction-input"
                  value={step.instruction}
                  onChange={e => handleInstructionChange(e, i)}
                />
              </div>
              <div className="column-right">
                <ImageField image={step.image} updateImage={img => updateStepImage(img, i)}/>
              </div>
						</div>
					</div>
				))}				
			</div>
		</>
	);
}
