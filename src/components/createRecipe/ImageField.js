import React from "react";

export default function ImageField({handleChange}) {
  return (
    <>
      <h3>Lastly, upload an image to showcase your recipe!</h3>
      <input type="file" required={true}
             onChange={(e) => handleChange(e.target.files[0], "image")}/>
    </>
  )
}