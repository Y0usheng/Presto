import styled from 'styled-components';

export const PageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background-image: url('https://images.unsplash.com/photo-1437419764061-2473afe69fc2?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'); 
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background: rgba(0, 0, 0, 0.7);
    z-index: 1;
  }
`;

export const ContentZIndex = styled.div`
  z-index: 2;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const TopBar = styled.nav`
  width: 100%;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Logo = styled.div`
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

export const AuthGroup = styled.div`
  display: flex;
  gap: 15px;
`;

export const NavButton = styled.button`
  background: transparent;
  color: #ffffff;
  border: 1px solid transparent;
  padding: 8px 20px;
  font-size: 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const SlideContainer = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const SlideCanvas = styled.div`
  width: 100%;
  max-width: 1100px;
  aspect-ratio: 16 / 9;
  background: rgba(255, 255, 255, 0.03); 
  backdrop-filter: blur(20px); 
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
`;

export const PlaceholderBox = styled.div`
  border: 2px dashed rgba(255, 255, 255, 0.2);
  padding: 20px 40px;
  text-align: center;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  background: rgba(0, 0, 0, 0.2);

  &:hover {
    border-color: #d83b01;
    background: rgba(216, 59, 1, 0.1);
    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
  }
`;

export const Title = styled.h1`
  font-size: 6rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 0 4px 10px rgba(0,0,0,0.5);

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 300;
  color: #cfd8dc;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

/* emoji and others components */
export const Sticker = styled.div`
  font-size: ${props => props.size || '3rem'};
  background: ${props => props.bg || 'transparent'};
  color: ${props => props.color || '#fff'};
  padding: ${props => props.padding || '0'};
  border-radius: 12px;
  box-shadow: ${props => props.shadow ? '0 10px 20px rgba(0,0,0,0.4)' : 'none'};
  transform: rotate(${props => props.rotate || '0deg'});
  white-space: nowrap;
  font-weight: bold;
  border: 1px solid rgba(255,255,255,0.1);
  transition: border-color 0.2s;

  &:hover {
    border-color: #d83b01;
  }
`;

export const ActionHint = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  color: #d83b01;
  font-size: 1.2rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 30px;
  background: rgba(216, 59, 1, 0.1);
  border: 1px solid rgba(216, 59, 1, 0.3);
  transition: all 0.2s;

  &:hover {
    background: #d83b01;
    color: white;
  }
`;