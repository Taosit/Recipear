import React, { useState, useRef, useMemo, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Recipes from "../components/Recipes";
import TopControls from "../components/TopControls";
import { useRecipeContext } from "../contexts/RecipeContextProvider";
import { useProgressiveImage } from "../hooks/useProgressiveImage";
import backgroundImage from "../assets/background.png";
import backgroundImageMin from "../assets/background-min.png";

function Home() {
	const { tags, recipes, loading, setLastVisitedPage } = useRecipeContext();
	const [tagOnHover, setTagOnHover] = useState(null);
	const [controlValues, setControlValues] = useState({filterValue: "", searchValue: "", sortValue: ""})
	const loaded = useProgressiveImage(backgroundImage);

	const filterContainer = useRef();

	const currentRoute = useLocation();
	setLastVisitedPage(currentRoute.pathname);

	const sortRecipes = useCallback(
		recipes => {
			if (controlValues.sortValue === "top") {
				recipes.sort((a, b) => b.likes - a.likes);
			} else {
				recipes.sort((a, b) => b.date - a.date);
			}
			return recipes;
		},
		[controlValues],
	)
	
	let filteredAndSortedRecipes = useMemo(() => {
		if (!controlValues.filterValue && !controlValues.searchValue && !controlValues.sortValue) return recipes;
		let filteredRecipes = recipes;
		if (controlValues.filterValue) {
			filteredRecipes = filteredRecipes.filter(recipe => recipe.tags.includes(controlValues.filterValue));
		}
		if (controlValues.searchValue) {
			filteredRecipes = filteredRecipes.filter(recipe => recipe.name.toLowerCase().includes(controlValues.searchValue) || recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(controlValues.searchValue)));
		}
		if (controlValues.sortValue) {
			filteredRecipes = sortRecipes(filteredRecipes);
		}
		return filteredRecipes;
	}, [controlValues, recipes, sortRecipes]);

	const capitalize = str => {
		return str.replace(str[0], str[0].toUpperCase());
	};

	const handleHoverTagCategory = (tagCategory) => {
		setTagOnHover([tagCategory, tags[tagCategory]]);
	};

	const handleLeaveCategoryTags = e => {
		if (e.clientY < 50) setTagOnHover(null);
	};

	const handleLeaveTags = e => {
		setTagOnHover(null);
	};

	const filterRecipeByTag = async tag => {
		setControlValues(prev => ({...prev, filterValue: tag}));
	};

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
		<>
			<div className="main-container-top">
				<div className="container">
					<div className="main-header">
						<div className="filters" ref={filterContainer}>
							<div
								className="filter-container"
								onMouseLeave={e => handleLeaveCategoryTags(e)}
							>
								{Object.keys(tags).map((tagCategory, i) => (
									<span
										className="tag-category"
										tabIndex="0"
										key={i}
										onKeyDown={e => e.key === "Enter" && handleHoverTagCategory(tagCategory)}
										onMouseEnter={() => handleHoverTagCategory(tagCategory)}
									>
										{capitalize(tagCategory)}
									</span>
								))}
							</div>
							{tagOnHover ? (
								<div
									className={`tags-to-filter-container hover-${tagOnHover[0]}`}
									onMouseLeave={e => handleLeaveTags(e)}
								>
									{tagOnHover[1].map((tag, i) => (
										<span
											className="tag-category"
											tabIndex="0"
											key={i}
											onKeyDown={e => e.key === "Enter" && filterRecipeByTag(tag)}
											onClick={() => filterRecipeByTag(tag)}
										>
											{tag}
										</span>
									))}
								</div>
							) : (
								<TopControls controlValues={controlValues} setControlValues={setControlValues} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div
				className="main-container"
				style={{ backgroundImage: `url(${loaded || backgroundImageMin})` }}
				onTouchStart={() => setTagOnHover(null)}
			>
				<div className="container">
					<div className="main">
						<Recipes recipes={filteredAndSortedRecipes} />
					</div>
				</div>
			</div>
		</>
	);
}

export default Home;
