import React from 'react'

const SingleSelect = ({label, options, selectOption, containerStyles = {}, optionStyles = {}}) => {
  const optionArray = options.map(option => Object.keys(option)[0])
  return (
    <div>
        <label>{label}</label>
        <div className='select-option-container' style={containerStyles}>
          {optionArray.map((option, i) => (
            <span key={option} style={optionStyles} className={`radio-button ${options[i][option] ? "selected-option" : ""}`}
              onClick={(e) => e.target.tagName === "LABEL" && selectOption(option)} tabIndex="0">
              <input type="radio" name={label} id={option} value={option}/>
              <label htmlFor={option}>{option}</label>
            </span>
          ))}
        </div>
    </div>
  )
}

export default SingleSelect