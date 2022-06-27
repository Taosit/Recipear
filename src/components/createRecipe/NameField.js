import React from "react";

export default function NameField({recipe, handleChange}) {

  return (
    <>
      <h3>Give your recipe a name</h3>
      <input type="text" value={recipe.name} required={true}
             onChange={e => handleChange(e.target.value, "name")}/>
    </>
  )
}