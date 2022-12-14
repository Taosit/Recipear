import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import editIcon from "../assets/edit.svg";
import doneIcon from "../assets/done.svg";
import cookBookIcon from "../assets/cookbook.svg";
import mealIcon from "../assets/meal.svg";
import addIcon from "../assets/add.svg";
import RecipeModal from "../components/RecipeModal";

export default function Profile() {
	const auth = getAuth();

	const navigate = useNavigate();

	const [changeName, setChangeName] = useState(false);
	const [nameField, setNameField] = useState(auth.currentUser.displayName);
	const [showModal, setShowModal] = useState(false);

	const updateUserName = () => {
		if (changeName) {
			updateProfile(auth.currentUser, {
				displayName: nameField,
			}).then(async () => {
				await updateDoc(doc(db, "users", auth.currentUser.uid), {
					name: nameField,
				});
				toast.success(`Username changed to ${nameField}`);
			});
		} else {
		}
		setChangeName(prev => !prev);
	};

	return (
		<div className="page">
			<div className="narrow-container">
				<div className="profile-header">
						<div className="profile-title-container">
							<h1 className="profile-title">
								Welcome, {auth.currentUser.displayName}!
							</h1>
						</div>
						<hr className="header-seperator" />
					</div>
					<div className="account-info-container">
						<h2 className="account-header">Account Info</h2>
						<div className="account-info">
							<div className="account-input-group">
								<label htmlFor="username">Username:</label>
								<div className="account-name-input-group">
									<input
										type="text"
										id="username"
										className={`profile-input ${
											changeName ? "changing-name" : ""
										}`}
										value={nameField}
										disabled={!changeName}
										onChange={e => setNameField(e.target.value)}
									/>
									<img
										src={changeName ? doneIcon : editIcon}
										alt={changeName ? "Done" : "Edit"}
										className="edit-name-icon"
										tabIndex="0"
										onKeyDown={e => e.key === "Enter" && updateUserName()}
										onClick={updateUserName}
									/>
								</div>
							</div>
							<div className="account-input-group">
								<label>Email:</label>
								<input
									type="text"
									value={auth.currentUser.email}
									disabled={true}
									className="profile-input"
								/>
							</div>
						</div>
					</div>
					<div className="profile-cards">
						<div
							className="category-card"
							tabIndex="0"
							role="button"
							onKeyDown={e => e.key === "Enter" && navigate("/my-recipes")}
							onClick={() => navigate("/my-recipes")}
						>
							<h2 className="category-card-title">My Recipes</h2>
							<div className="card-icon">
								<img src={cookBookIcon} alt="Recipe book" />
							</div>
						</div>
						<div
							className="category-card"
							tabIndex="0"
							role="button"
							onKeyDown={e => e.key === "Enter" && navigate("/liked-recipes")}
							onClick={() => navigate("/liked-recipes")}
						>
							<h2 className="category-card-title">Liked Recipes</h2>
							<div className="card-icon">
								<img src={mealIcon} alt="Recipe book" />
							</div>
						</div>
					</div>
					<div className="add-button-container">
						<div
							className="create-recipe-button"
							tabIndex="0"
							role="button"
							onKeyDown={e => e.key === "Enter" && setShowModal(true)}
							onClick={() => setShowModal(true)}
						>
							<p className="create-recipe">Create New Recipe</p>
							<div className="create-icon">
								<img src={addIcon} alt="Add" />
							</div>
						</div>
					</div>
				</div>
			{showModal && <RecipeModal setShowModal={setShowModal} />}
		</div>
	);
}
