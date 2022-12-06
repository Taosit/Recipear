import {createContext, useContext, useState, useEffect} from "react";
import {doc, deleteDoc, getDocs, collection} from "firebase/firestore";
import {db, storage} from "../firebase.config";

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
    protein: ["Meat", "Seafood", "Vege"],
    nutrition: ["Low-carb", "High-protein", "High-fiber"],
    meal: ["Breakfast", "Main", "Desert"],
    region: ["Asian", "Arabian", "European"],
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
    }}
  >
    {children}
  </RecipeContext.Provider>

}

export {useRecipeContext, RecipeContextProvider};