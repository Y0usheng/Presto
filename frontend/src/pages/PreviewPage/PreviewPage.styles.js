// src/pages/PreviewPage/PreviewPage.styles.js
import styled from 'styled-components';

export const PreviewContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background: #0e1318; /* 纯黑的电影级背景 */
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

export const SlideWrapper = styled.div`
  width: 100%;
  max-width: 95vw;
  max-height: 95vh;
  aspect-ratio: 16 / 9;
  background: ${props => props.$bg?.startsWith('url') ? props.$bg : (props.$bg || '#ffffff')};
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  overflow: hidden;
  container-type: inline-size;
`;

export const ControlBar = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 10px 20px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 100;

  ${PreviewContainer}:hover & {
    opacity: 1;
  }
`;

export const ControlBtn = styled.button`
  background: transparent;
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background 0.2s;

  &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.2); }
  &:disabled { opacity: 0.3; cursor: not-allowed; }
`;

export const SlideIndicator = styled.span`
  color: white;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 14px;
  min-width: 60px;
  text-align: center;
  user-select: none;
`;

export const TopActions = styled.div`
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  gap: 15px;
  z-index: 100;
  opacity: 0;
  transition: opacity 0.3s;
  ${PreviewContainer}:hover & { opacity: 1; }
`;

export const ActionPill = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover { 
    background: rgba(255, 255, 255, 0.25); 
    transform: translateY(-2px); 
  }
`;