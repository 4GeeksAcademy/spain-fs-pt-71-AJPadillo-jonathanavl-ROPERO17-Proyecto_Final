import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Context } from '../../store/appContext';
import { ProfileHeader } from './ProfileHeader';
import { ProfilePreferences } from './ProfilePreferences';
import { ProfileEvents } from './ProfileEvents';
import { ProfilePosts } from './ProfilePosts';
import { ProfileReviews } from './ProfileReviews';
import './index.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
    const { store, actions } = useContext(Context);
    const { currentUser, isLoggedIn, isLoadingUser, reviews } = store;
    const [selectedImage, setSelectedImage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!isLoggedIn) {
                navigate('/login');
            } else {
                try {
                    const storedImage = Cookies.get('profileImage');
                    if (storedImage) {
                        setSelectedImage(storedImage);
                    } else if (currentUser && currentUser.profile_image) {
                        setSelectedImage(currentUser.profile_image);
                    } else {
                        setSelectedImage('https://cdn.icon-icons.com/icons2/3217/PNG/512/unknown_user_avatar_profile_person_icon_196532.png');
                    }

                    if (!currentUser) {
                        await actions.getCurrentUser();
                    }

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

    const handleImageSelect = (imageUrl) => {
        setSelectedImage(imageUrl);
        Cookies.set('profileImage', imageUrl, { expires: 7 });
        actions.updateProfileImage(imageUrl);
    };

    if (!currentUser) {
        return null;
    }

    const preferences = currentUser?.preferred_genres ? currentUser.preferred_genres.split(',') : [];
    const events = currentUser?.events || [];
    const posts = currentUser?.posts || [];
    const displayedReviews = reviews.slice(0, 6);

    return (
        <Container className="profile-container">
            <Row className="profile-row">
                <Col md={4} className="profile-left">
                    <ProfileHeader
                        user={currentUser}
                        selectedImage={selectedImage}
                        onImageSelect={handleImageSelect}
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
        </Container>
    );
};
