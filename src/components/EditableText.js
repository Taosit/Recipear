import React, {useEffect, useState} from "react";
import doneIcon from "../assets/done.png";
import editIcon from "../assets/edit.png";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../firebase.config";
import {useParams} from "react-router-dom";

export default function EditableText({
                                       recipe, setRecipeModified, isAuthor, label, field,
                                       editing, setEditing, editFieldValue, setEditFieldValue}) {


  const {id} = useParams()

  const recipeRef = doc(db, "recipes", id);
  const getFieldValue = () => {
    if (!field.includes("step")) return recipe[field];
    const [_, index, stepField] = field.split("-");
    return recipe.steps[index][stepField]
  }

  useEffect(() => {
    const updateField = async () => {
      if (!editing && editFieldValue) {
        if (Object.keys(editFieldValue)[0].includes("step")) {
          const [_, index, field] = Object.keys(editFieldValue)[0].split("-")
          const updatedSteps = recipe.steps.map((step, i) => {
            if (+index !== i) return step;
            return {...step, [field]: Object.values(editFieldValue)[0]}
          })
          await updateDoc(recipeRef, {steps: updatedSteps})
        } else {
          await updateDoc(recipeRef, {...editFieldValue})
        }
        setRecipeModified(true);
        setEditFieldValue(null)
      }
    }
    updateField()
  }, [editing, editFieldValue])

  const startEditing = (field) => {
    setEditing(field);
    if (field.includes("step")) {
      const [_, index, stepField] = field.split("-");
      setEditFieldValue({[field]: recipe.steps[index][stepField]})
    } else {
      setEditFieldValue({[field]: recipe[field]})
    }
  }

  const doneEditing = async () => {
    setEditing(null)
  }

  return (
    <div className="editable-text-container">
      {editing === field ?
        <span className="edit-field-container">
          {label && <label htmlFor="ingredient-edit">{label}: </label>}
          <textarea className="edit-field" value={editFieldValue[field]}
                    onChange={(e) => setEditFieldValue({[field]: e.target.value})}
          />
                    <img className="edit-field-icon" src={doneIcon} alt="done"
                         onClick={doneEditing}
                    />
                </span>
        :
        <span className="edit-field-container">{label ? `${label}: ` : ""}{getFieldValue()}
          {isAuthor && <img className="edit-field-icon" src={editIcon} alt="edit"
                            onClick={() => startEditing(field)}
          />}
                </span>
      }
    </div>
  )
}