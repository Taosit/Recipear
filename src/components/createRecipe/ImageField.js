import React, {useRef, useId} from "react";
import {toast} from "react-toastify";

export default function ImageField({recipe, handleChange}) {

  const photoId = useId()

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    if (!imageFile || !ALLOWED_TYPES.includes(imageFile.type)) {
      toast.error("Please upload a png, jpeg or jpg file")
      return;
    }
    let reader = new FileReader();
    reader.readAsDataURL(imageFile)
    reader.onloadend = () => {
      const imagePreview = reader.result;
      handleChange({file: imageFile, preview: imagePreview}, "image");
    }
  }

  return (
    <div className="upload-image-column">
      <div className="image-input-group">
        <div className="upload-image-label">Photo</div>
        <div className="upload-image-input-container">
          <input type="file" id={photoId} onChange={handleImageChange}/>
          <label htmlFor={photoId} tabIndex="0">Upload</label>
          <span className="upload-image-text-holder"></span>
        </div>
      </div>
      <div className="image-preview-area">{
        recipe.image ?          
          <img src={recipe.image.preview} alt="Recipe"/>        
          :
          <p>Image Preview Area</p>
      }</div>
    </div>
  )
}