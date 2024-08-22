import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import './ProfilePage.css'; // Importa el archivo CSS para los estilos personalizados

export const ProfilePage = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [events, setEvents] = useState([]);
    const [posts, setPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const preferences = ['RPG', 'Acción']; // Preferencias de géneros

    // Simulando la obtención de datos del usuario y de eventos, posts y reseñas
    useEffect(() => {
        // Simulación de llamada a la API para obtener el email y teléfono del usuario
        setEmail('usuario@example.com');
        setPhone('123-456-7890');

        // Simulación de llamada a la API para obtener eventos
        setEvents([
            'Gran torneo de Fortnite 2024',
            'Evento de Apex Legends: La batalla definitiva',
            'Maratón de League of Legends',
            'Torneo de Counter-Strike: Global Offensive'
        ]);

        // Simulación de llamada a la API para obtener publicaciones
        setPosts([
            '¿Alguien sabe cómo derrotar a Nameless King en Dark Souls III?',
            'Consejos para mejorar en Apex Legends',
            'Cómo optimizar tu build en The Witcher 3',
            'Estrategias para ganar en el nuevo modo de Fortnite'
        ]);

        // Simulación de llamada a la API para obtener reseñas
        setReviews([
            { game: 'Fortnite', rating: 4.5 },
            { game: 'Apex Legends', rating: 3.5 },
            { game: 'Dark Souls III', rating: 5 },
            { game: 'Fortnite', rating: 4 }
        ]);
    }, []);


    return (
        <Container className="profile-container">
            <Row className="profile-row">
                <Col md={4} className="profile-left">
                    <Card className="profile-card">
                        <Card.Body>
                            <Image
                                src="https://img.freepik.com/free-vector/cute-ninja-gaming-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-flat_138676-8079.jpg"
                                roundedCircle
                                alt="Avatar"
                                className="avatar-img"
                            />
                            <div className="my-profile-status">
                                <h3 className="my-profile">My Profile</h3>
                                <span className="status-indicator"></span>
                                <span className="status-text">Connected</span>
                            </div>
                            <div className="user-info">
                                <div className="user-name-phone">
                                    <p className="user-name">@Username</p>
                                    <p className="user-phone">{phone}</p>
                                </div>
                                <p className="user-email">{email}</p>
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
                                            <p>{review.review}</p>
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
        </Container>
    );
};