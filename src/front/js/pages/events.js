import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './events.css';

export const Events = () => {
  const { store, actions } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    image_url: ''
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        await actions.getCurrentUser(); 
        await actions.getEvents();

        
        if (store.currentUser && store.currentUser.email === 'admin@admin.es') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error fetching user and events:', error);
      }
    };

    fetchUserAndEvents();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await actions.updateEvent(editingEvent.id, newEvent);
        setEditingEvent(null);
      } else {
        await actions.createEvent(newEvent);
      }
      setNewEvent({ name: '', description: '', date: '', image_url: '' });
      setShowModal(false); 
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const handleEdit = (event) => {
    setNewEvent({
      name: event.name,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      image_url: event.image_url || ''
    });
    setEditingEvent(event);
    setShowModal(true); // Abre el modal
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await actions.deleteEvent(eventId);
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleAttend = async (eventId) => {
    try {
      await actions.attendEvent(eventId);
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setNewEvent({ name: '', description: '', date: '', image_url: '' });
    setEditingEvent(null);
    setShowModal(false);
  };

  if (!Array.isArray(store.events)) {
    return <div>Cargando eventos...</div>;
  }

  return (
    <Container className="events-container">
      <h1>Eventos</h1>

      {isAdmin && (
        <Button variant="primary" onClick={handleOpenModal} className="mb-3">
          Crear Evento
        </Button>
      )}

      <Row>
        {store.events.map((event) => (
          <Col key={event.id} md={12} className="mb-4">
            <div className="events-card">
              <img src={event.image_url || 'https://via.placeholder.com/120'} alt={event.name} className="events-image" />
              <div className="events-name">{event.name}</div>
              <div className="events-details">
                <p>{event.description}</p>
                <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
                <p><strong>Asistentes:</strong> {event.attendees.length}</p>
                <div className="events-actions">
                  {!isAdmin && (
                    <Button
                      variant={store.currentUser?.attendingEvents?.includes(event.id) ? "danger" : "success"}
                      className="btn-attend"
                      onClick={() => handleAttend(event.id)}
                    >
                      {store.currentUser?.attendingEvents?.includes(event.id) ? 'Cancelar asistencia' : 'Asistir'}
                    </Button>
                  )}
                  {isAdmin && (
                    <div className="admin-actions">
                      <Button variant="warning" className="btn-admin" onClick={() => handleEdit(event)}>Modificar</Button>
                      <Button variant="danger" className="btn-admin" onClick={() => handleDelete(event.id)}>Eliminar</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

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
    </Container>
  );
};
