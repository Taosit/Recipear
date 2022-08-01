import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRecipeContext } from "../contexts/RecipeContextProvider";
import { useParams, useNavigate, Link } from "react-router-dom";
import cookingIcon from "../assets/cooking.png";
import filledHeartIcon from "../assets/filledHeart.png";
import emptyHeartIcon from "../assets/emptyHeart.png";
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
import EditableText from "../components/EditableText";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import imageIcon from "../assets/image.png";

function SingleRecipe() {
	const { recipes, setRecipes, setRecipeModified, lastVisitedPage } =
		useRecipeContext();
	const [currentUserData, setCurrentUserData] = useState(null);
	const [likedByCurrentUser, setLikedByCurrentUser] = useState(null);
	const [likeCount, setLikeCount] = useState(null);
	const [editing, setEditing] = useState(null);
	const [editFieldValue, setEditFieldValue] = useState(null);

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
		if (!recipe) return;
		setLikeCount(recipe.likes);
	}, [recipe]);

	useEffect(() => {
		if (!loggedIn) return;
		const getUserData = async () => {
			const userRef = doc(db, "users", auth.currentUser.uid);
			const userDocSnap = await getDoc(userRef);
			if (userDocSnap.exists()) {
				setCurrentUserData(userDocSnap.data());
				setLikedByCurrentUser(userDocSnap.data().likedRecipes.includes(id));
			}
		};
		getUserData();
	}, [loggedIn]);

	useEffect(() => {
		if (likedByCurrentUser === null) return;
		const updateLike = async () => {
			const userRef = doc(db, "users", auth.currentUser.uid);
			const userDocSnap = await getDoc(userRef);
			if (userDocSnap.data().likedRecipes.includes(id) === likedByCurrentUser)
				return;
			if (likedByCurrentUser) {
				await updateDoc(userRef, {
					likedRecipes: arrayUnion(id),
				});
				await updateDoc(recipeRef, {
					likes: increment(1),
				});
				setRecipeModified(true);
				setLikeCount(prev => prev + 1);
			} else {
				await updateDoc(userRef, {
					likedRecipes: arrayRemove(id),
				});
				await updateDoc(recipeRef, {
					likes: increment(-1),
				});
				setRecipeModified(true);
				setLikeCount(prev => prev - 1);
			}
		};
		updateLike();
	}, [likedByCurrentUser]);

	const capitalize = str => {
		return str.replace(str[0], str[0].toUpperCase());
	};

	const addStep = async () => {
		await updateDoc(recipeRef, {
			steps: [...recipe.steps, { instruction: "" }],
		});
		setRecipeModified(true);
		setEditing(`step-${recipe.steps.length}-instruction`);
		setEditFieldValue({ [`step-${recipe.steps.length}-instruction`]: "" });
	};

	const modifyLike = like => {
		setLikedByCurrentUser(like);
	};

	const deleteRecipe = async id => {
		try {
			setRecipes(prevRecipes => {
				const newRecipes = prevRecipes.filter(r => r.id !== id);
				return newRecipes;
			});
			navigate("/recipes");
			const recipeRef = doc(db, "recipes", id);
			const docSnapshot = await getDoc(recipeRef);
			if (docSnapshot.exists()) {
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
			} else {
				console.log("doc doesn't exist");
			}
			await deleteDoc(recipeRef);
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

	const cook = () => {
		navigate(`/recipes/${id}/cook`);
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
					<p
						className=" link back-link"
						onClick={() => navigate(lastVisitedPage)}
					>
						Back
					</p>
					<h1 className="recipe-name">{capitalize(recipe.name)}</h1>
					<div className="tag-container">
						{recipe.tags.map((tag, index) => {
							if (
								!tag ||
								tag === "Other" ||
								tag === "For All" ||
								tag === "Main"
							)
								return;
							return (
								<span
									key={index}
									className={`recipe-tag tag${(index % 2) + 1}`}
								>
									{tag}
								</span>
							);
						})}
					</div>
					<div
						className="big-image-container"
						onMouseEnter={showImageOverlay}
						onMouseLeave={hideImageOverlay}
					>
						<img className="big-image" src={recipe.image.url} alt="recipe" />
						{isAuthor && (
							<div
								className="big-image-overlay show-big-image-overlay"
								ref={overlayRef}
							>
								<span className="image-button">
									<label className="image-button-text" htmlFor="image-input">
										Update Image
									</label>
									<input
										type="file"
										id="image-input"
										onChange={e => updateImage(e, null)}
									/>
								</span>
							</div>
						)}
					</div>
					<div className="recipe-description">
						<EditableText
							recipe={recipe}
							setRecipeModified={setRecipeModified}
							isAuthor={isAuthor}
							label="Ingredients"
							field="ingredients"
							editing={editing}
							setEditing={setEditing}
							editFieldValue={editFieldValue}
							setEditFieldValue={setEditFieldValue}
						/>
						<br />
						<EditableText
							recipe={recipe}
							setRecipeModified={setRecipeModified}
							isAuthor={isAuthor}
							label="Seasonings"
							field="seasonings"
							editing={editing}
							setEditing={setEditing}
							editFieldValue={editFieldValue}
							setEditFieldValue={setEditFieldValue}
						/>
						<p className="step-text">
							<label>Steps</label>{" "}
							{isAuthor && (
								<span className="add-step-icon" onClick={addStep}>
									+
								</span>
							)}
						</p>
						<ol className="step-list">
							{recipe.steps.map((step, i) => (
								<li key={i} className="step-row">
									<div className="instruction-col">
										<span className="step-num">{i + 1}. </span>
										<EditableText
											recipe={recipe}
											setRecipeModified={setRecipeModified}
											isAuthor={isAuthor}
											label={null}
											field={`step-${i}-instruction`}
											editing={editing}
											setEditing={setEditing}
											editFieldValue={editFieldValue}
											setEditFieldValue={setEditFieldValue}
										/>
									</div>
									{isAuthor && step.image ? (
										<div className="image-col">
											<img
												className="step-image"
												src={step.image.url}
												alt="step"
											/>
											<div className="step-image-button-group">
												<span className="image-button">
													<label
														className="image-button-text"
														htmlFor={`image${i}-input`}
													>
														Update
													</label>
													<input
														type="file"
														className="image-input"
														id={`image${i}-input`}
														onChange={e => updateImage(e, i)}
													/>
												</span>
												<span className="image-button">
													<label
														className="image-button-text"
														onClick={() => removeImage(i)}
													>
														Remove
													</label>
												</span>
											</div>
										</div>
									) : isAuthor && !step.image ? (
										<div className="empty-image-col">
											<div className="add-image-container">
												<label
													className="image-input-label"
													htmlFor={`recipe${recipe.id}image${i}-input`}
												>
													Add Image
												</label>
												<input
													type="file"
													id={`recipe${recipe.id}image${i}-input`}
													className="image-input"
													onChange={e => addImage(e, i)}
												/>
												<img src={imageIcon} alt="Image" />
											</div>
										</div>
									) : (
										step.image && (
											<div className="image-col">
												<img
													className="step-image"
													src={step.image.url}
													alt="step"
												/>
											</div>
										)
									)}
								</li>
							))}
						</ol>
					</div>
					{likedByCurrentUser === null ? (
						<span className="like-container">{recipe.likes} likes</span>
					) : likedByCurrentUser ? (
						<span
							className="like-container mutable"
							onClick={() => modifyLike(false)}
						>
							<img src={filledHeartIcon} alt="like" />{" "}
							{likeCount ?? recipe.likes}
						</span>
					) : (
						<span
							className="like-container mutable"
							onClick={() => modifyLike(true)}
						>
							<img src={emptyHeartIcon} alt="like" /> like
						</span>
					)}
					<button className="button-orange cook-button" onClick={cook}>
						<div className="cook-icon-container">
							<img className="cook-icon" src={cookingIcon} alt="cook" />
						</div>
						<span className="cook">Cook</span>
					</button>
					{isAuthor && (
						<button
							className="button-red"
							onClick={() => deleteARecipe(recipe.id)}
						>
							Delete
						</button>
					)}
				</div>
			</div>
		</div>
	);
}

export default SingleRecipe;
