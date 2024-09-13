import React, { useContext, useEffect, useState } from "react";
import { Context } from '../../store/appContext';
import { Container } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { GameCarousel } from "./GameCarousel";
import "./index.css";

export const Games = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        if (store.games.length === 0) {
            actions.getGames();
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [store.games.length, actions]);

    const groupedGames = [];
    for (let i = 0; i < store.games.length && i < 120; i += 8) {
        groupedGames.push(store.games.slice(i, i + 8));
    }

    const handleSlide = (selectedIndex) => {
        const maxGames = 120;
        const loadedGames = store.games.length;

        if (loadedGames < maxGames && (selectedIndex + 1) * 8 >= loadedGames) {
            actions.loadMoreGames();
        }

        if (isMobile) {
            window.scrollTo(0, 0);
        }
    };

    return (
        <Container className="my-4">
            <h1 className="heading">Games</h1>
            <br />
            {store.loading && <p>Loading...</p>}
            <GameCarousel
                groupedGames={groupedGames}
                handleSlide={handleSlide}
                navigateToDetails={(id) => navigate(`/game/${id}`)}
            />
        </Container>
    );
};
