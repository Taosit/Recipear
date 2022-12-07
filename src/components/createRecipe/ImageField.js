import React, {useRef, useId} from "react";
import {toast} from "react-toastify";

export default function ImageField({image, updateImage, required = false}) {

  const photoId = useId()
  const imageName = useRef("");

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
      updateImage({file: imageFile, preview: imagePreview, name: imageFile.name});
    }
  }
  
  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36);
    return dateString + randomness;
  };

  return (
    <div key={uniqueId()} className="upload-image-column">
      <div className="image-input-group">
        <div className={`upload-image-label ${required? "required-field" : ""}`}>Photo</div>
        <div className="upload-image-input-container">
          <input type="file" id={photoId} onChange={handleImageChange}/>
          <label htmlFor={photoId} tabIndex="0">Upload</label>
          <span className="upload-image-text-holder">{image?.name}</span>
        </div>
      </div>
      <div className="image-preview-area">{
        image ?          
          <img src={image.preview} alt="Recipe"/>        
          :
          <p>Image Preview Area</p>
      }</div>
    </div>
  )
}