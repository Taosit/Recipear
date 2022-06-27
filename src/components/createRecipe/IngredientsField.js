import React from "react";

export default function IngredientsField({recipe, handleChange}) {
  return (
    <>
      <h3>List the ingredients you need</h3>
      <textarea value={recipe.ingredients} required={true}
                onChange={e => handleChange(e.target.value, "ingredients")}/>
      <h3>What about the seasonings?</h3>
      <textarea value={recipe.seasonings} required={true}
                onChange={e => handleChange(e.target.value, "seasonings")}/>
    </>
  )
}