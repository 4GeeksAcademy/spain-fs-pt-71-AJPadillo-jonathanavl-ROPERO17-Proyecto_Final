import React from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export const EventForm = ({ showModal, handleCloseModal, handleSubmit, newEvent, setNewEvent, editingEvent }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{editingEvent ? 'Modificar Evento' : 'Crear Evento'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEventName">
            <Form.Label>Nombre del Evento</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nombre del Evento"
              value={newEvent.name}
              onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEventDescription">
            <Form.Label>Descripción</Form.Label>
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
            <Form.Label>Fecha y Hora</Form.Label>
            <Form.Control
              type="datetime-local"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="formEventImage">
            <Form.Label>Imagen URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="URL de la Imagen"
              value={newEvent.image_url}
              onChange={(e) => setNewEvent({ ...newEvent, image_url: e.target.value })}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            {editingEvent ? 'Modificar' : 'Crear'} Evento
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


