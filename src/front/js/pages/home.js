import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/home.css";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (store.games.length === 0) {
            actions.getGames();
        }
    }, [store.games.length, actions]);

    // Agrupar juegos en bloques de 8
    const groupedGames = [];
    for (let i = 0; i < store.games.length && i < 120; i += 8) {
        groupedGames.push(store.games.slice(i, i + 8));
    }

    const handleSlide = (selectedIndex) => {
        setCurrentIndex(selectedIndex);

        const maxGames = 120;
        const loadedGames = store.games.length;

        if (loadedGames < maxGames && (selectedIndex + 1) * 8 >= loadedGames) {
            actions.loadMoreGames();
        }
    };

    const getMetacriticClass = (score) => {
        const decimalScore = score / 10;
        if (decimalScore === 0) return "metacritic-blue";
        if (decimalScore < 4) return "metacritic-red";
        if (decimalScore < 8) return "metacritic-orange";
        return "metacritic-green";
    };
 // Dividir por 10 y mostrar un decimal
    const formatMetacritic = (score) => {
        const decimalScore = score / 10;
        return decimalScore === 0 ? "N/A" : decimalScore.toFixed(1);
    };
    const navigateToDetails = (id) => {
        navigate(`/game/${id}`);
    };

    return (
        <Container className="my-4">
            <h1 className="heading">Games</h1>'\n'
            {store.loading && <p>Loading...</p>}
            <Carousel 
                controls={true} 
                indicators={true} 
                interval={null} 
                onSlide={handleSlide}
            >
                {groupedGames.map((group, index) => (
                    <Carousel.Item key={index}>
                        <Row className="justify-content-center"> 
                            {group.map((game) => (
                                <Col md={3} key={game.id} className="d-flex justify-content-center mb-4">
                                    <div className="card" style={{ width: '100%' }}>
                                        <img src={game.background_image} alt={game.name} className="card-img-top" />
                                        <div className="card-body">
                                            <h5 className="card-title">{game.name}</h5>
                                            <p className="card-text">Released: {game.released}</p>
                                            <p className="card-text">Genres: {game.genres.map(genre => genre.name).join(', ')}</p>
                                            <button className="card-button" onClick={() => navigateToDetails(game.id)}>Details</button>
                                        </div>
                                        <div className={`metacritic-score ${getMetacriticClass(game.metacritic)}`}>
                                            {formatMetacritic(game.metacritic)}
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
};
