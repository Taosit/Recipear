import React from "react";

export default function StepsField({recipe, setRecipe}) {

  const addStep = () => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      steps: [...prevRecipe.steps, ""]
    }))
  }

  const handleStepChange = (event, index, type) => {
    setRecipe(prevRecipe => {
      const newSteps = prevRecipe.steps.map((step, i) => {
        if (index === i) {
          if (type === "time") return {...step, time: event.target.value}
          if (type === "instruction") return {...step, instruction: event.target.value}
          console.log("image upload files", event.target.files)
          if (type === "image") return {...step, image: event.target.files[0]}
        }
        return step;
      });
      return {
        ...prevRecipe,
        steps: newSteps
      }
    })
  }

  return (
    <>
      <h3>How do you make it?</h3>
      <p className="image-instruction">You can optionally add <b>one</b> image for each step</p>
      <div className="steps">
        {recipe.steps.map((step, i) => (
          <div className="step" key={i}>
            <div className="step-header">
              <span className="step-label">{`Step ${i+1}:`}</span>
              <span className="cook-time">
              <label htmlFor="cook-time">Cook time: </label>
                <span className="cook-time-value">
                  <input className="cook-time-input" type="text" value={step.time}
                         onChange={e => handleStepChange(e, i, "time")}
                  /> mins
                </span>
            </span>
            </div>
            <textarea
              id={`step${i}`}
              value={step.instruction}
              onChange={e => handleStepChange(e, i, "instruction")}
            />
            <input type="file" id="image"
                   onChange={e => handleStepChange(e, i, "image")}/>
          </div>
        ))}
        <button type="button" className="add-step-button" onClick={addStep}>Add Step</button>
      </div>

    </>
  )
}