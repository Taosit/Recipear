import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRecipeContext } from "../contexts/RecipeContextProvider";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { getAuth } from "firebase/auth";
import { db, storage } from "../firebase.config";
import {
	doc,
	getDoc,
	updateDoc,
	arrayRemove,
	deleteDoc,
} from "firebase/firestore";
import {
	deleteObject,
	ref,
} from "firebase/storage";
import { toast } from "react-toastify";
import trashIcon from "../assets/trash.svg";
import editIcon from "../assets/edit.svg";
import RecipeInfoColumn from "../components/RecipeInfoColumn";
import RecipeStepColumn from "../components/RecipeStepColumn";
import RecipeModal from "../components/RecipeModal";

function SingleRecipe() {
	const { recipes, dispatch, lastVisitedPage } =
		useRecipeContext();
	const [currentUserData, setCurrentUserData] = useState(null);
	const [showModal, setShowModal] = useState(false);

	const { id } = useParams();
	const navigate = useNavigate();

	const recipe = recipes.find(recipe => recipe.id === id);
	const recipeRef = doc(db, "recipes", id);

	const { loggedIn } = useAuthStatus();
	const auth = getAuth();

	const isAuthor = useMemo(() => {
		if (!currentUserData || !recipe) return false;
		return currentUserData.createdRecipes.includes(recipe.id);
	}, [currentUserData, recipe]);

	useEffect(() => {
		if (!loggedIn) return;
		const getUserData = async () => {
			const userRef = doc(db, "users", auth.currentUser.uid);
			const userDocSnap = await getDoc(userRef);
			if (userDocSnap.exists()) {
				setCurrentUserData(userDocSnap.data());
			}
		};
		getUserData();
	}, [loggedIn]);

	const capitalize = str => {
		return str.replace(str[0], str[0].toUpperCase());
	};

	const deleteRecipe = async id => {
		try {
			dispatch({ type: "DELETE_RECIPE", payload: id });
			navigate("/recipes");
			const recipeRef = doc(db, "recipes", id);
			const docSnapshot = await getDoc(recipeRef);
			if (!docSnapshot.exists()) return;
			const finishedImage = docSnapshot.data().image;
			await deleteObject(ref(storage, `images/${finishedImage.storageId}`));
			const stepImagePromises = docSnapshot
				.data()
				.steps.filter(step => step.image)
				.map(
					async step =>
						await deleteObject(ref(storage, `images/${step.image.storageId}`))
				);
			await Promise.all(stepImagePromises);
			await deleteDoc(recipeRef);
			toast.success("Successfully deleted recipe");
		} catch (e) {
			console.log(e);
		}
	};

	const deleteARecipe = async id => {
		if (!currentUserData?.createdRecipes.includes(recipe.id)) return;
		await deleteRecipe(id);
		await updateDoc(doc(db, "users", currentUserData.id), {
			createdRecipes: arrayRemove(recipe.id),
		});
	};

	if (recipes.length === 0 || !recipe)
		return (
			<div className="single-recipe-container">
				<div className="loader"></div>
			</div>
		);

	return (
		<div className="single-recipe-container">
			<div className="container">
				<div className="single-recipe">
					<span
						className="link back-link"
						tabIndex="0"
						onKeyDown={e => e.key === "Enter" && navigate(lastVisitedPage)}
						onClick={() => navigate(lastVisitedPage)}
					>
						Back
					</span>
					<div className="recipe-header-container">
						<div className="recipe-name-container">
							<h1 className="recipe-name">{capitalize(recipe.name)}</h1>
						</div>
						{isAuthor && (<div className="recipe-top-buttons">
							<button className="icon-button column"
								onClick={() => setShowModal(true)}>
									<div className="edit-icon-container">
									<img src={editIcon} alt="pen and paper" />
								</div>
								<p className="edit-text">Edit</p>
							</button>
							<button className="icon-button column"
								onClick={() => deleteARecipe(recipe.id)}>
								<div className="trash-icon-container">
									<img src={trashIcon} alt="trash icon" />
								</div>
								<p className="delete-text">Delete</p>
							</button>
						</div>)}
					</div>
					<div className="recipe-body">
						<RecipeInfoColumn recipe={recipe} />
						<RecipeStepColumn recipe={recipe} />
					</div>
				</div>
			</div>
			{showModal && <RecipeModal recipe={recipe} setShowModal={setShowModal} />}
		</div>
	);
}

export default SingleRecipe;
