import React, {useRef, useId} from "react";
import {toast} from "react-toastify";

export default function ImageField({recipe, setRecipe}) {

  const overlayRef = useRef()
  const photoId = useId()

  const handleImageChange = (e) => {
    // const imageFile = e.target.files[0];
    // const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
    // if (!imageFile || !ALLOWED_TYPES.includes(imageFile.type)) {
    //   toast.error("Please upload a png, jpeg or jpg file")
    //   return;
    // }
    // let reader = new FileReader();
    // reader.readAsDataURL(imageFile)
    // reader.onloadend = () => {
    //   const imagePreview = reader.result;
    //   setRecipe(prevRecipe => ({...prevRecipe, image: {file: imageFile, preview: imagePreview}}))
    // }
  }

  return (
    <div className="upload-image-column">
      <div className="image-input-group">
        <div className="upload-image-label">Photo</div>
        <div className="upload-image-input-container">
          <span className="upload-image-text-holder"></span>
          <input type="file" id={photoId} onChange={handleImageChange}/>
          <label htmlFor={photoId}>Upload</label>
        </div>
      </div>
      {
        recipe.image ?
          <div className="final-image-preview-area">
            <div className="final-image-preview-container">
              <img src={recipe.image.preview} alt="Recipe"/>
              <div className="image-overlay" ref={overlayRef}>
                <span className="link" onClick={() => setRecipe(prev => ({...prev, image: null}))}>Remove</span>
              </div>
            </div>
          </div>
          :
          <div className="choose-image-container">
            <p className="add-image-button" htmlFor="image-input">Image Preview Area</p>
          </div>
      }
    </div>
  )
}