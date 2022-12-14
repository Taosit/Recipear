import React, { useEffect, useRef, useState } from "react";
import Compressor from "compressorjs";
import { ACTIONS, useRecipeContext } from "../contexts/RecipeContextProvider";
import { v4 as uuid } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { storage, db } from "../firebase.config";
import OverviewField from "./createRecipe/OverviewField";
import IngredientsField from "./createRecipe/IngredientsField";
import StepsField from "./createRecipe/StepsFields";
import TagsField from "./createRecipe/TagsFields";
import ProgressBar from "./createRecipe/ProgressBar";
import StepButtons from "./createRecipe/StepButtons";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { toast } from "react-toastify";

function RecipeModal({ showModal, setShowModal }) {
	const integerMatch = {
		a: 1,
		one: 1,
		two: 2,
		three: 3,
		four: 4,
		five: 5,
		ten: 10,
	};
	const emptyRecipe = {
		name: "",
		time: "",
		difficulty: "Easy",
		image: null,
		seasonings: [{ ingredient: "", amount: "", id: uuid() }, { ingredient: "", amount: "", id: uuid() }],
		ingredients: [{ ingredient: "", amount: "", id: uuid() }, { ingredient: "", amount: "", id: uuid() }],
		steps: [{instruction: "", image: null}],
		tags: [null, null, null, null],
		date: null,
		likes: 0,
	};
	const [newRecipe, setNewRecipe] = useState(emptyRecipe);
	const { dispatch } = useRecipeContext();
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);

	const isMounted = useRef(true);
	const auth = getAuth();

	useEffect(() => {
		if (isMounted) {
			onAuthStateChanged(auth, user => {
				if (user) {
					setNewRecipe({ ...newRecipe, userRef: user.uid });
				}
			});
		}

		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isMounted]);

	const updateRecipe = (inputValue, field) => {
		setNewRecipe(prevRecipe => ({
			...prevRecipe,
			[field]: inputValue,
		}));
	};

	const addRecipeRefToUser = async id => {
		if (!auth.currentUser) return;
		const userRef = doc(db, "users", auth.currentUser.uid);
		await updateDoc(userRef, {
			createdRecipes: arrayUnion(id),
		});
	};

	const compress = (file, options) => {
		return new Promise((resolve, reject) => {
			new Compressor(file, {
				...options,
				success(result) {
					resolve(result);
				},
				error(err) {
					reject(err);
				},
			});
		});
	};

	const getImage = async img => {
		const id = uuid();
		if (img.size > 100000) {
			img = await compress(img, { maxWidth: 500 });
		}
		const imgRef = ref(storage, `images/${id}`);
		await uploadBytes(imgRef, img);
		const url = await getDownloadURL(imgRef);
		return { storageId: id, url };
	};

	const filterInvalidFields = (recipe) => {
		const validSeasonings = recipe.seasonings.filter(
			seasoning => seasoning.ingredient
		);
		const validIngredients = recipe.ingredients.filter(
			ingredient => ingredient.ingredient
		);
		const validSteps = recipe.steps.filter(
			step => step.instruction
		);
		const validTags = recipe.tags.map(
			tag => tag === "Other"? null : tag
		);
		return {...recipe, seasonings: validSeasonings, ingredients: validIngredients, steps: validSteps, tags: validTags};
	}

	const checkEmptyFields = (recipe) => {
		if (!recipe.name) {
			setStep(0);
			return {isValid: false, message: "Please fill in the name field"};
		} else if (!recipe.time) {
			setStep(0);
			return {isValid: false, message: "Please provide the time it takes to make the recipe"};
		}else if (!recipe.image) {
			setStep(0);
			return {isValid: false, message: "Please provide an image for the recipe"};
		}else if (!recipe.seasonings.length) {
			setStep(1);
			return {isValid: false, message: "Please provide at least one seasoning"};
		} else if (!recipe.ingredients.length) {
			setStep(2);
			return {isValid: false, message: "Please provide at least one ingredient"};
		} else if (!recipe.steps.length) {
			setStep(4);
			return {isValid: false, message: "Please provide at least one step"};
		}
		return {isValid: true};
	};

	const getStepPromises = async (steps) => {
		return steps.map(async step => {
			const timeMatchingResult = step.instruction.match(
				/(a|one|two|three|four|five|ten|\d+)(?= min)/i
			);
			let stepCopy = { ...step };
			if (timeMatchingResult) {
				if (isNaN(parseInt(timeMatchingResult[0]))) {
					stepCopy.time = integerMatch[timeMatchingResult[0]];
				} else {
					stepCopy.time = +timeMatchingResult[0];
				}
			}
			if (!step.image) return stepCopy;
			const image = await getImage(step.image.file);
			return { ...stepCopy, image };
		});
	};

	const createRecipe = async e => {
		e.preventDefault();
		console.log("creating recipe")
		const filteredRecipe = filterInvalidFields(newRecipe);
		const validity = checkEmptyFields(filteredRecipe);
		console.log(validity)
		if (!validity.isValid) {
			toast.error(validity.message);
			return;
		}
		setLoading(true);
		console.log("recipe is valid")
		const finalImage = await getImage(filteredRecipe.image.file);
		const stepsWithImagesPromise = await getStepPromises(filteredRecipe.steps);

		Promise.all(stepsWithImagesPromise).then(async stepsWithImages => {
			const recipeId = uuid();
			const finalRecipe = {
				...filteredRecipe,
				steps: stepsWithImages,
				name: filteredRecipe.name.toLowerCase().trim(),
				image: finalImage,
				id: recipeId,
				date: new Date(),
			};
			console.log(finalRecipe);
			dispatch({ type: ACTIONS.ADD_RECIPE, payload: finalRecipe });
			await setDoc(doc(db, "recipes", recipeId), finalRecipe);
			await addRecipeRefToUser(recipeId);
			toast.success("Successfully added a new recipe");
			setLoading(false);
			closeModal();
		});
	};

	const closeModal = () => {
		setStep(0);
		setShowModal(false);
		setNewRecipe(emptyRecipe);
	};

	const showField = () => {
		switch (step) {
			case 0:
				return (
					<OverviewField
						recipe={newRecipe}
						updateRecipe={updateRecipe}
						showModal={showModal}
					/>
				);
			case 1:
				return (
					<IngredientsField
						type="seasonings"
						recipe={newRecipe}
						updateRecipe={updateRecipe}
					/>
				);
			case 2:
				return (
					<IngredientsField
						type="ingredients"
						recipe={newRecipe}
						updateRecipe={updateRecipe}
					/>
				);
			case 3:
				return (
					<TagsField recipe={newRecipe} updateRecipe={updateRecipe} />
				);
			case 4:
				return <StepsField recipe={newRecipe} updateRecipe={updateRecipe} />;
		}
	};

	const prevStep = e => {
		e.preventDefault();
		setStep(prev => prev - 1);
	};

	const nextStep = e => {
		e.preventDefault();
		if (step === 4) createRecipe(e);
		else setStep(prev => prev + 1);
	};

	return (
		<>
			<div className="overlay" hidden={!showModal}>
				<div className="modal" hidden={!showModal}>
					<span className="close-modal"
					role="button"
					tabIndex="0"
					onKeyDown={e => e.key === "Enter" && closeModal()}
					onClick={closeModal}>
						&times;
					</span>
					<form className="recipe-form">
						<ProgressBar step={step} />
						<div className="create-recipe-container">{showField()}</div>
						<StepButtons step={step} prevStep={prevStep} nextStep={nextStep} loading={loading}/>
					</form>
				</div>
			</div>
		</>
	);
}

export default RecipeModal;
