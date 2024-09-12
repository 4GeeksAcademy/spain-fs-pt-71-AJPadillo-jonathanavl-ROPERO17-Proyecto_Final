import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { Container, Row, Button } from 'react-bootstrap';
import { EventCard } from '../component/eventspage/EventCard';
import { EventForm } from '../component/eventspage/EventForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../component/eventspage/events.css';

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
        
        if (store.currentUser && store.currentUser.is_admin === true) {
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
      await actions.getEvents();
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
          <EventCard
            key={event.id}
            event={event}
            isAdmin={isAdmin}
            handleAttend={handleAttend}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        ))}
      </Row>
      <EventForm
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleSubmit={handleSubmit}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        editingEvent={editingEvent}
      />
    </Container>
  );
};
