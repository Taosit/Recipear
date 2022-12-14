import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getAuth } from "firebase/auth";
import { useProgressiveImage } from "../hooks/useProgressiveImage";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase.config";
import Recipes from "../components/Recipes";
import { useRecipeContext } from "../contexts/RecipeContextProvider";
import backgroundImage from "../assets/background.png";
import backgroundImageMin from "../assets/background-min.png";
import boxIcon from "../assets/empty-box.svg";
import RecipeModal from "../components/RecipeModal";

function UserRecipes() {
	const { setLastVisitedPage } = useRecipeContext();
	const [showModal, setShowModal] = useState(false);

	const loaded = useProgressiveImage(backgroundImage);
	const auth = getAuth();

	const navigate = useNavigate();
	const currentRoute = useLocation();
	setLastVisitedPage(currentRoute.pathname);

	const [recipesToDisplay, setRecipesToDisplay] = useState([]);
	const [loading, setLoading] = useState(true);

	const page = window.location.href.endsWith("my-recipes")
		? "createdRecipes"
		: "likedRecipes";

	useEffect(() => {
		if (!page) return;
		setLoading(true);
		const getRecipes = () => {
			return getDoc(doc(db, "users", auth.currentUser.uid)).then(
				async snapshot => {
					const recipeIds = snapshot.data()[page];
					return Promise.all(
						recipeIds.map(id => getDoc(doc(db, "recipes", id)))
					).then(snapshots => {
						snapshots.forEach(snapshot => {
							if (snapshot.exists()) {
								setRecipesToDisplay(prev => [...prev, snapshot.data()]);
							}
						});
						setLoading(false);
					});
				}
			);
		};
		getRecipes();
		return setRecipesToDisplay([]);
	}, [page]);

	if (loading)
		return (
			<div className="page">
				<div className="loader"></div>
			</div>
		);

	if (!recipesToDisplay.length) {
		return <div className="page">
			<div className="container">
				<div className="empty-state">
					{page === "createdRecipes" && <h1 className="empty-state-title">You haven't created any recipes yet.</h1>}
					{page === "likedRecipes" && <h1 className="empty-state-title">You haven't saved any recipes yet.</h1>}
					<img src={boxIcon} alt="empty box" className="empty-state-icon" />
					{page === "createdRecipes" && <button onClick={() => setShowModal(true)} className="border-button empty-state-button">Create My First Recipe</button>}
					{page === "likedRecipes" && <button onClick={() => navigate("/recipes")} role="link" className="border-button empty-state-button">Browse Recipes</button>}
				</div>
			</div>
			{showModal && <RecipeModal setShowModal={setShowModal} />}
		</div>
	}

	return (
		<div className="page">
			<div className="container">
				<div className="user-recipes-container">
					{page === "createdRecipes" && <h1 className="user-recipe-title">My Recipes</h1>}
					{page === "likedRecipes" && <h1 className="user-recipe-title">Favorite Recipes</h1>}
					<hr className="header-seperator" />
					<div className="user-recipes">
						<Recipes recipes={recipesToDisplay} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserRecipes;
