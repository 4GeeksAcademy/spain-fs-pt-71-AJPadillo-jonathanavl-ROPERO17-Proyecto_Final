import React from 'react';
import { Button, Col } from 'react-bootstrap';

export const EventCard = ({ event, isAdmin, handleAttend, handleEdit, handleDelete }) => {
  return (
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
                variant={event.attendees.includes(event.id) ? "danger" : "success"}
                className="btn-attend"
                onClick={() => handleAttend(event.id)}
              >
                {event.attendees.includes(event.id) ? 'Cancelar asistencia' : 'Asistir'}
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
  );
};
