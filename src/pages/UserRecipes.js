import {useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
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

  useEffect(() => {
    if (window.location.href.endsWith("my-recipes")) {
      getDoc(doc(db, "users", auth.currentUser.uid))
        .then(snapshot => {
          console.log(snapshot.data())
          const recipeIds = snapshot.data().createdRecipes;
          Promise.all(recipeIds.map(id => getDoc(doc(db, "recipes", id))))
            .then(snapshots => snapshots.forEach(snapshot => setRecipesToDisplay(prev => [...prev, snapshot.data()])))
        })
    } else if (window.location.href.endsWith("liked-recipes")) {
      getDoc(doc(db, "users", auth.currentUser.uid))
        .then(snapshot => {
          console.log(snapshot.data())
          const recipeIds = snapshot.data().likedRecipes;
          Promise.all(recipeIds.map(id => getDoc(doc(db, "recipes", id))))
            .then(snapshots => snapshots.forEach(snapshot => setRecipesToDisplay(prev => [...prev, snapshot.data()])))
        })
    }
  }, [])

  console.log(recipesToDisplay)

  return (
    <div className="user-recipes-page">
      <div className="container">
        <div className="user-recipes-container">
          <p className=" link back-link" onClick={() => navigate("/profile")}>Back to Profile</p>
          {window.location.href.endsWith("my-recipes") && <h1>My Recipes</h1>}
          {window.location.href.endsWith("liked-recipes") && <h1>Recipes I Like</h1>}
          <Recipes recipes={recipesToDisplay} />
        </div>
      </div>
    </div>
  )
}

export default UserRecipes;