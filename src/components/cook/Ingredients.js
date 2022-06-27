import React from "react";
import microphoneIcon from "../../assets/microphone.png"
import blockedMicrophoneIcon from "../../assets/block-microphone.png"
import VoiceCommand from "./VoiceCommand";

export default function Ingredients({recipe, nextStep, previousStep, voiceCommandActive, setVoiceCommandActive}) {

  return (
    <>
      <p className="subtitle">{recipe.name}</p>
      <h2 className="cook-title">Prepare</h2>
      <div className="ingredient-list">
        <h3>Ingredients</h3>
        <p>{recipe.ingredients}</p>
        <h3>Seasonings</h3>
        <p>{recipe.seasonings}</p>
      </div>

        <div className="navigate-buttons">
          <button className="button-orange" onClick={previousStep}>Prev</button>
          <VoiceCommand voiceCommandActive={voiceCommandActive}
                        setVoiceCommandActive={setVoiceCommandActive}
                        recipe={recipe}
                        previousStep={previousStep}
                        nextStep={nextStep}
          />
          <button className="button-orange" onClick={nextStep}>Next</button>
        </div>
    </>
  )
}