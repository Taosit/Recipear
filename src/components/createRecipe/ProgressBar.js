import React from 'react'

const ProgressBar = ({step}) => {
    console.log({step})
  return (
    <div className='progress-bar'>
        {Array(5).fill().map((_, i) => (
            <span className={`progress-bar-step ${i <= step ? "completed-step" : ""}`}></span>
        ))}
    </div>
  )
}

export default ProgressBar