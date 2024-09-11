import React, { useEffect, useState, useContext } from 'react';
import { Button, Modal, Form, ListGroup, Card, Container, Row, Col } from 'react-bootstrap';
import { Context } from '../store/appContext';
import { FaEdit, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './PostPage.css';

export const PostPage = () => {
    const { store, actions } = useContext(Context);
    const [showPostModal, setShowPostModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPost, setCurrentPost] = useState(null);
    const { title, content, imageUrl } = currentPost || {};
    const initPostValues = { title, content, imageUrl };

    useEffect(() => {
        async function initialLoad() {
            await actions.getAllPost();
            setIsLoading(false);
        }
        initialLoad()
    }, []);

    const handlePostModalOpen = () => setShowPostModal(true);
    const handlePostModalClose = () => {
        setShowPostModal(false);
        setCurrentPost(null);
        setIsEditing(false);
    };
    const handleCreatePost = async (title, content, imageUrl) => {
        if (isEditing) {
            await actions.updatePost(currentPost.id, title, content, imageUrl);
        } else {
            await actions.createPost(title, content, imageUrl);
        }
        await actions.getAllPost();
        handlePostModalClose();
    };
    const handleEditPost = (post) => {
        setIsEditing(true);
        setCurrentPost(post);
        handlePostModalOpen();
    };
    const handleDeletePost = async (postId) => {
        await actions.deletePost(postId);
        await actions.getAllPost();
    };

    if (isLoading) {
        return (
            <div className="m-5 text-white text-center bg-warning">Loading.....</div>
        )
    }

    return (
        <Container>
            <Row className="mb-3 align-items-center">
                <Col>
                    <h1 className="d-inline">Posts</h1>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" onClick={handlePostModalOpen}>
                        Create New Post
                    </Button>
                </Col>
            </Row>
            <Row>
                {store.posts.map((post, key) => (
                    <PostCard key={`PostCard-${key}`} post={post} onEdit={handleEditPost} onDelete={handleDeletePost} />
                ))}
            </Row>

            {showPostModal && (
                <PostModal
                    isEditing={isEditing}
                    initValues={initPostValues}
                    onSubmit={handleCreatePost}
                    onHide={handlePostModalClose}
                />
            )}
        </Container>
    );
};

export const PostModal = ({ initValues, isEditing, onSubmit, onHide }) => {
    const [title, seTitle] = useState(initValues.title);
    const [content, setContent] = useState(initValues.content);
    const [imageUrl, setImageUrl] = useState(initValues.imageUrl);
    const handleOnSubmit = () => {
        onSubmit(title, content, imageUrl)
    };
    return (
        <Modal show={true} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Post' : 'Create Post'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formPostTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => seTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPostContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPostImageUrl">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter image URL (optional)"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleOnSubmit}>
                    {isEditing ? 'Save Changes' : 'Create Post'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export const PostCard = ({ post, onEdit, onDelete }) => {
    const { store, actions } = useContext(Context);
    const [newComment, setNewComment] = useState('');
    const { currentUser } = store;
    const handleCreateComment = async (postId) => {
        if (newComment.trim()) {
            await actions.createComment(postId, newComment);
            await actions.getAllPost();
            setNewComment('');
        }
    };
    return (
        <Col lg={12} md={12} key={post.id} className="mb-4">
            <Card style={{ width: '100%' }} className="position-relative post-card">
                {post.image_url && <Card.Img variant="top" src={post.image_url} />}
                <Card.Body>
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <Card.Title>{post.title}</Card.Title>
                            <span className="text-muted">
                                {store.users.find(user => user.id === post.user_id)?.username || 'Unknown User'}
                            </span>
                        </div>
                        {currentUser?.id === post.user_id && (
                            <div className="post-card-icons">
                                <Button
                                    variant="secondary"
                                    className="me-2 p-1 fs-6"
                                    onClick={() => onEdit(post)}
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="danger"
                                    className="p-1 fs-6"
                                    onClick={() => onDelete(post.id)}
                                >
                                    <FaTimes />
                                </Button>
                            </div>
                        )}
                        <Card.Text>{post.content}</Card.Text>
                        <Form.Group className="mt-3 d-flex align-items-center">
                            <Form.Control
                                as="textarea"
                                rows={2}
                                placeholder="Add a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <Button
                                variant="primary"
                                className="ms-2 d-flex align-items-center"
                                onClick={() => handleCreateComment(post.id)}
                            >
                                <FaPaperPlane />
                            </Button>
                        </Form.Group>
                    </div>
                </Card.Body>
                <ListGroup className="mt-3">
                    {post.comments
                        .filter(comment => comment.post_id === post.id)
                        .map(comment => (
                            <ListGroup.Item key={comment.id}>
                                <strong>{store.users.find(user => user.id === comment.user_id)?.username}</strong>: {comment.content}
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup>
            </Card>
        </Col>
    );
};
