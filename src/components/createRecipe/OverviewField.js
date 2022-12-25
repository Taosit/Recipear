import React, { useState } from "react";
import ImageField from "./ImageField";
import SingleSelect from "./SingleSelect";

export default function OverviewField({ recipe, updateRecipe }) {

  const getInitialOptions = () => {
    const options = ["Easy", "Medium", "Hard"];
    if (!recipe.difficulty) return [{Easy: true}, {Medium: false}, {Hard: false}];
    return options.map(option => {
      if (option === recipe.difficulty) {
        return {[option]: true}
      }
      return {[option]: false}
    })
  }
  const [options, setOptions] = useState(getInitialOptions());

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
            <label className="required-field" htmlFor="recipe-name">Recipe Name</label>
            <input
              type="text"
              id="recipe-name"
              value={recipe.name}
              required={true}
              onChange={(e) => updateRecipe(e.target.value, "name")}
            />
          </div>
          <div className="recipe-input-group">
            <label className="required-field" htmlFor="recipe-time">Time Estimate</label>
            <input type="text"
            id="recipe-time" 
            value={recipe.time}
            onChange={(e) => updateRecipe(e.target.value, "time")}/>
          </div>
          <SingleSelect 
            label="Difficulty" 
            options={options}
            selectOption={selectDifficulty}
            required={true}
            containerStyles={{width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr"}}
          />
				</div>
        <div className="column-right">
          <ImageField image={recipe.image} updateImage={img => updateRecipe(img, "image")} required={true}/>
        </div>
			</div>
		</>
	);
}
