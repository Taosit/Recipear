import { createContext, useContext, useState, useEffect, useReducer } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase.config";

const RecipeContext = createContext();

const useRecipeContext = () => {
  return useContext(RecipeContext)
};

export const ACTIONS = {
  GET_RECIPES: "GET_RECIPES",
  ADD_RECIPE: "ADD_RECIPE",
  DELETE_RECIPE: "DELETE_RECIPE",
  LIKE_RECIPE: "LIKE_RECIPE",
  UNLIKE_RECIPE: "UNLIKE_RECIPE",
  UPDATE_RECIPE: "UPDATE_RECIPE",
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.GET_RECIPES:
      return action.payload
    case ACTIONS.ADD_RECIPE:
      return [...state, action.payload]
    case ACTIONS.UPDATE_RECIPE:
      return state.map(recipe => {
        if (recipe.id === action.payload.id) {
          return action.payload
        }
        return recipe
      })
    case ACTIONS.DELETE_RECIPE:
      return state.filter(recipe => recipe.id !== action.payload)
    case ACTIONS.LIKE_RECIPE:
      return state.map(recipe => {
        if (recipe.id === action.payload) {
          return {...recipe, likes: recipe.likes + 1}
        }
        return recipe
      })
    case ACTIONS.UNLIKE_RECIPE:
      return state.map(recipe => {
        if (recipe.id === action.payload) {
          return {...recipe, likes: recipe.likes - 1}
        }
        return recipe
      })
    default:
      return state
  }
}

const RecipeContextProvider = ({children}) => {
  const [lastVisitedPage, setLastVisitedPage] = useState("/recipes")
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(reducer, [])

  useEffect(() => {
    setLoading(true)
    getDocs(collection(db, "recipes")).then(snapshot => {
      dispatch({type: ACTIONS.GET_RECIPES, payload: snapshot.docs.map(doc => {
        return {...doc.data(), id: doc.id}
      })})
      setLoading(false)
    });
  }, [])

  return <RecipeContext.Provider
    value={{
      loading,
      setLoading,
      recipes: state,
      dispatch,
      lastVisitedPage,
      setLastVisitedPage,
    }}
  >
    {children}
  </RecipeContext.Provider>

}

export {useRecipeContext, RecipeContextProvider};