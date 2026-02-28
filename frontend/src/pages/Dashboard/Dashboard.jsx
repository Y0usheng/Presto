// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import {
  DashboardWrapper, TopBar, Logo, LogoutButton, MainContent,
  Greeting, GridContainer, Card, CreateCard, CreateIcon, CreateText,
  ThumbnailWrapper, HoverOverlay, OverlayButton, CardFooter, PresentationTitle, SlideCount, DeleteIconBtn,
  ModalOverlay, ModalContent, ModalInput, ModalButtonGroup, ActionButton
} from './Dashboard.styles';

function Dashboard() {
  const [presentations, setPresentations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        const data = await api.getStore();
        const storeData = data.store;
        if (Array.isArray(storeData)) {
          setPresentations(storeData);
        } else if (storeData && Array.isArray(storeData.presentations)) {
          setPresentations(storeData.presentations);
        } else {
          setPresentations([]);
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

  const handleCreate = async () => {
    if (!newTitle.trim()) return;

    const newPresentation = {
      id: Date.now(),
      title: newTitle,
      thumbnail: '',
      description: '',
      slides: [{ elements: [], background: '' }]
    };

    const updatedList = [...presentations, newPresentation];

    try {
      await api.updateStore(updatedList);
      setPresentations(updatedList);
      setIsModalOpen(false);
      setNewTitle('');
    } catch (error) {
      console.error('Error creating presentation:', error);
    }
  };

  const handleDelete = async (idToDelete) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this presentation?");
    if (!confirmDelete) return;

    const updatedList = presentations.filter(p => p.id !== idToDelete);
    try {
      await api.updateStore(updatedList);
      setPresentations(updatedList);
    } catch (error) {
      console.error('Error deleting presentation:', error);
    }
  };

  return (
    <DashboardWrapper>
      <TopBar>
        <Logo onClick={() => navigate('/')}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M2 12C2 12 5 13 7 15C9 17 10 20 10 20C10 20 11 17 13 15C15 13 18 12 18 12C18 12 15 11 13 9C11 7 10 4 10 4C10 4 9 7 7 9C5 11 2 12 2 12Z" fill="#d83b01" />
            <path d="M16 4C16 4 17 4.5 18 5.5C19 6.5 19.5 7.5 19.5 7.5C19.5 7.5 20 6.5 21 5.5C22 4.5 23 4 23 4C23 4 22 3.5 21 2.5C20 1.5 19.5 0.5 19.5 0.5C19.5 0.5 19 1.5 18 2.5C17 3.5 16 4 16 4Z" fill="#d83b01" />
          </svg>
          Presto
        </Logo>
        <LogoutButton onClick={handleLogout}>Log out</LogoutButton>
      </TopBar>

      <MainContent>
        <Greeting>What will you design today?</Greeting>

        <GridContainer>
          <CreateCard onClick={() => setIsModalOpen(true)}>
            <div style={{ textAlign: 'center' }}>
              <CreateIcon>+</CreateIcon>
              <CreateText>Create design</CreateText>
            </div>
          </CreateCard>

          {presentations.map((presentation) => {
            let coverImage = presentation.thumbnail || presentation.slides?.[0]?.background || '#e8ecef';
            if (coverImage.startsWith('data:image')) {
              coverImage = `url(${coverImage})`;
            }

            return (
              <Card key={presentation.id}>
                <ThumbnailWrapper>
                  <div style={{
                    width: '100%', height: '100%',
                    background: coverImage.startsWith('url') ? coverImage : (coverImage || '#ffffff'),
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }} />
                  <HoverOverlay className="hover-overlay">
                    <OverlayButton $primary onClick={() => navigate(`/presentation/${presentation.id}`)}>
                      ✏️ Edit
                    </OverlayButton>
                    <OverlayButton onClick={() => navigate(`/preview/${presentation.id}`)}>
                      ▶️ Play
                    </OverlayButton>
                  </HoverOverlay>

                </ThumbnailWrapper>

                <CardFooter>
                  <div>
                    <PresentationTitle title={presentation.title}>
                      {presentation.title || 'Untitled Design'}
                    </PresentationTitle>
                    <SlideCount>
                      {presentation.slides ? presentation.slides.length : 1} slide(s)
                    </SlideCount>
                  </div>

                  <DeleteIconBtn onClick={() => handleDelete(presentation.id)} title="Delete presentation">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                  </DeleteIconBtn>
                </CardFooter>
              </Card>
            );
          })}
        </GridContainer>
      </MainContent>

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 10px 0', color: '#0e1318' }}>Create a new presentation</h2>
            <p style={{ margin: '0', color: '#5e6d77', fontSize: '14px' }}>Give your awesome design a name to get started.</p>

            <ModalInput
              autoFocus
              type="text"
              placeholder="e.g. Q4 Marketing Plan"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />

            <ModalButtonGroup>
              <ActionButton onClick={() => setIsModalOpen(false)}>Cancel</ActionButton>
              <ActionButton $primary onClick={handleCreate}>Create</ActionButton>
            </ModalButtonGroup>
          </ModalContent>
        </ModalOverlay>
      )}

    </DashboardWrapper>
  );
}

export default Dashboard;