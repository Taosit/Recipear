import React from 'react'

const SingleSelect = ({label, options, selectOption}) => {
  const optionArray = options.map(option => Object.keys(option)[0])
  console.log({options, optionArray})
  return (
    <div onClick={(e) => console.log(e.target)}>
        <label>{label}</label>
        <div className='select-option-container'>
          {optionArray.map((option, i) => (
            <span className={`radio-button ${options[i][option] ? "selected-option" : ""}`}
              onClick={() => selectOption(option)} tabIndex="0">
              <input type="radio" name={label} id={option} value={option}/>
              <label for={option}>{option}</label>
            </span>
          ))}
        </div>
    </div>
  )
}

export default SingleSelect