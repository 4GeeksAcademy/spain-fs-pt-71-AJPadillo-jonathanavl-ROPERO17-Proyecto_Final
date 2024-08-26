// src/component/SearchBar.jsx
import React, { useState } from "react";
import { Context } from "../store/appContext";

const SearchBar = () => {
	const { store, actions } = React.useContext(Context);
	const [query, setQuery] = useState("");

	// Manejador para cuando se escriba en la barra de búsqueda
	const handleInputChange = (e) => {
		setQuery(e.target.value);
		if (e.target.value.trim()) {
			actions.searchGames(e.target.value); // Llama a la acción de búsqueda
		}
	};

	return (
		<div className="search-bar-container">
			<input
				type="text"
				placeholder="Search for games..."
				value={query}
				onChange={handleInputChange}
				className="search-input"
			/>
			{query && store.searchResults.length > 0 && (
				<ul className="search-dropdown">
					{store.searchResults.map((game) => (
						<li key={game.id} className="search-result-item">
							{game.name} {/* Muestra solo el nombre del juego */}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SearchBar;
