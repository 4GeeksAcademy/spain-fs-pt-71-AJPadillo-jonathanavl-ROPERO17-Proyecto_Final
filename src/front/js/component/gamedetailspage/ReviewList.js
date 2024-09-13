import React from 'react';
import { Button } from 'react-bootstrap';
import { FaEdit, FaTimes } from 'react-icons/fa';
import './index.css';

const getUserAvatar = (username) => {
  const firstLetter = username.charAt(0).toUpperCase();
  const canvas = document.createElement('canvas');
  canvas.width = 50;
  canvas.height = 50;
  const context = canvas.getContext('2d');
  context.fillStyle = '#000'; // Default color
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.font = 'bold 20px Arial';
  context.fillStyle = '#fff';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(firstLetter, canvas.width / 2, canvas.height / 2);
  return canvas.toDataURL();
};

const ReviewList = ({ reviews, currentUser, onEditReview, onDeleteReview }) => {

  return (
    <>
      {reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} className="review-container">
            <div className="review">
              <div
                className="user-avatar"
                style={{ backgroundImage: `url(${getUserAvatar(review.username)})` }}
              >
              </div>
              <div className="review-details">
                <div className="review-header">
                  <div className="review-title-and-username">
                    <h6>{review.title}</h6>
                    <p className="review-username">@{review.username}</p>
                  </div>
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
                      onClick={() => onEditReview(review)}
                    >
                      <FaEdit color="white" />
                    </Button>
                    <Button
                      variant="link"
                      className="review-action-button"
                      onClick={() => onDeleteReview(review.id)}
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
    </>
  );
};

export default ReviewList;
