import React, {useRef} from "react";
import imageIcon from "../../assets/image.png"
import {toast} from "react-toastify";

export default function ImageField({recipe, setRecipe}) {

  const overlayRef = useRef()

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
      setRecipe(prevRecipe => ({...prevRecipe, image: {file: imageFile, preview: imagePreview}}))
    }
  }

  const showImageOverlay = () => {
    overlayRef.current.classList.add("show-image-overlay")
  }

  const hideImageOverlay = () => {
    overlayRef.current.classList.remove("show-image-overlay")
  }

  return (
    <>
      <h3>Lastly, upload an image to showcase your recipe!</h3>
      {
        recipe.image ?
          <div className="final-image-preview-area">
            <div className="final-image-preview-container"
                 onMouseEnter={showImageOverlay} onMouseLeave={hideImageOverlay}>
              <img src={recipe.image.preview} alt="Recipe"/>
              <div className="image-overlay" ref={overlayRef}>
                <span className="link" onClick={() => setRecipe(prev => ({...prev, image: null}))}>Remove</span>
              </div>
            </div>
          </div>
          :
          <div className="choose-image-container">
            <label className="add-image-button" htmlFor="image-input">Choose Image</label>
            <input type="file" id="image-input"
                   onChange={e => handleImageChange(e)}/>
            <img src={imageIcon} alt="Image"/>
          </div>
      }
    </>
  )
}