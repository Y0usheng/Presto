// src/pages/Dashboard/Dashboard.styles.js
import styled from 'styled-components';

export const DashboardWrapper = styled.div`
  min-height: 100vh;
  background-color: #f6f8fd;
  font-family: 'Inter', -apple-system, sans-serif;
`;

export const TopBar = styled.nav`
  background: #ffffff;
  height: 64px;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #0e1318;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  svg { fill: #d83b01; }
`;

export const LogoutButton = styled.button`
  background: transparent;
  color: #5e6d77;
  border: 1px solid #dcdfe4;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: #f1f3f5; color: #0e1318; }
`;

export const MainContent = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Greeting = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0e1318;
  margin-bottom: 30px;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); 
  gap: 24px;
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e6ea;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  }
`;

export const CreateCard = styled(Card)`
  background: linear-gradient(135deg, rgba(216, 59, 1, 0.05) 0%, rgba(216, 59, 1, 0.01) 100%);
  border: 2px dashed rgba(216, 59, 1, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  min-height: 240px;
  box-shadow: none;

  &:hover {
    border-color: #d83b01;
    background: rgba(216, 59, 1, 0.08);
  }
`;

export const CreateIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #d83b01;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 12px auto;
`;

export const CreateText = styled.div`
  font-weight: 600;
  color: #d83b01;
  font-size: 1.1rem;
`;

export const ThumbnailWrapper = styled.div`
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid #e2e6ea;
  background: #ffffff;
  &:hover .hover-overlay {
    opacity: 1;
  }
`;

export const HoverOverlay = styled.div`
  className: hover-overlay; 
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  z-index: 50;
`;

export const OverlayButton = styled.button`
  background: ${props => props.$primary ? '#d83b01' : 'rgba(255,255,255,0.2)'};
  color: #ffffff;
  border: 1px solid ${props => props.$primary ? '#d83b01' : 'rgba(255,255,255,0.4)'};
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: ${props => props.$primary ? '#b83201' : 'rgba(255,255,255,0.3)'};
    transform: scale(1.05);
  }
`;

export const CardFooter = styled.div`
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #ffffff;
`;

export const PresentationTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0e1318;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
`;

export const SlideCount = styled.p`
  font-size: 0.85rem;
  color: #5e6d77;
  margin: 0;
`;

export const DeleteIconBtn = styled.button`
  background: transparent;
  color: #a0abb2;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #ffebee;
    color: #d32f2f;
  }
`;

export const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5); display: flex; align-items: center; justifyContent: center;
  z-index: 1000; backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
`;

export const ModalInput = styled.input`
  width: 100%; padding: 12px; border: 2px solid #e2e6ea; border-radius: 6px; margin: 20px 0; font-size: 16px; box-sizing: border-box;
  &:focus { border-color: #d83b01; outline: none; }
`;

export const ModalButtonGroup = styled.div`
  display: flex; justify-content: flex-end; gap: 12px;
`;
export const ActionButton = styled.button`
  padding: 8px 16px; font-weight: 600; border-radius: 4px; cursor: pointer; border: 1px solid transparent; transition: all 0.2s;
  ${props => props.$primary ? `background: #d83b01; color: white; &:hover { background: #b83201; }` : `background: #f1f3f5; color: #0e1318; &:hover { background: #e2e6ea; }`}
`;