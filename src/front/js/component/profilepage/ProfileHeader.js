import React from 'react';
import { Card, Image, Button } from 'react-bootstrap';

export const ProfileHeader = ({ user, selectedImage, onImageClick }) => (
    <Card className="profile-card">
        <Card.Body>
            <Image
                src={selectedImage}
                roundedCircle
                alt="Avatar"
                className="avatar-img"
            />
            <div className="my-profile-status">
                <h3 className="my-profile">My Profile</h3>
                <Button variant="primary" className="circle-button" onClick={onImageClick}>
                    <img src="https://www.svgrepo.com/show/345041/pencil-square.svg" alt="Edit" className="pencil-icon" />
                </Button>
            </div>
            <div className="user-info">
                <div className="user-name-more-data">
                    <p className="user-name">@{user.username || 'TheGhostGamer'}</p>
                </div>
                <p className="user-email">{user.email}</p>
            </div>
        </Card.Body>
    </Card>
);
