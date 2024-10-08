import React, { useState, useRef, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const { store, actions } = React.useContext(Context);
    const [query, setQuery] = useState("");
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const searchBarRef = useRef(null);
    const navigate = useNavigate();

    // Manejador para cuando se escriba en la barra de búsqueda
    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value.trim()) {
            actions.searchGames(e.target.value); 
            setDropdownOpen(true); 
        } else {
            setDropdownOpen(false);
        }
    };

    // Manejador para cuando se haga clic fuera del componente
    const handleClickOutside = (event) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
            setDropdownOpen(false);
        }
    };

    // Añade y limpia el evento de clic fuera del componente
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleResultClick = (gameId) => {
        navigate(`/game/${gameId}`);
        setQuery("");
        setDropdownOpen(false);
    };
    return (
        <div className="search-bar-container" ref={searchBarRef}>
            <input
                type="text"
                placeholder="Search for games..."
                value={query}
                onChange={handleInputChange}
                className="search-input"
            />
            {isDropdownOpen && query && store.searchResults.length > 0 && (
                <ul className="search-dropdown">
                    {store.searchResults.map((game) => (
                         <li 
                         key={game.id} 
                         className="search-result-item"
                         onClick={() => handleResultClick(game.id)} // Add click handler
                     >
                         {game.name} {/* Show only the game name */}
                     </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
