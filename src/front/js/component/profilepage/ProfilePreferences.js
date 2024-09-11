import React from 'react';
import { Card } from 'react-bootstrap';

export const ProfilePreferences = ({ preferences }) => (
    <Card className="profile-card mt-3">
        <Card.Body>
            <Card.Title>Preferencias de Géneros</Card.Title>
            <Card.Text>{preferences.length > 0 ? preferences.join(', ') : 'No especificado'}</Card.Text>
        </Card.Body>
    </Card>
);
