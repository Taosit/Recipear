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

function UserRecipes() {
	const { setLastVisitedPage } = useRecipeContext();
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
			<div
				style={{ backgroundImage: `url(${loaded || backgroundImageMin})` }}
				className="loading-container"
			>
				<div className="loader"></div>
			</div>
		);

	return (
		<div
			style={{ backgroundImage: `url(${loaded || backgroundImageMin})` }}
			className="user-recipes-page"
		>
			<div className="container">
				<div className="user-recipes-container">
					<p className=" link back-link" onClick={() => navigate("/profile")}>
						Back to Profile
					</p>
					{page === "createdRecipes" && <h1>My Recipes</h1>}
					{page === "likedRecipes" && <h1>Favorite Recipes</h1>}
					<Recipes recipes={recipesToDisplay} />
				</div>
			</div>
		</div>
	);
}

export default UserRecipes;
