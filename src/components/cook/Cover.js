import React, {useState, useRef} from "react";
import infoIcon from "../../assets/info.png"
import CommandHint from "./CommandHint";

export default function Cover({recipe, nextStep, voiceCommandActive, setVoiceCommandActive}) {
  const [displayHint, setDisplayHint] = useState(false);
  const infoIconRef = useRef();



  const startCooking = () => {
    nextStep()
  }

  const showHint = (e) => {
    console.log("show hint")
    setDisplayHint(true);
  }

  const hideHint = () => {
    setDisplayHint(false);
  }

  return (
    <>
      <p className="subtitle">{recipe.name}</p>
      <h2 className="cook-title">Get ready to cook</h2>
      <div className="cook-image-container">
        <img className="cook-image" src={recipe.image} alt="recipe"/>
      </div>
      <div className="voice-command-question">
        <p>Would you like to activate voice command? You can activate or stop voice command later.</p>
        <div className="radio-button-groups">
          <span className={`radio-button-group ${voiceCommandActive ? "active" : "not-active"}`}>
            <label htmlFor="activate" className="voice-option">Yes</label>
          <input type="radio" id="activate" name="voice-command-option"
            onClick={() => setVoiceCommandActive(true)}
          />
          </span>
          <span className={`radio-button-group ${!voiceCommandActive ? "active" : "not-active"}`}>
            <label htmlFor="not-activate" className="voice-option">No</label>
          <input type="radio" id="not-activate" name="voice-command-option"
                 onClick={() => setVoiceCommandActive(false)}
          />
          </span>
        </div>
        <div className="command-hint">
          <p>What commands can I use? </p>
          <img ref={infoIconRef} onMouseEnter={e => showHint(e)} src={infoIcon} alt="info"
          onMouseLeave={hideHint}
          />
        </div>
        {displayHint && infoIconRef && <CommandHint infoIconX={infoIconRef.current.getBoundingClientRect().left}/>}
      </div>
      <div>
        <button className="button-orange cover-page-button" onClick={startCooking}>Start Cooking</button>
      </div>
    </>
  )
}