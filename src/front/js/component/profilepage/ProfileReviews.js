import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './index.css';

export const ProfileReviews = ({ reviews, showAllReviews, onToggleReviews }) => {
    return (
        <Card className="profile-card content-card mt-3">
            <Card.Body>
                <Card.Title>My Reviews</Card.Title>
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
                                        View Review
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No reviews available.</p>
                    )}
                </div>
                {reviews.length > 6 && !showAllReviews && (
                    <a href="#" className="card-link" onClick={onToggleReviews}>
                        View all Reviews
                    </a>
                )}
                {showAllReviews && reviews.length > 6 && (
                    <a href="#" className="card-link" onClick={onToggleReviews}>
                        Hide reviews
                    </a>
                )}
            </Card.Body>
        </Card>
    );
};
