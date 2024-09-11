import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { ProfileHeader } from '../component/profilepage/ProfileHeader';
import { ProfilePreferences } from '../component/profilepage/ProfilePreferences';
import { ProfileEvents } from '../component/profilepage/ProfileEvents';
import { ProfilePosts } from '../component/profilepage/ProfilePosts';
import { ProfileReviews } from '../component/profilepage/ProfileReviews';
import { ProfileImageModal } from '../component/profilepage/ProfileImageModal';
import "../../styles/ProfilePage.css";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { store, actions } = useContext(Context);
    const { currentUser, isLoggedIn, isLoadingUser, reviews } = store;
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const navigate = useNavigate(); // Hook para redirección

    const profileImages = [
        'https://img.freepik.com/free-vector/cute-ninja-gaming-cartoon-vector-icon-illustration-people-technology-icon-concept-isolated-flat_138676-8079.jpg',
        'https://img.freepik.com/free-vector/cute-crocodile-gamer-playing-game-with-headphone-joystick-cartoon-vector-icon-illustration-flat_138676-6509.jpg',
        'https://img.freepik.com/free-vector/cute-astronaut-gaming-with-joystick-headphone-cartoon-vector-icon-illustration-science-techno_138676-9648.jpg',
        'https://img.freepik.com/free-vector/cute-gorilla-playing-game-virtual-reality-with-joystick-cartoon-vector-icon-illustration-animal_138676-6743.jpg'
    ];

    const handleImageSelect = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(false);
        Cookies.set('profileImage', imageUrl, { expires: 7 });
        actions.updateProfileImage(imageUrl);
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn) {
                navigate('/login'); // Redirige usando el hook useNavigate
            } else {
                try {
                    // Verifica si hay una imagen en las cookies
                    const storedImage = Cookies.get('profileImage');
                    if (storedImage) {
                        setSelectedImage(storedImage);
                    } else if (currentUser && currentUser.profile_image) {
                        setSelectedImage(currentUser.profile_image);
                    } else {
                        setSelectedImage('https://cdn.icon-icons.com/icons2/3217/PNG/512/unknown_user_avatar_profile_person_icon_196532.png');
                    }

                    // Si el usuario no está cargado, obtén los datos del usuario
                    if (!currentUser) {
                        await actions.getCurrentUser();
                    }

                    // Fetch reviews after loading user data
                    await actions.fetchReviews();
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        if (!isLoadingUser) {
            fetchUserData();
        }
    }, [isLoadingUser, isLoggedIn, currentUser, navigate]);

    const posts = [
        '¿Alguien sabe cómo derrotar a Nameless King en Dark Souls III?',
        'Consejos para mejorar en Apex Legends',
        'Cómo optimizar tu build en The Witcher 3',
        'Estrategias para ganar en el nuevo modo de Fortnite'
    ];

    if (!currentUser) {
        return null;
    }

    const preferences = currentUser?.preferred_genres ? currentUser.preferred_genres.split(',') : [];
    const events = currentUser?.events || [];
    const displayedReviews = reviews.slice(0, 6);

    return (
        <Container className="profile-container">
            <Row className="profile-row">
                <Col md={4} className="profile-left">
                    <ProfileHeader
                        user={currentUser}
                        selectedImage={selectedImage}
                        onImageClick={() => setShowModal(true)}
                    />
                    <ProfilePreferences preferences={preferences} />
                </Col>
                <Col md={8} className="profile-right">
                    <div className="profile-content">
                        <ProfileEvents events={events} />
                        <ProfilePosts posts={posts} />
                        <ProfileReviews
                            reviews={displayedReviews}
                            showAllReviews={false}
                            onToggleReviews={() => {}}
                        />
                    </div>
                </Col>
            </Row>

            <ProfileImageModal
                showModal={showModal}
                onHide={() => setShowModal(false)}
                profileImages={profileImages}
                onImageSelect={handleImageSelect}
            />
        </Container>
    );
};
