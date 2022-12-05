import React, { useEffect, useRef, useState } from "react";
import Compressor from "compressorjs";
import { useRecipeContext } from "../contexts/RecipeContextProvider";
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
		seasonings: [{ name: "", amount: "" }, { name: "", amount: "" }],
		ingredients: [{ name: "", amount: "" }, { name: "", amount: "" }],
		steps: [""],
		tags: [],
		date: null,
		likes: 0,
	};
	const [newRecipe, setNewRecipe] = useState(emptyRecipe);
	const { setRecipes } = useRecipeContext();
	const initialTags = {
		protein: null,
		nutrition: null,
		meal: null,
		region: null,
		flavor: null,
	};
	const [tags, setTags] = useState(initialTags);
	const [step, setStep] = useState(0);
	const [loading, setLoading] = useState(false);
	const [shouldButtonDisable, setShouldButtonDisable] = useState([false, false]);

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

	const checkEmptyFields = () => {
		if (!newRecipe.name) {
			setStep(0);
			return false;
		} else if (!newRecipe.ingredients || !newRecipe.seasonings) {
			setStep(2);
			return false;
		} else if (!newRecipe.steps[0].instruction) {
			setStep(3);
			return false;
		} else if (!newRecipe.image) {
			setStep(4);
			return false;
		}
		return true;
	};

	const createRecipe = async e => {
		e.preventDefault();
		if (!checkEmptyFields()) {
			toast.error("Please fill in all the fields");
			return;
		}
		setShouldButtonDisable([true, true]);
		setLoading(true);

		const finalImage = await getImage(newRecipe.image.file);

		const validSteps = newRecipe.steps.filter(
			step => step.instruction && step.instruction.length !== 0
		);

		const stepsWithImagesPromise = validSteps.map(async step => {
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

		Promise.all(stepsWithImagesPromise).then(async stepsWithImages => {
			const recipeId = uuid();
			const finalRecipe = {
				...newRecipe,
				steps: stepsWithImages,
				name: newRecipe.name.toLowerCase().trim(),
				image: finalImage,
				id: recipeId,
				date: new Date(),
			};
			console.log(finalRecipe);
			setRecipes(prev => [...prev, finalRecipe]);
			await setDoc(doc(db, "recipes", recipeId), finalRecipe);
			await addRecipeRefToUser(recipeId);
			toast.success("Successfully added a new recipe");
			setLoading(false);
			closeModal();
		});
	};

	const closeModal = () => {
		setTags(initialTags);
		setStep(0);
		setShowModal(false);
		setNewRecipe(emptyRecipe);
		setShouldButtonDisable([false, false]);
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
					<TagsField tags={tags} setTags={setTags} updateRecipe={updateRecipe} />
				);
			case 4:
				return <StepsField recipe={newRecipe} setRecipe={setNewRecipe} />;
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
				<div className="recipe-modal" hidden={!showModal}>
					<span className="close-modal" onClick={closeModal}>
						&times;
					</span>
					<form className="recipe-form">
						<ProgressBar step={step} />
						<div className="create-recipe-container">{showField()}</div>
						<StepButtons step={step} prevStep={prevStep} nextStep={nextStep} shouldButtonDisable={shouldButtonDisable} loading={loading}/>
					</form>
				</div>
			</div>
		</>
	);
}

export default RecipeModal;
