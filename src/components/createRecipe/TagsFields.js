import React, {useState, useEffect} from "react";
import {useRecipeContext} from "../../contexts/RecipeContextProvider";
import SingleSelect from "./SingleSelect";

export default function TagsField({recipe, updateRecipe}) {
  const {tags: specifiedTags} = useRecipeContext()
  const tagCategories = Object.keys(specifiedTags)

  const initialTags = Object.keys(specifiedTags).reduce((acc, tag) => {
    return {...acc, [tag]: [...specifiedTags[tag], "Other"].map(tag => ({[tag]: false}))}
  }, {})

  const [tags, setTags] = useState(initialTags)

  const capitalize = (str) => {
    return str.replace(str[0], str[0].toUpperCase())
  }

  const selectCategory = (category, tag, i) => {
    setTags(prev => ({
      ...prev,
      [category]: prev[category].map(prevTag => {
        if (Object.keys(prevTag)[0] === tag) {
          return {[tag]: true}
        } else {
          return {[Object.keys(prevTag)[0]]: false}
        }
      })
    }))
    const recipeTags = [...recipe.tags]
    recipeTags[i] = tag === "Other" ? null : tag
    updateRecipe(recipeTags, "tags")
  }

  const handleType = (e, i) => {
    e.preventDefault()
    const recipeTags = [...recipe.tags]
    recipeTags[i] = e.target.value || null
    updateRecipe(recipeTags, "tags")
  }

  const styles = {
    width: "100%",
    maxWidth: "500px",
    display: "grid", 
    gridTemplateColumns: "1fr 1fr 1fr 1fr"
  }

  return (
    <>
      <h1>Tags</h1>
      <div className="recipe-tags">
        {tagCategories.map((tagCategory, i) => (
            <div className="select-tag-container" key={tagCategory}>
              <SingleSelect
                label={capitalize(tagCategory)}
                options={tags[tagCategory]}
                selectOption={(tag) => selectCategory(tagCategory, tag, i)}
                containerStyles={styles}
              />
              {tags[tagCategory][3].Other &&
                <div>
                  <input type="text" placeholder="Please specify" onChange={(e) => handleType(e, i)}/>
                </div>}
            </div>
          ))}
      </div>
    </>
  )
}