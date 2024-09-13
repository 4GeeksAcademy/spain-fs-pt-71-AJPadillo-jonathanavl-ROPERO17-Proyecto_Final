import React from 'react';
import { Button, Col } from 'react-bootstrap';
import "./index.css";

export const EventCard = ({ event, isAdmin, onAttend, onEdit, onDelete }) => (
  <Col md={12} className="mb-4">
    <div className="events-card">
      <img src={event.image_url || 'https://via.placeholder.com/120'} alt={event.name} className="events-image" />
      <div className="events-name">{event.name}</div>
      <div className="events-details">
        <p>{event.description}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Attendees:</strong> {event.attendees.length}</p>
        <div className="events-actions">
          {!isAdmin && (
            <Button
              variant={event.attendees.includes(event.id) ? "danger" : "success"}
              className="btn-attend"
              onClick={() => onAttend(event.id)}
            >
              {event.attendees.includes(event.id) ? 'Cancel assistance' : 'Assist'}
            </Button>
          )}
          {isAdmin && (
            <div className="admin-actions">
              <Button variant="warning" className="btn-admin" onClick={() => onEdit(event)}>Modificar</Button>
              <Button variant="danger" className="btn-admin" onClick={() => onDelete(event.id)}>Eliminar</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  </Col>
);

