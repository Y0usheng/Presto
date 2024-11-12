import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'w3-css/w3.css';

const DashboardWrapper = styled.div`
  padding: 20px;
`;

const PresentationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 20px;
`;

const PresentationCard = styled.div`
  width: 200px;
  height: 100px;
  border: 1px solid #ccc;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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
            const updatedPresentations = [...presentations, { ...newPresentation, id: presentations.length + 1 }];

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

            <PresentationGrid>
                {presentations.map((presentation) => (
                    <PresentationCard key={presentation.id} onClick={() => navigate(`/presentation/${presentation.id}`)}>
                        <div>{presentation.name}</div>
                        <div>{presentation.thumbnail ? <img src={URL.createObjectURL(presentation.thumbnail)} alt="Thumbnail" width="50" height="50" /> : <div style={{ width: '50px', height: '50px', backgroundColor: 'gray' }} />}</div>
                        <div>{presentation.description}</div>
                    </PresentationCard>
                ))}
            </PresentationGrid>
            <button onClick={handleLogout}>Logout</button>
        </DashboardWrapper>
    );
}

export default Dashboard;