import chevronLeft from "../../assets/chevron-left.svg";
import chevronRignt from "../../assets/chevron-right.svg";

const StepButtons = ({step, prevStep, nextStep, loading}) => {

  return (
    <div className="step-button-group">
      <button
        onClick={e => prevStep(e)}
        disabled={step === 0 || loading}
        className="border-button step-button"
      >
        <img src={chevronLeft} alt="chevron left" />
        <span>Previous</span>
      </button>
      <button
        onClick={e => nextStep(e)}
        disabled={loading}
        className="border-button step-button"
      >
        {step !== 4 ? (
          <>
            <span>Next</span>
            <img src={chevronRignt} alt="chevron right" />
          </>
        ) : (
          <><span>Submit</span><div className={loading? "button-loader" : "button-loader-placeholder"}></div></>
        )}
      </button>
    </div>
  )
}

export default StepButtons