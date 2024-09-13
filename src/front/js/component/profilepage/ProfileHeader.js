import React, { useState } from 'react';
import { Card, Image, Button } from 'react-bootstrap';
import { ProfileImageModal } from './ProfileImageModal';
import './index.css';

export const ProfileHeader = ({ user, selectedImage, onImageSelect }) => {
    const [showModal, setShowModal] = useState(false);

    const profileImages = [
        'https://img.freepik.com/free-vector/cute-ninja-gaming-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-flat_138676-8079.jpg',
        'https://img.freepik.com/free-vector/cute-crocodile-gamer-playing-game-with-headphone-joystick-cartoon-vector-icon-illustration-flat_138676-6509.jpg',
        'https://img.freepik.com/free-vector/cute-astronaut-gaming-with-joystick-headphone-cartoon-vector-icon-illustration-science-techno_138676-9648.jpg',
        'https://img.freepik.com/free-vector/cute-gorilla-playing-game-virtual-reality-with-joystick-cartoon-vector-icon-illustration-animal_138676-6743.jpg'
    ];

    const handleImageClick = () => {
        setShowModal(true);
    };

    const handleImageSelect = (imageUrl) => {
        onImageSelect(imageUrl); // Pasar la selección de imagen al componente padre
        setShowModal(false);
    };

    return (
        <>
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
                        <Button variant="primary" className="circle-button" onClick={handleImageClick}>
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

            <ProfileImageModal
                showModal={showModal}
                onHide={() => setShowModal(false)}
                profileImages={profileImages}
                onImageSelect={handleImageSelect}
            />
        </>
    );
};