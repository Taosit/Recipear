import React, { useRef, useEffect } from "react";

export default function NameField({ recipe, handleChange, showModal }) {
	const nameRef = useRef();

	useEffect(() => {
		if (showModal && !recipe.name) {
			nameRef.current.focus();
		}
	}, [showModal]);

	return (
		<>
			<h3>Give your recipe a name</h3>
			<input
				type="text"
				value={recipe.name}
				required={true}
				ref={nameRef}
				onChange={e => handleChange(e.target.value, "name")}
			/>
		</>
	);
}
