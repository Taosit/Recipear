import {createContext, useContext, useState, useEffect} from "react";
import {doc, deleteDoc, getDocs, collection} from "firebase/firestore";
import {db, storage} from "../firebase.config";
import { ref, deleteObject } from "firebase/storage";

const RecipeContext = createContext();

const useRecipeContext = () => {
  return useContext(RecipeContext)
};

const RecipeContextProvider = ({children}) => {
  const [recipes, setRecipes] = useState([])
  const [lastVisitedPage, setLastVisitedPage] = useState("/recipes")
  const [loading, setLoading] = useState(false)
  const [recipeModified, setRecipeModified] = useState(true)

  const tags = {
    type: ["For All", "Pescatarian", "Vegetarian", "Vegan"],
    nutrition: ["Low-carb", "High-fiber"],
    meal: ["Breakfast", "Main", "Desert", "Soup"],
    region: ["Japanese", "Indian", "Chinese", "Arabian", "African"],
    flavor: ["Spicy", "Sour", "Sweet"],
  }

  useEffect(() => {
    console.log("useEffect ran")
    if (!recipeModified) return
    setLoading(true)
    getDocs(collection(db, "recipes")).then(snapshot => {
      setRecipes(snapshot.docs.map(doc => {
        return {...doc.data(), id: doc.id}
      }))
      setLoading(false)
      setRecipeModified(false)
    });
  }, [recipeModified])

  const deleteRecipe = async (id) => {
    setRecipes(prevRecipes => {
      const newRecipes = prevRecipes.filter(r => r.id !== id);
      return newRecipes
    })
    await deleteDoc(doc(db, "recipes", id));
    await deleteObject(ref(storage, `images/${id}`));
  }

  return <RecipeContext.Provider
    value={{
      loading,
      setLoading,
      recipes,
      setRecipes,
      tags,
      recipeModified,
      setRecipeModified,
      lastVisitedPage,
      setLastVisitedPage,
      deleteRecipe
    }}
  >
    {children}
  </RecipeContext.Provider>

}

export {useRecipeContext, RecipeContextProvider};