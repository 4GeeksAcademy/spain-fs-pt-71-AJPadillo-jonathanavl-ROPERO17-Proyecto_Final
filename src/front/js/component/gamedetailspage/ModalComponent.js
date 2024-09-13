import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from 'react-bootstrap';
import './index.css';

const ModalComponent = ({ showModal, setShowModal, editReview, game,handleSubmitReview, handleUpdateReview }) => {
  const [newReview, setNewReview] = useState({ title: "", comment: "" });

  useEffect(() => {
    if (editReview) {
      setNewReview({ title: editReview.title, comment: editReview.comment });
    } else {
      setNewReview({ title: "", comment: "" });
    }
  }, [editReview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (editReview) {
      await handleUpdateReview(newReview);
    } else {
      await handleSubmitReview({ game_id: game.id, ...newReview });
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{editReview ? "Edit Review" : "Submit Review"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={handleSubmit}>
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
  );
};

export default ModalComponent;