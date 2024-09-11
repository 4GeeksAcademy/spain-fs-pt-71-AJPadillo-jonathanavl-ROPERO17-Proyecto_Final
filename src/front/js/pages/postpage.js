import React, { useEffect, useState, useContext } from 'react';
import { Button, Modal, Form, ListGroup, Card, Container, Row, Col } from 'react-bootstrap';
import { Context } from '../store/appContext'; // Ajusta la ruta según la ubicación de tu Context
import { FaEdit, FaTimes, FaPaperPlane } from 'react-icons/fa'; // Importa los íconos necesarios
import './PostPage.css'; // Importa el archivo de estilos
import io from 'socket.io-client';

export const PostPage = () => {
    const { store, actions } = useContext(Context);
    const [showPostModal, setShowPostModal] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', content: '', imageUrl: '' });
    const [currentPost, setCurrentPost] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [selectedPostId, setSelectedPostId] = useState(null);

    useEffect(() => {
        const socket = io(process.env.BACKEND_URL);
        socket.on('new_post', (newPost) => {
            console.log('Nuevo post recibido:', newPost);
            setPosts(prevPosts => [newPost, ...prevPosts]);
        });

        actions.getAllPost();
        actions.getAllComments();

        return () => {
            socket.disconnect();
        };
    }, []);

    const handlePostModalOpen = () => setShowPostModal(true);
    const handlePostModalClose = () => {
        setShowPostModal(false);
        setNewPost({ title: '', content: '', imageUrl: '' });
        setIsEditing(false);
    };

    const handleCreatePost = async () => {
        try {
            if (isEditing && currentPost) {
                await actions.updatePost(currentPost.id, newPost.title, newPost.content, newPost.imageUrl);
            } else {
                await actions.createPost(newPost.title, newPost.content, newPost.imageUrl);
            }
            await actions.getAllPost(); // Actualiza la lista de posts después de crear o editar
            handlePostModalClose();
        } catch (error) {
            console.error("Error al crear el post:", error.response || error.message);
        }
    };    

    const handleEditPost = (post) => {
        setCurrentPost(post);
        setNewPost({
            title: post.title,
            content: post.content,
            imageUrl: post.image_url || ''
        });
        setIsEditing(true);
        handlePostModalOpen();
    };

    const handleDeletePost = async (postId) => {
        await actions.deletePost(postId);
        await actions.getAllPost();
    };

    const handleCreateComment = async (postId) => {
        if (newComment.trim()) {
            await actions.createComment(postId, newComment);
            await actions.getAllComments();
            setNewComment('');
        }
    };

    const currentUser = store.currentUser;

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
                {store.posts.map(post => (
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
                                                onClick={() => handleEditPost(post)}
                                            >
                                                <FaEdit />
                                            </Button>
                                            <Button
                                                variant="danger"
                                                className="p-1 fs-6"
                                                onClick={() => handleDeletePost(post.id)}
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
                        </Card>
                        <ListGroup className="mt-3">
                            {store.comments
                                .filter(comment => comment.post_id === post.id)
                                .map(comment => (
                                    <ListGroup.Item key={comment.id}>
                                        <strong>{store.users.find(user => user.id === comment.user_id)?.username}</strong>: {comment.content}
                                    </ListGroup.Item>
                                ))
                            }
                        </ListGroup>
                    </Col>
                ))}
            </Row>

            {/* Modal para crear/editar posts */}
            <Modal show={showPostModal} onHide={handlePostModalClose}>
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
                                value={newPost.title}
                                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPostContent">
                            <Form.Label>Content</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter content"
                                value={newPost.content}
                                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPostImageUrl">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image URL (optional)"
                                value={newPost.imageUrl}
                                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handlePostModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCreatePost}>
                        {isEditing ? 'Save Changes' : 'Create Post'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
