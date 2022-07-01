import React, {useRef} from "react";

export default function CommandHint({infoIconPos}) {

  const offsetLeft = infoIconPos.x + 250 > window.innerWidth ? window.innerWidth / 2 - 125 : infoIconPos.x + 30;
  const offsetHeight = infoIconPos.y - 415;

  const styles = {
    top: `${offsetHeight}px`,
    left: `${offsetLeft}px`
  }

  return (
    <div style={styles} className={`hint-container `}>
      <h3>Voice Commands</h3>
      <ul className="hint-list">
        <li><b>Next page</b>: go to next page</li>
        <li><b>Previous page</b>: go to previous page</li>
        <li><b>Set timer ... minutes (for ...)</b>: set a timer of x minutes</li>
        <li><b>Remove timer</b>: set the timer for the current step</li>
        <li><b>Stop listening</b>: disable voice command</li>
        <li><b>Finish cooking</b>: stop voice command and close the recipe</li>
      </ul>
    </div>
  )
}