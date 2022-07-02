import React, {useState, useRef, useEffect} from "react";
import VoiceCommand from "./VoiceCommand";
import Timer from "./Timer";
import timerIcon from "../../assets/timer.png";

export default function Step({
                               recipe, progress, previousStep, nextStep, timers, setTimers,
                               finishCooking, voiceCommandActive, setVoiceCommandActive
                             }) {

  const timeRef = useRef()
  const stepIndex = progress - 2;
  const currentStep = recipe.steps[stepIndex];

  const showTimerInput = () => {
    setTimers(prev => prev.map((timer, i) => i === stepIndex ? {...timer, timerInUse: true} : timer));
  }

  const startTimer = (timeValue, task = "") => {
    let time = new Date();
    time.setMinutes(time.getMinutes() + parseInt(timeValue));
    time = time.getTime()
    setTimers(prev => prev.map((timer, i) => i === stepIndex ? {...timer, endTime: time, task, timerInUse: true, timer: 1} : timer));
  }

  return (
    <>
      <p className="subtitle">{recipe.name}</p>
      <h2 className="cook-title">Step <span className="step-number">{stepIndex + 1}
      </span> of <span className="step-number">{recipe.steps.length}</span></h2>
      {!timers[stepIndex].timerInUse ?
        <span className="timer-span">
          {currentStep.time && <span className="time-span">
          <img src={timerIcon} alt="timer"/>
          <p className="time-value">{currentStep.time} mins</p>
        </span>}
            <span className="set-timer" onClick={showTimerInput}>Set timer</span>
        </span>
        :
        !timers[stepIndex].timer ?
          <span className="timer-input-span">
            <input type="number" ref={timeRef}
                 defaultValue={currentStep.time? currentStep.time : 1} className="timer-input"/> mins
            <span className="set-timer" onClick={() => startTimer(timeRef.current.value)}>OK</span>
          </span>
          :
          <Timer timers={timers} setTimers={setTimers} stepIndex={stepIndex} voiceCommandActive={voiceCommandActive} />
      }
      <p className="step-instruction">{currentStep.instruction}</p>
      {currentStep.image && <div className="step-image-container">
        <img className="step-image" src={currentStep.image.url} alt="current step"/>
      </div>}
      <div className="navigate-buttons">
        <button className="button-orange" onClick={previousStep}>Prev</button>
        <VoiceCommand voiceCommandActive={voiceCommandActive}
                      setVoiceCommandActive={setVoiceCommandActive}
                      recipe={recipe}
                      startTimer={startTimer}
                      timers={timers}
                      setTimers={setTimers}
                      stepIndex={stepIndex}
                      previousStep={previousStep}
                      nextStep={nextStep}
        />
        {progress <= recipe.steps.length ?
          <button className="button-orange" onClick={nextStep}>Next</button>
          :
          <button className="button-orange" onClick={finishCooking}>Done</button>
        }
      </div>
    </>
  )
}