import React, { useState } from 'react';
import './index.css'; // Asegúrate de que esta es la ubicación correcta

const GameInfo = ({ game }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleToggleDescription = () => setShowFullDescription(!showFullDescription);

  return (
    <div>
      <h1 className="game-title">{game.name}</h1>
      <p><strong>Released:</strong> {game.released}</p>
      <p><strong>Genres:</strong> {game.genres.map(genre => genre.name).join(", ")}</p>
      <p><strong>Developer:</strong> {game.developers.map(dev => dev.name).join(", ")}</p>
      <p>
        {showFullDescription || game.description_raw.length <= 1070
          ? game.description_raw
          : `${game.description_raw.substring(0, 1070)}...`}
        {game.description_raw.length > 1070 && (
          <span onClick={handleToggleDescription} className="more-details-link">
            {showFullDescription ? " Show less" : " More details"}
          </span>
        )}
      </p>
    </div>
  );
};

export default GameInfo;
