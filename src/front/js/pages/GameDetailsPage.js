import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/details.css";
import { FaEdit, FaTimes } from "react-icons/fa";

export const GameDetailsPage = () => {
  const { store, actions } = useContext(Context);
  const { gameId } = useParams();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [newReview, setNewReview] = useState({ title: "", comment: "" });
  const [showModal, setShowModal] = useState(false);
  const [editReview, setEditReview] = useState(null);
  const [avatarColors, setAvatarColors] = useState({});

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

  useEffect(() => {
    const generateAvatarColors = () => {
      const colors = {};
      store.reviews.forEach(review => {
        colors[review.username] = getRandomColor();
      });
      setAvatarColors(colors);
    };
    if (store.reviews.length > 0) {
      generateAvatarColors();
    }
  }, [store.reviews]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Función para crear una imagen con la primera letra del nombre de usuario
  const getUserAvatar = (username) => {
    const firstLetter = username.charAt(0).toUpperCase();
    const canvas = document.createElement('canvas');
    canvas.width = 50;
    canvas.height = 50;
    const context = canvas.getContext('2d');
  
    // Rellenar el fondo con un color aleatorio ya generado
    context.fillStyle = avatarColors[username] || '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
  
    // Configuración del texto
    context.font = 'bold 20px Arial';
    context.fillStyle = '#fff'; // Texto blanco
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(firstLetter, canvas.width / 2, canvas.height / 2);
  
    return canvas.toDataURL();
  };

  const game = store.gameDetails;
  const currentUser = store.currentUser;

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
    setShowFullDescription((prev) => !prev);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await actions.addReview({
        game_id: game.id,
        title: newReview.title,
        comment: newReview.comment,
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

  const handleEditReview = (review) => {
    setEditReview(review);
    setNewReview({ title: review.title, comment: review.comment });
    setShowModal(true);
  };
  
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      await actions.updateReview(editReview.id, newReview.comment);
      setEditReview(null);
      setNewReview({ title: "", comment: "" });
      setShowModal(false);
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

  return (
    <Container className="game-details-container">
      {game ? (
        <>
          <Row className="game-details-row">
            <Col md={4} className="position-relative">
              <img
                src={game.background_image}
                alt={game.name}
                className="game-image"
              />
              <div
                className={`metacritic-score ${getMetacriticClass(
                  game.metacritic
                )}`}
              >
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
            </Col>
            <Col md={8}>
              <h1 className="game-title">{game.name}</h1>
              <p className="game-text">
                <strong>Released:</strong> {game.released}
              </p>
              <p className="game-text">
                <strong>Genres:</strong>{" "}
                {game.genres.map((genre) => genre.name).join(", ")}
              </p>
              <p className="game-text">
                <strong>Developer:</strong>{" "}
                {game.developers.map((dev) => dev.name).join(", ")}
              </p>
              <p className="game-text">
                {showFullDescription || game.description_raw.length <= 1070
                  ? game.description_raw
                  : `${game.description_raw.substring(0, 1070)}...`}
                {game.description_raw.length > 1070 && (
                  <span
                    className="more-details-link"
                    onClick={handleToggleDescription}
                  >
                    {showFullDescription ? " Show less" : " More details"}
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
                  <div key={index} className="review-container">
                    <div className="review">
                      <div
                        className="user-avatar"
                        style={{ backgroundImage: `url(${getUserAvatar(review.username)})` }}
                      >
                      </div>
                      <div className="review-details">
                        <div className="review-header">
                          <h6 className="review-username">@{review.username.charAt(0).toUpperCase() + review.username.slice(1)}</h6>
                          <p className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                        {currentUser && currentUser.username === review.username && (
                          <div className="review-actions">
                            <Button
                              variant="link"
                              className="review-action-button"
                              onClick={() => handleEditReview(review)}
                            >
                              <FaEdit color="white" />
                            </Button>
                            <Button
                              variant="link"
                              className="review-action-button"
                              onClick={() => handleDeleteReview(review.id)}
                            >
                              <FaTimes color="white" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </Col>
          </Row>
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{editReview ? "Edit Review" : "Submit Review"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={editReview ? handleUpdateReview : handleSubmitReview}>
                <Form.Group controlId="formReviewTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newReview.title}
                    onChange={handleInputChange}
                    placeholder="Enter review title"
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formReviewComment">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="comment"
                    value={newReview.comment}
                    onChange={handleInputChange}
                    placeholder="Enter review comment"
                    required
                  />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                  {editReview ? "Update Review" : "Submit Review"}
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};
