import React from "react";
import { Button } from "react-bootstrap";
import "./index.css";

export const GameCard = ({ game, navigateToDetails }) => {
    const getMetacriticClass = (score) => {
        const decimalScore = score / 10;
        if (decimalScore === 0) return "metacritic-blue";
        if (decimalScore < 4) return "metacritic-red";
        if (decimalScore < 8) return "metacritic-orange";
        return "metacritic-green";
    };

    const formatMetacritic = (score) => {
        const decimalScore = score / 10;
        return decimalScore === 0 ? "N/A" : decimalScore.toFixed(1);
    };

    return (
        <div className="card-games" style={{ width: '100%' }}>
            <div className="card-games-image-container">
                <img src={game.background_image} alt={game.name} className="card-games-img-top" />
                <div className="metacritic-wrapper">
                    <div className={`metacritic-score ${getMetacriticClass(game.metacritic)}`}>
                        {formatMetacritic(game.metacritic)}
                    </div>
                </div>
            </div>
            <div className="card-games-body">
                <h5 className="card-title">{game.name}</h5>
                <p className="card-text">Released: {game.released}</p>
                <p className="card-text">Genres: {game.genres.map(genre => genre.name).join(', ')}</p>
                <br />
                <Button className="card-button" onClick={() => navigateToDetails(game.id)}>Details</Button>
            </div>
        </div>
    );
};
