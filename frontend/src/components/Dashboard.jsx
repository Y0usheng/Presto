import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import 'w3-css/w3.css';
import { Card, CardContent, Typography } from '@mui/material';
import { api } from '../utils/api';

const DashboardWrapper = styled.div`
  padding: 20px;
  background-image: url('https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D');
  background-size: cover;
  background-position: center;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`;

const Greeting = styled.h2`
  margin-left: 5px;
  font-size: 2rem;
  color: #3a3a3a;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  @media (max-width: 400px) {
    font-size: 1.2rem;
  }
`;

const ListWork = styled.p`
  margin-left: 10px;
  font-size: 1.5rem;
  color: #5a5a5a;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 400px) {
    font-size: 0.8rem;
  }
`;

const PresentationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }

  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
  }
`;

const CardStyle = styled(Card)`
  aspect-ratio: 2 / 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 30px;
  margin-left: 20px;

  @media (max-width: 768px) {
    aspect-ratio: 3 / 2;
  }

  @media (max-width: 400px) {
    aspect-ratio: 1 / 1;
  }
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
  margin-left: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #ff7b54;
  color: white;
  border: none;
  border-radius: 5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;
  &:hover {
    background-color: #e66a48;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 14px;
  }

  @media (max-width: 400px) {
    font-size: 12px;
  }
`;

const LogoutButton = styled.button`
  padding: 10px;
  font-size: 14px;
  cursor: pointer;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #c0392b;
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 12px;
  }

  @media (max-width: 400px) {
    font-size: 10px;
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
        const data = await api.getStore();
        setPresentations(data.store || []);
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
        ...newPresentation, id: presentations.length + 1, slides: [{ page: "Default Slide 1" }],
        slidesCount: 1,
      }];

      await api.updateStore(updatedPresentations);
      setPresentations(updatedPresentations);
      document.getElementById('newPresentationModal').style.display = 'none';
    } catch (error) {
      console.error('Error creating presentation:', error);
    }
  };

  return (
    <DashboardWrapper>
      <Header>
        <Greeting>Hello! Ready for Project?</Greeting>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>

      <NewPresentationButton onClick={() => (document.getElementById('newPresentationModal').style.display = 'block')}>New Presentation</NewPresentationButton>

      <ListWork>Your Working list:</ListWork>
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
        <p>There is no project, please create a new project!</p>
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