import React, {useState} from "react"
import {useParams, useNavigate} from "react-router-dom";
import {useRecipeContext} from "../contexts/RecipeContextProvider";
import Cover from "../components/cook/Cover";
import Ingredients from "../components/cook/Ingredients";
import Step from "../components/cook/Step";


function Cook() {
  const navigate = useNavigate()
  const {recipes} = useRecipeContext()
  const {id} = useParams();
  const getRecipe = () => recipes.find(recipe => recipe.id === id);
  const [recipe, setRecipe] = useState(getRecipe)

  const progressList = ["cover", "ingredients"]
  recipe.steps.forEach((_, i) => progressList.push(`${i}`))
  const [progress, setProgress] = useState(0)
  const [voiceCommandActive, setVoiceCommandActive] = useState(false)
  const initialTimers = new Array(recipe.steps.length).fill({
    timer: null,
    timerHasStarted: false,
    endTime: null,
    task: ""
  });
  const [timers, setTimers] = useState(initialTimers)
  const [stepsHaveTimer, setStepsHaveTimer] = useState(new Array(recipe.steps.length).fill(false))

  const cancelCooking = () => {
    timers.forEach(t => t.timer && clearTimeout(t.timer))
    setTimers(initialTimers)
    navigate(`/recipes/${id}`)
  }

  const nextStep = () => {
    setProgress(prev => prev + 1)
  }

  const previousStep = () => {
    setProgress(prev => prev - 1)
  }

  const recipeContent = () => {
    switch (progressList[progress]) {
      case "cover":
        return <Cover recipe={recipe} nextStep={nextStep}
                      voiceCommandActive={voiceCommandActive} setVoiceCommandActive={setVoiceCommandActive}/>
      case "ingredients":
        return <Ingredients recipe={recipe} nextStep={nextStep} previousStep={previousStep}
                            voiceCommandActive={voiceCommandActive} setVoiceCommandActive={setVoiceCommandActive}/>
      default:
        return <Step recipe={recipe} progress={progress} timers={timers} setTimers={setTimers}
                     stepsHaveTimer={stepsHaveTimer} setStepsHaveTimer={setStepsHaveTimer}
                     nextStep={nextStep} previousStep={previousStep} finishCooking={cancelCooking}
                     voiceCommandActive={voiceCommandActive} setVoiceCommandActive={setVoiceCommandActive}/>
    }
  }

  return (
    <div className="cook-page-container">
      <div className="cook-page">
        <span className="cancel-cooking" onClick={cancelCooking}>Cancel</span>
        {recipeContent()}
      </div>
    </div>
  );
}

export default Cook;