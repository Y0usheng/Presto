import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PageWrapper,
  ContentZIndex,
  TopBar,
  Logo,
  AuthGroup,
  NavButton,
  SlideContainer,
  SlideCanvas,
  PlaceholderBox,
  Title,
  Subtitle,
  ActionHint,
  Sticker
} from './LandingPage.styles';

// draggable element component
const DraggableElement = ({ children, startX = 0, startY = 0, zIndex = 10 }) => {
  const [pos, setPos] = useState({ x: startX, y: startY });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    setIsDragging(true);
    // record the initial pointer position relative to the element's current position
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    // continue to capture pointer events even if the cursor goes outside the element
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    setPos({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${isDragging ? 1.02 : 1})`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        touchAction: 'none',
        zIndex: isDragging ? zIndex + 10 : zIndex,
        transition: 'transform 0.1s ease-out',
      }}
    >
      {children}
    </div>
  );
};

function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <ContentZIndex>
        <TopBar>
          <Logo onClick={() => navigate('/')}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#d83b01" style={{ marginRight: '10px' }}>
              <path d="M2 12C2 12 5 13 7 15C9 17 10 20 10 20C10 20 11 17 13 15C15 13 18 12 18 12C18 12 15 11 13 9C11 7 10 4 10 4C10 4 9 7 7 9C5 11 2 12 2 12Z" />
              <path d="M16 4C16 4 17 4.5 18 5.5C19 6.5 19.5 7.5 19.5 7.5C19.5 7.5 20 6.5 21 5.5C22 4.5 23 4 23 4C23 4 22 3.5 21 2.5C20 1.5 19.5 0.5 19.5 0.5C19.5 0.5 19 1.5 18 2.5C17 3.5 16 4 16 4Z" />
            </svg>
            Presto
          </Logo>
          <AuthGroup>
            <NavButton onClick={() => navigate('/login')}>Log in</NavButton>
            <NavButton onClick={() => navigate('/register')} style={{ background: '#d83b01', borderColor: '#d83b01' }}>
              Sign up
            </NavButton>
          </AuthGroup>
        </TopBar>

        <SlideContainer>
          <SlideCanvas>

            <DraggableElement startX={0} startY={-60} zIndex={20}>
              <PlaceholderBox>
                <Title>Presto</Title>
              </PlaceholderBox>
            </DraggableElement>

            <DraggableElement startX={0} startY={70} zIndex={20}>
              <PlaceholderBox>
                <Subtitle>Lighter, enjoyable, and funny presentations.</Subtitle>
              </PlaceholderBox>
            </DraggableElement>

            <DraggableElement startX={-250} startY={-120} zIndex={15}>
              <Sticker rotate="-15deg" size="4rem">🚀</Sticker>
            </DraggableElement>

            <DraggableElement startX={260} startY={-40} zIndex={15}>
              <Sticker rotate="20deg" size="4.5rem">🪄</Sticker>
            </DraggableElement>

            <DraggableElement startX={-300} startY={100} zIndex={30}>
              <Sticker
                bg="#ffc107"
                color="#000"
                padding="10px 20px"
                size="1.2rem"
                rotate="-5deg"
                $shadow={true}
              >
                Drag us around! 🖱️
              </Sticker>
            </DraggableElement>

            <DraggableElement startX={250} startY={120} zIndex={30}>
              <Sticker
                bg="#d83b01"
                color="#fff"
                padding="8px 16px"
                size="1rem"
                rotate="10deg"
                $shadow={true}
              >
                #Creative
              </Sticker>
            </DraggableElement>

            <ActionHint onClick={() => navigate('/register')}>
              Click here to start your design ➔
            </ActionHint>

          </SlideCanvas>
        </SlideContainer>
      </ContentZIndex>
    </PageWrapper>
  );
}

export default LandingPage;