import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, TextField, Modal, Box } from '@mui/material';

const Header = styled.div`
    display: flex;
    justify-content: space - between;
    align-items: center;
    margin-bottom: 20px;
`;

const SlideNumber = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 50px;
    height: 50px;
    font-size: 1em;
    color: #000;
    display: flex;
    align-items: center;
    justify-content: center;
`;

function PresentationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [presentation, setPresentation] = useState(null);
    const [editTitleOpen, setEditTitleOpen] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newThumbnail, setNewThumbnail] = useState(null);
    const [slides, setSlides] = useState([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const handleDelete = async () => {
        if (window.confirm('Are you sure?')) {
            try {
                const response = await fetch(`http://localhost:5005/store`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    let updatedStore = data.store.filter(p => p.id !== parseInt(id));

                    updatedStore = updatedStore.map((presentation, index) => ({
                        ...presentation,
                        id: index + 1,
                    }));

                    const updateResponse = await fetch(`http://localhost:5005/store`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                        },
                        body: JSON.stringify({ ...data, store: updatedStore }),
                    });

                    if (updateResponse.ok) {
                        navigate('/dashboard');
                    } else {
                        console.error('Failed to delete presentation');
                    }
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error deleting presentation:', error);
            }
        }
    };

    useEffect(() => {
        const fetchPresentation = async () => {
            try {
                const response = await fetch(`http://localhost:5005/store`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const foundPresentation = data.store.find(p => p.id === parseInt(id));

                    if (foundPresentation) {
                        setPresentation(foundPresentation);
                        setNewTitle(foundPresentation.name);
                        setSlides(foundPresentation.slides || []);
                    } else {
                        console.error('Presentation not found');
                    }
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching presentation:', error);
            }
        };

        fetchPresentation();
    }, [id]);

    const handleTitleEdit = async () => {
        try {
            const response = await fetch(`http://localhost:5005/store`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const updatedStore = data.store.map((p) =>
                    p.id === parseInt(id) ? { ...p, name: newTitle } : p
                );
                const updateResponse = await fetch(`http://localhost:5005/store`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ ...data, store: updatedStore }),
                });
                if (updateResponse.ok) {
                    setPresentation((prev) => ({ ...prev, name: newTitle }));
                    setEditTitleOpen(false);
                }
            }
        } catch (error) {
            console.error('Error updating title:', error);
        }
    };

    const handleThumbnailUpdate = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64String = reader.result;
                if (window.confirm('Are you sure you want to change the thumbnail?')) {
                    try {
                        const response = await fetch(`http://localhost:5005/store`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                            },
                        });
                        if (response.ok) {
                            const data = await response.json();
                            const updatedStore = data.store.map((p) =>
                                p.id === parseInt(id) ? { ...p, thumbnail: base64String } : p
                            );
                            const updateResponse = await fetch(`http://localhost:5005/store`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                                },
                                body: JSON.stringify({ ...data, store: updatedStore }),
                            });
                            if (updateResponse.ok) {
                                setPresentation((prev) => ({ ...prev, thumbnail: base64String }));
                                setNewThumbnail(base64String);
                            }
                        }
                    } catch (error) {
                        console.error('Error updating thumbnail:', error);
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSlide = async () => {
        try {
            const newSlides = [...slides, { content: `Slide ${slides.length + 1}` }];
            setSlides(newSlides);

            const updatedPresentation = { ...presentation, slides: newSlides, slidesCount: newSlides.length };
            setPresentation(updatedPresentation);

            const response = await fetch(`http://localhost:5005/store`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const updatedStore = data.store.map((p) => (p.id === parseInt(id) ? updatedPresentation : p));

                const updateResponse = await fetch(`http://localhost:5005/store`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ ...data, store: updatedStore }),
                });

                if (updateResponse.ok) {
                    setPresentation(updatedPresentation);
                } else {
                    console.error('Failed to update presentation');
                }
            }
        } catch (error) {
            console.error('Error adding slide:', error);
        }
    };

    const handleDeleteSlide = async () => {
        if (slides.length === 1) {
            alert('Cannot delete the only slide. Please delete the presentation instead.');
            return;
        }

        const newSlides = slides.filter((_, index) => index !== currentSlideIndex);
        setSlides(newSlides);

        const updatedPresentation = { ...presentation, slides: newSlides, slidesCount: newSlides.length };

        try {
            const response = await fetch(`http://localhost:5005/store`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                const updatedStore = data.store.map((p) => (p.id === parseInt(id) ? updatedPresentation : p));

                const updateResponse = await fetch(`http://localhost:5005/store`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ ...data, store: updatedStore }),
                });

                if (updateResponse.ok) {
                    setPresentation(updatedPresentation);
                    if (currentSlideIndex > 0) {
                        setCurrentSlideIndex(currentSlideIndex - 1);
                    }
                } else {
                    console.error('Failed to update presentation');
                }
            }
        } catch (error) {
            console.error('Error deleting slide:', error);
        }
    };

    const handleSlideNavigation = (direction) => {
        if (direction === 'next' && currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(currentSlideIndex + 1);
        } else if (direction === 'prev' && currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
        }
    };

    return (
        <div>
            <Header>
                <h2>{presentation?.name}</h2>
                <div>
                    <Button variant="outlined" onClick={() => setEditTitleOpen(true)}>
                        Edit Title
                    </Button>
                    <Button variant="contained" color="error" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                        Delete Presentation
                    </Button>
                </div>
            </Header>
            <p>{presentation?.description}</p>

            <input type="file" onChange={handleThumbnailUpdate} />
            <br></br>
            <Button variant="outlined" onClick={handleAddSlide}>Add Slide</Button>
            <Button variant="outlined" color="error" onClick={handleDeleteSlide} style={{ marginLeft: '10px' }}>Delete Slide</Button>
            <div>
                {slides.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
                        <div>
                            <Button
                                disabled={currentSlideIndex === 0}
                                onClick={() => handleSlideNavigation('prev')}
                            >
                                Previous
                            </Button>
                            <span>Slide {currentSlideIndex + 1} of {slides.length}</span>
                            <Button
                                disabled={currentSlideIndex === slides.length - 1}
                                onClick={() => handleSlideNavigation('next')}
                            >
                                Next
                            </Button>
                        </div>
                        <div>
                            <p>{slides[currentSlideIndex]?.content}</p>
                            <p>{slides[currentSlideIndex]?.content}</p>
                            <p>{slides[currentSlideIndex]?.content}</p>
                            <p>{slides[currentSlideIndex]?.content}</p>
                        </div>
                        <br></br>
                        <SlideNumber>{currentSlideIndex + 1}</SlideNumber>
                    </div>
                )}
            </div>

            <Button variant="outlined" onClick={() => navigate('/dashboard')}>Back</Button>
            <Modal open={editTitleOpen} onClose={() => setEditTitleOpen(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <h2>Edit Presentation Title</h2>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleTitleEdit}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </div>
    );
}

export default PresentationPage;