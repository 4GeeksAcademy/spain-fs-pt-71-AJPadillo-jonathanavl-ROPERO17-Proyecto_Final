import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Image, Button, Modal } from 'react-bootstrap';
import { Context } from '../store/appContext';
import './ProfilePage.css';

export const ProfilePage = () => {
    const { store, actions } = useContext(Context);
    const { currentUser, isLoggedIn } = store;
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(currentUser?.profile_image);

    const profileImages = [
        'https://img.freepik.com/free-vector/cute-ninja-gaming-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-flat_138676-8079.jpg?t=st=1724607166~exp=1724610766~hmac=6d056c79229df86fe84a23c82bd362d9799f4e0e12bdc40392269b8bbe1ea0c4&w=826',
        'https://img.freepik.com/free-vector/cute-crocodile-gamer-playing-game-with-headphone-joystick-cartoon-vector-icon-illustration-flat_138676-6509.jpg?t=st=1724603117~exp=1724606717~hmac=42c92177dd5ab4ee04c20b78d9dcd54d99dc9496e089a8b6fa46f78b9e13c3a5&w=826',
        'https://img.freepik.com/free-vector/cute-astronaut-gaming-with-joystick-headphone-cartoon-vector-icon-illustration-science-techno_138676-9648.jpg?t=st=1724607119~exp=1724610719~hmac=3f04309e3030d6ae66f3d4248a0c903badb274c87442f0423d340905a118906a&w=826',
        'https://img.freepik.com/free-vector/cute-gorilla-playing-game-virtual-reality-with-joystick-cartoon-vector-icon-illustration-animal_138676-6743.jpg?t=st=1724607141~exp=1724610741~hmac=97e3dfc9b4794a96ee83cc30b25d7f161860941d7fa6db35fe91bb2b353bf10b&w=826'
    ];

    const handleImageSelect = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(false);
        localStorage.setItem('profileImage', imageUrl); // Guardar la imagen seleccionada en localStorage
        actions.updateProfileImage(imageUrl);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchUserData = async () => {
            if (!isLoggedIn) {
                window.location.href = '/login';
            } else {
                try {
                    const storedImage = localStorage.getItem('profileImage'); // Intentar recuperar la imagen de localStorage
                    if (storedImage) {
                        setSelectedImage(storedImage); // Usar la imagen almacenada en localStorage si existe
                    } else {
                        const user = await actions.getCurrentUser();
                        if (isMounted) {
                            if (user && user.profile_image) {
                                setSelectedImage(user.profile_image);
                            } else {
                                setSelectedImage('https://cdn.icon-icons.com/icons2/3217/PNG/512/unknown_user_avatar_profile_person_icon_196532.png');
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error al obtener la información del usuario:', error);
                }
            }
        };

        fetchUserData();

        return () => {
            isMounted = false;
        };
    }, [isLoggedIn, actions]);

    const events = [
        'Gran torneo de Fortnite 2024',
        'Evento de Apex Legends: La batalla definitiva',
        'Maratón de League of Legends',
        'Torneo de Counter-Strike: Global Offensive'
    ];

    const posts = [
        '¿Alguien sabe cómo derrotar a Nameless King en Dark Souls III?',
        'Consejos para mejorar en Apex Legends',
        'Cómo optimizar tu build en The Witcher 3',
        'Estrategias para ganar en el nuevo modo de Fortnite'
    ];

    const reviews = [
        { game: 'Fortnite', rating: 4.5 },
        { game: 'Apex Legends', rating: 3.5 },
        { game: 'Dark Souls III', rating: 5 },
        { game: 'Fortnite', rating: 4 }
    ];

    const preferences = currentUser.preferred_genres ? currentUser.preferred_genres.split(',') : [];

    return (
        <Container className="profile-container">
            <Row className="profile-row">
                <Col md={4} className="profile-left">
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
                                <Button variant="primary" className="circle-button" onClick={() => setShowModal(true)}>
                                <img src="https://www.svgrepo.com/show/345041/pencil-square.svg" alt="Edit" className="pencil-icon" />
                            </Button>                            </div>
                            <div className="user-info">
                                <div className="user-name-more-data">
                                    <p className="user-name">@{currentUser.username || 'TheGhostGamer'}</p>
                                </div>
                                <p className="user-email">{currentUser.email}</p>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className="profile-card mt-3">
                        <Card.Body>
                            <Card.Title>Preferencias de Géneros</Card.Title>
                            <Card.Text>{preferences.join(', ')}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8} className="profile-right">
                    <div className="profile-content">
                        <Card className="profile-card content-card">
                            <Card.Body>
                                <Card.Title>Eventos</Card.Title>
                                <Card.Text>
                                    {events.map((event, index) => (
                                        <div key={index} className="event-item">
                                            {event}
                                        </div>
                                    ))}
                                </Card.Text>
                                <a href="#" className="card-link">Ver todos los eventos</a>
                            </Card.Body>
                        </Card>
                        <Card className="profile-card content-card mt-3">
                            <Card.Body>
                                <Card.Title>Posts Escritos</Card.Title>
                                <Card.Text>
                                    {posts.map((post, index) => (
                                        <div key={index} className="post-item">
                                            {post}
                                        </div>
                                    ))}
                                </Card.Text>
                                <a href="#" className="card-link">Ver todos los posts</a>
                            </Card.Body>
                        </Card>
                        <Card className="profile-card content-card mt-3">
                            <Card.Body>
                                <Card.Title>Reseñas Escritas</Card.Title>
                                <div className="review-list">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="review-item">
                                            <h5>{review.game}</h5>
                                            <p>{review.review || 'No review provided'}</p>
                                            <div className="review-rating">Rating: {review.rating} ★</div>
                                        </div>
                                    ))}
                                </div>
                                <a href="#" className="card-link">Ver todas las reseñas</a>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona tu nueva imagen de perfil</Modal.Title>
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
                                onClick={() => handleImageSelect(image)}
                                style={{ cursor: 'pointer', width: '80px', height: '80px' }}
                            />
                        ))}
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    );
};
