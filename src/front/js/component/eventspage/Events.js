import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';
import { Container, Row, Button } from 'react-bootstrap';
import { EventCard } from './EventCard';
import { EventForm } from './EventForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css";

const Events = () => {
  const { store, actions } = useContext(Context);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        await actions.getCurrentUser();
        await actions.getEvents();
        setIsAdmin(store.currentUser?.is_admin || false);
      } catch (error) {
        console.error('Error fetching user and events:', error);
      }
    };

    fetchUserAndEvents();
  }, []);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowModal(true);
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
      try {
        await actions.deleteEvent(eventId);
        await actions.getEvents(); // Refresh the event list
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const handleAttend = async (eventId) => {
    try {
      await actions.attendEvent(eventId);
      await actions.getEvents(); // Refresh the event list
    } catch (error) {
      console.error('Error attending event:', error);
    }
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setEditingEvent(null);
    setShowModal(false);
  };

  if (!Array.isArray(store.events)) {
    return <div>Cargando eventos...</div>;
  }

  return (
    <Container className="events-container">
    <div className="heading-container">
      <h1 className="heading">Events</h1>
      {isAdmin && (
        <Button variant="primary" className="create-event-button" onClick={handleOpenModal}>
          New Event
        </Button>
      )}
    </div>
    <br />
      <Row>
        {store.events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            isAdmin={isAdmin}
            onAttend={handleAttend}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </Row>
      <EventForm
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        editingEvent={editingEvent}
        actions={actions}
        getEvents={actions.getEvents}
      />
    </Container>
  );
};

export default Events;
