import React from 'react'
import chevronLeft from "../../assets/chevron-left.svg";
import chevronRignt from "../../assets/chevron-right.svg";

const StepButtons = ({step, prevStep, nextStep, shouldButtonDisable, loading}) => {
  return (
    <div className="step-button-group">
      <button
        onClick={e => prevStep(e)}
        disabled={step === 0}
        className="step-button"
      >
        <img src={chevronLeft} alt="chevron left" />
        <span>Previous</span>
      </button>
      <button
        onClick={e => nextStep(e)}
        disabled={false}
        className={`step-button ${step === 4 ? "submit-button" : ""}`}
      >
        {step !== 4 ? (
          <>
            <span>Next</span>
            <img src={chevronRignt} alt="chevron right" />
          </>
        ) : !loading ? (
          "Submit"
        ) : (
          <div className="button-loader"></div>
        )}
      </button>
    </div>
  )
}

export default StepButtons