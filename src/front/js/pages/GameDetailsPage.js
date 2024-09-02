import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/details.css";

export const GameDetailsPage = () => {
    const { store, actions } = useContext(Context);
    const { gameId } = useParams();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [newReview, setNewReview] = useState({ title: "", comment: "" });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await actions.getGameById(gameId);
                await actions.getReviewsForGame(gameId);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [gameId, actions]);

    const game = store.gameDetails;
    const currentUser = store.currentUser; // Asumiendo que tienes el usuario actual en el estado

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

    const handleToggleDescription = () => {
        setShowFullDescription(prev => !prev);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewReview(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        try {
            await actions.addReview({
                game_id: game.id,
                user_id: currentUser.id,  // ID del usuario actual
                title: newReview.title,
                comment: newReview.comment
            });
            setNewReview({ title: "", comment: "" });
            setShowModal(false);
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };
    
    
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setNewReview({ title: "", comment: "" });
        setShowModal(false);
    };

    return (
        <Container className="game-details-container">
            {game ? (
                <>
                    <Row className="game-details-row">
                        <Col md={4} className="position-relative">
                            <img src={game.background_image} alt={game.name} className="game-image" />
                            <div className={`metacritic-score ${getMetacriticClass(game.metacritic)}`}>
                                {formatMetacritic(game.metacritic)}
                            </div>
                            <h3 className="game-platform">Platforms</h3>
                            {game.platforms && game.platforms.length > 0 ? (
                                <ul className="platforms-list">
                                    {game.platforms.map((platform, index) => (
                                        <li key={index}>
                                            {platform.platform.name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No platform information available.</p>
                            )}
                        </Col>
                        <Col md={8}>
                            <h1 className="game-title">{game.name}</h1>
                            <p className="game-text"><strong>Released:</strong> {game.released}</p>
                            <p className="game-text"><strong>Genres:</strong> {game.genres.map(genre => genre.name).join(', ')}</p>
                            <p className="game-text"><strong>Developer:</strong> {game.developers.map(dev => dev.name).join(', ')}</p>
                            <p className="game-text">
                                {showFullDescription || game.description_raw.length <= 1070
                                    ? game.description_raw
                                    : `${game.description_raw.substring(0, 1070)}...`}
                                {game.description_raw.length > 1070 && (
                                    <span className="more-details-link" onClick={handleToggleDescription}>
                                        {showFullDescription ? ' Show less' : ' More details'}
                                    </span>
                                )}
                            </p>
                        </Col>
                    </Row>
                    <hr className="separator" />
                    <Row className="align-items-center">
                        <Col>
                            <h3 className="game-subtitle">User Reviews</h3>
                        </Col>
                        <Col className="text-end">
                            {store.isLoggedIn && (
                                <Button variant="primary" onClick={handleOpenModal}>
                                    Add Review
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {store.reviews.length > 0 ? (
                                store.reviews.map((review, index) => (
                                    <div key={index} className="review-card">
                                        <p><strong>{review.user_name}</strong> - {new Date(review.date).toLocaleDateString()}</p>
                                        <p>{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available.</p>
                            )}
                        </Col>
                    </Row>

                    {/* Modal para añadir reseñas */}
                    <Modal show={showModal} onHide={handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Add Review</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmitReview}>
                                <Form.Group controlId="formReviewTitle">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter review title"
                                        name="title"
                                        value={newReview.title}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formReviewComment">
                                    <Form.Label>Comment</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Enter review comment"
                                        name="comment"
                                        value={newReview.comment}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Submit Review
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </>
            ) : (
                <p>Loading game details...</p>
            )}
        </Container>
    );
};
