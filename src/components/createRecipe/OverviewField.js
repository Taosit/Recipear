import React, { useRef, useEffect, useState } from "react";
import ImageField from "./ImageField";
import SingleSelect from "./SingleSelect";

export default function OverviewField({ recipe, updateRecipe, showModal }) {
	const nameRef = useRef();
  const [options, setOptions] = useState([{Easy: true}, {Medium: false}, {Hard: false}]);

	useEffect(() => {
		if (showModal && !recipe.name) {
			nameRef.current.focus();
		}
	}, [showModal, recipe.name]);

  const selectDifficulty = (option) => {
    setOptions(prev => prev.map(prevOption => {
      if (Object.keys(prevOption)[0] === option) {
        return {[option]: true}
      } else {
        return {[Object.keys(prevOption)[0]]: false}
      }
    }))
    updateRecipe(option, "difficulty");
  }

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
              onChange={(e) => updateRecipe(e.target.value, "name")}
            />
          </div>
          <div className="recipe-input-group">
            <label htmlFor="recipe-time">Time Estimate</label>
            <input type="text"
            id="recipe-time" 
            value={recipe.time}
            onChange={(e) => updateRecipe(e.target.value, "time")}/>
          </div>
          <SingleSelect 
            label="Difficulty" 
            options={options}
            selectOption={selectDifficulty}
            containerStyles={{width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}
          />
				</div>
        <div className="column-right">
          <ImageField recipe={recipe} updateRecipe={updateRecipe}/>
        </div>
			</div>
		</>
	);
}
