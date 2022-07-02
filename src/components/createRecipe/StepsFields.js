import React from "react";
import imageIcon from "../../assets/image.png";
import {toast} from "react-toastify";

export default function StepsField({recipe, setRecipe}) {

  const addStep = () => {
    setRecipe(prevRecipe => ({
      ...prevRecipe,
      steps: [...prevRecipe.steps, ""]
    }))
  }

  const handleInstructionChange = (e, index) => {
    setRecipe(prevRecipe => {
      const newSteps = prevRecipe.steps.map((step, i) => {
        if (index === i) return {...step, instruction: e.target.value}
        return step;
      });
      return {
        ...prevRecipe,
        steps: newSteps
      }
    })
  }

  const handleImageChange = (e, index) => {
    const imageFile = e.target.files[0];
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    if (!imageFile || !ALLOWED_TYPES.includes(imageFile.type)) {
      toast.error("Please upload a png, jpeg or jpg file")
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(imageFile)
    reader.onloadend = () => {
      const imagePreview = reader.result;
      setRecipe(prevRecipe => {
        const newSteps = prevRecipe.steps.map((step, i) => {
          if (index !== i) return step
          return {...step, image: {file: imageFile, preview: imagePreview}};
        });
        return {
          ...prevRecipe,
          steps: newSteps
        }
      })
    }
  }

  const removeImage = (index) => {
    setRecipe(prevRecipe => {
      const newSteps = prevRecipe.steps.map((step, i) => {
        if (index !== i) return step
        return {...step, image: null};
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
            </div>
            <div className="step-content">
              <textarea
                id={`step${i}`}
                className="step-instruction-input"
                value={step.instruction}
                onChange={e => handleInstructionChange(e, i)}
              />
              {
                step.image ?
                  <div className="step-image-preview-area">
                    <div className="step-image-preview-container">
                      <img src={step.image.preview} alt="Step"/>
                    </div>
                    <button className="link" onClick={() => removeImage(i)}>Remove</button>
                  </div>
                  :
                  <div className="choose-image-container">
                    <label className="add-image-button" htmlFor="image-input">Add Image</label>
                    <input type="file" id="image-input"
                           onChange={e => handleImageChange(e, i)}/>
                    <img src={imageIcon} alt="Image"/>
                  </div>
              }
            </div>
            </div>
        ))}
        <button type="button" className="add-step-button" onClick={addStep}>Add Step</button>
      </div>

    </>
  )
}