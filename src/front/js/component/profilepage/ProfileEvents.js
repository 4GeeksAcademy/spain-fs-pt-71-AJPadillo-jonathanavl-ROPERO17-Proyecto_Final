import React from 'react';
import { Card } from 'react-bootstrap';

export const ProfileEvents = ({ events }) => (
    <Card className="profile-card content-card">
        <Card.Body>
            <Card.Title>Eventos</Card.Title>
            <Card.Text>
                {events.length > 0 ? (
                    events.map((event, index) => (
                        <div key={index} className="event-item">
                            {event.name} - {event.date}
                        </div>
                    ))
                ) : (
                    <p>No hay eventos disponibles.</p>
                )}
            </Card.Text>
            <a href="#" className="card-link">Ver todos los eventos</a>
        </Card.Body>
    </Card>
);
