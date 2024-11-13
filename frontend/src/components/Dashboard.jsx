import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'w3-css/w3.css';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';

const DashboardWrapper = styled.div`
    padding: 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
`;

const Greeting = styled.h2`
    margin: 0;
`;

const PresentationGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 30px;
`;

const CardStyle = styled(Card)`
    aspect-ratio: 2 / 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
`;

const CustomCardContent = styled(CardContent)`
  padding: 2px !important;
  "&:last-child": {
    paddingBottom: 3px !important;
  }
`;

const TightTypography = styled(Typography)`
  margin-bottom: 2px !important;
  line-height: 1 !important; 
`;

const NewPresentationButton = styled.button`
    margin-bottom: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    &:hover {
        background-color: #0056b3;
    }
`;

const LogoutButton = styled.button`
    padding: 10px;
    font-size: 14px;
    cursor: pointer;
    background-color: #f44336;
    color: white;
    border: none;
    border-radius: 5px;
    &:hover {
    background-color: #d32f2f;
    }
`;

function Dashboard() {
    const [presentations, setPresentations] = useState([]);
    const [newPresentation, setNewPresentation] = useState({ name: '', description: '', thumbnail: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPresentations = async () => {
            try {
                const response = await fetch('http://localhost:5005/store', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setPresentations(data.store || []);
                }
            } catch (error) {
                console.error('Error fetching presentations:', error);
            }
        };
        fetchPresentations();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreatePresentation = async () => {
        try {
            const updatedPresentations = [...presentations, {
                ...newPresentation, id: presentations.length + 1, slides: [{ content: "Default Slide 1" }],
                slidesCount: 1,
            }];

            const response = await fetch('http://localhost:5005/store', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ store: updatedPresentations }),
            });

            if (response.ok) {
                setPresentations(updatedPresentations);
                document.getElementById('newPresentationModal').style.display = 'none';
            } else {
                console.error('Error creating presentation');
            }
        } catch (error) {
            console.error('Error creating presentation:', error);
        }
    };

    return (
        <DashboardWrapper>
            <Header>
                <Greeting>Hello!</Greeting>
                <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
            </Header>

            <NewPresentationButton onClick={() => (document.getElementById('newPresentationModal').style.display = 'block')}>New Presentation</NewPresentationButton>

            <div id="newPresentationModal" className="w3-modal">
                <div className="w3-modal-content w3-animate-top w3-card-4" style={{ padding: '20px', width: '400px' }}>
                    <header className="w3-container w3-teal">
                        <span
                            onClick={() => (document.getElementById('newPresentationModal').style.display = 'none')}
                            className="w3-button w3-display-topright"
                        >&times;</span>
                        <h2>Create New Presentation</h2>
                    </header>
                    <div className="w3-container">
                        <input
                            type="text"
                            placeholder="Name"
                            className="w3-input w3-border"
                            value={newPresentation.name}
                            onChange={(e) => setNewPresentation({ ...newPresentation, name: e.target.value })}
                            required
                        />
                        <br />
                        <input
                            type="text"
                            placeholder="Description"
                            className="w3-input w3-border"
                            value={newPresentation.description}
                            onChange={(e) => setNewPresentation({ ...newPresentation, description: e.target.value })}
                        />
                        <br />
                        <input
                            type="file"
                            className="w3-input w3-border"
                            onChange={(e) => setNewPresentation({ ...newPresentation, thumbnail: e.target.files[0] })}
                        />
                        <br />
                        <button className="w3-button w3-green" onClick={handleCreatePresentation}>Create</button>
                        <button className="w3-button w3-red" onClick={() => (document.getElementById('newPresentationModal').style.display = 'none')}>Cancel</button>
                    </div>
                </div>
            </div>

            {presentations.length === 0 ? (
                <p>There is no project, let's begin your first project!</p>
            ) : (
                <PresentationGrid>
                    {presentations.map((presentation) => (
                        <CardStyle key={presentation.id} onClick={() => navigate(`/presentation/${presentation.id}`)} style={{ cursor: 'pointer' }}>
                            <div
                                style={{
                                    backgroundImage: `url(${typeof presentation.thumbnail === 'object' ? URL.createObjectURL(presentation.thumbnail) : presentation.thumbnail || 'https://via.placeholder.com/300'})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    height: '50%',
                                    width: '100%',
                                }}
                            />
                            <CustomCardContent>
                                <TightTypography gutterBottom variant="h7" component="div">
                                    {presentation.name}
                                </TightTypography>
                                <TightTypography variant="body2" color="text.secondary">
                                    {presentation.description || 'No description provided'}
                                </TightTypography>
                                <TightTypography variant="body2" color="text.secondary">
                                    Slides: {presentation.slidesCount || 0}
                                </TightTypography>
                            </CustomCardContent>
                        </CardStyle>
                    ))}
                </PresentationGrid>
            )}
        </DashboardWrapper>
    );
}

export default Dashboard;