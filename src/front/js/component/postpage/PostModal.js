import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import './index.css';

export const PostModal = ({ initValues, isEditing, onSubmit, onHide }) => {
    const [title, setTitle] = useState(initValues.title);
    const [content, setContent] = useState(initValues.content);
    const [imageUrl, setImageUrl] = useState(initValues.imageUrl);

    const handleOnSubmit = () => {
        onSubmit(title, content, imageUrl);
    };

    return (
        <Modal show={true} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Edit Post' : 'Create Post'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="formPostTitle">
                        <Form.Label>Títle</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPostContent">
                        <Form.Label>Content</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter the content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="formPostImageUrl">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter the URL of the image (optional)"
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
