import React, { useState, useContext } from 'react';
import { Button, Form, ListGroup, Col } from 'react-bootstrap';
import { FaEdit, FaTimes, FaPaperPlane } from 'react-icons/fa';
import { Context } from '../../store/appContext';
import './index.css';

export const PostCard = ({ post, onEdit, onDelete }) => {
    const { store, actions } = useContext(Context);
    const [newComment, setNewComment] = useState('');
    const { currentUser } = store;

    const handleCreateComment = async (postId) => {
        if (newComment.trim()) {
            await actions.createComment(postId, newComment);
            await actions.getAllPost(); // Actualiza los posts y comentarios
            setNewComment('');
        }
    };

    return (
        <Col lg={12} md={12} key={post.id} className="mb-4">
            <div className="post-card">
                {post.image_url && <img src={post.image_url} alt={post.title} className="post-card-image" />}
                <div className="post-card-header">
                    <h5 className="post-card-title">{post.title}</h5>
                    <span className="post-card-username">
                        @{post.username}
                    </span>
                </div>
                {currentUser?.id === post.user_id && (
                    <div className="post-card-icons">
                        <Button
                            variant="secondary"
                            className="p-1"
                            onClick={() => onEdit(post)}
                        >
                            <FaEdit />
                        </Button>
                        <Button
                            variant="danger"
                            className="p-1"
                            onClick={() => onDelete(post.id)}
                        >
                            <FaTimes />
                        </Button>
                    </div>
                )}
                <div className="post-card-body">
                    <p className="post-card-text">{post.content}</p>
                </div>
                <ul className="comment-list">
                    {post.comments && post.comments.map(comment => (
                        <li key={comment.id} className="comment-list-item">
                            <span className="comment-author">
                                {comment.username}
                            </span>: {comment.content}
                        </li>
                    ))}
                </ul>
                <div className="create-comment-form">
                    <Form.Control
                        as="textarea"
                        rows={2}
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button
                        variant="primary"
                        onClick={() => handleCreateComment(post.id)}
                    >
                        <FaPaperPlane />
                    </Button>
                </div>
            </div>
        </Col>
    );
};
