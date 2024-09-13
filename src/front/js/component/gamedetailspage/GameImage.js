import React from 'react';
import './index.css';

const GameImage = ({ game }) => {
  const getMetacriticClass = (score) => {
    const decimalScore = score / 10;
    if (decimalScore === 0) return "metacritic-blue";
    if (decimalScore < 4) return "metacritic-red";
    if (decimalScore < 8) return "metacritic-orange";
    return "metacritic-green";
  };

  const formatMetacritic = (score) => (score === 0 ? "N/A" : (score / 10).toFixed(1));

  return (
    <div>
      <img src={game.background_image} alt={game.name} className="game-image" />
      <div className={`metacritic-score ${getMetacriticClass(game.metacritic)}`}>
        {formatMetacritic(game.metacritic)}
      </div>
      <h3 className="game-platform">Platforms</h3>
      {game.platforms && game.platforms.length > 0 ? (
        <ul className="platforms-list">
          {game.platforms.map((platform, index) => (
            <li key={index}>{platform.platform.name}</li>
          ))}
        </ul>
      ) : (
        <p>No platform information available.</p>
      )}
    </div>
  );
};

export default GameImage;