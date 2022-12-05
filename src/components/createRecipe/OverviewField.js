import React, { useRef, useEffect, useState } from "react";
import ImageField from "./ImageField";
import SingleSelect from "./SingleSelect";

export default function OverviewField({ recipe, handleChange, showModal }) {
	const nameRef = useRef();
  const [options, setOptions] = useState([{Easy: true}, {Medium: false}, {Hard: false}]);

	useEffect(() => {
		if (showModal && !recipe.name) {
			nameRef.current.focus();
		}
	}, [showModal]);

  const selectDifficulty = (option) => {
    setOptions(prev => prev.map(prevOption => {
      if (Object.keys(prevOption)[0] === option) {
        return {[option]: true}
      } else {
        return {[Object.keys(prevOption)[0]]: false}
      }
    }))
    handleChange(option, "difficulty");
  }

  console.log(recipe)

	return (
		<>
			<h1>Overview</h1>
			<div className="recipe-overview">
				<div className="column-left">
					<div className="recipe-input-group">
            <label htmlFor="recipe-name">Recipe Name</label>
            <input
              type="text"
              id="recipe-name"
              value={recipe.name}
              required={true}
              ref={nameRef}
              onChange={(e) => handleChange(e.target.value, "name")}
            />
          </div>
          <div className="recipe-input-group">
            <label htmlFor="recipe-time">Time Estimate</label>
            <input type="text"
            id="recipe-time" 
            value={recipe.time}
            onChange={(e) => handleChange(e.target.value, "time")}/>
          </div>
          <SingleSelect 
            label="Difficulty" 
            options={options}
            selectOption={selectDifficulty}
          />
				</div>
        <div className="column-right">
          <ImageField recipe={recipe} handleChange={handleChange}/>
        </div>
			</div>
		</>
	);
}
