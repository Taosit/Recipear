import {useNavigate, useLocation} from "react-router-dom";
import {useEffect, useMemo, useState} from "react";
import {getAuth} from "firebase/auth";
import {getDoc, doc} from "firebase/firestore";
import {db} from "../firebase.config";
import Recipes from "../components/Recipes";
import {useRecipeContext} from "../contexts/RecipeContextProvider";

function UserRecipes() {
  const {setLastVisitedPage} = useRecipeContext()
  const auth = getAuth()

  const navigate = useNavigate()
  const currentRoute = useLocation()
  setLastVisitedPage(currentRoute.pathname)

  const [recipesToDisplay, setRecipesToDisplay] = useState([])

  const page = window.location.href.endsWith("my-recipes") ? "createdRecipes" : "likedRecipes";

  useEffect(() => {
    if (!page) return;
    const getRecipes = () => {
      return getDoc(doc(db, "users", auth.currentUser.uid))
        .then(async snapshot => {
          const recipeIds = snapshot.data()[page];
          return Promise.all(recipeIds.map(id => getDoc(doc(db, "recipes", id))))
            .then(snapshots => snapshots.forEach(snapshot => setRecipesToDisplay(prev => [...prev, snapshot.data()])))
        })
    }
    getRecipes()
    return setRecipesToDisplay([])
  }, [page])

  console.log(recipesToDisplay)

  return (
    <div className="user-recipes-page">
      <div className="container">
        <div className="user-recipes-container">
          <p className=" link back-link" onClick={() => navigate("/profile")}>Back to Profile</p>
          {page === "createdRecipes" && <h1>My Recipes</h1>}
          {page === "likedRecipes" && <h1>Recipes I Like</h1>}
          <Recipes recipes={recipesToDisplay} />
        </div>
      </div>
    </div>
  )
}

export default UserRecipes;