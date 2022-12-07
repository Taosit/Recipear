import { useEffect, useState } from "react";
import { useRecipeContext } from "../contexts/RecipeContextProvider";
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
    const { setRecipeModified } = useRecipeContext();
    const [liked, setLiked] = useState(null);
    const { id, likes } = recipe;
    const [likeCount, setLikeCount] = useState(likes);

    const recipeRef = doc(db, "recipes", id);
    const auth = getAuth();

    useEffect(() => {
		if (liked === null) return;
		const updateLike = async () => {
			const userRef = doc(db, "users", auth.currentUser.uid);
			const userDocSnap = await getDoc(userRef);
			if (userDocSnap.data().likedRecipes.includes(id) === liked)
				return;
			let change = 1;
			if (liked) {
				await updateDoc(userRef, {
					likedRecipes: arrayUnion(id),
				});
			} else {
				await updateDoc(userRef, {
					likedRecipes: arrayRemove(id),
				});
				change = -1;
			}
			await updateDoc(recipeRef, {
				likes: increment(change),
			});
			setRecipeModified(true);
			setLikeCount(prev => prev + change);
		};
		updateLike();
	}, [liked]);

    const toggleLike = () => {
        setLiked(prev => !prev);
    }
  
    return {liked, toggleLike, likeCount}
  }