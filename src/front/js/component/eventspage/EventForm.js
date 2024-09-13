import React, { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import "./index.css";

export const EventForm = ({ showModal, handleCloseModal, editingEvent, actions, getEvents }) => {
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    image_url: ''
  });

  useEffect(() => {
    if (editingEvent) {
      setNewEvent({
        name: editingEvent.name,
        description: editingEvent.description,
        date: new Date(editingEvent.date).toISOString().slice(0, 16),
        image_url: editingEvent.image_url || ''
      });
    } else {
      setNewEvent({ name: '', description: '', date: '', image_url: '' });
    }
  }, [editingEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await actions.updateEvent(editingEvent.id, newEvent);
      } else {
        await actions.createEvent(newEvent);
      }
      await getEvents();
      handleCloseModal();
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{editingEvent ? 'Modify Event' : 'Create Event'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEventName">
            <Form.Label>Event Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Event Name"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEventDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Descripción"
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEventDate">
            <Form.Label>Date and Time</Form.Label>
            <Form.Control
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEventImage">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="URL de la Imagen"
              value={newEvent.image_url}
              onChange={(e) => setNewEvent({ ...newEvent, image_url: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingEvent ? 'Modificar' : 'Crear'} Event
          </Button>
          {editingEvent && (
            <Button
              variant="secondary"
              className="ml-2"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
          )}
        </Form>
      </Modal.Body>
    </Modal>
  );
};
