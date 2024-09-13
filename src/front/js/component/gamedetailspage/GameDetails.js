import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';
import GameImage from './GameImage';
import GameInfo from './GameInfo';
import ReviewList from './ReviewList';
import ModalComponent from './ModalComponent';
import './index.css';

const GameDetails = () => {
    const { store, actions } = useContext(Context);
    const { gameId } = useParams();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editReview, setEditReview] = useState(null);

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
    }, [gameId]);

    const handleOpenModal = () => {
        if (store.currentUser) { 
            setShowModal(true);
        } else {
            navigate('/login'); 
        }
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setEditReview(null);
    };

    const handleEditReview = (review) => {
        setEditReview(review);
        handleOpenModal();
    };

    const handleSubmitReview = async (newReview) => {
        try {
            await actions.addReview(newReview);
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    const handleUpdateReview = async (newReview) => {
        try {
            await actions.updateReview(editReview.id, newReview.title, newReview.comment);
            handleCloseModal();
        } catch (error) {
            console.error("Error updating review:", error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        try {
            await actions.deleteReview(reviewId);
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    const game = store.gameDetails;
    const reviews = store.reviews;
    const currentUser = store.currentUser;



    return (
        <Container className="game-details-container">
            {game && (
                <>
                    <Row className="game-details-row">
                        <Col md={4} className="position-relative">
                            <GameImage game={game} />
                        </Col>
                        <Col md={8} className="game-text">
                            <GameInfo game={game} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                        <div className="userreview">
                            <h3>User Reviews</h3>
                            <Button onClick={handleOpenModal}>Add Review</Button>
                            </div>
                            <hr className="separator" />
                            <ReviewList
                                reviews={reviews}
                                currentUser={currentUser}
                                onEditReview={handleEditReview}
                                onDeleteReview={handleDeleteReview}
                            />
                        </Col>
                    </Row>
                    <ModalComponent
                        showModal={showModal}
                        setShowModal={setShowModal}
                        editReview={editReview}
                        actions={actions}
                        game={game}
                        setEditReview={setEditReview}
                        handleSubmitReview={handleSubmitReview}
                        handleUpdateReview={handleUpdateReview}
                    />
                </>
            )}
        </Container>
    );
};

export default GameDetails;
