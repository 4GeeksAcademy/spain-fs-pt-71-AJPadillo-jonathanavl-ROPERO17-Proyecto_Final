import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import './index.css';

export const ProfileEvents = ({ events }) => {
    const [showAllEvents, setShowAllEvents] = useState(false);

    const onToggleEvents = (e) => {
        e.preventDefault();
        setShowAllEvents(!showAllEvents);
    };

    const eventsToShow = showAllEvents || events.length <= 5
        ? events
        : events.slice(0, 5);

    return (
        <Card className="profile-card content-card">
            <Card.Body>
                <Card.Title>Events</Card.Title>
                <Card.Text>
                    {eventsToShow.length > 0 ? (
                        eventsToShow.map((event, index) => (
                            <div key={index} className="event-item">
                                {event.name} - {event.date}
                            </div>
                        ))
                    ) : (
                        <p>There are no events available.</p>
                    )}
                </Card.Text>
                {events.length > 5 && !showAllEvents && (
                    <a href="#" className="card-link" onClick={onToggleEvents}>
                        See all events
                    </a>
                )}
                {showAllEvents && events.length > 5 && (
                    <a href="#" className="card-link" onClick={onToggleEvents}>
                        Hiden events
                    </a>
                )}
            </Card.Body>
        </Card>
    );
};
