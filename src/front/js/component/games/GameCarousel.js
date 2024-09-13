import React from "react";
import { Carousel, Row, Col } from 'react-bootstrap';
import { GameCard } from "./GameCard"; 
import "./index.css";
export const GameCarousel = ({ groupedGames, handleSlide, navigateToDetails }) => (
    <Carousel controls={true} indicators={true} interval={null} onSlide={handleSlide}>
        {groupedGames.map((group, index) => (
            <Carousel.Item key={index}>
                <Row className="justify-content-center">
                    {group.map((game) => (
                        <Col md={3} key={game.id} className="d-flex justify-content-center mb-4">
                            <GameCard game={game} navigateToDetails={navigateToDetails} />
                        </Col>
                    ))}
                </Row>
            </Carousel.Item>
        ))}
    </Carousel>
);
