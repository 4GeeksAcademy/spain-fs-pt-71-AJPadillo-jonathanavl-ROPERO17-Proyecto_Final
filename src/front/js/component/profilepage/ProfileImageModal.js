import React from 'react';
import { Modal, Image } from 'react-bootstrap';
import './index.css';

export const ProfileImageModal = ({ showModal, onHide, profileImages, onImageSelect }) => (
    <Modal show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Select your new profile image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex justify-content-around">
                {profileImages.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        roundedCircle
                        alt={`Avatar ${index + 1}`}
                        className="avatar-option"
                        onClick={() => onImageSelect(image)}
                        style={{ cursor: 'pointer', width: '80px', height: '80px' }}
                    />
                ))}
            </div>
        </Modal.Body>
    </Modal>
);
