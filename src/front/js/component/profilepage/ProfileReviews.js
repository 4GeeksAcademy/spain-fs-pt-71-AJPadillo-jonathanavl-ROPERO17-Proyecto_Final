import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export const ProfileReviews = ({ reviews, showAllReviews, onToggleReviews }) => {
    return (
        <Card className="profile-card content-card mt-3">
            <Card.Body>
                <Card.Title>Reseñas Escritas</Card.Title>
                <div className="review-list">
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <div>{review.title}</div>
                                    <Link
                                        to={`/game/${review.game_id}`}  // Cambia esta ruta según cómo gestiones las páginas de reseñas
                                        className="view-review-link"
                                    >
                                        Ver reseña
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay reseñas disponibles.</p>
                    )}
                </div>
                {reviews.length > 6 && !showAllReviews && (
                    <a href="#" className="card-link" onClick={onToggleReviews}>
                        Ver todas las reseñas
                    </a>
                )}
                {showAllReviews && reviews.length > 6 && (
                    <a href="#" className="card-link" onClick={onToggleReviews}>
                        Ocultar reseñas
                    </a>
                )}
            </Card.Body>
        </Card>
    );
};
