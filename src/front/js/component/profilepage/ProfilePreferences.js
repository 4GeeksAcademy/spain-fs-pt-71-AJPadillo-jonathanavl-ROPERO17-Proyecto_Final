import React from 'react';
import { Card } from 'react-bootstrap';
import './index.css';

export const ProfilePreferences = ({ preferences }) => (
    <Card className="profile-card mt-3">
        <Card.Body>
            <Card.Title>Genre Preferences</Card.Title>
            <Card.Text>{preferences.length > 0 ? preferences.join(', ') : 'No especificado'}</Card.Text>
        </Card.Body>
    </Card>
);
