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
	arrayUnion,
	arrayRemove,
	increment,
	deleteDoc,
} from "firebase/firestore";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import trashIcon from "../assets/trash.svg";
import RecipeInfoColumn from "../components/RecipeInfoColumn";
import RecipeStepColumn from "../components/RecipeStepColumn";

function SingleRecipe() {
	const { recipes, dispatch, setRecipeModified, lastVisitedPage } =
		useRecipeContext();
	const [currentUserData, setCurrentUserData] = useState(null);

	const { id } = useParams();
	const navigate = useNavigate();

	const recipe = recipes.find(recipe => recipe.id === id);
	const recipeRef = doc(db, "recipes", id);

	const { loggedIn } = useAuthStatus();
	const auth = getAuth();

	const overlayRef = useRef();

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

	const addStep = async () => {
		await updateDoc(recipeRef, {
			steps: [...recipe.steps, { instruction: "" }],
		});
		setRecipeModified(true);
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

	const showImageOverlay = () => {
		if (!isAuthor) return;
		overlayRef.current.classList.add("show-big-image-overlay");
	};

	const hideImageOverlay = () => {
		if (!isAuthor) return;
		overlayRef.current.classList.remove("show-big-image-overlay");
	};

	const updateImage = async (e, index) => {
		const imageFile = e.target.files[0];
		const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
		if (!imageFile || !ALLOWED_TYPES.includes(imageFile.type)) {
			toast.error("Please upload a png, jpeg or jpg file");
			return;
		}
		const id = uuid();
		const imgRef = ref(storage, `images/${id}`);
		await uploadBytes(imgRef, imageFile);
		const url = await getDownloadURL(imgRef);
		let imageToDelete;
		if (!index) {
			imageToDelete = recipe.image.storageId;
			await updateDoc(recipeRef, { image: { storageId: id, url } });
		} else {
			imageToDelete = recipe.steps[index].image.storageId;
			const updatedSteps = recipe.steps.map((step, i) => {
				if (index !== i) return step;
				return { ...step, image: { storageId: id, url } };
			});
			await updateDoc(recipeRef, { steps: updatedSteps });
		}
		setRecipeModified(true);
		await deleteObject(ref(storage, `images/${imageToDelete}`));
	};

	const removeImage = async index => {
		const imageToDelete = recipe.steps[index].image.storageId;
		const updatedSteps = recipe.steps.map((step, i) => {
			if (index !== i) return step;
			return { ...step, image: null };
		});
		await updateDoc(recipeRef, { steps: updatedSteps });
		setRecipeModified(true);
		await deleteObject(ref(storage, `images/${imageToDelete}`));
	};

	const addImage = async (e, index) => {
		console.log("add image", { index });
		const imageFile = e.target.files[0];
		const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];
		if (!imageFile || !ALLOWED_TYPES.includes(imageFile.type)) {
			toast.error("Please upload a png, jpeg or jpg file");
			return;
		}
		const id = uuid();
		const imgRef = ref(storage, `images/${id}`);
		await uploadBytes(imgRef, imageFile);
		const url = await getDownloadURL(imgRef);
		const updatedSteps = recipe.steps.map((step, i) => {
			if (index !== i) return step;
			return { ...step, image: { storageId: id, url } };
		});
		await updateDoc(recipeRef, { steps: updatedSteps });
		setRecipeModified(true);
	};

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
						{isAuthor && (
							<button className="icon-button delete-button"
								onClick={() => deleteARecipe(recipe.id)}>
								<div className="trash-icon-container">
									<img src={trashIcon} alt="trash icon" />
								</div>
								<p className="delete-text">Delete Recipe</p>
							</button>
						)}
					</div>
					<div className="recipe-body">
						<RecipeInfoColumn recipe={recipe} />
						<RecipeStepColumn recipe={recipe} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default SingleRecipe;
