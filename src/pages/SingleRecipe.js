import React, {useState, useEffect, useMemo} from "react"
import {useRecipeContext} from "../contexts/RecipeContextProvider";
import {useParams, useNavigate, Link} from "react-router-dom";
import cookingIcon from "../assets/cooking.png"
import filledHeartIcon from "../assets/filledHeart.png"
import emptyHeartIcon from "../assets/emptyHeart.png"
import {useAuthStatus} from "../hooks/useAuthStatus";
import {getAuth} from "firebase/auth";
import {db} from "../firebase.config";
import {doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment} from "firebase/firestore";


function SingleRecipe() {
  const {recipes, deleteRecipe, setRecipeModified, lastVisitedPage} = useRecipeContext()
  const [currentUserData, setCurrentUserData] = useState(null)
  const [likedByCurrentUser, setLikedByCurrentUser] = useState(null)
  const [likeCount, setLikeCount] = useState(null)

  const {id} = useParams();
  const navigate = useNavigate()

  const recipe = recipes.find(recipe => recipe.id === id);
  const recipeRef = doc(db, "recipes", id);

  const {loggedIn} = useAuthStatus()
  const auth = getAuth()

  useEffect(() => {
    if (!recipe) return;
    setLikeCount(recipe.likes)
  }, [recipe])

  useEffect(() => {
    if (!loggedIn) return;
    const getUserData = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid)
      const userDocSnap = await getDoc(userRef)
      if (userDocSnap.exists()) {
        setCurrentUserData(userDocSnap.data())
        setLikedByCurrentUser(userDocSnap.data().likedRecipes.includes(id))
      }

    }
    getUserData()
  }, [loggedIn])

  useEffect(() => {
    if (likedByCurrentUser === null) return;
    const updateLike = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid)
      const userDocSnap = await getDoc(userRef)
      if (userDocSnap.data().likedRecipes.includes(id) === likedByCurrentUser) return
      if (likedByCurrentUser) {
        await updateDoc(userRef, {
          likedRecipes: arrayUnion(id)
        })
        await updateDoc(recipeRef, {
          likes: increment(1)
        })
        setRecipeModified(true);
        setLikeCount(prev => prev + 1)
      } else {
        await updateDoc(userRef, {
          likedRecipes: arrayRemove(id)
        })
        await updateDoc(recipeRef, {
          likes: increment(-1)
        })
        setRecipeModified(true);
        setLikeCount(prev => prev - 1)
      }
    }
    updateLike()
  }, [likedByCurrentUser])

  const capitalize = (str) => {
    return str.replace(str[0], str[0].toUpperCase())
  }

  const modifyLike = (like) => {
    setLikedByCurrentUser(like);
  }

  const deleteARecipe = async (id) => {
    if (!currentUserData?.createdRecipes.includes(recipe.id)) return;
    deleteRecipe(id)
    await updateDoc(doc(db, "users", currentUserData.id), {
      createdRecipes: arrayRemove(recipe.id)
    });
    navigate("/recipes")
  }

  const cook = () => {
    navigate(`/recipes/${id}/cook`)
  }

  if (recipes.length === 0 || !recipe) return <h3>Loading</h3>

  return (
    <div className="single-recipe-container">
      <div className="container">
        <div className="single-recipe">
          <p className=" link back-link" onClick={() => navigate(lastVisitedPage)}>Back</p>
          <h1>{capitalize(recipe.name)}</h1>
          <div className="tag-container">
            {
              recipe.tags.map((tag, index) => {
                if (!tag || tag === "Other" || tag === "For All" || tag === "Main") return;
                return <span key={index} className={`recipe-tag tag${index % 2 + 1}`}>{tag}</span>
              })
            }
          </div>
          <div className="big-image-container">
            <img className="big-image" src={recipe.image} alt="recipe"/>
          </div>
          <div className="recipe-description">
            <p>Ingredients: {recipe.ingredientStr}</p>
            <p>Seasonings: {recipe.seasonings}</p>
            <p>Steps</p>
            <ol className="step-list">
              {recipe.steps.map((step, i) => (
                <li key={i} className="step-row">
                  <div className="instruction-col">
                    <span className="stem-num">{i + 1}. </span>
                    <span className="step-instruction">{step.instruction}</span>
                    {step.time && <span className="time-tag">{step.time} mins</span>}
                  </div>
                  {step.image && <div className="image-col">
                    <img className="step-image" src={step.image} alt="step"/>
                  </div>}
                </li>
              ))}
            </ol>
          </div>
          {likedByCurrentUser === null ?
            <span className="like-container">{recipe.likes} likes</span>
            :
            likedByCurrentUser ?
              <span className="like-container mutable" onClick={() => modifyLike(false)}>
                <img src={filledHeartIcon} alt="like"/> {likeCount ?? recipe.likes}
              </span>
              :
              <span className="like-container mutable" onClick={() => modifyLike(true)}>
                <img src={emptyHeartIcon} alt="like"/> like
              </span>
          }
          <button className="button-orange cook-button" onClick={cook}>
            <img src={cookingIcon} alt="cook"/>
            <span className="cook">Cook</span>
          </button>
          {currentUserData?.createdRecipes.includes(recipe.id) &&
            <button className="button-red delete-recipe-button" onClick={() => deleteARecipe(recipe.id)}>Delete</button>}
        </div>
      </div>
    </div>
  );
}

export default SingleRecipe;