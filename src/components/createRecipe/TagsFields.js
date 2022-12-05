import React, {useState, useEffect} from "react";
import {useRecipeContext} from "../../contexts/RecipeContextProvider";

export default function TagsField({updateRecipe, tags, setTags}) {
  const {tags: specifiedTags} = useRecipeContext()

  useEffect(() => {
    updateRecipe(Object.values(tags), "tags")
  }, [tags])

  const tagCategories = Object.keys(specifiedTags)

  const capitalize = (str) => {
    return str.replace(str[0], str[0].toUpperCase())
  }

  const changeTag = (e, group, attribute) => {
    e.preventDefault();
    setTags(prev => ({
      ...prev,
      [group]: prev[group] === attribute? null : attribute
    }))
  }

  const handleType = (e, group) => {
    e.preventDefault()
    setTags(prev => ({
      ...prev,
      [group]: e.target.value
    }))
  }

  return (
    <>
      <h3>Add some tags to your recipe</h3>
      {
        tagCategories.map((tagCategory, i) => (
          <div className="radio-group" key={tagCategory}>
            <h4 className="group-title">{capitalize(tagCategory)}</h4>
            {
              specifiedTags[tagCategory].map((tagAttribute, index) => (
                <button className={`option ${tags[tagCategory] === tagAttribute ? "selected" : ""}`} key={tagAttribute}
                        onClick={(e) => changeTag(e,tagCategory, capitalize(tagAttribute))}
                >
                  {capitalize(tagAttribute)}
                </button>
              ))
            }
            <button className={`option ${tags[tagCategory] !== null && !specifiedTags[tagCategory].includes(tags[tagCategory]) ? "selected" : ""}`}
                    onClick={(e) => changeTag(e,tagCategory, "Other")}>Other</button>
            {tags[tagCategory] !== null && !specifiedTags[tagCategory].includes(tags[tagCategory]) &&
              <div>
                <label className="specify" htmlFor={tagCategory}>Please specify: </label>
                <input type="text" id={tagCategory} onChange={(e) => handleType(e, tagCategory)}/>
              </div>
            }
          </div>
        ))
      }
    </>
  )
}