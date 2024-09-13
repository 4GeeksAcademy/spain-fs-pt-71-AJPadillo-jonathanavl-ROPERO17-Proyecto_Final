import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Asegúrate de que este import esté presente si usas `react-router-dom`
import './index.css';

export const ProfilePosts = ({ posts, showAllPosts, onTogglePosts }) => {
    return (
        <Card className="profile-card content-card mt-3">
            <Card.Body>
                <Card.Title>My Post</Card.Title>
                <div className="review-list">
                    {posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div key={index} className="review-item">
                                <div className="review-header">
                                    <div>{post.title}</div>
                                    <Link
                                        to={`/Forum`}  // Cambia esta ruta según cómo gestiones las páginas de posts
                                        className="view-review-link"
                                    >
                                        View Post
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>There are no publications available.</p>
                    )}
                </div>
                {posts.length > 6 && !showAllPosts && (
                    <a href="#" className="card-link" onClick={onTogglePosts}>
                        See all posts
                    </a>
                )}
                {showAllPosts && posts.length > 6 && (
                    <a href="#" className="card-link" onClick={onTogglePosts}>
                        Hiden posts
                    </a>
                )}
            </Card.Body>
        </Card>
    );
};
