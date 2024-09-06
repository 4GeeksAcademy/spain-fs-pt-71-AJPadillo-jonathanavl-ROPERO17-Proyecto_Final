import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Image, Button, Modal } from 'react-bootstrap';
import { Context } from '../store/appContext';
import './ProfilePage.css';

export const ProfilePage = () => {
    const { store, actions } = useContext(Context);
    const { currentUser, isLoggedIn, isLoadingUser, reviews } = store;
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(currentUser?.profile_image || '');
    const [showAllReviews, setShowAllReviews] = useState(false);

    const profileImages = [
        'https://img.freepik.com/free-vector/cute-ninja-gaming-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-flat_138676-8079.jpg',
        'https://img.freepik.com/free-vector/cute-crocodile-gamer-playing-game-with-headphone-joystick-cartoon-vector-icon-illustration-flat_138676-6509.jpg',
        'https://img.freepik.com/free-vector/cute-astronaut-gaming-with-joystick-headphone-cartoon-vector-icon-illustration-science-techno_138676-9648.jpg',
        'https://img.freepik.com/free-vector/cute-gorilla-playing-game-virtual-reality-with-joystick-cartoon-vector-icon-illustration-animal_138676-6743.jpg'
    ];

    const handleImageSelect = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(false);
        localStorage.setItem('profileImage', imageUrl); // Guardar la imagen seleccionada en localStorage
        actions.updateProfileImage(imageUrl);
    };

    useEffect(() => {
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
                        if (user && user.profile_image) {
                            setSelectedImage(user.profile_image);
                        } else {
                            setSelectedImage('https://cdn.icon-icons.com/icons2/3217/PNG/512/unknown_user_avatar_profile_person_icon_196532.png');
                        }
                    }

                    // Llama a fetchReviews después de cargar los datos del usuario
                    await actions.fetchReviews();
                } catch (error) {
                    console.error('Error al obtener la información del usuario:', error);
                }
            }
        };

        if (!isLoadingUser) {
            fetchUserData();
        }
    }, [isLoadingUser, isLoggedIn]);

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

    if (!currentUser) {
        return null
    }

    const preferences = currentUser?.preferred_genres ? currentUser.preferred_genres.split(',') : [];
    
    // Determinar las reseñas a mostrar según el estado de showAllReviews
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 6);

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
                                </Button>
                            </div>
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
                            <Card.Text>{preferences.length > 0 ? preferences.join(', ') : 'No especificado'}</Card.Text>
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
                                    {displayedReviews.length > 0 ? (
                                        displayedReviews.map((review, index) => (
                                            <div key={index} className="review-item">
                                                <div className="review-header">
                                                    <h7>{review.title}</h7>
                                                    <a href={`https://reimagined-train-7v76qvx6g5563xx6x-3000.app.github.dev/game/${review.game_id}`} 
                                                       target="_blank" 
                                                       rel="noopener noreferrer"
                                                       className="view-review-link">
                                                       Ver reseña
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No hay reseñas disponibles.</p>
                                    )}
                                </div>
                                {reviews.length > 6 && !showAllReviews && (
                                    <a href="#" className="card-link" onClick={() => setShowAllReviews(true)}>
                                        Ver todas las reseñas
                                    </a>
                                )}
                                {showAllReviews && reviews.length > 6 && (
                                    <a href="#" className="card-link" onClick={() => setShowAllReviews(false)}>
                                        Ocultar reseñas
                                    </a>
                                )}
                            </Card.Body>
                        </Card>
                    </div>
                </Col>
            </Row>

            {/* Modal to select a profile image */}
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
