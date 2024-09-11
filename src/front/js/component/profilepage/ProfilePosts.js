import React from 'react';
import { Card } from 'react-bootstrap';

export const ProfilePosts = ({ posts }) => (
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
);
