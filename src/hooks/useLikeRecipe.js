import { useEffect, useState } from "react";
import { ACTIONS, useRecipeContext } from "../contexts/RecipeContextProvider";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import {
	doc,
	getDoc,
	updateDoc,
	arrayUnion,
	arrayRemove,
	increment,
} from "firebase/firestore";


export function useLikeRecipe(recipe) {
    const {  dispatch } = useRecipeContext();
    const [liked, setLiked] = useState(null);
    const { id } = recipe;

    const recipeRef = doc(db, "recipes", id);
    const auth = getAuth();

	const updateLike = async () => {
		const userRef = doc(db, "users", auth.currentUser.uid);
		const userDocSnap = await getDoc(userRef);
		if (liked === null) {
			setLiked(userDocSnap.data().likedRecipes.includes(id));
			return;
		}
		if (userDocSnap.data().likedRecipes.includes(id) === liked)
			return;
		if (liked) {
			dispatch({ type: ACTIONS.LIKE_RECIPE, payload: id });
			await updateDoc(userRef, {
				likedRecipes: arrayUnion(id),
			});
			await updateDoc(recipeRef, {
				likes: increment(1),
			});
		} else {
			dispatch({ type: ACTIONS.UNLIKE_RECIPE, payload: id });
			await updateDoc(userRef, {
				likedRecipes: arrayRemove(id),
			});
			await updateDoc(recipeRef, {
				likes: increment(-1),
			});
		}			
	};

    useEffect(() => {		
		updateLike();
	}, [liked]);

    const toggleLike = () => {
		if (!auth.currentUser) return;
        setLiked(prev => !prev);
    }
  
    return {liked, toggleLike }
  }