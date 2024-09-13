import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Context } from '../../store/appContext';
import { PostCard } from './PostCard';
import { PostModal } from './PostModal';
import './index.css';

export const PostPage = () => {
    const { store, actions } = useContext(Context);
    const [showPostModal, setShowPostModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPost, setCurrentPost] = useState(null);
    const { title, content, imageUrl } = currentPost || {};
    const initPostValues = { title, content, imageUrl };

    useEffect(() => {
        async function fetchPosts() {
            try {
                await actions.getAllPost();
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchPosts();
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
            <div className="m-5 text-white text-center bg-warning">Cargando.....</div>
        );
    }

    return (
        <Container>
            <Row className="my-4">
                <div className="heading-container">
                    <h1 className="heading">Forum</h1>
                    <Button
                        variant="primary"
                        className="create-post-button"
                        onClick={handlePostModalOpen}
                    >
                        new Post
                    </Button>
                </div>
            </Row>
            <Row>
                {store.posts.map(post => (
                    <PostCard
                        key={post.id}
                        post={post}
                        onEdit={handleEditPost}
                        onDelete={handleDeletePost}
                    />
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
